"use client"

import TaskCard from "@/components/task-card";
import { useEffect, useState } from "react";
import { privateAxios } from "../../../../axios-config";
import { SiteHeader } from "@/components/site-header";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await privateAxios.get('tasks');
                setTasks(response.data);
            } catch (err) {
                setError(
                    err?.response?.data?.detail ||
                        "Something went wrong while fetching tasks"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

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
        if (!tasks.length)
            return (
                <Alert>
                    <AlertCircleIcon />
                    <AlertTitle>No tasks found.</AlertTitle>
                </Alert>
            );
    };
    const renderTaskCards = () =>
        tasks.map((task) => <TaskCard key={task.id} task={task} />);
    return (
        <div className="px-4 lg:px-6 flex flex-col gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            <SiteHeader title="Tasks"/>
            {renderExceptions()}
            {renderTaskCards()}
        </div>
    );
}
