/* eslint-disable react-hooks/exhaustive-deps */
import type { BankAccountResponse } from 'src/infrastructure/type';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Stack, Alert, Button, Dialog, Typography, IconButton, DialogTitle, DialogActions, DialogContent } from "@mui/material";

import { fCurrency } from 'src/utils';
import { postDepositRequest } from 'src/infrastructure/api';

import { Form } from "src/components/hook-form";
import { Iconify } from 'src/components/iconify';

interface DialogConfirmTopUpProps {
    open: boolean;
    onClose: () => void;
    amount?: number;
    bank?: BankAccountResponse;
}

type DepositSchemaType = zod.infer<typeof DepositSchema>;

const DepositSchema = zod.object({
    amount: zod.number().min(3, { message: "Nominal deposit wajib diisi!" }),
    unique_code: zod.number().optional(),
    net_amount: zod.number().optional(),
    bank_accounts_id: zod.number().min(1, { message: "Bank Tujuan Wajib Dipilih!" }),
})

const defaultValues: DepositSchemaType = {
    amount: 0,
    unique_code: 0,
    net_amount: 0,
    bank_accounts_id: 0,
};

export const DialogConfirmTopUp = ({
    open,
    onClose,
    amount = undefined,
    bank = undefined,
}: DialogConfirmTopUpProps) => {
    const form = useForm<DepositSchemaType>({
        resolver: zodResolver(DepositSchema),
        defaultValues,
    });

    useEffect(() => {
        if (amount) {
            // Set 3 digit unique code based on the amount
            const unique = Math.floor(Math.random() * 900) + 100; // Generates a random number between 100 and 999
            form.setValue('unique_code', unique);
            form.setValue('amount', amount);
            form.setValue('net_amount', amount + unique);
            form.setValue('bank_accounts_id', bank?.id || 0);
        }
    }, [amount, open]);

    const { handleSubmit, reset } = form;

    const { mutateAsync: createDeposit, isPending: isCreating } = useMutation({
        mutationKey: ["deposit", "create"],
        mutationFn: postDepositRequest,
    });

    const onSubmit = async (data: any) => {
        try {
            const save = await createDeposit(data);
            toast.success("Berhasil", {
                description: save?.message ?? "Berhasil menyimpan data",
            });
            handleClose();
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menyimpan data",
            });
        }
    };

    const handleCopyAccountNumber = async (accountNumber: string, bankName: string) => {
        try {
            await navigator.clipboard.writeText(accountNumber);
            toast.success("Berhasil", {
                description: `Nomor rekening ${bankName} berhasil disalin`,
            });
        } catch (error) {
            toast.error("Gagal", {
                description: "Gagal menyalin nomor rekening",
            });
        }
    };

    const handleCopyAmount = async (am: number) => {
        try {
            await navigator.clipboard.writeText(fCurrency(am));
            toast.success("Berhasil", {
                description: `Jumlah ${fCurrency(am)} berhasil disalin`,
            });
        } catch (error) {
            toast.error("Gagal", {
                description: "Gagal menyalin jumlah",
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

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
            <Form methods={form} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    Top Up Saldo
                </DialogTitle>
                <DialogContent sx={{ paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
                    <Stack sx={{ p: 2, bgcolor: 'grey.200', borderRadius: 1 }} direction="column" gap={1}>
                        <Stack direction="row" gap="1" justifyContent="center">
                            <Typography variant="h2" textAlign="center">
                                {fCurrency(form.watch('net_amount') || 0)}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => handleCopyAmount(form.watch('net_amount') || 0)}
                            >
                                <Iconify icon="solar:copy-bold-duotone" />
                            </IconButton>
                        </Stack>
                    </Stack>
                    <Alert severity="info">
                        <Typography variant="body2">
                            Silahkan transfer sejumlah {fCurrency(form.watch('net_amount') || 0)} ke rekening di bawah ini, Kemudian klik tombol Top Up untuk melanjutkan proses.
                        </Typography>
                    </Alert>
                    <Stack sx={{ mb: 2, p: 2, bgcolor: 'grey.200', borderRadius: 1 }} direction="column" gap={1}>
                        <Box>
                            <Typography variant="h6" color="info">
                                {bank?.bank_name ?? "-"}
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {bank?.account_number ?? "-"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {bank?.account_holder_name ?? "-"}
                            </Typography>
                        </Box>
                        <Box>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<Iconify icon="solar:copy-bold-duotone" />}
                                onClick={() => handleCopyAccountNumber(bank?.account_number as string, bank?.bank_name as string)}
                            >
                                Salin No Rekening
                            </Button>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleClose}
                    >
                        Batal
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loadingPosition="start"
                        color="primary"
                        loading={isCreating}
                    >
                        Top Up
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    )
}