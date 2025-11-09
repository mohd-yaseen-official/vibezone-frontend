"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "./task-card";

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
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/goals/${id}/tasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

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
    }, [id]);

    if (loading) return <p className="text-muted-foreground">Loading tasks...</p>;
    if (error) return <p className="text-destuctive">{error}</p>;
    if (!tasks.length) return <p className="text-muted-foreground">No tasks found for this goal.</p>;

    const renderGoalTasks = () =>
        tasks.map((task) => <TaskCard key={task.id} task={task} />);

    return renderGoalTasks();
}
