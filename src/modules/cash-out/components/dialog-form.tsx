import LoadingButton from "@mui/lab/LoadingButton";
import { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { Form, Field } from "src/components/hook-form";

import { useCashOutForm } from "../hooks";

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
    const {
        form,
        category,
        categoryOpen,
        isCreating,
        isUpdating,
        isLoading,
        handleSubmit,
        onSubmit,
        handleReset,
    } = useCashOutForm({
        initialValues,
        mode,
        onSuccess: () => {
            refetch();
            handleClose();
        },
    });

    const handleClose = () => {
        handleReset();
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
                    {mode === "create" ? "Tambah Pengeluaran" : "Edit Pengeluaran"}
                </DialogTitle>
                <DialogContent sx={{ py: 2, paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
                    <Stack direction="column" spacing={4}>
                        <Field.AutoCompleteAsync
                            name="category"
                            label="Kategori"
                            placeholder="Pilih kategori pengeluaran"
                            options={category?.data?.data ?? []}
                            async={{
                                keyValue: "id",
                                keyLabel: "name",
                                isLoading: category.isLoading,
                                onSearch: () => { },
                                isOpen: categoryOpen.setValue,
                            }}
                        />
                        <Field.Text
                            name="description"
                            label="Catatan"
                            placeholder="Untuk apa pengeluaran ini ?"
                            helperText="Contoh: Pembelian barang dagangan"
                            multiline
                            rows={4}
                        />
                        <Field.Number
                            name="amount"
                            label="Nominal"
                            placeholder="Berapa nominal pengeluarannya ?"
                            startAdornment="Rp"
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