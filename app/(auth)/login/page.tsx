"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogIn, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";



export default function LoginPage() {
  const router = useRouter()

  // 1. Login එකට අවශ්‍ය වෙන්නේ Email සහ Password විතරයි
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  // 1. කලින් විදිහටම Login වෙනවා
  const { error } = await authClient.signIn.email({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    alert(error.message);
  } else {
    // 2. දැනට ලොග් වුණු user ගේ session එක ගන්නවා
    const { data: session } = await authClient.getSession();
    
    // 3. Role එක අනුව Redirect කරනවා
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  }
  setIsLoading(false);
};
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="relative flex min-h-screen items-center justify-center bg-slate-50 p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(59,130,246,0.18),transparent_36%),radial-gradient(circle_at_85%_78%,rgba(14,165,233,0.14),transparent_34%)]" />
      
      {/* පටු card එකක් (max-w-sm) භාවිතා කරමු */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
      <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-blue-500 py-2 backdrop-blur-sm bg-white/95">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-center mb-1">
            <div className="bg-blue-100 p-2 rounded-full">
              <LogIn className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl text-center font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-center text-xs">
            Login to your AI Safety Maps account
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
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                <Link href="#" className="text-[10px] text-blue-600 hover:underline">Forgot password?</Link>
              </div>
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

          <CardFooter className="flex flex-col mt-3">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full">
            <Button className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 font-bold h-10 text-sm" type="submit" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : "Login"}
            </Button>
            </motion.div>
            <p className="text-[12px] text-center text-muted-foreground mt-8">
              Dont have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline font-bold">
                Sign up here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      </motion.div>
    </motion.div>
  )
}