import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Lightbulb,
  Clock,
  BarChart3
} from "lucide-react";

export default function WeeklyReportCard({ report }) {  
  const totalTasks = report.completed_tasks + report.missed_tasks;
  const completionRate = totalTasks > 0 
    ? Math.round((report.completed_tasks / totalTasks) * 100) 
    : 0;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPerformanceBadge = () => {
    if (completionRate >= 80) {
      return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 border">Excellent</Badge>;
    } else if (completionRate >= 60) {
      return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 border">Good</Badge>;
    } else if (completionRate >= 40) {
      return <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 border">Fair</Badge>;
    } else {
      return <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 border">Needs Focus</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold mb-2">
              Weekly Report
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-muted-foreground" />
              <span>
                {formatDate(report.week_start)} - {formatDate(report.week_end)}
              </span>
            </CardDescription>
          </div>
          {getPerformanceBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Completion Rate Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">
                Completion Rate
              </span>
            </div>
            <span className="text-2xl font-bold">
              {completionRate}%
            </span>
          </div>
          <Progress value={completionRate} className="h-3" />
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                Completed
              </span>
            </div>
            <p className="text-3xl font-bold text-green-700 dark:text-green-300">
              {report.completed_tasks}
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-2">
              <XCircle size={20} className="text-red-600 dark:text-red-400" />
              <span className="text-xs font-medium text-red-700 dark:text-red-300">
                Missed
              </span>
            </div>
            <p className="text-3xl font-bold text-red-700 dark:text-red-300">
              {report.missed_tasks}
            </p>
          </div>
        </div>

        {/* AI Suggestion */}
        {report.ai_suggestion && (
          <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                AI Insight
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {report.ai_suggestion}
            </p>
          </div>
        )}
        {/* Timestamps */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>Created {new Date(report.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}