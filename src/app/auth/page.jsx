"use client";
import { AuthForm } from "@/components/auth-form";
import { Suspense } from "react";

export default function AuthPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <Suspense fallback={<div>Loading...</div>}>
                    <AuthForm />
                </Suspense>
            </div>
        </div>
    );
}
