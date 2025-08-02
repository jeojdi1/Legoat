"use client";
import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { cn } from "@/lib/utils";
import { Music, User, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function SignupFormDemo() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsLoading(false);
      // Navigate to home page after successful login
      navigate("/");
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Read Google OAuth Client ID from environment variable
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Handle Google login success
  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log("Google login successful:", credentialResponse);
    // Navigate to home page after successful login
    navigate("/");
  };

  // Handle Google login error
  const handleGoogleError = () => {
    console.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-spotify-green rounded-full mb-4">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Legoat</h1>
            <p className="text-gray-400 mt-2">Connect Your Mind to Music</p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {isLogin ? "Sign in to continue to Legoat" : "Join Legoat to start your journey"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <LabelInputContainer>
                    <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">
                      <User className="h-4 w-4 inline mr-2" />
                      First name
                    </Label>
                                         <Input
                       id="firstName"
                       name="firstName"
                       type="text"
                       placeholder="John"
                       value={formData.firstName}
                       onChange={handleInputChange}
                       className="border-gray-300 focus:border-spotify-green focus:ring-spotify-green"
                     />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">
                      Last name
                    </Label>
                                         <Input
                       id="lastName"
                       name="lastName"
                       type="text"
                       placeholder="Doe"
                       value={formData.lastName}
                       onChange={handleInputChange}
                       className="border-gray-300 focus:border-spotify-green focus:ring-spotify-green"
                     />
                  </LabelInputContainer>
                </div>
              )}

              <LabelInputContainer>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </Label>
                                 <Input
                   id="email"
                   name="email"
                   type="email"
                   placeholder="your@email.com"
                   value={formData.email}
                   onChange={handleInputChange}
                   className="border-gray-300 focus:border-spotify-green focus:ring-spotify-green"
                 />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Password
                </Label>
                                 <Input
                   id="password"
                   name="password"
                   type="password"
                   placeholder="••••••••"
                   value={formData.password}
                   onChange={handleInputChange}
                   className="border-gray-300 focus:border-spotify-green focus:ring-spotify-green"
                 />
              </LabelInputContainer>

                             <Button
                 type="submit"
                 disabled={isLoading}
                 className="w-full bg-spotify-green hover:bg-spotify-green/90 text-white font-semibold py-3 rounded-lg transition-colors"
               >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                                 className="text-spotify-green hover:text-spotify-green/80 text-sm font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                />
              </div>
            </div>

            <div className="mt-6 text-center">
                             <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-spotify-green text-sm">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default SignupFormDemo;



const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
