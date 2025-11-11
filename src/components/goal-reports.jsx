"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import WeeklyReportCard from "./weekly-report-card";
import { privateAxios } from "../../axios-config";
import MonthlyReportCard from "./monthly-report-card";
import { Spinner } from "./ui/spinner";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

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
                const response = await privateAxios.get(
                    `goals/${id}/reports/${type}`
                );

                setReports(response.data);
            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.detail ||
                        "Something went wrong while fetching reports"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
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
    if (!reports.length)
        return (
            <Alert>
                <AlertCircleIcon />
                <AlertTitle>No reports found.</AlertTitle>
            </Alert>
        );

    const renderGoalReports = () =>
        reports.map((report) =>
            type == "weekly" ? (
                <WeeklyReportCard key={report.id} weeklyReport={report} />
            ) : <MonthlyReportCard key={report.id} weeklyReport={report}/>
        );

    return renderGoalReports();
}
