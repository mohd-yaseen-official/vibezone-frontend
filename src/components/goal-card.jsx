"use client";

import { useRouter } from "next/navigation";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GoalCard({ goal }) {
    const router = useRouter();

    const getStatusVariant = (status) => {
        switch (status) {
            case "active":
                return "default";
            case "completed":
                return "secondary";
            case "deleted":
                return "destructive";
            default:
                return "outline";
        }
    };

    const handleClick = () => {
        router.push(`goals/${goal.id}`);
    };

    return (
        <Card
            onClick={handleClick}
            className="transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer rounded-2xl border border-neutral-200 bg-white text-black dark:bg-neutral-900 dark:text-white dark:border-neutral-800"
        >
            <CardContent>
                <div className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold truncate max-w-[70%]">
                        {goal.title}
                    </CardTitle>
                    <Badge
                        variant={getStatusVariant(goal.status)}
                        className="capitalize"
                    >
                        {goal.status}
                    </Badge>
                </div>
                <div>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                        {goal.description || "No description provided."}
                    </CardDescription>
                </div>
            </CardContent>

            <CardFooter className="text-xs text-muted-foreground flex justify-between">
                <span>End: {new Date(goal.end_date).toLocaleDateString()}</span>
            </CardFooter>
        </Card>
    );
}
