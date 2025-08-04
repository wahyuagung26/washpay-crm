import LoadingButton from "@mui/lab/LoadingButton";
import { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { Form, Field } from "src/components/hook-form";

import { useCustomerForm } from "../hooks";

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
    const { form, handleSubmit, handleReset, isLoading } = useCustomerForm({
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
            <Form methods={form} onSubmit={handleSubmit}>
                <DialogTitle>
                    {mode === "create" ? "Tambah Pelanggan" : "Edit Pelanggan"}
                </DialogTitle>
                <DialogContent sx={{ py: 2, paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
                    <Stack direction="column" spacing={4}>
                        <Field.Text
                            name="name"
                            label="Nama Pelanggan"
                            placeholder="Masukkan nama Pelanggan"
                        />
                        <Field.Phone
                            name="phone_number"
                            label="No. Telepon / HP"
                            placeholder="Masukkan no. telepon"
                        />
                        <Field.Text
                            name="address"
                            label="Alamat Pelanggan"
                            placeholder="Masukkan alamat Pelanggan"
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