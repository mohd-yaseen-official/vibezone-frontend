"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "./task-card";
import { privateAxios } from "../../axios-config";
import { Spinner } from "./ui/spinner";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function GoalTasks({ id }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchTasks = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await privateAxios.get(
                    `goals/${id}/tasks`,
                    {}
                );

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
    }, [id]);

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

    const renderGoalTasks = () =>
        tasks.map((task) => <TaskCard key={task.id} task={task} />);

    return renderGoalTasks();
}
