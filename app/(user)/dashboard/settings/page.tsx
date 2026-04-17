"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [profilePic, setProfilePic] = useState("")
  const [emailAlerts, setEmailAlerts] = useState("enabled")
  const [pushNotifications, setPushNotifications] = useState("enabled")
  const [safetyAlerts, setSafetyAlerts] = useState("enabled")
  const [riskThreshold, setRiskThreshold] = useState("medium")
  const [preferredLocation, setPreferredLocation] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="py-2">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="py-2">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="profilePic" className="py-2">Profile Picture URL</Label>
            <Input
              id="profilePic"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              placeholder="Enter profile picture URL"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Profile</Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emailAlerts" className="py-2">Email Alerts</Label>
              <Select value={emailAlerts} onValueChange={setEmailAlerts}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pushNotifications" className="py-2">Push Notifications</Label>
              <Select value={pushNotifications} onValueChange={setPushNotifications}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="safetyAlerts" className="py-2">Safety Alerts</Label>
              <Select value={safetyAlerts} onValueChange={setSafetyAlerts}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Safety Settings */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Safety Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="riskThreshold" className="py-2">Risk Threshold</Label>
              <Select value={riskThreshold} onValueChange={setRiskThreshold}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="preferredLocation" className="py-2">Preferred Location</Label>
              <Input
                id="preferredLocation"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="Enter preferred location"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="emergencyContact" className="py-2">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Enter emergency contact"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Safety Settings</Button>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">Change Password</Button>
            <Button variant="outline">Delete Account</Button>
            <Button variant="destructive">Logout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
