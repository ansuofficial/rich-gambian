"use client";

import { useTheme } from "next-themes";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { formatMoney } from "@/utils/utils";
import {
  CHART_COLORS_DARK,
  CHART_COLORS_LIGHT,
} from "@/utils/constants/constants";
import { CategoryDataType } from "@/app/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SpendingChartProps {
  categoryData: CategoryDataType[];
  onShare?: () => void;
  className?: string;
}

export function SpendingChart({
  categoryData,
  onShare,
  className,
}: SpendingChartProps) {
  const { resolvedTheme } = useTheme();
  const colors =
    resolvedTheme === "dark" ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;

  if (categoryData.length === 0) return null;

  return (
    <Card className={className}>
      <CardHeader className="text-center sm:text-left">
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Where your GDP went, by category</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="sr-only">
          <caption>Spending breakdown by category</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{formatMoney(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          role="img"
          aria-label="Pie chart showing spending by category"
          className="h-[260px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatMoney(value)}
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--popover-foreground)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {onShare && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={onShare}>
              Share my breakdown
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}