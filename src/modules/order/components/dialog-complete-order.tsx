/* eslint-disable react-hooks/exhaustive-deps */
import type { TransactionResponse } from 'src/infrastructure/type';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import React, { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';

import LoadingButton from "@mui/lab/LoadingButton";
import { Stack, Grid2, Dialog, Button, Typography, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { fCurrency } from 'src/utils';
import { getPaymentMethods, patchUpdateTransactionStatus } from 'src/infrastructure/api';

import { Form, Field } from "src/components/hook-form";

import { constant } from '../constant';
import { StatusPayment } from './status-payment';

interface DialogCompleteOrderProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (initialValues: TransactionResponse) => void;
    initialValues?: TransactionResponse | null;
}

type UpdateStatusSchemaType = zod.infer<typeof UpdateStatusSchema>;

const UpdateStatusSchema = zod.object({
    note: zod.string().optional().default(""),
    is_full_payment: zod.boolean().optional().default(false),
    payment_methods: zod.object({
        id: zod.number(),
    }).optional().nullable(),
    payment_amount: zod.number().optional(),
    payment_change: zod.number().optional()
})

const defaultValues: UpdateStatusSchemaType = {
    note: "",
    is_full_payment: false,
    payment_amount: 0,
    payment_change: 0
};

export const DialogCompleteOrder = ({
    open,
    onClose,
    onSuccess = (initialValues) => { },
    initialValues = null,
}: DialogCompleteOrderProps) => {
    const values = useMemo(() => initialValues ? { ...initialValues } : { ...defaultValues }, [initialValues]);

    const form = useForm<UpdateStatusSchemaType>({
        resolver: zodResolver(UpdateStatusSchema),
        defaultValues: values as any,
    });

    const { mutateAsync: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: patchUpdateTransactionStatus
    });

    const paymentMethods = useQuery({
        queryKey: ["payment-methods", "list"],
        queryFn: () => getPaymentMethods(),
        enabled: open && !initialValues?.is_payment_complete,
    });

    const handleActionCompleteOrder = async (data: any) => {
        try {
            if (initialValues) {
                if (!initialValues.is_payment_complete && !data.payment_methods?.id) {
                    toast.error("Gagal", {
                        description: "Silahkan pilih metode pembayaran terlebih dahulu.",
                    });
                    return;
                }

                if (!initialValues.is_payment_complete && (data.payment_amount ?? 0) < initialValues.total_final) {
                    toast.error("Gagal", {
                        description: "Silahkan masukkan jumlah pembayaran yang sesuai.",
                    });
                    return;
                }

                const del = await updateStatus({
                    id: initialValues.id,
                    status: constant.STATUS_ORDER_COMPLETED,
                    notes: data.note,
                    payment_method_id: data.payment_methods?.id ?? null,
                });

                toast.success("Berhasil", {
                    description: del?.message ?? "Berhasil mengubah status transaksi",
                });

                onSuccess?.(initialValues);
            }
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal mengubah status transaksi",
            });
        }
    };

    const { handleSubmit, reset } = form;

    const handleClose = () => {
        reset();
        onClose();
    };

    const calculatePaymentChange = () => {
        const paymentAmount = (form.watch("payment_amount") ?? 0) as number;
        const totalPrice = initialValues?.total_final ?? 0;
        const paymentChange = paymentAmount >= totalPrice ? paymentAmount - totalPrice : 0;
        form.setValue("payment_change", paymentChange);
    }

    useEffect(() => {
        if (form.watch("is_full_payment")) {
            const totalPayment = initialValues?.total_final ?? 0;
            form.setValue("payment_amount", totalPayment);
        }
    }, [form.watch("is_full_payment")]);

    useEffect(() => {
        calculatePaymentChange();
    }, [form.watch("payment_amount")]);

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose();
                }
            }}
            maxWidth="sm"
            fullWidth
            hideBackdrop={false}
            disableEscapeKeyDown
        >
            <DialogTitle>
                <Typography variant="h6" component="span" fontWeight={600}>
                    Selesaikan Pesanan ?
                </Typography>
            </DialogTitle>
            <Form methods={form} onSubmit={handleSubmit(handleActionCompleteOrder)}>
                <DialogContent sx={{ gap: 2, flexDirection: "column", display: "flex" }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                            <Stack direction={{ xs: "column", sm: "row" }} justifyContent={{ xs: "flex-start", sm: "space-between" }}>
                                <Typography variant="body1" color="text.secondary">
                                    Nominal Order
                                </Typography>
                                <Typography variant="body1" color="text.primary" fontWeight={600}>
                                    {fCurrency(initialValues?.total_final)}
                                </Typography>
                            </Stack>
                        </Grid2>
                        <Grid2 size={12}>
                            <Stack direction={{ xs: "column", sm: "row" }} justifyContent={{ xs: "flex-start", sm: "space-between" }}>
                                <Typography variant="body1" color="text.secondary">
                                    Pembayaran
                                </Typography>
                                <StatusPayment isPaymentComplete={initialValues?.is_payment_complete ?? false} paymentMethodName={initialValues?.payment_method_name ?? ''} />
                            </Stack>
                        </Grid2>
                        {
                            !initialValues?.is_payment_complete && (
                                <>
                                    <Grid2 size={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Field.AutoCompleteAsync
                                            name="payment_methods"
                                            placeholder="Pilih metode pembayaran"
                                            options={paymentMethods?.data?.data ?? []}
                                            async={{
                                                keyValue: "id",
                                                keyLabel: "name",
                                                isLoading: false,
                                                onSearch: () => { },
                                                isOpen: () => { },
                                            }}
                                        />
                                    </Grid2>
                                    <Grid2 size={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Grid2 container spacing={2} sx={{ mb: 1, width: '100%' }}>
                                            <Grid2 size={10} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="subtitle1">Bayar Sesuai Tagihan ?</Typography>
                                            </Grid2>
                                            <Grid2 size={2} sx={{ display: 'flex', alignItems: 'end', justifyContent: 'flex-end' }}>
                                                <Field.Switch
                                                    name="is_full_payment"
                                                    label=""
                                                />
                                            </Grid2>
                                        </Grid2>
                                    </Grid2>
                                    <Grid2 size={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Field.Number
                                            name="payment_amount"
                                            label="Nominal Pembayaran"
                                            placeholder="Masukkan jumlah pembayaran"
                                            disabled={form.watch("is_full_payment")}
                                            fullWidth
                                            startAdornment="Rp"

                                        />
                                    </Grid2>
                                    <Grid2 size={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Field.Number
                                            name="payment_change"
                                            label="Kembalian"
                                            placeholder="Kembalian akan otomatis terhitung"
                                            disabled
                                            fullWidth
                                            startAdornment="Rp"

                                        />
                                    </Grid2>
                                </>
                            )
                        }
                        <Grid2 size={12}>
                            <Field.Text
                                name="note"
                                label="Catatan (Opsional)"
                                placeholder="Tulis catatan jika ada hal yang perlu diperhatikan"
                                multiline
                                rows={4}
                                sx={{ mt: 2 }}
                            />
                        </Grid2>
                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                    >
                        Batal
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isUpdating}
                        loadingPosition="start"
                        color="primary"
                    >
                        Selesaikan Sekarang
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    )
}