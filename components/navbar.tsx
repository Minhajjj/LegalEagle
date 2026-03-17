"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  Menu,
  LogOut,
  Settings,
  FileText,
  User as UserIcon,
  LogIn,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { signOut } from "@/app/auth/actions"; // ← Import your existing signOut action
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      // Use your existing server action
      await signOut();
      // No need to do anything else - the server action handles redirect
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "G"; // Guest
  };

  // Don't show navbar on auth pages
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/auth/callback"
  ) {
    return null;
  }

  return (
    <nav className="bg-[#308970] border-b border-[#F2F1EE]/30 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Always visible */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#F2F1EE] rounded-lg flex items-center justify-center">
              <span className="text-[#308970] font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-[#F2F1EE]">LegalEagle</span>
          </Link>

          {/* Navigation Links - Only show when logged in */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className={`text-sm font-bold transition-colors ${
                  pathname === "/dashboard"
                    ? "text-white underline underline-offset-4"
                    : "text-[#F2F1EE] hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/templates"
                className={`text-sm font-bold transition-colors ${
                  pathname === "/templates"
                    ? "text-white underline underline-offset-4"
                    : "text-[#F2F1EE] hover:text-white"
                }`}
              >
                Templates
              </Link>
              <Link
                href="/analyze"
                className={`text-sm font-bold transition-colors ${
                  pathname?.startsWith("/analyze")
                    ? "text-white underline underline-offset-4"
                    : "text-[#F2F1EE] hover:text-white"
                }`}
              >
                Analyze
              </Link>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Only show when logged in */}
            {user && (
              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F2F1EE]" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-10 w-64 bg-[#F2F1EE]/10 border-[#F2F1EE]/20 text-[#F2F1EE] placeholder:text-[#F2F1EE]/60 focus-visible:ring-1 focus-visible:ring-[#F2F1EE]"
                />
              </div>
            )}

            {/* Notifications - Only show when logged in */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="text-[#F2F1EE] hover:bg-white/10 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            )}

            {/* Profile Icon - ALWAYS VISIBLE */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-white/10"
                  disabled={isSigningOut}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#F2F1EE] text-[#308970] font-medium">
                      {!loading && getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64" align="end" forceMount>
                {user ? (
                  /* LOGGED IN STATE - Show profile + logout */
                  <>
                    {/* User Info Header */}
                    <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-r from-[#F2F1EE] to-white">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#308970] text-white font-bold">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold text-[#1C212B]">
                            {profile?.full_name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">
                            {user.email}
                          </p>
                          <span className="text-xs font-medium text-[#308970] mt-1 bg-[#308970]/10 px-2 py-0.5 rounded-full inline-block w-fit">
                            {profile?.subscription_tier || "Free"} Plan
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* Quick Actions */}
                    <div className="p-2">
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-lg"
                      >
                        <Link
                          href="/profile"
                          className="flex items-center w-full px-2 py-2"
                        >
                          <UserIcon className="mr-3 h-4 w-4 text-[#308970]" />
                          <span>View Profile</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-lg"
                      >
                        <Link
                          href="/dashboard"
                          className="flex items-center w-full px-2 py-2"
                        >
                          <FileText className="mr-3 h-4 w-4 text-[#308970]" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-lg"
                      >
                        <Link
                          href="/settings"
                          className="flex items-center w-full px-2 py-2"
                        >
                          <Settings className="mr-3 h-4 w-4 text-[#308970]" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Logout Button - Using your server action */}
                    <div className="p-2">
                      <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={isSigningOut}
                        className="cursor-pointer rounded-lg text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>
                          {isSigningOut ? "Signing out..." : "Sign Out"}
                        </span>
                      </DropdownMenuItem>
                    </div>
                  </>
                ) : (
                  /* LOGGED OUT STATE - Show login/signup options */
                  <>
                    <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-r from-[#F2F1EE] to-white">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#308970] text-white font-bold">
                            G
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold text-[#1C212B]">
                            Guest User
                          </p>
                          <p className="text-xs text-gray-500">Not signed in</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* Auth Actions */}
                    <div className="p-2">
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-lg"
                      >
                        <Link
                          href="/login"
                          className="flex items-center w-full px-2 py-2"
                        >
                          <LogIn className="mr-3 h-4 w-4 text-[#308970]" />
                          <span>Log In</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-lg"
                      >
                        <Link
                          href="/signup"
                          className="flex items-center w-full px-2 py-2"
                        >
                          <UserIcon className="mr-3 h-4 w-4 text-[#308970]" />
                          <span>Sign Up</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Public Links */}
                    <div className="p-2">
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-lg"
                      >
                        <Link
                          href="/about"
                          className="flex items-center w-full px-2 py-2"
                        >
                          <span>About</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-lg"
                      >
                        <Link
                          href="/pricing"
                          className="flex items-center w-full px-2 py-2"
                        >
                          <span>Pricing</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#F2F1EE] hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
