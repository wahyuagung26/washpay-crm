'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import { Button, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { postRegister } from 'src/infrastructure/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';


// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod.object({
    user: zod.object({
        name: zod.string().min(1, { message: 'Nama wajib diisi!' }),
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
        phone_number: zod.string().min(1, { message: 'Nomor telepon wajib diisi!' }),
    }).refine((data) => data.password === data.password_confirmation, {
        message: "Password harus sama",
        path: ["password_confirmation"], // path of error
    }),
    client: zod.object({
        name: zod.string().min(1, { message: 'Nama bisnis wajib diisi!' }),
        phone_number: zod.string().min(1, { message: 'Nomor telepon bisnis wajib diisi!' }),
        address: zod.string().min(1, { message: 'Alamat bisnis wajib diisi!' }),
    }),
});

// ----------------------------------------------------------------------

export function SignUpView() {
    const showPassword = useBoolean();
    const showRePassword = useBoolean();

    const { checkUserSession } = useAuthContext();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const defaultValues: SignUpSchemaType = {
        user: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            phone_number: '',
        },
        client: {
            name: '',
            phone_number: '',
            address: '',
        },
    };

    const methods = useForm<SignUpSchemaType>({
        resolver: zodResolver(SignUpSchema),
        defaultValues,
    });

    const {mutateAsync: signUp, isPending} = useMutation({
        mutationFn: postRegister,
    })

    const {
        handleSubmit,
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signUp(data as any);
            await checkUserSession?.();

            methods.reset();
            setSuccessMessage('Pendaftaran berhasil, silahkan cek email anda untuk aktivasi akun.');
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.errors?.[0]);
        }
    });

    const renderForm = () => (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Profil Bisnis
                </Typography>
            </Box>

            <Field.Text
                name="client.name"
                label="Nama Laundry"
                placeholder="Ex: Fast Clean Laundry"
                slotProps={{ inputLabel: { shrink: true } }}
            />

            <Field.Phone
                name="client.phone_number"
                label="Nomor Telepon / HP"
                placeholder="Ex: 812xxxxxxxx"
                slotProps={{ inputLabel: { shrink: true } }}
            />

            <Field.Text
                name="client.address"
                label="Alamat"
                placeholder='Ex: Jl. Raya No. 123, Jakarta'
                slotProps={{ inputLabel: { shrink: true } }}
            />

            <Box>
                <Typography variant="h6" gutterBottom>
                    Profil User
                </Typography>
            </Box>

            <Field.Text
                name="user.name"
                label="Nama Pemilik"
                placeholder="Ex: Budi Santoso"
                slotProps={{ inputLabel: { shrink: true } }}
            />

            <Field.Text
                name="user.email"
                label="Alamat Email"
                placeholder="Ex: budi@example.com"
                slotProps={{ inputLabel: { shrink: true } }}
            />

            <Field.Phone
                name="user.phone_number"
                label="Nomor Telepon / HP"
                placeholder="Ex: 812xxxxxxxx"
                slotProps={{ inputLabel: { shrink: true } }}
            />

            <Field.Text
                name="user.password"
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
                name="user.password_confirmation"
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
                loading={isPending}
                loadingIndicator="Loading..."
            >
                Daftar
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
            <FormHead
                title="Pendaftaran Akun"
                description="Lengkapi form di bawah ini, dan kami akan mengirim link aktivasi ke email anda"
                sx={{ textAlign: { xs: 'left', md: 'left' }, mt: { xs: 0, md: 4 } }}
            />

            {!!errorMessage && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errorMessage}
                </Alert>
            )}

            {!!successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {successMessage}
                </Alert>
            )}

            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm()}
            </Form>
        </>
    );
}