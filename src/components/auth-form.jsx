"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { publicAxios } from "@/lib/axios";


export function AuthForm({ className, ...props }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [formType, setFormType] = useState(token ? "resetPassword" : "login"); // login, register, forgotPassword, resetPassword
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (token) {
            setFormType("resetPassword");
        }
    }, [token]);

    // useEffect(() => {
    //     const loadGoogleScript = () => {
    //         if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
    //             if (window.google) {
    //                 window.google.accounts.id.initialize({
    //                     client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    //                     callback: handleGoogleCallback,
    //                 });
    //             }
    //             return;
    //         }

    //         const script = document.createElement("script");
    //         script.src = "https://accounts.google.com/gsi/client";
    //         script.async = true;
    //         script.defer = true;
    //         document.body.appendChild(script);

    //         script.onload = () => {
    //             if (window.google) {
    //                 window.google.accounts.id.initialize({
    //                     client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    //                     callback: handleGoogleCallback,
    //                 });
    //             }
    //         };
    //     };

    //     loadGoogleScript();
    // }, []);

    // const handleGoogleCallback = async (response) => {
    //     setLoading(true);
    //     setError(null);
    //     setSuccess(null);

    //     try {
    //         const res = await fetch(
    //             "http://127.0.0.1:8000/api/v1/auth/google-login",
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     token: response.credential,
    //                 }),
    //             }
    //         );

    //         if (res.ok) {
    //             const data = await res.json();
    //             setSuccess("Google login successful!");
    //             localStorage.setItem("token", data.token);
    //             console.log("Google login successful", data);
    //             router.push("/dashboard/overview");
    //         } else {
    //             const errorData = await res.json();
    //             throw new Error(errorData.detail || "Google login failed");
    //         }
    //     } catch (err) {
    //         setError(err.message);
    //         console.error("Google auth error:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleGoogleSignIn = () => {
    //     if (window.google) {
    //         window.google.accounts.id.prompt();
    //     } else {
    //         setError("Google Sign-In not loaded. Please refresh the page.");
    //     }
    // };

//     const handleGoogleSignIn = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       try {
//         console.log(tokenResponse);
//         const res = await publicAxios.post("auth/google-login", {
//           token: tokenResponse.id_token,
//         });

