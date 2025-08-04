import { useState } from "react";
import { useBoolean } from "minimal-shared/hooks";

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Stack, Dialog, Button, Typography, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { fCurrency, STATUS_TOPUP_APPROVED, STATUS_TOPUP_REJECTED } from "src/utils";

import { Form, Field } from "src/components/hook-form";
import { DialogConfirm } from "src/components/dialog/confirm";

import { useDialogApprove } from "../hooks/use-dialog-approve";

interface DialogApproveProps {
    open: boolean;
    onClose: () => void;
    refetch?: () => void;
    initialValues?: any | null;
}

export const DialogApprove = ({
    open,
    onClose,
    refetch = () => { },
    initialValues = null,
}: DialogApproveProps) => {
    const dialogConfirm = useBoolean(false);
    const [confirmMessage, setConfirmMessage] = useState<string>("Apakah anda yakin ingin memproses top up ini?");

    const { form, handleSubmit, handleReset, isLoading } = useDialogApprove({
        initialValues,
        onSuccess: () => {
            refetch?.();
            handleClose();
        },
    });

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleApprove = async () => {
        form.setValue("status", STATUS_TOPUP_APPROVED); // Set status to approved

        const isValid = await form.trigger();
        if (!isValid) {
            return;
        }

        setConfirmMessage("Apakah anda yakin ingin menyetujui top up ini? Saldo klien akan bertambah sesuai dengan jumlah top up yang disetujui.");
        dialogConfirm.onTrue();
    };

    const handleReject = async () => {
        form.setValue("status", STATUS_TOPUP_REJECTED); // Set status to rejected

        const isValid = await form.trigger();
        if (!isValid) {
            return;
        }

        setConfirmMessage("Apakah anda yakin ingin menolak top up ini? Saldo klien tidak akan bertambah.");
        dialogConfirm.onTrue();
    };

    return (
        <>
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
                <Form methods={form} onSubmit={handleSubmit}>
                    <DialogTitle>
                        Proses Top Up
                    </DialogTitle>
                    <DialogContent sx={{ py: 2, paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
                        <Stack direction="column" spacing={4}>
                            <Box textAlign="center">
                                <Typography variant="h2" gutterBottom>{fCurrency(form.watch("net_amount"))}</Typography>
                            </Box>

                            <Field.Number
                                name="approved_amount"
                                label="Jumlah Disetujui"
                                placeholder="Masukkan jumlah yang disetujui"
                            />

                            <Field.Text
                                name="status_notes"
                                label="Catatan"
                                placeholder="Masukkan catatan"
                                multiline
                                rows={4}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <LoadingButton
                            type="button"
                            variant="outlined"
                            loading={isLoading}
                            loadingPosition="start"
                            color="error"
                            onClick={handleReject}
                        >
                            Tolak
                        </LoadingButton>
                        <LoadingButton
                            type="button"
                            variant="contained"
                            loading={isLoading}
                            loadingPosition="start"
                            color="primary"
                            onClick={handleApprove}
                        >
                            Setujui
                        </LoadingButton>
                    </DialogActions>
                </Form>
            </Dialog>

            <DialogConfirm
                open={dialogConfirm.value}
                onClose={dialogConfirm.onFalse}
                onSubmit={handleSubmit}
                message={confirmMessage}
                buttonLabel="Ya, Lanjutkan"
            />
        </>
    )
}