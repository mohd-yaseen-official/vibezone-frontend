"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mail, Shield, Clock, Trash2 } from "lucide-react";

export default function UserCard({ user, onDelete }) {
    const formattedCreated = new Date(user.created_at).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );

    const formattedUpdated = new Date(user.updated_at).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );

    const handleDelete = () => {
        if (onDelete) {
            onDelete(user.id);
        }
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl font-semibold">
                        User Details
                    </CardTitle>

                    <div className="flex items-center gap-3">
                        {user.is_admin ? (
                            <Badge className="border flex items-center gap-1 whitespace-nowrap">
                                <Shield size={14} /> Admin
                            </Badge>
                        ) : (
                            <Badge className="border flex items-center gap-1 whitespace-nowrap">
                                <Shield size={14} /> User
                            </Badge>
                        )}

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive border-destructive hover:bg-destructive hover:text-foreground transition"
                                >
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete User
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        user? This action cannot be undone.
                                        <br />
                                        <span className="font-medium mt-2 block">
                                            {user.email}
                                        </span>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive/80 hover:bg-destructive focus:ring-destructive text-foreground"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={16} className="text-muted-foreground shrink-0" />
                    <span className="break-all">{user.email}</span>
                </div>

                <div className="flex flex-col gap-2 pt-2 text-sm">
                    <div className="flex items-start gap-2">
                        <Clock
                            size={14}
                            className="text-muted-foreground shrink-0 mt-0.5"
                        />
                        <div>
                            <span className="font-medium text-muted-foreground">
                                Created:{" "}
                            </span>
                            <span className="text-muted-foreground">
                                {formattedCreated}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Clock
                            size={14}
                            className="text-muted-foreground shrink-0 mt-0.5"
                        />
                        <div>
                            <span className="font-medium text-muted-foreground">
                                Updated:{" "}
                            </span>
                            <span className="text-muted-foreground">
                                {formattedUpdated}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
