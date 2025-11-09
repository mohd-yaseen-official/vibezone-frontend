import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

export default function MonthlyReportCard({ monthlyReport }) {
    return (
        <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Month: {monthlyReport.month} Year: {monthlyReport.year}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Completed Tasks: {monthlyReport.completed_tasks}, Missed Tasks: {monthlyReport.missed_tasks}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground mt-2 md:mt-0">
                {monthlyReport.perfomance_score && (
                    <>
                        <strong>Perfomace Score:</strong>{" "}
                            {monthlyReport.perfomance_score}
                        </>
                )}
            </CardContent>
        </Card>
    );
}
