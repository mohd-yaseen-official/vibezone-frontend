"use client"

import GoalCard from "@/components/goal-card";
import axios from "axios";
import { useEffect, useState } from "react";

export default function GoalsPage() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        var fetchGoals = async function () {
            setLoading(true);
            setError("");

            try {
                var token = localStorage.getItem("token");
                var response = await axios.get("http://127.0.0.1:8000/api/v1/goals/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setGoals(response.data);
            } catch (err) {
                if (err.response) {
                    setError(
                        err.response.data?.detail || "Failed to fetch goals"
                    );
                } else if (err.request) {
                    setError("No response from server");
                } else {
                    setError("Error: " + err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    if (loading) {
        return <p className="text-center text-muted-foreground mt-10">Loading goals...</p>;
    }
    if (error) {
        return <p className="text-center mt-10 text-destructive">{error}</p>;
    }
    if (!goals.length)
        return (
            <p className="text-muted-foreground">
                No goals found.
            </p>
        );

    const renderGoalCards = () =>
        goals.map((goal) => <GoalCard key={goal.id} goal={goal} />);
    return (
        <div className="px-4 lg:px-6 flex flex-col gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            {renderGoalCards()}
        </div>
    );
}
