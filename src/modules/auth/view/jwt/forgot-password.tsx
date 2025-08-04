'use client';

import { z as zod } from 'zod';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Alert, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { postResetPassword } from 'src/infrastructure/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../components/form-head';
// ----------------------------------------------------------------------

export type ForgotPasswordType = zod.infer<typeof forgotPasswordSchema>;

export const forgotPasswordSchema = zod.object({
    email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function ForgotPasswordView() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const defaultValues: ForgotPasswordType = {
        email: '',
    };

    const methods = useForm<ForgotPasswordType>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues,
    });

    const { mutateAsync: submitResetPassword, isPending: isUpdating } = useMutation({
        mutationKey: ["auth", "reset-password"],
        mutationFn: postResetPassword,
    });

    const {
        handleSubmit,
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await submitResetPassword(data);

            toast.success('Kami telah mengirim link untuk mengatur ulang kata sandi. Periksa email anda dan ikuti instruksi yang diberikan.');

            methods.reset();
        } catch (error: any) {
            toast.error(error?.response?.data?.errors ?? 'Silahkan coba beberapa saat lagi / hubungi admin jika masalah berlanjut.');
        }
    });

    const renderForm = () => (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>

            <Field.Text name="email" label="Alamat Email" placeholder="example@gmail.com" slotProps={{ inputLabel: { shrink: true } }} />

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
                title="Lupa Kata Sandi"
                description="Kami akan mengirimkan link untuk mengatur ulang kata sandi melalui email anda."
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
