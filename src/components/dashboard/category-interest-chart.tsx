import React, { useMemo, useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoryChartQuery } from "@/redux/services/metaApis";

const CATEGORY_COLORS: Record<string, string> = {
  Pools: "hsl(var(--primary))",
  Landscaping: "#0284c7",
  Landscape: "#0284c7",
};

const DEFAULT_PALETTE = [
  "hsl(var(--primary))",
  "#0284c7",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export const CategoryInterestChart = React.memo(
  function CategoryInterestChart() {
    const [year, setYear] = useState<number>(new Date().getFullYear());

    const {
      data: categoryResponse,
      isLoading: isCategoryLoading,
      isFetching: isCategoryFetching,
      isError: isCategoryError,
    } = useGetCategoryChartQuery({ year });

    const handleYearChange = useCallback((val: string) => {
      setYear(Number(val));
    }, []);

    const getCategoryColor = useCallback((cat: string, index: number) => {
      return (
        CATEGORY_COLORS[cat] || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]
      );
    }, []);

    const categoryChartItems = useMemo(() => {
      if (Array.isArray(categoryResponse?.data)) {
        return categoryResponse?.data;
      }
      if (Array.isArray(categoryResponse)) {
        return categoryResponse as any[];
      }
      return [];
    }, [categoryResponse]);

    const categoryKeys = useMemo(() => {
      if (!categoryChartItems?.length) return ["Pools", "Landscaping"];

      const keys = new Set<string>();
      categoryChartItems?.forEach((item) => {
        if (item) {
          Object.keys(item).forEach((k) => {
            if (k !== "month") {
              keys.add(k);
            }
          });
        }
      });
      return keys.size > 0 ? Array.from(keys) : ["Pools", "Landscaping"];
    }, [categoryChartItems]);

    const yearOptions = useMemo(() => {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 5 }, (_, i) => currentYear - i);
    }, []);

    return (
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Interest by Category</CardTitle>
              {isCategoryFetching && !isCategoryLoading && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              )}
            </div>
            <CardDescription>
              Monthly inquiry breakdown for {year}
            </CardDescription>
          </div>
          <Select value={String(year)} onValueChange={handleYearChange}>
            <SelectTrigger className="h-8 w-[100px] text-xs">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions?.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="h-72">
          {isCategoryLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isCategoryError ? (
            <div className="flex h-full items-center justify-center text-xs text-destructive">
              Failed to load category chart data.
            </div>
          ) : categoryChartItems?.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No category data available for {year}.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryChartItems}
                margin={{ top: 10, left: -16, right: 16, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 11,
                  }}
                  width={32}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  cursor={{ fill: "hsl(var(--muted)/0.4)" }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "0.75rem", paddingTop: "8px" }}
                />
                {categoryKeys?.map((catKey, index) => (
                  <Bar
                    key={catKey}
                    dataKey={catKey}
                    name={catKey}
                    fill={getCategoryColor(catKey, index)}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    );
  },
);
