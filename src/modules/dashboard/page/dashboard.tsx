'use client';

import { useQuery } from "@tanstack/react-query";

import { Grid2 } from "@mui/material";

import { getSummary } from "src/infrastructure/api";
import { DashboardContent } from "src/layouts/dashboard";

import { MainBreadchumbs } from "src/components/breadcrumbs";

import { Revenue } from "../components/revenue";
import { Performance } from "../components/performance";
import { Subscription } from "../components/subscription";

export const DashboardPage = () => {
    const summary = useQuery({
        queryKey: ["dashboard", "summary"],
        queryFn: () => getSummary(),
        refetchOnWindowFocus: true,
    });

    const renderSubscription = () => (<Subscription />)

    const renderRevenue = () => (
        <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
                <Revenue title="Pendapatan Hari Ini" isLoading={summary.isLoading} totalAmount={summary?.data?.data?.today?.total_revenue ?? 0} totalOrder={summary?.data?.data?.today?.total_transaction ?? 0} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
                <Revenue title="Pendapatan Bulan Ini" isLoading={summary.isLoading} totalAmount={summary?.data?.data?.this_month?.total_revenue ?? 0} totalOrder={summary?.data?.data?.this_month?.total_transaction ?? 0} />
            </Grid2>
        </Grid2>
    )

    const renderPerformance = () => (<Performance />)

    return (
        <DashboardContent>
            <MainBreadchumbs
                heading="Dashboard"
            />
            {renderSubscription()}
            {renderRevenue()}
            {renderPerformance()}
        </DashboardContent>
    )
}