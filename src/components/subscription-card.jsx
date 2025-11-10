"use client";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, CheckCircle, XCircle } from "lucide-react";
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
} from "./ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function SubscriptionCard({ subscription }) {
    const router = useRouter()
    const {
        has_subscription,
        status,
        is_active,
        current_period_start,
        current_period_end,
        plan_id,
        price,
        cancel_at_period_end,
        trial_end,
    } = subscription;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const statusBadge =
        status === "active"
            ? "bg-green-500/10 text-green-600 dark:text-green-400"
            : status === "trialing"
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            : status === "canceled"
            ? "bg-red-500/10 text-red-600 dark:text-red-400"
            : "bg-gray-500/10 text-gray-600 dark:text-gray-400";

    const formatted = (date) => (date ? new Date(date).toLocaleString() : "—");

    const handleSubscribe = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://127.0.0.1:8000/api/v1/subscriptions/create-checkout-session`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { url } = response.data;
            if (url){
                router.push(url)
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.detail ||
                    "Something went wrong while fetching reports"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader className="flex justify-between">
                <CardTitle className="text-xl font-semibold flex gap-3 items-center">
                    <span>Subscription Details</span>
                    <Badge className={`${statusBadge} capitalize`}>
                        {status ? status : "No Plan"}
                    </Badge>
                </CardTitle>

                {!has_subscription ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-chart-2 border-chart-2 hover:bg-chart-2 transition"
                        onClick={handleSubscribe}
                    >
                        Subscribe Now
                    </Button>
                ) : (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive border-destructive hover:bg-destructive-500 hover:text-foreground transition"
                            >
                                Cancel Subscription
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Cancel Subscription
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to cancel this
                                    subscription?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    // onClick={handleDelete}
                                    className="bg-destructive/80 hover:bg-destructive focus:ring-destructive text-foreground"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardHeader>

            <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex flex-col gap-3 text-sm">
                    <div className="flex gap-2">
                        <span className="font-medium text-muted-foreground">
                            Current Period Start:
                        </span>
                        <p>{formatted(current_period_start)}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-medium text-muted-foreground">
                            Current Period End:
                        </span>
                        <p>{formatted(current_period_end)}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-medium text-muted-foreground">
                            Trial End:
                        </span>
                        <p>{formatted(trial_end)}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-medium text-muted-foreground">
                            Cancel at Period End:
                        </span>
                        <p>{cancel_at_period_end ? "Yes" : "No"}</p>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-medium text-muted-foreground">
                            Price:
                        </span>
                        <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            <span>{price ? price : "—"}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
