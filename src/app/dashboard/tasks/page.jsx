"use client"

import TaskCard from "@/components/task-card";
import { useEffect, useState } from "react";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/tasks`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setTasks(response.data);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.detail ||
                        "Something went wrong while fetching tasks"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading)
        return <p className="text-center text-muted-foreground mt-10">Loading tasks...</p>;
    if (error) return <p className="text-center mt-10 text-destructive">{error}</p>;
    if (!tasks.length)
        return (
            <p className="text-center mt-10 text-muted-foreground">
                No tasks found.
            </p>
        );
    const renderTaskCards = () =>
        tasks.map((task) => <TaskCard key={task.id} task={task} />);
    return (
        <div className="px-4 lg:px-6 flex flex-col gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            {renderTaskCards()}
        </div>
    );
}
