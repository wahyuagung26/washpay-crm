import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useCallback } from 'react';

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Alert, Stack, Button, Dialog, Typography, DialogTitle, DialogActions, DialogContent } from "@mui/material";

import { fData } from 'src/utils';
import { putOutlet, postOutlet, postUploadSingle } from 'src/infrastructure/api';

import { UploadAvatar } from 'src/components/upload';
import { Form, Field } from "src/components/hook-form";

interface DialogFormProps {
    open: boolean;
    onClose: () => void;
    refetch?: () => void;
    initialValues?: any | null;
    mode?: "create" | "edit";
    allowEditFooterPrint?: boolean;
}

type OutletSchemaType = zod.infer<typeof OutletSchema>;

const OutletSchema = zod.object({
    id: zod.number().optional(),
    name: zod.string().min(1, { message: "Nama cabang wajib diisi!" }),
    phone_number: zod.string().min(3, { message: "No. telepon wajib diisi!" }),
    address: zod.string().min(1, { message: "Alamat cabang wajib diisi!" }),
    print_footer_note: zod.string().optional().nullable(),
    logo_url: zod.string().optional().nullable(),
    path_logo: zod.string().optional().nullable(),
})

const defaultValues: OutletSchemaType = {
    id: undefined,
    name: "",
    phone_number: "",
    address: "",
    print_footer_note: null,
    logo_url: null,
    path_logo: "",
};

export const DialogForm = ({
    open,
    onClose,
    refetch = () => { },
    initialValues = null,
    mode = "create",
    allowEditFooterPrint = false,
}: DialogFormProps) => {
    const [avatarUrl, setAvatarUrl] = useState<File | string | null>(null);

    const { mutateAsync: createOutlet, isPending: isCreating } = useMutation({
        mutationKey: ["outlet", "create"],
        mutationFn: postOutlet,
    });

    const { mutateAsync: updateOutlet, isPending: isUpdating } = useMutation({
        mutationKey: ["outlet", "update"],
        mutationFn: putOutlet,
    });

    const { mutateAsync: uploadFile, isPending: isUploading } = useMutation({
        mutationKey: ["upload", "single"],
        mutationFn: postUploadSingle,
    });

    const values = useMemo(() => {
        const baseValues = initialValues ? { ...initialValues } : { ...defaultValues };
        // Set avatar URL from initial values if exists
        if (baseValues.logo_url && !avatarUrl) {
            setAvatarUrl(baseValues.logo_url);
        }
        return baseValues;
    }, [initialValues, avatarUrl]);

    const form = useForm<OutletSchemaType>({
        resolver: zodResolver(OutletSchema),
        defaultValues: values,
    });

    const { handleSubmit, reset, setValue } = form;

    const handleDropAvatar = useCallback(async (acceptedFiles: File[]) => {
        const newFile = acceptedFiles[0];
        if (!newFile) return;

        try {
            const uploadResult = await uploadFile({
                file: newFile,
                folder: 'outlets'
            });
            
            if (uploadResult?.data?.url) {
                setAvatarUrl(uploadResult.data.url);
                setValue('logo_url', uploadResult.data.url);
                setValue('path_logo', uploadResult.data.path);

                toast.success("Berhasil", {
                    description: "File berhasil diupload",
                });
            }
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal upload file",
            });
            // Still set the file locally for preview
            setAvatarUrl(newFile);
        }
    }, [uploadFile, setValue]);

    const onSubmit = async (data: any) => {
        try {
            const save = await (mode === "create" ? createOutlet(data) : updateOutlet(data));
            toast.success("Berhasil", {
                description: save?.message ?? "Berhasil menyimpan data",
            });
            refetch();
            handleClose();
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menyimpan data",
            });
        }
    };

    const handleClose = () => {
        reset();
        setAvatarUrl(null);
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
                    {mode === "create" ? "Tambah Cabang" : "Edit Cabang"}
                </DialogTitle>
                <DialogContent sx={{ py: 2, paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
                    <Stack direction="column" spacing={4}>
                        <Box>
                            <UploadAvatar
                                value={avatarUrl}
                                onDrop={handleDropAvatar}
                                validator={(fileData) => {
                                    if (fileData.size > 1000000) {
                                        return { code: 'file-too-large', message: `File is larger than ${fData(1000000)}` };
                                    }
                                    return null;
                                }}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 3,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.disabled',
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png, *.gif
                                        <br /> max size of {fData(3145728)}
                                    </Typography>
                                }
                            />
                        </Box>
                        <Field.Text
                            name="name"
                            label="Nama Cabang"
                            placeholder="Masukkan nama cabang"
                        />
                        <Field.Phone
                            name="phone_number"
                            label="No. Telepon / HP"
                            placeholder="Masukkan no. telepon"
                        />
                        <Field.Text
                            name="address"
                            label="Alamat Cabang"
                            placeholder="Masukkan alamat cabang"
                            multiline
                            rows={4}
                        />
                    </Stack>
                    <Stack direction="column" spacing={4}>
                        <Typography variant="body1" fontWeight={700}>
                            Pengaturan Printer
                        </Typography>
                        {
                            !allowEditFooterPrint && (
                                <Alert severity="error">
                                    Paket anda saat ini tidak mendukung pengaturan footer print. Silahkan upgrade paket anda untuk mengaktifkan fitur ini.
                                </Alert>
                            )
                        }
                        <Field.Text
                            name="print_footer_note"
                            label="Footer Print"
                            placeholder="Masukkan Footer Print"
                            multiline
                            rows={4}
                            disabled={!allowEditFooterPrint}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleClose}
                        disabled={isCreating || isUpdating || isUploading}
                    >
                        Batal
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isCreating || isUpdating || isUploading}
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