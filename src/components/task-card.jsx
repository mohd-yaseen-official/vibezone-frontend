"use client";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function TaskCard({ task }) {
    const router = useRouter();

    const statusColor =
        {
            assigned: "bg-blue-500/10 text-blue-500",
            done: "bg-green-500/10 text-green-500",
            missed: "bg-red-500/10 text-red-500",
        }[task.status] || "bg-gray-500/10 text-gray-500";

    const difficultyColor =
        {
            easy: "text-green-500",
            medium: "text-yellow-500",
            hard: "text-red-500",
        }[task.difficulty] || "text-gray-500";

    return (
        <Card
            onClick={() => router.push(`/tasks/${task.id}`)}
            className="hover:shadow-md transition-all duration-200"
        >
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    {task.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex justify-between space-y-2">
                <div className="flex flex-col gap-3">
                    {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {task.description}
                        </p>
                    )}

                    <span className="text-sm text-muted-foreground">
                        Assigned: {task.assigned_date}
                    </span>

                    <span
                        className={`text-sm ${difficultyColor} capitalize`}
                    >
                        Difficulty: {task.difficulty}
                    </span>

                    <div className="flex gap-2">
                        {task.ai_generated && (
                            <Badge className="bg-purple-500/10 text-purple-500 border-none">
                                AI Generated
                            </Badge>
                        )}
                        <Badge className={`${statusColor} capitalize`}>
                            {task.status}
                        </Badge>
                    </div>
                </div>
                {task.status === "assigned" && (
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                // API call to mark done
                            }}
                            className="w-full text-chart-2 border-chart-2 hover:bg-chart-2 transition"
                        >
                            Mark Done
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                // API call to mark missed
                            }}
                            className="w-full text-destructive border-destructive hover:bg-destructive transition"
                        >
                            Mark Missed
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
