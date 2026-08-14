import React, { useMemo, useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
import { useGetInquiryChartQuery } from "@/redux/services/metaApis";

export const InquiryVolumeChart = React.memo(function InquiryVolumeChart() {
  const [inquiryYear, setInquiryYear] = useState<number>(
    new Date().getFullYear(),
  );

  const {
    data: inquiryResponse,
    isLoading: isInquiryLoading,
    isFetching: isInquiryFetching,
    isError: isInquiryError,
  } = useGetInquiryChartQuery({ year: inquiryYear });

  const handleYearChange = useCallback((val: string) => {
    setInquiryYear(Number(val));
  }, []);

  const inquiryChartItems = useMemo(() => {
    if (Array.isArray(inquiryResponse?.data)) {
      return inquiryResponse?.data;
    }
    if (Array.isArray(inquiryResponse)) {
      return inquiryResponse as any[];
    }
    return [];
  }, [inquiryResponse]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Inquiry volume</CardTitle>
            {isInquiryFetching && !isInquiryLoading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            )}
          </div>
          <CardDescription>
            Contact form submissions for {inquiryYear}
          </CardDescription>
        </div>
        <Select
          value={String(inquiryYear)}
          onValueChange={handleYearChange}
        >
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
      <CardContent className="h-72 pl-0">
        {isInquiryLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : isInquiryError ? (
          <div className="flex h-full items-center justify-center text-xs text-destructive">
            Failed to load inquiry volume data.
          </div>
        ) : inquiryChartItems?.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No inquiry volume data available for {inquiryYear}.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={inquiryChartItems}
              margin={{ left: 8, right: 16 }}
            >
              <defs>
                <linearGradient
                  id="inquiryGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
                width={28}
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
              />
              <Area
                type="monotone"
                dataKey="inquiryCount"
                name="Inquiries"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#inquiryGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});