//         console.log("Backend response:", res.data);
//       } catch (error) {
//         console.error("Google login failed:", error);
//       }
//     },
//     onError: (err) => {
//       console.error("Google login error", err);
//     },
//     flow: "implicit"
//   });
        
    const handleGoogleSignIn = async () => {
    setLoading(true);

    const onSuccess = async (credentialResponse) => {
      const idToken = credentialResponse.credential; // ✅ This is the ID token

      try {
        const res = await publicAxios.post("auth/google-login", { token: idToken });
        console.log("Backend response:", res.data);
      } catch (err) {
        console.error("Login failed:", err);
      } finally {
        setLoading(false);
      }
    };

    const onError = () => {
      console.error("Google login failed");
      setLoading(false);
    };

    return (
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap={true}
      />
    );
  };

    const getTitle = () => {
        switch (formType) {
            case "register":
                return "Create Account";
            case "forgotPassword":
                return "Forgot Password";
            case "resetPassword":
                return "Reset Password";
            default:
                return "Welcome back";
        }
    };

    const getDescription = () => {
        switch (formType) {
            case "register":
                return "Create a new Vibezone account";
            case "forgotPassword":
                return "Enter your email to reset your password";
            case "resetPassword":
                return "Enter your new password below";
            default:
                return "Login to your Vibezone account";
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (formType === "login") {
                const { data } = await publicAxios.post("auth/login", { email, password });
                setSuccess("Login successful!");
                localStorage.setItem("access_token", data.token);
                router.push("/dashboard/overview");
                console.log("Login successful", data);
            } else if (formType === "register") {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }

                const { data } = await publicAxios.post("auth/register", { email, password });
                setSuccess(
                    "Account created successfully! Please login to your account."
                );
                setFormType("login");
                setPassword("");
                setConfirmPassword("");
                console.log("Registration successful", data);
            } else if (formType === "forgotPassword") {
                const { data } = await publicAxios.post("auth/forgot-password", { email });
                setSuccess("Password reset link sent to your email!");
                console.log("Password reset email sent", data);
            } else if (formType === "resetPassword") {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }

                const { data } = await publicAxios.post("auth/reset-password", {
                    token: token,
                    new_password: password,
                });
                setSuccess(
                    "Password reset successfully! You can now login with your new password."
                );
                setPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                    router.push(window.location.pathname);
                    setFormType("login");
                }, 2000);

                console.log("Password reset successful", data);
            }
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
            console.error("Auth error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const toggleFormType = (type) => {
        setFormType(type);
        setError(null);
        setSuccess(null);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">
                                    {getTitle()}
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    {getDescription()}
                                </p>
                            </div>

                            {formType === "resetPassword" &&
                                (!token || token === "") && (
                                    <Field>
                                        <div className="p-3 rounded-md bg-destructive/10 text-destructive">
                                            Invalid or missing reset token.
                                            Please use the link sent to your
                                            email.
                                        </div>
                                    </Field>
                                )}

                            {(error || success) && (
                                <Field>
                                    <div
                                        className={`p-3 rounded-md ${
                                            error
                                                ? "bg-destructive/10 text-destructive"
                                                : "bg-chart-2/10 text-chart-2"
                                        }`}
                                    >
                                        {error || success}
                                    </div>
                                </Field>
                            )}

                            {formType !== "resetPassword" && (
                                <Field>
                                    <FieldLabel htmlFor="email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                </Field>
                            )}

                            {(formType === "login" ||
                                formType === "register") && (
                                <Field>
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="password">
                                            Password
                                        </FieldLabel>
                                        {formType === "login" && (
                                            <button
                                                type="button"
                                                className="ml-auto text-sm underline-offset-2 hover:underline"
                                                onClick={() =>
                                                    toggleFormType(
                                                        "forgotPassword"
                                                    )
                                                }
                                            >
                                                Forgot your password?
                                            </button>
                                        )}
                                    </div>

                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                </Field>
                            )}

                            {formType === "resetPassword" && (
                                <>
                                    <Field>
                                        <FieldLabel htmlFor="password">
                                            New Password
                                        </FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your new password"
                                            required
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            onKeyPress={handleKeyPress}
                                            disabled={loading || !token}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirmPassword">
                                            Confirm New Password
                                        </FieldLabel>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm your new password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            onKeyPress={handleKeyPress}
                                            disabled={loading || !token}
                                        />
                                    </Field>
                                </>
                            )}

                            {formType === "register" && (
                                <Field>
                                    <FieldLabel htmlFor="confirmPassword">
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                </Field>
                            )}

                            {formType === "forgotPassword" && (
                                <Field>
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Sending..."
                                            : "Send Reset Link"}
                                    </Button>
                                </Field>
                            )}

                            {formType === "login" && (
                                <Field>
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </Button>
                                </Field>
                            )}

                            {formType === "register" && (
                                <Field>
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Creating account..."
                                            : "Create Account"}
                                    </Button>
                                </Field>
                            )}

                            {formType === "resetPassword" && (
                                <Field>
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full"
                                        disabled={loading || !token}
                                    >
                                        {loading
                                            ? "Resetting Password..."
                                            : "Reset Password"}
                                    </Button>
                                </Field>
                            )}

                            {formType !== "resetPassword" && (
                                <>
                                    <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                        Or continue with
                                    </FieldSeparator>

                                    <Field className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="w-full"
                                            onClick={handleGoogleSignIn}
                                            disabled={loading}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                className="w-5 h-5 mr-2"
                                            >
                                                <path
                                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            Google
                                        </Button>
                                    </Field>
                                </>
                            )}

                            <FieldDescription className="text-center">
                                {formType === "login" && (
                                    <>
                                        Don&apos;t have an account?
                                        <button
                                            type="button"
                                            className="ml-1 underline-offset-2 hover:underline"
                                            onClick={() =>
                                                toggleFormType("register")
                                            }
                                        >
                                            Sign up
                                        </button>
                                    </>
                                )}

                                {formType === "register" && (
                                    <>
                                        Already have an account?
                                        <button
                                            type="button"
                                            className="ml-1 underline-offset-2 hover:underline"
                                            onClick={() =>
                                                toggleFormType("login")
                                            }
                                        >
                                            Login
                                        </button>
                                    </>
                                )}

                                {formType === "forgotPassword" && (
                                    <>
                                        Remember your password?
                                        <button
                                            type="button"
                                            className="ml-1 underline-offset-2 hover:underline"
                                            onClick={() =>
                                                toggleFormType("login")
                                            }
                                        >
                                            Login
                                        </button>
                                    </>
                                )}

                                {formType === "resetPassword" && (
                                    <>
                                        Remember your password?
                                        <button
                                            type="button"
                                            className="ml-1 underline-offset-2 hover:underline"
                                            onClick={() => {
                                                router.push(
                                                    window.location.pathname
                                                );
                                                toggleFormType("login");
                                            }}
                                        >
                                            Login
                                        </button>
                                    </>
                                )}
                            </FieldDescription>
                        </FieldGroup>
                    </div>
                    <div className="bg-white items-center justify-center hidden md:flex">
                        <img
                            src="/logo_black.png"
                            alt="Vibezone Logo"
                            className="object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}