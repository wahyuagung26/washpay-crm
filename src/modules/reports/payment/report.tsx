"use client";

import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Box, Card, Grid2, Stack, Button, Divider, Typography, CardHeader, CardContent } from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard"
import { fDate, fNumber, fCurrency, fDateTime } from "src/utils";
import { getListCustomer, getReportPayment, getPaymentMethods } from "src/infrastructure/api";

import { Form, Field } from "src/components/hook-form";
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs"

export const ReportPaymentPage = () => {
    const [keywordCustomer, setCustomerKeyword] = useState("");
    const [totalOrder, setTotalOrder] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [labelPeriod, setLabelPeriod] = useState("");
    const [labelCustomer, setLabelCustomer] = useState("Semua");
    const [labelPaymentMethod, setLabelPaymentMethod] = useState("Semua");
    const [summaryPaymentMethods, setSummaryPaymentMethods] = useState<any[]>([]);

    const method = useForm({
        defaultValues: {
            period: "",
            start_date: "",
            end_date: "",
            customer_id: 0,
            customer: {
                id: 0,
                name: "",
            },
            payment_method: {
                id: 0,
                name: "",
            }
        }
    });

    const startDate = useWatch({
        control: method.control,
        name: "start_date"
    })
    const endDate = useWatch({
        control: method.control,
        name: "end_date"
    })
    const customer = useWatch({
        control: method.control,
        name: "customer"
    })
    const paymentMethod = useWatch({
        control: method.control,
        name: "payment_method"
    })

    const customers = useQuery({
        queryKey: ["master", "customer", keywordCustomer],
        queryFn: () => getListCustomer({
            keyword: keywordCustomer,
            page: 1,
            per_page: 100,
        }),
        enabled: true,
    });

    const paymentMethods = useQuery({
        queryKey: ["master", "payment-methods"],
        queryFn: () => getPaymentMethods(),
        enabled: true,
    });

    const summary = useQuery({
        queryKey: ["report", "payment", startDate, endDate, customer?.id],
        queryFn: () => getReportPayment({
            start_date: startDate,
            end_date: endDate,
            customer_id: customer?.id ?? 0,
            payment_method_id: paymentMethod?.id ?? 0,
        }),
        refetchOnWindowFocus: true,
        enabled: false, // ⛔ jangan auto jalan
    });

    useEffect(() => {
        if (summary.data?.data) {
            setTotalOrder((summary.data.data ?? []).length);
            setTotalAmount((summary.data.data ?? []).reduce((acc, item) => acc + item.amount, 0));

            setLabelPeriod(`${fDate(startDate)} - ${fDate(endDate)}`);
            setLabelCustomer(customer?.name || "Semua");
            setLabelPaymentMethod(paymentMethod?.name || "Semua");

            // group by payment method
            const groupedMethods = (summary.data.data ?? []).reduce((acc: any, item: any) => {
                const methodName = item.payment_method_name || "Tidak Diketahui";
                if (!acc[methodName]) {
                    acc[methodName] = {
                        name: methodName,
                        total: 0,
                    };
                }
                acc[methodName].total += item.amount;
                return acc;
            }, {});

            // convert to array
            const groupedMethodsArray = Object.values(groupedMethods).map((mt: any) => ({
                ...mt,
                total: mt.total,
            }));

            setSummaryPaymentMethods(groupedMethodsArray);
        }
    }, [summary.data, startDate, endDate]);

    const handleSubmit = () => {
        if (startDate?.length === 0 || endDate?.length === 0) {
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
                                name="payment_method"
                                label="Metode Pembayaran"
                                placeholder="Pilih Metode"
                                options={paymentMethods.data?.data || []}
                                async={{
                                    keyValue: "id",
                                    keyLabel: "name",
                                    isLoading: paymentMethods.isLoading,
                                }}
                            />
                        </Box>
                        <Box flex={1} width={{ xs: '100%', md: 'auto' }}>
                            <Field.AutoCompleteAsync
                                name="customer"
                                label="Pelanggan"
                                placeholder="Pilih Pelanggan"
                                options={customers.data?.data || []}
                                async={{
                                    keyValue: "id",
                                    keyLabel: "name",
                                    isLoading: customers.isLoading,
                                    onSearch: setCustomerKeyword,
                                }}
                                renderOption={(props: any, option: any) => (
                                    <Stack {...props} direction="column" key={`customer-${option.id}`}>
                                        <Typography variant="subtitle1">{option.name}</Typography>
                                        <Typography variant="body1" color="text.secondary">{option.phone_number}</Typography>
                                    </Stack>
                                )}
                            />
                        </Box>
                        <Box flex={1} width={{ xs: '100%', md: 'auto' }}>
                            <Field.Daterangepicker
                                name="period"
                                label="Periode"
                                placeholder="Masukkan periode"
                                onChangeDate={(start, end) => {
                                    method.setValue("start_date", start ? fDate(start, 'YYYY-MM-DD') : "");
                                    method.setValue("end_date", end ? fDate(end, 'YYYY-MM-DD') : "");
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
        <Stack spacing={2}>
            {renderSummary()}
            <Card>
                <CardHeader title="Riwayat Pembayaran" />
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
                                                        <Typography variant="body1">Nota</Typography>
                                                    </Stack>
                                                </Grid2>
                                                <Grid2 size={8}>
                                                    <Typography variant="body1" fontWeight="bold">{item?.order_code}</Typography>
                                                </Grid2>
                                            </Grid2>
                                            <Grid2 container spacing={2}>
                                                <Grid2 size={4}>
                                                    <Stack direction="row" alignItems="center" gap={1}>
                                                        <Typography variant="body1">Metode</Typography>
                                                    </Stack>
                                                </Grid2>
                                                <Grid2 size={8}>
                                                    <Typography variant="body1" fontWeight="bold">{item?.payment_method_name}</Typography>
                                                </Grid2>
                                            </Grid2>
                                            <Grid2 container spacing={2}>
                                                <Grid2 size={4}>
                                                    <Stack direction="row" alignItems="center" gap={1}>
                                                        <Typography variant="body1">Pelanggan</Typography>
                                                    </Stack>
                                                </Grid2>
                                                <Grid2 size={8}>
                                                    <Typography variant="body1" fontWeight="bold">{item?.customer_name}</Typography>
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
                                description="Tidak ada data transaksi pada periode ini"
                            />
                        )
                    }
                </CardContent>
            </Card>
        </Stack>
    );

    const renderSummary = () => (
        <Card>
            <CardHeader title={`Ringkasan ${labelPeriod}`} />
            <CardContent>
                <Grid2 container spacing={1}>
                    <Grid2 size={5}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography variant="body1">Pelanggan</Typography>
                        </Stack>
                    </Grid2>
                    <Grid2 size={7}>
                        <Typography variant="body1" fontWeight="bold">{labelCustomer}</Typography>
                    </Grid2>
                    <Grid2 size={5}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography variant="body1">Metode</Typography>
                        </Stack>
                    </Grid2>
                    <Grid2 size={7}>
                        <Typography variant="body1" fontWeight="bold">{labelPaymentMethod}</Typography>
                    </Grid2>
                    <Grid2 size={5}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography variant="body1">Total</Typography>
                        </Stack>
                    </Grid2>
                    <Grid2 size={7}>
                        <Typography variant="body1" fontWeight="bold">{fNumber(totalOrder)} Pembayaran</Typography>
                    </Grid2>
                    {
                        summaryPaymentMethods.map((item, idx) => (
                            <React.Fragment key={idx}>
                                <Grid2 size={5}>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <Typography variant="body1">{item.name}</Typography>
                                    </Stack>
                                </Grid2>
                                <Grid2 size={7}>
                                    <Typography variant="body1" fontWeight="bold">{fCurrency(item.total)}</Typography>
                                </Grid2>
                            </React.Fragment>
                        ))
                    }
                </Grid2>
            </CardContent>
        </Card>
    )

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
                    { name: "Pembayaran" },
                ]}
                heading="Laporan Pembayaran"
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