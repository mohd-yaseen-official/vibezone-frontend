"use client";
import { useEffect, useState } from "react";
import WeeklyReportCard from "./weekly-report-card";
import axios from "axios";
import { privateAxios } from "../../axios-config";
import { Spinner } from "./ui/spinner";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function WeeklyReports() {
    const [weeklyReports, setWeeklyReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await privateAxios.get("reports/weekly-report");

                setWeeklyReports(response.data);
            } catch (err) {
                setError(
                    err?.response?.data?.detail ||
                        "Something went wrong while fetching reports"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
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
        if (!weeklyReports.length)
            return (
                <Alert>
                    <AlertCircleIcon />
                    <AlertTitle>No weekly reports found.</AlertTitle>
                </Alert>
            );
    };

    const renderWeeklyReportCards = () =>
        weeklyReports?.map((weeklyReport) => (
            <WeeklyReportCard
                key={weeklyReport.id}
                weeklyReport={weeklyReport}
            />
        ));

    return (
        <>
            {renderExceptions()}
            {renderWeeklyReportCards()}
        </>
    );
}
