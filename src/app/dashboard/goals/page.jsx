"use client";

import CreateGoalButton from "@/components/create-goal-button";
import GoalCard from "@/components/goal-card";
import { SiteHeader } from "@/components/site-header";
import { useEffect, useState } from "react";
import { privateAxios, publicAxios } from "../../../../axios-config";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function GoalsPage() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        var fetchGoals = async function () {
            setLoading(true);
            setError("");

            try {
                var response = await privateAxios.get("goals/");
                setGoals(response.data);
            } catch (err) {
                setError(
                    err?.response?.data?.detail ||
                        "Something went wrong while fetching goals"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    const handleSubmit = async (data) => {
        setLoading(true);
        console.log(data)
        try {
            var response = await privateAxios.post("goals/create", data);
            toast.success("Goal created successfully");
        } catch (err) {
            toast.error(
                err?.response?.data?.detail ||
                    "Something went wrong while creating goal"
            );
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
        if (!goals.length)
            return (
                <Alert>
                    <AlertCircleIcon />
                    <AlertTitle>No goals found.</AlertTitle>
                </Alert>
            );
    };

    const renderGoalCards = () =>
        goals?.map((goal) => <GoalCard key={goal.id} goal={goal} />);
    return (
        <div className="px-4 lg:px-6 flex flex-col gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            <SiteHeader
                title="Goals"
                button={<CreateGoalButton handleSubmit={handleSubmit} />}
            />
            {renderExceptions()}
            {renderGoalCards()}
        </div>
    );
}
