'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
    email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
    password: zod
        .string()
        .min(1, { message: 'Password is required!' })
        .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function SignInView() {
    const router = useRouter();

    const showPassword = useBoolean();

    const { checkUserSession } = useAuthContext();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const defaultValues: SignInSchemaType = {
        email: '',
        password: '',
    };

    const methods = useForm<SignInSchemaType>({
        resolver: zodResolver(SignInSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signInWithPassword({ email: data.email, password: data.password });
            await checkUserSession?.();

            router.refresh();
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.errors ?? 'An error occurred while signing in.');
        }
    });

    const renderForm = () => (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <Field.Text name="email" label="Alamat Email" placeholder="example@gmail.com" slotProps={{ inputLabel: { shrink: true } }} />

            <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
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
                                        <Iconify
                                            icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                                        />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            <LoadingButton
                fullWidth
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                loadingIndicator="Loading..."
            >
                Masuk
            </LoadingButton>
        </Box>
    );

    return (
        <>
            <FormHead title="Login Ke Akun Anda" />

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
