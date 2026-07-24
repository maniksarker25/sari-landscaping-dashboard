import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  FolderKanban,
  Mail,
  MessageSquareQuote,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import {
  useServicesStore,
  useProjectsStore,
  useTestimonialsStore,
} from "@/lib/content-stores";
import { useMessagesStore } from "@/lib/messages-store";

const inquiryTrend = [
  { month: "Feb", inquiries: 14 },
  { month: "Mar", inquiries: 18 },
  { month: "Apr", inquiries: 22 },
  { month: "May", inquiries: 19 },
  { month: "Jun", inquiries: 27 },
  { month: "Jul", inquiries: 24 },
];

const serviceInterest = [
  { service: "Pools", count: 32 },
  { service: "Landscape", count: 24 },
];

export default function DashboardPage() {
  const services = useServicesStore((s) => s.items);
  const projects = useProjectsStore((s) => s.items);
  const testimonials = useTestimonialsStore((s) => s.items);
  const messages = useMessagesStore((s) => s.items);

  const newMessages = useMemo(
    () => messages.filter((m) => m.status === "new"),
    [messages],
  );
  const recentMessages = useMemo(
    () =>
      [...messages]
        .sort((a, b) => +new Date(b.receivedAt) - +new Date(a.receivedAt))
        .slice(0, 5),
    [messages],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="A snapshot of your website's content and recent activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Services"
          value={String(services.length)}
          icon={Wrench}
          trend={{ value: "+1", direction: "up" }}
        />
        <StatCard
          label="Published Projects"
          value={String(
            projects.filter((p) => p.status === "published").length,
          )}
          icon={FolderKanban}
          trend={{ value: "+2", direction: "up" }}
        />
        <StatCard
          label="New Messages"
          value={String(newMessages.length)}
          icon={Mail}
          trend={{ value: "+3", direction: "up" }}
        />
        <StatCard
          label="Testimonials"
          value={String(testimonials.length)}
          icon={MessageSquareQuote}
          trend={{ value: "0", direction: "up" }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Inquiry volume</CardTitle>
            <CardDescription>
              Contact form submissions over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inquiryTrend} margin={{ left: 8, right: 16 }}>
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
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#inquiryGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Interest by service</CardTitle>
            <CardDescription>
              Which services inquiries mention most.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceInterest}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  dataKey="service"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={90}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent messages</CardTitle>
            <CardDescription>
              The latest contact form submissions.
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/messages">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-1">
          {recentMessages.map((message) => (
            <Link
              key={message.id}
              to="/messages"
              className="flex items-center justify-between gap-4 rounded-md px-2 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{message.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {message.message}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {formatDateTime(message.receivedAt)}
                </span>
                <Badge
                  variant={message.status === "new" ? "warning" : "outline"}
                >
                  {message.status}
                </Badge>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
