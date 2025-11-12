"use client"
import GoalOverview from "@/components/goal-overview";
import GoalReports from "@/components/goal-reports";
import GoalTasks from "@/components/goal-tasks";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use } from "react";

export default function GoalDetailsPage({ params }) {

    return (
        <div className="px-4 lg:px-6 flex flex-col gap-4">
            <SiteHeader title="Goal Details" />
            <Tabs
                defaultValue="overview"
                className="*:data-[slot=tabs-trigger]:from-primary/5 *:data-[slot=tabs-trigger]:to-card dark:*:data-[slot=tabs-trigger]:bg-card *:data-[slot=tabs-trigger]:bg-gradient-to-t *:data-[slot=tabs-trigger]:shadow-xs gap-5"
            >
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly Reports</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-5 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                    <GoalOverview id={use(params).id} />
                </TabsContent>
                <TabsContent value="tasks" className="space-y-5 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                    <GoalTasks id={use(params).id}/>
                </TabsContent>
                <TabsContent value="weekly" className="space-y-5 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                    <GoalReports id={use(params).id} type="weekly"/>
                </TabsContent>
                <TabsContent value="monthly" className="space-y-5 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                    <GoalReports id={use(params).id} type="monthly"/>
                </TabsContent>
            </Tabs>
        </div>
    );
}
