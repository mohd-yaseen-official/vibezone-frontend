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

export default function GoalOverview({id}) {
    const [goal, setGoal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchGoal = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/goals/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setGoal(response.data);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.detail ||
                        "Something went wrong while fetching goal"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGoal();
    }, [id]);

    if (loading) return <p className="text-muted-foreground">Loading goal...</p>;
    if (error) return <p className="text-destructive">{error}</p>;
    if (!goal) return <p className="text-muted-foreground">No goal found.</p>;

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
                    <Button variant="outline" className="border-destructive hover:bg-destructive">
                        Delete
                    </Button>
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
