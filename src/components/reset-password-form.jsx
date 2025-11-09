"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ResetPasswordForm({ className, ...props }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    
    try {
      // Reset password request
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token: token,
          new_password: password
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuccess("Password reset successfully! You can now login with your new password.");
        // Clear form
        setPassword("");
        setConfirmPassword("");
        // Optionally redirect to login after a delay
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to reset password");
      }
    } catch (err) {
      setError(err.message || "An error occurred while resetting your password");
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your new password below
                </p>
              </div>
              
              {(!token || token === "") && (
                <Field>
                  <div className="p-3 rounded-md bg-red-100 text-red-800">
                    Invalid or missing reset token. Please use the link sent to your email.
                  </div>
                </Field>
              )}

              {(error || success) && (
                <Field>
                  <div className={`p-3 rounded-md ${error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {error || success}
                  </div>
                </Field>
              )}
              
              <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your new password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || !token}
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirm your new password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || !token}
                />
              </Field>
              
              <Field>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !token}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </Field>
              
              <FieldDescription className="text-center">
                Remember your password? <a href="/login" className="underline-offset-2 hover:underline">Login</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted items-center justify-center hidden md:flex">
            <img
              src="/logo_black.png"
              alt="Vibezone Logo"
              className="object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}