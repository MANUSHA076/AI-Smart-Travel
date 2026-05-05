"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { UserPlus, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        callbackURL: "/login"
      })

      if (error) {
        alert(error.message || error.statusText || "Signup failed")
        return
      }

      console.log("Signup success:", data)
      router.push("/login")


    } catch (error) {
      alert(error instanceof Error ? error.message : "Signup failed")
      
    } finally {
      setIsLoading(false)
    }
}
  


  return (
    // Centers the entire page using min-h-screen
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="relative flex min-h-screen items-center justify-center bg-slate-50 p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(59,130,246,0.12),transparent_35%)]" />

      {/* Set max-w-sm so the Card is a bit smaller */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
      <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-primary py-3 backdrop-blur-sm bg-white/95">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-center mb-1">
            <div className="bg-primary/10 p-2 rounded-full">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl text-center font-bold">Create Account</CardTitle>
          <CardDescription className="text-center text-xs">
            Enter details to start with AI Safety Maps
          </CardDescription>
        </CardHeader>
        </motion.div>
        
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.42 }}
          >
          <CardContent className="space-y-3">
            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Manusha" 
                className="h-9 text-sm" // Slightly reduced height
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                className="h-9 text-sm"
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
              <Input 
                id="password" 
                type="password" 
                className="h-9 text-sm"
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </CardContent>
          </motion.div>

          <CardFooter className="flex flex-col mt-2">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full">
            <Button className="w-full font-bold h-10 text-sm" type="submit" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Sign Up"}
            </Button>
            </motion.div>
            <p className="text-[12px] text-center text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-bold">
                Login here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      </motion.div>
    </motion.div>
  )
}