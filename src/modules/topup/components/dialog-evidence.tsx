/* eslint-disable react-hooks/exhaustive-deps */
import type { DepositResponse } from "src/infrastructure/type";

import { z as zod } from 'zod';
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Stack, Button, Dialog, Typography, DialogTitle, DialogActions, DialogContent } from "@mui/material";

import { fCurrency } from "src/utils";
import { putEvidenceDepositRequest } from "src/infrastructure/api";

import { Form, Field } from "src/components/hook-form";

interface DialogEvicenceTopUpProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    deposit?: DepositResponse;
}

type EvidenceTopUpType = Zod.infer<typeof EvidenceTopUpSchema>;

const EvidenceTopUpSchema = zod.object({
    id: zod.number().optional(),
    status: zod.number().min(1, { message: "Status wajib diisi!" }),
    source_bank_name: zod.string().min(1, { message: "Bank yang Anda gunakan wajib diisi!" }),
    source_account_number: zod.string().min(1, { message: "Nomor rekening wajib diisi!" }),
    source_account_holder_name: zod.string().min(1, { message: "Atas nama rekening wajib diisi!" }),
})

const defaultValues: EvidenceTopUpType = {
    id: undefined,
    status: 1, // Assuming 1 is the status for 'pending' or similar
    source_bank_name: "",
    source_account_number: "",
    source_account_holder_name: "",
};

export const DialogEvicenceTopUp = ({
    open,
    onClose,
    onSuccess,
    deposit = undefined,
}: DialogEvicenceTopUpProps) => {
    const handleClose = () => {
        onClose();
    };

    const method = useForm({
        resolver: zodResolver(EvidenceTopUpSchema),
        defaultValues,
    });

    useEffect(() => {
        if (deposit) {
            method.reset({
                id: deposit.id,
                status: 1,
                source_bank_name: deposit.source_bank_name,
                source_account_number: deposit.source_account_number,
                source_account_holder_name: deposit.source_account_holder_name,
            });
        }
    }, [deposit, open]);

    const { mutateAsync: updateEvidence, isPending: isSubmitting } = useMutation({
        mutationKey: ["deposit", "update-evidence"],
        mutationFn: putEvidenceDepositRequest,
    });

    const onSubmit = async (data: any) => {
        try {
            const save = await updateEvidence(data);
            toast.success("Berhasil", {
                description: save?.message ?? "Berhasil menyimpan data",
            });
            handleClose();
            onSuccess?.();
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menyimpan data",
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Kirim Bukti Transfer</DialogTitle>
            <DialogContent>
                <Form methods={method} onSubmit={method.handleSubmit(onSubmit)}>
                    <Stack direction="column" gap={2}>
                        <Box textAlign="center">
                            <Typography variant="h2" gutterBottom>{fCurrency(deposit?.amount)}</Typography>
                        </Box>

                        <Field.Text
                            name="source_bank_name"
                            label="Bank Yang Anda Gunakan"
                            placeholder="Masukkan nama bank"
                            fullWidth
                        />

                        <Field.Text
                            name="source_account_number"
                            label="Nomor Rekening Pengirim"
                            placeholder="Masukkan nomor rekening"
                            fullWidth
                        />

                        <Field.Text
                            name="source_account_holder_name"
                            label="Atas Nama Rekening Pengirim"
                            placeholder="Masukkan nama pemilik rekening"
                            fullWidth
                        />
                    </Stack>
                </Form>
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
                    loading={isSubmitting}
                    onClick={method.handleSubmit(onSubmit)}
                >
                    Kirim Bukti Transfer
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}