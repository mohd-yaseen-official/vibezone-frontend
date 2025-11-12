"use client";

import SubscriptionCard from "@/components/subscription-card";
import UserCard from "@/components/user-card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { privateAxios } from "../../../../axios-config";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OverviewPage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [userRes, subscriptionRes] = await Promise.all([
                    privateAxios.get("auth/user"),
                    privateAxios.get("subscriptions/subscription/status"),
                ]);

                setUser(userRes.data);
                setSubscription(subscriptionRes.data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                        "Something went wrong while fetching data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        toast.success("Logged out successfully");
        router.push("/auth");
    };

    const deleteUser = async () => {
        setLoading(true);

        try {
            const response = await privateAxios.delete("auth/");
            toast.success(response.data || "Account deleted successfully");
            localStorage.removeItem("access_token");
            router.push("/auth");
        } catch (err) {
            toast.error("Something went wrong while deleting");
        } finally {
            setLoading(false);
        }
    };

    const renderExceptions = () => {
        if (loading) {
            return <Spinner className="size-7" />;
        }
        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            );
        }
        if (!user)
            return (
                <Alert>
                    <AlertCircleIcon />
                    <AlertTitle>No user data found.</AlertTitle>
                </Alert>
            );
    };

    return (
        <div className="px-4 lg:px-6 flex flex-col gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            <SiteHeader
                title="Overview"
                button={
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive border-destructive hover:bg-destructive-500 hover:text-foreground transition"
                            >
                                Logout
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Logout</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to logout from this
                                    account?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleLogout}
                                    className="bg-destructive/80 hover:bg-destructive focus:ring-destructive text-foreground"
                                >
                                    Logout
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                }
            />
            {renderExceptions()}
            {user && <UserCard user={user} onDelete={deleteUser}/>}

            {subscription && <SubscriptionCard subscription={subscription} />}
        </div>
    );
}
