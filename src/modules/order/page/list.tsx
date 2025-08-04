'use client';


import type { TransactionResponse } from "src/infrastructure/type";

import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { useTabs, useBoolean } from "minimal-shared/hooks";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Tab, Box, Card, Grid2, Stack, Button, Typography, CardContent, TablePagination } from "@mui/material";

import { paths } from "src/routes/paths";

import { fCurrency } from "src/utils/format-number";

import { fDate, fDateTime } from "src/utils";
import { DashboardContent } from "src/layouts/dashboard";
import { checkAccess, getWorkspace } from "src/modules/auth/context/jwt";
import { getListTransaction, patchUpdateTransactionStatus } from "src/infrastructure/api";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { CustomTabs } from "src/components/custom-tabs";
import { EmptyContent } from "src/components/empty-content";
import { LoadingList } from "src/components/loading-screen";
import { MainBreadchumbs } from "src/components/breadcrumbs";

import { constant } from "../constant";
import { StatusPayment } from "../components/status-payment";
import { DialogUpdateStatus } from "../components/dialog-update-status";
import { DialogCompleteOrder } from "../components/dialog-complete-order";

export const ListOrderPage = () => {
    const defaultTab = constant.STATUS_ORDER_PROCESSED;

    const form = useForm();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [outletId, setOutletId] = useState(0);
    const [filterStatus, setFilterStatus] = useState(defaultTab);
    const [newStatus, setNewStatus] = useState("");
    const tab = useTabs(defaultTab);
    const dialogUpdateStatus = useBoolean(false);
    const dialogCompleteOrder = useBoolean(false);
    const [selectedOrder, setSelectedOrder] = useState<TransactionResponse | null>(null);

    useEffect(() => {
        const workspace = getWorkspace();
        if (workspace) {
            setOutletId(workspace.id);
        }
    }, []);

    const debounce = useDebouncedCallback((value: string) => {
        setKeyword(value);
    }, 500);

    const list = useQuery({
        queryKey: ["transactions", "list", page, perPage, keyword, outletId, filterStatus],
        queryFn: () => getListTransaction({ page, per_page: perPage, keyword, outlet_id: outletId, status: filterStatus }),
        enabled: Boolean(outletId),
    });

    const { mutateAsync: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: patchUpdateTransactionStatus
    });

    const renderItem = () => (
        (list.data?.data ?? []).length > 0 ? renderList() : <EmptyContent />
    );

    const renderButtonAction = (item: TransactionResponse) => {
        switch (item.status) {
            case constant.STATUS_ORDER_PROCESSED:
                return (
                    <Box flex={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => handleUpdateStatus(item, constant.STATUS_ORDER_FINISHED)}
                        >
                            Selesaikan
                        </Button>
                    </Box>
                )
            case constant.STATUS_ORDER_FINISHED:
                return (
                    <Box flex={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => handleUpdateStatus(item, constant.STATUS_ORDER_COMPLETED)}
                        >
                            Diambil
                        </Button>
                    </Box>
                )
            default:
                return null
        }
    }

    const renderList = () => (
        <>
            {
                (list.data?.data ?? []).map((item) => (
                    <Grid2 size={12} key={`order-${item.id}`}>
                        <Card>
                            <CardContent>
                                <Grid2 container spacing={{xs: 1, sm: 0.5}}>
                                    {
                                        item.is_priority && (
                                            <Grid2 size={12}>
                                                <Label color="warning" variant="filled">
                                                    Prioritas
                                                </Label>
                                            </Grid2>
                                        )
                                    }
                                    <Grid2 size={12}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                                            <Typography variant="subtitle1">
                                                {item.code}
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                {fDateTime(item.created.at)}
                                            </Typography>
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={12}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body1" color="text.secondary">
                                                Nama Pelanggan
                                            </Typography>
                                            <Typography variant="body1" color="text.primary">
                                                {item?.customer?.name ?? "-"}
                                            </Typography>
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={12}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body1" color="text.secondary">
                                                Nama Telepon / HP
                                            </Typography>
                                            <Typography variant="body1" color="text.primary">
                                                {item?.customer?.phone ?? "-"}
                                            </Typography>
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={12}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body1" color="text.secondary">
                                                Nominal Order
                                            </Typography>
                                            <Typography variant="body1" color="text.primary">
                                                {fCurrency(item.total_final)}
                                            </Typography>
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={12}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body1" color="text.secondary">
                                                Pembayaran
                                            </Typography>
                                           <StatusPayment isPaymentComplete={item.is_payment_complete} paymentMethodName={item.payment_method_name as any} />
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={12}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body1" color="text.secondary">
                                                Estimasi Selesai
                                            </Typography>
                                            <Typography variant="body1" color="text.primary">
                                                {fDate(item.estimation_date)} ({item.estimation_day} hari)
                                            </Typography>
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={12} mt={1}>
                                        <Stack direction="row" gap={2} justifyContent="space-between" alignItems="center">
                                            {
                                                checkAccess('cashier') ? renderButtonAction(item) : null
                                            }
                                            <Box flex={1}>
                                                <Button
                                                    component={Link}
                                                    href={`${paths.order.detail(item.id)}`}
                                                    variant="outlined"
                                                    fullWidth
                                                >
                                                    Detail
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Grid2>
                                </Grid2>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))
            }
            <Grid2 size={12}>
                <TablePagination
                    component="div"
                    count={list.data?.meta?.total ?? 0}
                    page={(list.data?.meta?.page ?? 1) - 1}
                    onPageChange={(_, newPage) => {
                        setPage(newPage + 1);
                    }}
                    rowsPerPage={list.data?.meta?.per_page ?? 10}
                    onRowsPerPageChange={(event) => {
                        setPerPage(parseInt(event.target.value, 10));
                        setPage(1);
                    }}
                />
            </Grid2>
        </>
    );

    const renderTabs = () => (
        <CustomTabs value={tab.value} onChange={(e, v) => {
            tab.onChange(e, v);
            setFilterStatus(v);
            setPage(1);
        }} variant="scrollable" scrollButtons="auto" indicatorColor="primary">
            {
                constant.STATUS_ORDER.map((item) => (
                    <Tab key={item.id} value={`${item.id}`} label={item.name} />
                ))
            }
        </CustomTabs>
    );

    const handleUpdateStatus = (order: TransactionResponse, nStatus: string) => {
        setSelectedOrder(order);
        setNewStatus(nStatus);
        if (nStatus === constant.STATUS_ORDER_COMPLETED) {
            dialogCompleteOrder.onTrue();
        } else {
        dialogUpdateStatus.onTrue();
        }
    };

    const handleActionUpdateStatus = async (initialValues: TransactionResponse, notes: string, status: string) => {
        try {
            if (initialValues) {
                const del = await updateStatus({ id: initialValues.id, status, notes });

                toast.success("Berhasil", {
                    description: del?.message ?? "Berhasil menghapus data",
                });

                list.refetch();
                dialogUpdateStatus.onFalse();
            }
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menghapus data",
            });
        }
    };

    return (
        <DashboardContent>
            <MainBreadchumbs
                links={[
                    { name: "Dashboard", href: "/" },
                    { name: "Order", href: paths.order.root },
                    { name: "Daftar Order" },
                ]}
                heading="Daftar Order"
                action={checkAccess('cashier') && (
                    <Button
                        component={Link}
                        href={paths.cashier.root}
                        variant="contained"

                        startIcon={<Iconify icon="eva:plus-fill" />}
                        color="primary"
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "auto",
                            }
                        }}
                    >
                        Tambah Transaksi
                    </Button>
                )}
            />
            <Form methods={form}>
                <Field.SearchKeyword
                    name="search"
                    placeholder="Cari No. Order / No HP Pelanggan"
                    onChange={(event) => {
                        form.setValue("search", event.target.value);
                        debounce(event.target.value);
                    }}
                />
            </Form>
            {renderTabs()}
            <Grid2 container spacing={2}>
                {
                    list.isLoading ? <LoadingList /> : renderItem()
                }
            </Grid2>

            {
                dialogUpdateStatus.value && (
                    <DialogUpdateStatus
                        open={dialogUpdateStatus.value}
                        onClose={dialogUpdateStatus.onFalse}
                        initialValues={selectedOrder}
                        status={newStatus}
                        isLoading={isUpdating}
                        onSubmit={(initialValues, reason) => {
                            handleActionUpdateStatus(initialValues, reason, newStatus);
                            dialogUpdateStatus.onFalse();
                        }}
                    />
                )
            }

            {
                dialogCompleteOrder.value && (
                    <DialogCompleteOrder
                        open={dialogCompleteOrder.value}
                        onClose={dialogCompleteOrder.onFalse}
                        initialValues={selectedOrder}
                        onSuccess={() => {
                            list.refetch();
                            dialogCompleteOrder.onFalse();
                        }}
                    />
                )
            }
        </DashboardContent>
    );
}