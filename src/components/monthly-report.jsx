"use client";
import { useEffect, useState } from "react";
import MonthlyReportCard from "./monthly-report-card";
import { Spinner } from "./ui/spinner";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { privateAxios } from "../../axios-config";

export default function MonthlyReports() {
    const [monthlyReports, setMonthlyReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await privateAxios.get("reports/monthly-report");

                setMonthlyReports(response.data);
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
        if (!monthlyReports.length)
            return (
                <Alert>
                    <AlertCircleIcon />
                    <AlertTitle>No monthly reports found.</AlertTitle>
                </Alert>
            );
    };

    const renderMonthlyReportCards = () =>
        monthlyReports.map((monthlyReport) => (
            <MonthlyReportCard
                key={monthlyReport.id}
                monthlyReport={monthlyReport}
            />
        ));

    return (
        <>
            {renderExceptions()}
            {renderMonthlyReportCards()}
        </>
    );
}
