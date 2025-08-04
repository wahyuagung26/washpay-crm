'use client';

import type { PayloadPrintLabel, PayloadPrintReceipt } from 'src/infrastructure/type';

import { z as zod } from 'zod';
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useTabs, useBoolean } from "minimal-shared/hooks";
import { useQuery, useMutation } from "@tanstack/react-query";

import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import LoadingButton from '@mui/lab/LoadingButton';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import { Tab, Box, Card, Grid2, Stack, Divider, Typography, CardHeader, IconButton, CardContent, ToggleButton } from "@mui/material";

import { paths } from 'src/routes/paths';

import { DashboardContent } from "src/layouts/dashboard";
import { checkAccess } from 'src/modules/auth/context/jwt';
import { fDate, fNumber, fCurrency, fDateTime } from 'src/utils';
import { getTransaction, getTransactionHistories, patchUpdateTransactionNotes, patchUpdateTransactionStatus } from "src/infrastructure/api";

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from "src/components/hook-form";
import { CustomTabs } from 'src/components/custom-tabs';
import { EmptyContent } from 'src/components/empty-content';
import { MainBreadchumbs } from "src/components/breadcrumbs";
import { LoadingScreen } from "src/components/loading-screen";

import { constant } from '../constant';
import { StatusPayment } from '../components/status-payment';
import { ButtonPrinter } from '../components/button-printer';
import { DialogSelectInventory } from '../components/dialog-inventory';
import { DialogCompleteOrder } from '../components/dialog-complete-order';


type ConfirmationSchemaType = zod.infer<typeof ConfirmationSchema>;

const ConfirmationSchema = zod.object({
    last_notes: zod.string().min(1, ""),
    status: zod.string().optional(),
});

const defaultValues: ConfirmationSchemaType = {
    last_notes: "",
    status: constant.STATUS_ORDER_PROCESSED, // default to "Proses"
};

