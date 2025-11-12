"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { privateAxios } from "../../axios-config";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Spinner } from "./ui/spinner";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function GoalOverview({ id }) {
    const router = useRouter();
    const [goal, setGoal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchGoal = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await privateAxios.get(`goals/${id}/`);

                setGoal(response.data);
            } catch (err) {
                setError(
                    err?.response?.data?.detail ||
                        "Something went wrong while fetching goal"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGoal();
    }, [id]);

    const handleDelete = async () => {
        try {
            const response = await privateAxios.delete(`goals/${goal.id}`);
            toast.success(response.data || "Goal deleted successfully");
            router.push("/dashboard/goals");
        } catch (err) {
            toast.error("Something went wrong while deleting");
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{error}</AlertTitle>
            </Alert>
        );
    }
    if (loading) {
        return <Spinner className="size-7" />;
    }
    if (!goal)
        return (
            <Alert>
                <AlertCircleIcon />
                <AlertTitle>No goal found.</AlertTitle>
            </Alert>
        );

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
                <div>
                    <CardTitle className="text-xl font-semibold">
                        {goal.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Status:{" "}
                        <span
                            className={`font-medium ${
                                goal.status === "active"
                                    ? "text-green-500"
                                    : goal.status === "completed"
                                    ? "text-blue-500"
                                    : "text-red-500"
                            }`}
                        >
                            {goal.status}
                        </span>
                    </CardDescription>
                </div>
                <CardAction>
                    {goal.status !== "deleted" && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive border-destructive hover:bg-destructive-500 hover:text-foreground transition"
                                >
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        goal?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive/80 hover:bg-destructive focus:ring-destructive text-foreground"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
                {goal.description && <p>{goal.description}</p>}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm">
                    <div>
                        <span className="font-medium">Start:</span>{" "}
                        {goal.start_date}
                    </div>
                    <div>
                        <span className="font-medium">End:</span>{" "}
                        {goal.end_date}
                    </div>
                    <div>
                        <span className="font-medium">Target Days:</span>{" "}
                        {goal.target_days}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
