import MonthlyReports from "@/components/monthly-report";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyReports from "@/components/weekly-reports";

export default function ReportsPage() {

  
    return (
        <div className="px-4 lg:px-6 flex flex-col gap-4">
            <SiteHeader title="Reports"/>
            <Tabs
                defaultValue="overview"
                className="*:data-[slot=tabs-trigger]:from-primary/5 *:data-[slot=tabs-trigger]:to-card dark:*:data-[slot=tabs-trigger]:bg-card *:data-[slot=tabs-trigger]:bg-gradient-to-t *:data-[slot=tabs-trigger]:shadow-xs gap-5"
            >
                <TabsList>
                    <TabsTrigger value="weekly">Weekly Reports</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="weekly" className="space-y-5 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                    <WeeklyReports />
                </TabsContent>
                <TabsContent value="monthly" className="space-y-5 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                    <MonthlyReports />
                </TabsContent>
            </Tabs>
        </div>
    );
}
