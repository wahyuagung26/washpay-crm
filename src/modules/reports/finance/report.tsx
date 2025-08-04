'use client';

import { toast } from "sonner";
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query";

import { Box, Card, Grid2, Stack, Button, Divider, Typography, CardContent } from "@mui/material"

import { fDate, fCurrency } from "src/utils";
import { DashboardContent } from "src/layouts/dashboard"
import { getFinanceSummary } from "src/infrastructure/api/report";

import { Iconify } from "src/components/iconify";
import { ClickTooltip } from "src/components/tooltip";
import { Form, Field } from "src/components/hook-form"
import { MainBreadchumbs } from "src/components/breadcrumbs"

export const ReportFinancePage = () => {
    const method = useForm({
        defaultValues: {
            period: "",
            start_date: "",
            end_date: "",
        }
    });

    const summary = useQuery({
        queryKey: ["report", "finance-summary", method.watch("start_date"), method.watch("end_date")],
        queryFn: () => getFinanceSummary({
            start_date: method.watch("start_date"),
            end_date: method.watch("end_date"),
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

    const renderReport = () => (
        <Card>
            <CardContent>
                <Stack direction="column" gap={1}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={7}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Typography variant="body1">Total Pemasukan</Typography>
                                <ClickTooltip title="Pembayaran periode ini ( termasuk order diluar periode)"><Iconify icon="charm:info" /></ClickTooltip>
                            </Stack>
                        </Grid2>
                        <Grid2 size={5}>
                            <Typography variant="body1" fontWeight="bold">{fCurrency(summary?.data?.data?.total_payment ?? 0)}</Typography>
                        </Grid2>
                    </Grid2>
                    <Grid2 container spacing={2}>
                        <Grid2 size={7}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Typography variant="body1">Bayar Tunai</Typography>
                                <ClickTooltip title="Pembayaran Tunai"><Iconify icon="charm:info" /></ClickTooltip>
                            </Stack>
                        </Grid2>
                        <Grid2 size={5}>
                            <Typography variant="body1" fontWeight="bold">{fCurrency(summary?.data?.data?.total_cash_payment ?? 0)}</Typography>
                        </Grid2>
                    </Grid2>
                    <Grid2 container spacing={2}>
                        <Grid2 size={7}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Typography variant="body1">Bayar Non Tunai</Typography>
                                <ClickTooltip title="Pembayaran Non Tunai (qris, etc)"><Iconify icon="charm:info" /></ClickTooltip>
                            </Stack>
                        </Grid2>
                        <Grid2 size={5}>
                            <Typography variant="body1" fontWeight="bold">{fCurrency(summary?.data?.data?.total_cashless_payment ?? 0)}</Typography>
                        </Grid2>
                    </Grid2>
                    <Divider />
                    <Grid2 container spacing={2}>
                        <Grid2 size={7}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Typography variant="body1">Omset</Typography>
                                <ClickTooltip title="Transaksi Order"><Iconify icon="charm:info" /></ClickTooltip>
                            </Stack>
                        </Grid2>
                        <Grid2 size={5}>
                            <Typography variant="body1" fontWeight="bold">{fCurrency(summary?.data?.data?.gross_revenue ?? 0)}</Typography>
                        </Grid2>
                    </Grid2>
                    <Grid2 container spacing={2}>
                        <Grid2 size={7}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Typography variant="body1">Piutang</Typography>
                                <ClickTooltip title="Transaksi Order yang belum di bayar"><Iconify icon="charm:info" /></ClickTooltip>
                            </Stack>
                        </Grid2>
                        <Grid2 size={5}>
                            <Typography variant="body1" fontWeight="bold">{fCurrency(summary?.data?.data?.unpaid_order ?? 0)}</Typography>
                        </Grid2>
                    </Grid2>
                    <Divider />
                    <Grid2 container spacing={2}>
                        <Grid2 size={7}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Typography variant="body1">Pengeluaran</Typography>
                                <ClickTooltip title="Pengeluaran"><Iconify icon="charm:info" /></ClickTooltip>
                            </Stack>
                        </Grid2>
                        <Grid2 size={5}>
                            <Typography variant="body1" fontWeight="bold">{fCurrency(summary?.data?.data?.total_expense ?? 0)}</Typography>
                        </Grid2>
                    </Grid2>
                    <Grid2 container spacing={2}>
                        <Grid2 size={7}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Typography variant="body1">Keuntungan</Typography>
                                <ClickTooltip title="Pemasukan - Pengeluaran"><Iconify icon="charm:info" /></ClickTooltip>
                            </Stack>
                        </Grid2>
                        <Grid2 size={5}>
                            <Typography variant="body1" fontWeight="bold" color={(summary?.data?.data?.net_profit ?? 0) < 0 ? 'error.main' : 'success.main'}>
                                {fCurrency(summary?.data?.data?.net_profit ?? 0)}
                            </Typography>
                        </Grid2>
                    </Grid2>
                </Stack>
            </CardContent>
        </Card>
    );

    return (
        <DashboardContent>
            <MainBreadchumbs
                links={[
                    { name: "Dashboard", href: "/" },
                    { name: "Laporan" },
                    { name: "Keuangan" },
                ]}
                heading="Laporan Keuangan"
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