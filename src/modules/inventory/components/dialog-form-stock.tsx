import { useCallback } from 'react';

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Stack, Dialog, Button, Typography, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { Form, Field } from "src/components/hook-form";

import { useInventoryStockForm } from "../hooks";

interface DialogFormProps {
    open: boolean;
    onClose: () => void;
    refetch?: () => void;
    initialValues?: any | null;
    allowEditFooterPrint?: boolean;
}

export const DialogFormStock = ({
    open,
    onClose,
    refetch = () => { },
    initialValues = null,
}: DialogFormProps) => {
    const { 
        form, 
        isLoading, 
        onSubmit, 
        handleReset, 
        handleTypeChange, 
        optionsType 
    } = useInventoryStockForm({
        initialValues,
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
                    Mutasi Stok
                </DialogTitle>
                <DialogContent sx={{ py: 2, paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
                    <Stack direction="column" spacing={4}>
                        <Field.Text
                            name="name"
                            label="Nama Barang"
                            placeholder="Masukkan nama barang"
                            disabled
                        />
                        <Field.Text
                            name="unit"
                            label="Satuan"
                            placeholder="Contoh: pcs, kg, dll"
                            disabled
                        />
                        <Field.Number
                            name="stock"
                            label="Stok Di Aplikasi"
                            placeholder="Masukkan jumlah stok saat ini"
                            disabled
                        />
                        <Field.AutoCompleteAsync
                            name="type"
                            label="Tipe Stok"
                            placeholder="Masukkan nama barang"
                            options={optionsType}
                            async={{
                                isLoading: false,
                                isOpen: () => { },
                                onSearch: () => { },
                                placeholderSearchBox: 'Cari...',
                                keyValue: 'id',
                                keyLabel: 'name',
                            }}
                            onChange={(event, value) => {
                                handleTypeChange(value);
                            }}
                        />
                        {
                            form.watch("type")?.id === "opname" && (
                                <Field.Number
                                    name="real_stock"
                                    label="Stok Real"
                                    placeholder="Stok terbaru"
                                />
                            )
                        }
                        {
                            form.watch("type")?.id !== "opname" && (
                                <>
                                    <Field.Number
                                        name="qty"
                                        label={`Total ${form.watch("type")?.name ?? "Stok"}`}
                                        placeholder={`Masukkan total ${form.watch("type")?.name ?? "Stok"}`}
                                        disabled={(form.watch("type")?.id ?? "").length === 0}
                                    />
                                    <Field.Number
                                        name="real_stock"
                                        label="Stok Terbaru"
                                        placeholder="Stok terbaru"
                                        disabled
                                    />
                                </>
                            )
                        }
                        <Field.Text
                            name="note"
                            label="Catatan"
                            placeholder="Masukkan catatan"
                            multiline
                            minRows={2}
                        />
                        {
                            form.watch("type")?.id === "in" && (
                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                    <Box flex={1}>
                                        <Typography variant="subtitle1">Apakah ingin mencatatnya sebagai pengeluaran ?</Typography>
                                    </Box>
                                    <Box>
                                        <Field.Switch
                                            name="is_with_cashout"
                                            label=""
                                        />
                                    </Box>
                                </Stack>
                            )
                        }
                        {
                            form.watch("is_with_cashout") && (
                                <Field.Number
                                    name="cashout_amount"
                                    label="Nominal Pengeluaran"
                                    placeholder="Masukkan nominal pengeluaran untuk transaksi ini"
                                    disabled={!form.watch("is_with_cashout")}
                                    startAdornment="Rp"
                                />
                            )
                        }
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