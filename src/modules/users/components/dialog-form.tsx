import type { User } from 'src/infrastructure/type';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';

import LoadingButton from "@mui/lab/LoadingButton";
import { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { getListRole } from 'src/infrastructure/api/role';
import { putUser, postUser } from 'src/infrastructure/api';

import { Form, Field } from "src/components/hook-form";

interface DialogFormProps {
    open: boolean;
    onClose: () => void;
    refetch?: () => void;
    initialValues?: any | null;
    mode?: "create" | "edit";
    allowEditFooterPrint?: boolean;
}

type UserSchemaType = zod.infer<typeof UserSchema>;

const UserSchema = zod.object({
    id: zod.number().optional(),
    name: zod.string().min(1, { message: "Nama Pengguna wajib diisi!" }),
    phone_number: zod.string().min(3, { message: "No. telepon wajib diisi!" }),
    email: zod.string().min(1, { message: "Email Pengguna wajib diisi!" }),
    password: zod.string().min(6, { message: "Password Pengguna wajib diisi, minimal 6 karakter!" }).optional(),
    password_confirmation: zod.string().min(6, { message: "Konfirmasi Password wajib diisi!" }).optional(),
    role: zod.object({
        id: zod.number().optional(),
        name: zod.string().min(1, { message: "Hak Akses wajib diisi!" }),
    }).optional(),
    is_change_password: zod.boolean().default(false).optional(),
    mode: zod.enum(["create", "edit"]).default("create").optional(),
}).superRefine((data, ctx) => {
    if (data.mode === "create") {
        if (!data.password || data.password.length < 6) {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                path: ["password"],
                message: "Password Pengguna wajib diisi, minimal 6 karakter!",
            });
        }
        if (!data.password_confirmation || data.password_confirmation.length < 6) {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                path: ["password_confirmation"],
                message: "Konfirmasi Password wajib diisi!",
            });
        }
    }
    if (data.mode === "edit" && data.is_change_password) {
        if (!data.password || data.password.length < 6) {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                path: ["password"],
                message: "Password Pengguna wajib diisi, minimal 6 karakter!",
            });
        }
        if (!data.password_confirmation || data.password_confirmation.length < 6) {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                path: ["password_confirmation"],
                message: "Konfirmasi Password wajib diisi!",
            });
        }
    }
});

const defaultValues: UserSchemaType = {
    id: undefined,
    name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: {
        id: undefined,
        name: "",
    },
    is_change_password: false,
    mode: "create",
};

export const DialogForm = ({
    open,
    onClose,
    refetch = () => { },
    initialValues = null,
    mode = "create",
}: DialogFormProps) => {
    useEffect(() => {
        if (open) {
            form.setValue("mode", mode);
        }
    }, [open, mode]);

    const values = useMemo(() => initialValues ? { ...initialValues } : { ...defaultValues }, [initialValues]);

    const form = useForm<UserSchemaType>({
        resolver: zodResolver(UserSchema),
        defaultValues: values,
    });

    const [rolesKeyword, setRolesKeyword] = useState("");
    const rolesOpen = useBoolean(false);
    const roles = useQuery({
        queryKey: ["users", "roles", rolesKeyword],
        queryFn: () => getListRole({ keyword: rolesKeyword }),
        enabled: rolesOpen.value,
    })

    const { mutateAsync: createUser, isPending: isCreating } = useMutation({
        mutationKey: ["user", "create"],
        mutationFn: postUser,
    });

    const { mutateAsync: updateUser, isPending: isUpdating } = useMutation({
        mutationKey: ["user", "update"],
        mutationFn: putUser,
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data: any) => {
        try {
            const payload: User = {
                id: data.id ?? undefined,
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                phone_number: data.phone_number,
                user_role_id: data.role?.id ?? 0,
            };

            const save = await (mode === "create" ? createUser(payload) : updateUser(payload));
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
        onClose();
    };

    const renderPasswordFields = () => (
        <>
            <Field.Text
                name="password"
                label="Password Pengguna"
                placeholder="Masukkan password Pengguna"
                type="password"
            />
            <Field.Text
                name="password_confirmation"
                label="Konfirmasi Password"
                placeholder="Masukkan konfirmasi password"
                type="password"
            />
        </>
    )

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
                    {mode === "create" ? "Tambah Pengguna" : "Edit Pengguna"}
                </DialogTitle>
                <DialogContent sx={{ py: 2, paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
                    <Stack direction="column" spacing={4}>
                        <Field.Text
                            name="name"
                            label="Nama Pengguna"
                            placeholder="Masukkan nama Pengguna"
                        />
                        <Field.Phone
                            name="phone_number"
                            label="No. Telepon / HP"
                            placeholder="Masukkan no. telepon"
                        />
                        <Field.Text
                            name="email"
                            label="Email Pengguna"
                            placeholder="Masukkan email Pengguna"
                        />
                        {
                            mode === "edit" && (
                                <>
                                    <Stack direction="row" textAlign="right" alignItems="end" justifyContent="end" spacing={1}>
                                        <Field.Switch
                                            name="is_change_password"
                                            label="Ubah Password ?"
                                        />
                                    </Stack>
                                    {form.watch("is_change_password") && renderPasswordFields()}
                                </>
                            )
                        }
                        {
                            mode === "create" && (
                                renderPasswordFields()
                            )
                        }
                        <Field.AutoCompleteAsync
                            name="role"
                            label="Hak Akses"
                            placeholder="Pilih hak akses"
                            options={roles?.data?.data ?? []}
                            disabled={mode === "edit"}
                            async={{
                                keyValue: "id",
                                keyLabel: "name",
                                isLoading: roles.isLoading,
                                onSearch: (value) => {
                                    setRolesKeyword(value);
                                },
                                isOpen: rolesOpen.setValue,
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleClose}
                        disabled={isCreating || isUpdating}
                    >
                        Batal
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isCreating || isUpdating}
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