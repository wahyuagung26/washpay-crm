import { z as zod } from 'zod';
import React, { useMemo } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Stack, Dialog, Button, DialogContent, DialogActions } from "@mui/material";

import { Form, Field } from "src/components/hook-form";

interface DialogConfirmDeleteProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: any, reason: string) => void;
    initialValues?: any | null;
    message?: React.ReactNode;
    isLoading?: boolean;
}

type DeleteSchemaType = zod.infer<typeof DeleteSchema>;

const DeleteSchema = zod.object({
    reason: zod.string().min(1, { message: "Alasan wajib diisi!" }),
})

const defaultValues: DeleteSchemaType = {
    reason: "",
};

export const DialogConfirmDelete = ({
    open,
    onClose,
    onSubmit = (data: any, reason: string) => { },
    initialValues = null,
    message = "Apakah anda yakin ingin menghapus data ini?",
    isLoading = false,
}: DialogConfirmDeleteProps) => {
    const values = useMemo(() => initialValues ? { ...initialValues } : { ...defaultValues }, [initialValues]);

    const form = useForm<DeleteSchemaType>({
        resolver: zodResolver(DeleteSchema),
        defaultValues: values,
    });

    const { handleSubmit, reset } = form;

    const handleClickSubmit = async (data: any) => {
        onSubmit(initialValues, data?.reason ?? "-");
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
                            {message}
                        </Stack>
                        <Field.Text
                            name="reason"
                            label="Alasan"
                            placeholder="Masukkan alasan kenapa menghapus data ini"
                            multiline
                            rows={4}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        type="submit"
                        variant="outlined"
                        loading={isLoading}
                        loadingPosition="start"
                        color="inherit"
                    >
                        Hapus
                    </LoadingButton>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleClose}
                    >
                        Batal
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    )
}