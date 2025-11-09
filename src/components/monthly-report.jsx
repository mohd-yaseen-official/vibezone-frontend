"use client";
import { useEffect, useState } from "react";
import MonthlyReportCard from "./monthly-report-card";
import WeeklyReportCard from "./weekly-report-card";
import axios from "axios";

export default function MonthlyReports() {
    const [monthlyReports, setMonthlyReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/tasks/monthly-report`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setMonthlyReports(response.data);
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
        return <p className="text-muted-foreground">No reports found.</p>;

    const renderMonthlyReportCards = () =>
        monthlyReports.map((monthlyReport) => (
            <MonthlyReportCard
                key={monthlyReport.id}
                monthlyReport={monthlyReport}
            />
        ));

    return renderMonthlyReportCards();
}
