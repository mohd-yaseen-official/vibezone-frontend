"use client";

import SubscriptionCard from "@/components/subscription-card";
import UserCard from "@/components/user-card";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
                const token = localStorage.getItem("token");
                if (!token) {
                    // router.push("/auth");
                    return;
                }

                const [userRes, subscriptionRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/v1/user", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(
                        "http://127.0.0.1:8000/api/v1/subscription/status",
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    ),
                ]);

                setUser(userRes.data);
                setSubscription(subscriptionRes.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("Session expired. Please login again.");
                    router.push("/auth");
                } else {
                    setError(
                        err.response?.data?.detail ||
                            "Something went wrong while fetching data"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading)
        return (
            <p className="text-center text-muted-foreground mt-10">
                Loading user and subscription...
            </p>
        );

    if (error)
        return <p className="text-center mt-10 text-destructive">{error}</p>;

    if (!user)
        return (
            <p className="text-center mt-10 text-muted-foreground">
                No user data found.
            </p>
        );

    return (
        <div className="px-4 lg:px-6 flex flex-col gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            <UserCard user={user} />
            <SubscriptionCard subscription={subscription} />
        </div>
    );
}