export const DetailOrderPage = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const tab = useTabs('detail');
    const dialogCompleteOrder = useBoolean(false);
    const [selectedInventory, setSelectedInventory] = useState<any[]>([]);

    const histories = useQuery({
        queryKey: ["transactions", "history", orderId],
        queryFn: () => getTransactionHistories(orderId as any),
        enabled: !!orderId && tab.value === 'history',
        refetchOnWindowFocus: true,
    });

    const form = useForm<ConfirmationSchemaType>({
        resolver: zodResolver(ConfirmationSchema),
        defaultValues,
        mode: "onChange",
    });

    const dialogInventory = useBoolean(false);

    const detail = useQuery({
        queryKey: ["transactions", "detail"],
        queryFn: () => getTransaction(orderId as any),
        refetchOnWindowFocus: true,
    });

    const { mutateAsync: updateNote, isPending: isUpdatingNote } = useMutation({
        mutationKey: ["transactions", "updateNote"],
        mutationFn: patchUpdateTransactionNotes,
    });

    const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useMutation({
        mutationKey: ["transactions", "updateStatus"],
        mutationFn: patchUpdateTransactionStatus,
    });

    const order = detail.data?.data;

    // set inventory data when order is fetched
    useEffect(() => {
        if (detail.data?.data) {
            setSelectedInventory(detail.data?.data?.inventory || []);
            form.setValue("last_notes", "");
            form.setValue("status", detail.data?.data?.status || constant.STATUS_ORDER_PROCESSED);
        }
    }, [detail.data?.data, form]);

    const handleSubmit = async () => {
        try {
            const save = await updateNote({
                id: order?.id as number,
                status: order?.status as string,
                notes: form.getValues("last_notes"),
            });

            toast.success("Berhasil", {
                description: save?.message ?? "Berhasil menyimpan data",
            });

            form.reset();
            detail.refetch();
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menyimpan data",
            });
        }
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            const save = await updateStatus({
                id: order?.id as number,
                status,
            });

            toast.success("Berhasil", {
                description: save?.message ?? "Berhasil mengupdate status order",
            });

            form.reset();
            detail.refetch();

        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal mengupdate status order",
            });
        }
    };

    const renderOrderInformation = () => (
        <Card>
            <CardContent>
                <Grid2 container spacing={2}>
                    {
                        order?.is_priority && (
                            <Grid2 size={12}>
                                <Label color="warning" variant="filled">
                                    Prioritas
                                </Label>
                            </Grid2>
                        )
                    }
                    <Grid2 size={12}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {order?.code}
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {fDateTime(order?.created.at)}
                            </Typography>
                        </Stack>
                    </Grid2>
                    <Grid2 size={12}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                Nama Pelanggan
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                                {order?.customer?.name ?? "-"}
                            </Typography>
                        </Stack>
                    </Grid2>
                    <Grid2 size={12}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                Nama Telepon / HP
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                                {order?.customer?.phone ?? "-"}
                            </Typography>
                        </Stack>
                    </Grid2>
                    <Grid2 size={12}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                Nominal Order
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                                {fCurrency(order?.total_final)}
                            </Typography>
                        </Stack>
                    </Grid2>
                    <Grid2 size={12}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                Pembayaran
                            </Typography>
                            <StatusPayment isPaymentComplete={order?.is_payment_complete ?? false} paymentMethodName={order?.payment_method_name ?? ''} />
                        </Stack>
                    </Grid2>
                    <Grid2 size={12}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                Estimasi Selesai
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                                {fDate(order?.estimation_date)} ({order?.estimation_day} hari)
                            </Typography>
                        </Stack>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );

    const renderDetailItem = () => (
        <Card>
            <CardHeader title="Detail Item" />
            <CardContent>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        {
                            order?.items?.map((item) => (
                                <Grid2 container spacing={2} key={`confirmation-item-${item.id}`} sx={{ mb: 1 }}>
                                    <Grid2 size={{ xs: 6 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant="body1" color="text.secondary">{item.qty}x</Typography>
                                            <Typography variant="body1" color="text.secondary">{item.name}</Typography>
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={{ xs: 6 }}>
                                        <Typography variant="body1" fontWeight={600} textAlign="right">{fCurrency(item.price * item.qty)}</Typography>
                                    </Grid2>
                                    <Grid2 size={12}>
                                        <Divider />
                                    </Grid2>
                                </Grid2>
                            ))
                        }
                    </Grid2>
                    <Grid2 size={12}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight={600}>
                                Sub Total
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {fCurrency(order?.total_price)}
                            </Typography>
                        </Stack>
                    </Grid2>
                    <Grid2 size={12}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight={600}>
                                Diskon
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={600} color="error">
                                {fCurrency(order?.discount_nominal)}
                            </Typography>
                        </Stack>
                    </Grid2>
                    <Grid2 size={12}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight={600}>
                                Total Akhir
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {fCurrency(order?.total_final)}
                            </Typography>
                        </Stack>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card >
    );

    const renderInventory = () => (
        <Card>
            <CardHeader title="Inventori" action={checkAccess('cashier') && order?.status !== constant.STATUS_ORDER_COMPLETED && <IconButton onClick={dialogInventory.onTrue}><Iconify icon="eva:edit-fill" /></IconButton>} sx={{
                '&.MuiCardHeader-root': {
                    display: 'flex !important',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }
            }} />
            <CardContent>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        {
                            ((selectedInventory ?? []).length > 0) ? selectedInventory.map((item) => (
                                <Grid2 container spacing={2} key={`confirmation-item-${item.id}`} sx={{ mb: 1 }}>
                                    <Grid2 size={12}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant="body1" color="text.secondary">{item.qty}x</Typography>
                                            <Typography variant="body1" color="text.secondary">{item.name}</Typography>
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={12}>
                                        <Divider />
                                    </Grid2>
                                </Grid2>
                            )) : <EmptyContent />
                        }
                    </Grid2>
                </Grid2>
                {
                    dialogInventory.value && (
                        <DialogSelectInventory
                            open={dialogInventory.value}
                            onClose={dialogInventory.onFalse}
                            selectedProduct={selectedInventory}
                            setSelectedProduct={setSelectedInventory}
                            transactionId={order?.id}
                        />
                    )
                }
            </CardContent>
        </Card >
    );

    const renderNote = () => (
        <Card>
            <CardHeader title="Catatan" />
            <CardContent>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <Typography variant="body1" color="text.secondary">
                            Catatan terakhir : {order?.last_notes || "Tidak ada catatan"}
                        </Typography>
                    </Grid2>
                    {
                        [constant.STATUS_ORDER_FINISHED, constant.STATUS_ORDER_PROCESSED].includes(order?.status ?? '') && (
                            <>
                                <Grid2 size={12}>
                                    <Field.Text
                                        name="last_notes"
                                        label=""
                                        placeholder="Perbarui catatan untuk order ini"
                                        rows={4}
                                        multiline
                                        fullWidth
                                    />
                                </Grid2>
                                <Grid2 size={12}>
                                    <LoadingButton
                                        variant="contained"
                                        fullWidth
                                        color="primary"
                                        loading={form.formState.isSubmitting}
                                        onClick={form.handleSubmit(handleSubmit)}
                                        disabled={!form.formState.isValid || isUpdatingNote || isUpdatingStatus}
                                    >
                                        Simpan Catatan
                                    </LoadingButton>
                                </Grid2>
                            </>
                        )
                    }
                </Grid2>
            </CardContent>
        </Card>
    );

    const renderStatus = () => (
        <Card>
            <CardHeader title="Status Order" />
            <CardContent>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <Field.ToggleButton name="status">
                            {
                                constant.STATUS_ORDER.map((status) => (
                                    <ToggleButton
                                        key={status.id}
                                        value={status.id}
                                        color="primary"
                                        disabled={(isUpdatingStatus || isUpdatingNote || order?.status === constant.STATUS_ORDER_COMPLETED) || !checkAccess('cashier')}
                                        onChange={(_, value) => {
                                            if (value !== null) {
                                                if (value === constant.STATUS_ORDER_COMPLETED) {
                                                    dialogCompleteOrder.onTrue();
                                                } else {
                                                    form.setValue("status", value);
                                                    handleUpdateStatus(value);
                                                }
                                            }
                                        }}
                                    >
                                        {status.name}
                                    </ToggleButton>
                                ))
                            }
                        </Field.ToggleButton>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );

    const renderButtonAction = () => (
        <Card>
            <CardContent>
                <Stack direction="row" gap={2}>
                    <Box flex={1}>
                        <LoadingButton
                            variant="contained"
                            color="info"
                            onClick={printLabel}
                            fullWidth
                        >
                            Cetak Label
                        </LoadingButton>
                    </Box>
                    <Box flex={1}>
                        <LoadingButton
                            variant="contained"
                            color="warning"
                            onClick={printReceipt}
                            fullWidth
                        >
                            Cetak Nota
                        </LoadingButton>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );

    const renderHistory = () => (
        <Card>
            <CardContent>
                <Timeline
                    sx={{ p: 0, m: 0, [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 } }}
                >
                    {
                        histories.data?.data?.map((history, idx: number) => (
                            <TimelineItem key={`history-${history.id}`}>
                                <TimelineSeparator>
                                    <TimelineDot color='primary' />
                                    {idx !== ((histories.data.data ?? []).length - 1) && <TimelineConnector />}
                                </TimelineSeparator>

                                <TimelineContent>
                                    <Stack direction="column">
                                        <Typography variant="subtitle1">{history.title}</Typography>
                                        <Typography variant="body1">{history.activity}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {fDateTime(history.created_at)} By {history.created_user_name}
                                        </Typography>
                                    </Stack>
                                </TimelineContent>
                            </TimelineItem>
                        ))
                    }
                </Timeline>
            </CardContent>
        </Card>
    );

    const renderTabs = () => (
        <CustomTabs value={tab.value} onChange={(e, v) => {
            tab.onChange(e, v);
        }} variant="scrollable" scrollButtons="auto" indicatorColor="primary">
            {
                constant.TAB_DETAIL_PAGE.map((item) => (
                    <Tab key={item.id} value={`${item.id}`} label={item.name} />
                ))
            }
        </CustomTabs>
    );

    const printReceipt = async () => {
        const orderDet = detail?.data?.data ?? null;

        const transactionData: PayloadPrintReceipt = {
            type: "transaction",
            data: {
                outlet_name: orderDet?.outlet.name ?? "Outlet Name",
                outlet_address: orderDet?.outlet.address ?? "Outlet Address",
                outlet_phone: orderDet?.outlet.phone ?? "Outlet Phone",
                order_code: orderDet?.code ?? "Order Code",
                completed_at: fDateTime(orderDet?.completed_at ?? fDateTime(new Date()), "DD/MM/YYYY HH:mm:ss"),
                cashier_name: orderDet?.created?.name ?? "Cashier Name",
                last_note: orderDet?.last_notes ?? "",
                payment_method_name: orderDet?.payment_method_name ?? "Bayar Nanti",
                items: (orderDet?.items || []).map(item => ({
                    name: item.name,
                    qty: fNumber(item.qty),
                    price: fNumber(item.price),
                    sub_total: fNumber(item.price * item.qty),
                })),
                discount_nominal: fNumber(order?.discount_nominal ?? 0),
                total_final: fNumber(order?.total_final ?? 0),
            },
        };

        try {
            // Gunakan debug mode untuk testing
            if (window?.sendTransactionWithDebug) {
                console.log('🚀 Sending transaction with debug mode');
                window?.sendTransactionWithDebug(transactionData);
            } else if (window?.sendTransactionToAndroid) {
                console.log('🚀 Sending transaction (normal mode)');
                window?.sendTransactionToAndroid(transactionData);
            } else {
                throw new Error('Android interface not available');
            }
        } catch (error) {
            console.error('Failed to send transaction:', error);
            toast.error('Gagal mengirim transaksi, pastikan anda membuka aplikasi via Android App: ' + error);
        } finally {
            // setLoading(false);
        }
    };

    const printLabel = async () => {
        const orderDet = detail?.data?.data ?? null;

        const labelData: PayloadPrintLabel = {
            type: "label",
            data: {
                customer_name: orderDet?.customer?.name ?? "Customer Name",
                order_code: orderDet?.code ?? "Order Code",
                created_at: fDateTime(orderDet?.created?.at ?? new Date(), "DD/MM/YYYY HH:mm:ss"),
                estimation_day: orderDet?.estimation_day ?? 0,
                estimation_date: fDate(orderDet?.estimation_date ?? new Date()),
                payment_type: orderDet?.is_payment_complete ? "Lunas" : "Bayar Nanti",
                total_final: orderDet?.total_final ?? 0,
                last_notes: orderDet?.last_notes ?? "",
                items: (orderDet?.items || []).map(item => ({
                    name: item.name,
                    qty: fNumber(item.qty),
                    price: fNumber(item.price),
                    sub_total: fNumber(item.price * item.qty),
                })),
            },
        };

        try {
            // Gunakan debug mode untuk testing
            if (window?.sendTransactionWithDebug) {
                console.log('🚀 Sending transaction with debug mode');
                window?.sendTransactionWithDebug(labelData);
            } else if (window?.sendTransactionToAndroid) {
                console.log('🚀 Sending transaction (normal mode)');
                window?.sendTransactionToAndroid(labelData);
            } else {
                throw new Error('Android interface not available');
            }
        } catch (error) {
            console.error('Failed to send transaction:', error);
            toast.error('Gagal mengirim transaksi, pastikan anda membuka aplikasi via Android App: ' + error);
        } finally {
            // setLoading(false);
        }
    };

    if (detail.isLoading) {
        return <LoadingScreen />;
    }

    return (
        <DashboardContent>
            <MainBreadchumbs
                links={[
                    { name: "Dashboard", href: "/" },
                    { name: "Order", href: paths.order.root },
                    { name: "Detail Order" },
                ]}
                heading="Detail Order"
            />
            <Form methods={form}>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        {renderTabs()}
                    </Grid2>
                    {
                        tab.value === 'detail' && (
                            <>
                                <Grid2 size={12}>
                                    {renderOrderInformation()}
                                </Grid2>
                                <Grid2 size={12}>
                                    {renderDetailItem()}
                                </Grid2>
                                <Grid2 size={12}>
                                    {renderInventory()}
                                </Grid2>
                                <Grid2 size={12}>
                                    {renderNote()}
                                </Grid2>
                                <Grid2 size={12}>
                                    {renderStatus()}
                                </Grid2>
                                <Grid2 size={12}>
                                    {renderButtonAction()}
                                </Grid2>
                                <Grid2 size={12}>
                                    <ButtonPrinter />
                                </Grid2>
                            </>
                        )
                    }
                    {
                        tab.value === 'history' && (
                            <Grid2 size={12}>
                                {renderHistory()}
                            </Grid2>
                        )
                    }
                </Grid2>
            </Form>

            {
                dialogCompleteOrder.value && (
                    <DialogCompleteOrder
                        open={dialogCompleteOrder.value}
                        onClose={dialogCompleteOrder.onFalse}
                        initialValues={detail.data?.data}
                        onSuccess={() => {
                            detail.refetch();
                            dialogCompleteOrder.onFalse();
                        }}
                    />
                )
            }
        </DashboardContent>
    );
};