"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { Box, Card, Grid2, Stack, Button, Divider, Typography, CardContent } from "@mui/material";

import { fDate, fCurrency, fDateTime } from "src/utils";
import { DashboardContent } from "src/layouts/dashboard"
import { getListCategory, getReportCashout } from "src/infrastructure/api";

import { Form, Field } from "src/components/hook-form";
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs"

export const ReportCashOutPage = () => {
    const method = useForm({
        defaultValues: {
            period: "",
            start_date: "",
            end_date: "",
            transaction_category_id: 0,
            category: {
                id: 0,
            }
        }
    });

    const category = useQuery({
        queryKey: ["cash-out", "category"],
        queryFn: () => getListCategory({ type: "cashout" }),
        enabled: true,
    })

    const summary = useQuery({
        queryKey: ["report", "cash-out", method.watch("start_date"), method.watch("end_date"), method.watch("category")?.id],
        queryFn: () => getReportCashout({
            start_date: method.watch("start_date"),
            end_date: method.watch("end_date"),
            transaction_category_id: method.watch("category")?.id ?? 0,
        }),
        refetchOnWindowFocus: true,
        enabled: false, // ⛔ jangan auto jalan
    });

    const handleSubmit = () => {
        if (method.watch("start_date")?.length === 0 || method.watch("end_date")?.length === 0) {
            toast.error("Periode tidak boleh kosong");
            return;
        }

        summary.refetch();
    };

    const renderFilter = () => (
        <Card>
            <CardContent>
                <Form methods={method}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <Box flex={1} width={{ xs: '100%', md: 'auto' }}>
                            <Field.AutoCompleteAsync
                                name="category"
                                label="Kategori"
                                placeholder="Pilih kategori pengeluaran"
                                options={category?.data?.data ?? []}
                                async={{
                                    keyValue: "id",
                                    keyLabel: "name",
                                    isLoading: category.isLoading,
                                    onSearch: () => { },
                                }}
                            />
                        </Box>
                        <Box flex={1} width={{ xs: '100%', md: 'auto' }}>
                            <Field.Daterangepicker
                                name="period"
                                label="Periode"
                                placeholder="Masukkan periode"
                                onChangeDate={(startDate, endDate) => {
                                    method.setValue("start_date", startDate ? fDate(startDate, 'YYYY-MM-DD') : "");
                                    method.setValue("end_date", endDate ? fDate(endDate, 'YYYY-MM-DD') : "");
                                }}
                            />
                        </Box>
                        <Box width={{ xs: '100%', md: 'auto' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit}
                            >
                                Tampilkan
                            </Button>
                        </Box>
                    </Stack>
                </Form>
            </CardContent>
        </Card>
    );

    const renderList = () => (
        <Card>
            <CardContent>
                {
                    (summary?.data?.data ?? []).length > 0 ? (
                        <Stack direction="column" gap={2}>
                            {
                                (summary?.data?.data ?? []).map((item, idx) => (
                                    <Stack key={idx} gap={1}>
                                        <Grid2 container spacing={2}>
                                            <Grid2 size={4}>
                                                <Stack direction="row" alignItems="center" gap={1}>
                                                    <Typography variant="body1">Jenis</Typography>
                                                </Stack>
                                            </Grid2>
                                            <Grid2 size={8}>
                                                <Typography variant="body1" fontWeight="bold">{item?.transaction_category_name}</Typography>
                                            </Grid2>
                                        </Grid2>
                                        <Grid2 container spacing={2}>
                                            <Grid2 size={4}>
                                                <Stack direction="row" alignItems="center" gap={1}>
                                                    <Typography variant="body1">Pengeluaran</Typography>
                                                </Stack>
                                            </Grid2>
                                            <Grid2 size={8}>
                                                <Typography variant="body1" fontWeight="bold">{item?.description}</Typography>
                                            </Grid2>
                                        </Grid2>
                                        <Grid2 container spacing={2}>
                                            <Grid2 size={4}>
                                                <Stack direction="row" alignItems="center" gap={1}>
                                                    <Typography variant="body1">Tanggal</Typography>
                                                </Stack>
                                            </Grid2>
                                            <Grid2 size={8}>
                                                <Typography variant="body1" fontWeight="bold">{fDateTime(item?.date)}</Typography>
                                            </Grid2>
                                        </Grid2>
                                        <Grid2 container spacing={2}>
                                            <Grid2 size={4}>
                                                <Stack direction="row" alignItems="center" gap={1}>
                                                    <Typography variant="body1">Nominal</Typography>
                                                </Stack>
                                            </Grid2>
                                            <Grid2 size={8}>
                                                <Typography variant="body1" fontWeight="bold">{fCurrency(item?.amount ?? 0)}</Typography>
                                            </Grid2>
                                        </Grid2>
                                        <Divider />
                                    </Stack>
                                ))
                            }
                        </Stack>
                    ) : (
                        <EmptyContent
                            title="Tidak ada data"
                            description="Tidak ada data pengeluaran pada periode ini"
                        />
                    )
                }
            </CardContent>
        </Card>
    );

    const renderReport = () => (
        <>
            {summary.isLoading ? <LoadingList /> : renderList()}
        </>
    );

    return (
        <DashboardContent>
            <MainBreadchumbs
                links={[
                    { name: "Dashboard", href: "/" },
                    { name: "Laporan" },
                    { name: "Pengeluaran" },
                ]}
                heading="Laporan Pengeluaran"
            />
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    {renderFilter()}
                </Grid2>
                <Grid2 size={12}>
                    {renderReport()}
                </Grid2>
            </Grid2>
        </DashboardContent>
    )
}