"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Check for message from redirect (like after signup)
  useEffect(() => {
    const messageParam = searchParams.get("message");
    if (messageParam) {
      setMessage(decodeURIComponent(messageParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Authenticate via client-side Supabase to trigger onAuthStateChange
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Success: redirect client-side so AuthContext updates properly
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      // If there's an error before redirect
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#1a3a52] to-[#2563eb] relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 flex items-center justify-center w-full p-12">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-4">LegalEagle</h2>
              <p className="text-lg opacity-90">
                Professional-grade AI forensic analysis
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center bg-[#f8fafc] p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-[#0f172a]">
                Welcome back
              </CardTitle>
              <CardDescription className="text-[#64748b]">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Success Message (like after signup) */}
                {message && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[#0f172a]"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email" // ← Important: name attribute matches formData.get("email")
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#0f172a]"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password" // ← Important: name attribute matches formData.get("password")
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full"
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <p className="text-center text-sm text-[#64748b]">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-[#2563eb] hover:text-[#1d4ed8] hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-[#0f172a]">
          Loading…
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
