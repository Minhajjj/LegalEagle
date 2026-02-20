"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, CreditCard, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F2F1EE]">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 ml-20">
          <div className="container mx-auto px-8 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-[#1C212B] mb-8">Settings</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Settings */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1C212B]">Full Name</label>
                      <Input type="text" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1C212B]">Email</label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1C212B]">Company</label>
                      <Input type="text" placeholder="Your Company" />
                    </div>
                    <Button className="bg-[#308970] hover:bg-[#2a7863]">Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#1C212B]">Email Notifications</p>
                        <p className="text-sm text-[#1C212B]/60">Receive email updates about your documents</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#1C212B]">Risk Alerts</p>
                        <p className="text-sm text-[#1C212B]/60">Get notified when high-risk clauses are detected</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#1C212B]">Weekly Summary</p>
                        <p className="text-sm text-[#1C212B]/60">Receive a weekly digest of your activity</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security
                    </CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Two-Factor Authentication
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-[#1C212B]/60 mb-1">Plan</p>
                      <p className="font-semibold text-[#1C212B]">Professional</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-[#1C212B]/60 mb-1">Documents Analyzed</p>
                      <p className="font-semibold text-[#1C212B]">47 / Unlimited</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

