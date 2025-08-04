'use client';

import axios from 'axios';
import { z as zod } from 'zod';
import Image from 'next/image';
import { toast } from 'sonner';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';

import { getToken } from '../../context/jwt';
import { FormHead } from '../../components/form-head';
// ----------------------------------------------------------------------

export type VerifyEmailType = zod.infer<typeof verifyEmailSchema>;

export const verifyEmailSchema = zod.object({
    email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function VerifyEmailView() {
    const handleVerification = (verify_url: string) => {
        const token = getToken() ?? "";

        axios.get(verify_url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                toast.success('Email berhasil diverifikasi!', {
                    id: 'success',
                    description: 'Anda akan dialihkan ke halaman dashboard.',
                    position: 'bottom-center',
                });
                setTimeout(() => {
                    window.location.href = paths.dashboard.root;
                }, 2000);
            })
            .catch(err => {
                toast.error('Gagal memverifikasi email!', {
                    id: 'error',
                    description: 'Pastikan link verifikasi yang anda klik benar.',
                    position: 'bottom-center',
                });
            });
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const verifyUrl = urlParams.get('verify_url');

        if (verifyUrl) {
            console.log('Verifying email with URL:', verifyUrl);
            handleVerification(decodeURIComponent(verifyUrl));
        } else {
            toast.error('Link verifikasi tidak ditemukan!', {
                id: 'error',
                description: 'Pastikan anda mengklik link verifikasi yang benar.',
                position: 'bottom-center',
            });
        }
    }, []);

    return (
        <>
            <Box textAlign="center" mb={3}>
                <Image src="/assets/icons/components/ic-password.svg" alt="Password Icon" width={96} height={96} />
            </Box>

            <FormHead
                title="Proses verifikasi Email"
                description="Mohon tunggu sebentar, sistem kami sedang memverifikasi email anda."
                sx={{ textAlign: 'center' }}
            />

            <Box textAlign="center">
                <CircularProgress color="primary" size={64} />
            </Box>
        </>
    );
}
