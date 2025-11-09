"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import WeeklyReportCard from "./weekly-report-card";

export default function GoalReports({ id, type }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchReports = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/goals/${id}/reports/${type}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setReports(response.data);
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

        fetchReports();
    }, [id]);

    if (loading)
        return <p className="text-muted-foreground">Loading reports...</p>;
    if (error) return <p className="text-destuctive">{error}</p>;
    if (!tasks.length)
        return (
            <p className="text-muted-foreground">
                No reports found for this goal.
            </p>
        );

    const renderGoalReports = () =>
        reports.map((report) =>
            type == "weekly" ? (
                <WeeklyReportCard key={task.id} weeklyReport={report} />
            ) : null
        );

    return renderGoalReports();
}
