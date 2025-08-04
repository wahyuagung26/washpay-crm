import { z as zod } from 'zod';
import React, { useMemo } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Stack, Dialog, Button, DialogContent, DialogActions } from "@mui/material";

import { Form, Field } from "src/components/hook-form";

interface DialogUpdateStatusProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: any, note: string) => void;
    initialValues?: any | null;
    status?: string;
    message?: React.ReactNode | undefined;
    isLoading?: boolean;
}

type UpdateStatusSchemaType = zod.infer<typeof UpdateStatusSchema>;

const UpdateStatusSchema = zod.object({
    note: zod.string().optional(),
})

const defaultValues: UpdateStatusSchemaType = {
    note: "",
};

export const DialogUpdateStatus = ({
    open,
    onClose,
    onSubmit = (data: any, note: string) => { },
    initialValues = null,
    status = "delete",
    message = undefined,
    isLoading = false,
}: DialogUpdateStatusProps) => {
    const values = useMemo(() => initialValues ? { ...initialValues } : { ...defaultValues }, [initialValues]);

    const form = useForm<UpdateStatusSchemaType>({
        resolver: zodResolver(UpdateStatusSchema),
        defaultValues: values,
    });

    const { handleSubmit, reset } = form;

    const handleClickSubmit = async (data: any) => {
        onSubmit(initialValues, data?.note ?? "-");
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
            <Form methods={form} onSubmit={handleSubmit(handleClickSubmit)}>
                <DialogContent sx={{ py: 2, paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
                    <Stack direction="column" spacing={4}>
                        <Box textAlign="center">
                            <Box
                                component="img"
                                src="/assets/illustrations/characters/character-6.webp"
                                alt="warning"
                                sx={{
                                    maxWidth: "150px",
                                    width: "100%",
                                    height: "auto",
                                }}
                            />
                        </Box>
                        <Stack>
                            {!message ? `Apakah anda yakin ingin mengubah status pesanan ini menjadi ${status}?` : message}
                        </Stack>
                        <Field.Text
                            name="note"
                            label="Catatan (Opsional)"
                            placeholder="Tulis catatan jika ada hal yang perlu diperhatikan"
                            multiline
                            rows={4}
                        />
                    </Stack>
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
                        loading={isLoading}
                        loadingPosition="start"
                        color="primary"
                    >
                        Ya, Lanjutkan
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    )
}