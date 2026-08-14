import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { DashboardStatCards } from "@/components/dashboard/dashboard-stat-cards";
import { InquiryVolumeChart } from "@/components/dashboard/inquiry-volume-chart";
import { CategoryInterestChart } from "@/components/dashboard/category-interest-chart";
import { RecentMessagesCard } from "@/components/dashboard/recent-messages-card";
import { useGetMetaDataQuery } from "@/redux/services/metaApis";

export default function DashboardPage() {
  const {
    data: metaResponse,
    isLoading: isMetaDataLoading,
    isFetching: isMetaFetching,
    isError: isMetaDataError,
  } = useGetMetaDataQuery();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="A snapshot of your website's content and recent activity."
      />

      {/* Stat Cards */}
      <DashboardStatCards
        metaResponse={metaResponse}
        isLoading={isMetaDataLoading}
        isFetching={isMetaFetching}
        isError={isMetaDataError}
      />

      {/* Analytics Charts */}
      <div className="grid gap-4 lg:grid-cols-6">
        <InquiryVolumeChart />
        <CategoryInterestChart />
      </div>

      {/* Recent Messages */}
      <RecentMessagesCard />
    </div>
  );
}
