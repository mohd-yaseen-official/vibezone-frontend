import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for completed vs missed tasks
const sampleChartData = [
  { name: "Completed", value: 8 },
  { name: "Missed", value: 2 },
];

const COLORS = ["#4ade80", "#f87171"];

export default function WeeklyReportCard({ weeklyReport }) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Week: {weeklyReport.week_start} - {weeklyReport.week_end}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Completed Tasks: {weeklyReport.completed_tasks}, Missed Tasks: {weeklyReport.missed_tasks}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center gap-4">
        {/* <ResponsiveContainer width={150} height={150}>
          <PieChart>
            <Pie
              data={sampleChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              label
            >
              {sampleChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer> */}
        {weeklyReport.ai_suggestion && (
          <div className="text-sm text-muted-foreground mt-2 md:mt-0">
            <strong>AI Suggestion:</strong> {weeklyReport.ai_suggestion}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
