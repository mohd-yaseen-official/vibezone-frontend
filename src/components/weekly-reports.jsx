"use client"
import { useEffect, useState } from "react";
import WeeklyReportCard from "./weekly-report-card";
import axios from "axios";

export default function WeeklyReports() {
    const [weeklyReports, setWeeklyReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/tasks/weekly-report`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setWeeklyReports(response.data);
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
    }, []);

    if (loading)
        return <p className="text-muted-foreground">Loading reports...</p>;
    if (error) return <p className="text-destructive">{error}</p>;
    if (!tasks.length)
        return (
            <p className="text-muted-foreground">
                No reports found.
            </p>
        );

    const renderWeeklyReportCards = () =>
        weeklyReports.map((weeklyReport) => (
            <WeeklyReportCard
                key={weeklyReport.id}
                weeklyReport={weeklyReport}
            />
        ));

    return renderWeeklyReportCards();
}
