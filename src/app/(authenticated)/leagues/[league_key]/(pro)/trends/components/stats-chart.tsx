import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

export interface StatsChartProps {
  name: string;
  data: any[];
  comparisonLabel: string;
  desc?: string;
  selected?: boolean;
  setSelected: Dispatch<SetStateAction<string>>;
}

export function StatsChart({
  name,
  data,
  desc,
  comparisonLabel,
  selected = false,
  setSelected,
}: StatsChartProps) {
  const chartConfig = {
    user: {
      label: "You",
      color: "hsl(var(--chart-1))",
    },
    comparison: {
      label: comparisonLabel,
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const isPercent = data[0].user.startsWith(".");
  const min = Math.min(...data.map((x) => Math.min(x.user, x.comparison)));
  const max = Math.max(...data.map((x) => Math.max(x.user, x.comparison)));
  const buffer = isPercent ? 0.1 : 15;

  return (
    <Card
      onClick={() => setSelected(selected ? "" : name)}
      className={cn(
        "hover:brightness-125 hover:cursor-pointer",
        selected && "col-span-3 row-span-2",
      )}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {desc && <CardDescription>{desc}</CardDescription>}
      </CardHeader>
      <CardContent className="px-4">
        <ChartContainer config={chartConfig}>
          <LineChart
            width={20}
            height={20}
            accessibilityLayer
            data={data}
            margin={{
              left: 20,
              right: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis type="number" hide domain={[min - buffer, max + buffer]} />
            <XAxis
              dataKey="week"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => "Week " + value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="user"
              type="natural"
              stroke="var(--color-user)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="comparison"
              type="natural"
              stroke="var(--color-comparison)"
              strokeWidth={2}
              dot={true}
              strokeDasharray={"10 10 10"}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
