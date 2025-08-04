'use client';

import type { PayloadUpdatePassword } from 'src/infrastructure/type';

import { z as zod } from 'zod';
import Image from 'next/image';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Button, IconButton, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { postUpdatePassword } from 'src/infrastructure/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../components/form-head';
// ----------------------------------------------------------------------

export type UpdatePasswordType = zod.infer<typeof updatePasswordSchema>;

export const updatePasswordSchema = zod.object({
    token: zod.string().optional(),
    email: zod
        .string()
        .min(1, { message: 'Email wajib diisi!' })
        .email({ message: 'Email harus berupa alamat email yang valid!' }),
    password: zod
        .string()
        .min(1, { message: 'Password wajib diisi!' })
        .min(6, { message: 'Password harus memiliki minimal 6 karakter!' }),
    password_confirmation: zod
        .string()
        .min(1, { message: 'Konfirmasi password wajib diisi!' })
        .min(6, { message: 'Password harus memiliki minimal 6 karakter!' }),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Password harus sama",
    path: ["password_confirmation"], // path of error
});

// ----------------------------------------------------------------------

export function UpdatePasswordView() {
    const showPassword = useBoolean();
    const showRePassword = useBoolean();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const defaultValues: UpdatePasswordType = {
        token: '',
        email: '',
        password: '',
        password_confirmation: '',
    };

    const methods = useForm<UpdatePasswordType>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues,
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        if (token) {
            methods.setValue('token', token);
        }
        if (email) {
            methods.setValue('email', email);
        }
    }, [methods]);

    const { mutateAsync: submitUpdatePassword, isPending: isUpdating } = useMutation({
        mutationKey: ["auth", "update-password"],
        mutationFn: postUpdatePassword,
    });

    const {
        handleSubmit,
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload : PayloadUpdatePassword = {
                token: data.token || '',
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
            };

            await submitUpdatePassword(payload);

            toast.success('Password berhasil diperbarui. Silahkan login menggunakan password yang baru.');

            methods.reset();
        } catch (error: any) {
            toast.error(error?.response?.data?.errors ?? 'Gagal memperbarui password. Silahkan coba lagi. Silahkan coba beberapa saat lagi / hubungi admin jika masalah berlanjut.');
        }
    });

    const renderForm = () => (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>

            <Field.Text name="email" label="Alamat Email" placeholder="example@gmail.com" slotProps={{ inputLabel: { shrink: true } }} disabled />

            <Field.Text
                name="password"
                label="Kata Sandi"
                placeholder="6+ karakter"
                type={showPassword.value ? 'text' : 'password'}
                slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={showPassword.onToggle} edge="end">
                                    <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <Field.Text
                name="password_confirmation"
                label="Ulangi Kata Sandi"
                placeholder="6+ karakter"
                type={showRePassword.value ? 'text' : 'password'}
                slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={showRePassword.onToggle} edge="end">
                                    <Iconify icon={showRePassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <LoadingButton
                fullWidth
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                loading={isUpdating}
                loadingIndicator="Loading..."
            >
                Atur Ulang Kata Sandi
            </LoadingButton>

            <Button
                component={RouterLink}
                href={paths.auth.signIn}
                variant="text"
                size="large"
                fullWidth
                color="inherit"
                sx={{ justifyContent: 'center' }}
                startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
                Kembali ke Halaman Login
            </Button>
        </Box>
    );

    return (
        <>
            <Box textAlign="center" mb={3}>
                <Image src="/assets/icons/components/ic-password.svg" alt="Password Icon" width={96} height={96} />
            </Box>

            <FormHead
                title="Atur Ulang Kata Sandi"
                sx={{ textAlign: 'center' }}
            />

            {!!errorMessage && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errorMessage}
                </Alert>
            )}

            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm()}
            </Form>
        </>
    );
}
