// components/CourseCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Stat = {
  label: string;
  value: number; // 0 – 100
};

interface CourseCardProps {
  title: string;
  stats: Stat[];
}

export function CourseCard({ title, stats }: CourseCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="space-y-2">
              <p className="text-sm font-medium">{label}</p>
              <Progress value={value} className="h-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {value} %
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
