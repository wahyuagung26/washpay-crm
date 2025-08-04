import { useCallback } from 'react';

import LoadingButton from "@mui/lab/LoadingButton";
import { Stack, Dialog, Button, Typography, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { Form, Field } from "src/components/hook-form";

import { useInventoryForm } from "../hooks";

interface DialogFormProps {
    open: boolean;
    onClose: () => void;
    refetch?: () => void;
    initialValues?: any | null;
    mode?: "create" | "edit";
    allowEditFooterPrint?: boolean;
}

export const DialogForm = ({
    open,
    onClose,
    refetch = () => { },
    initialValues = null,
    mode = "create",
}: DialogFormProps) => {
    const { form, isLoading, onSubmit, handleReset } = useInventoryForm({
        initialValues,
        mode,
        onSuccess: () => {
            refetch();
            handleClose();
        },
    });

    const { handleSubmit } = form;

    const handleClose = useCallback(() => {
        handleReset();
        onClose();
    }, [handleReset, onClose]);

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
                    {mode === "create" ? "Tambah Inventori" : "Edit Inventori"}
                </DialogTitle>
                <DialogContent sx={{ py: 2, paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
                    <Stack direction="column" spacing={4}>
                        <Field.Text
                            name="name"
                            label="Nama Barang"
                            placeholder="Masukkan nama barang"
                        />
                        <Field.Text
                            name="unit"
                            label="Satuan"
                            placeholder="Contoh: pcs, kg, dll"
                        />
                        <Field.Number
                            name="stock"
                            label="Stok"
                            placeholder="Masukkan jumlah stok saat ini"
                            disabled={mode === "edit"}
                            helperText={
                                mode === "edit" ? (
                                    <Typography variant="caption" color="text.secondary">
                                        Untuk mengubah stok barang, silahkan edit melalui menu <strong>Mutasi Stok</strong> pada daftar inventori.
                                    </Typography>
                                ) : undefined
                            }
                        />
                        <Field.Number
                            name="stock_min"
                            label="Stok Minimal"
                            placeholder="Tentukan batas minimal stok"
                        />
                        <Field.Text
                            name="description"
                            label="Catatan"
                            placeholder="Masukkan catatan, Contoh: Barang ini digunakan untuk..."
                            multiline
                            rows={3}
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
                        type="submit"
                        variant="contained"
                        loading={isLoading}
                        loadingPosition="start"
                        color="primary"
                    >
                        Simpan
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    )
}