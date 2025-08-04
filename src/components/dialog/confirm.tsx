import React from 'react';
import { useForm } from 'react-hook-form';

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Stack, Dialog, Button, DialogContent, DialogActions } from "@mui/material";

import { Form } from "src/components/hook-form";

interface DialogConfirmProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    buttonLabel?: string;
    message?: React.ReactNode;
}

export const DialogConfirm = ({
    open,
    onClose,
    onSubmit = undefined,
    buttonLabel = "Konfirmasi",
    message = "Apakah anda yakin ingin menghapus data ini?",
}: DialogConfirmProps) => {
    const form = useForm();

    const handleClickSubmit = async () => {
        onSubmit?.();
    };

    const handleClose = () => {
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
            <Form methods={form}>
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
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="button"
                        variant="outlined"
                        color="inherit"
                        onClick={handleClose}
                    >
                        Batal
                    </Button>
                    <LoadingButton
                        type="button"
                        variant="outlined"
                        loadingPosition="start"
                        color="primary"
                        onClick={handleClickSubmit}
                    >
                        {buttonLabel}
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    )
}