'use client';

import type { DepositResponse } from 'src/infrastructure/type';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBoolean } from 'minimal-shared/hooks';

import {
    Box,
    Card,
    Chip,
    Button,
    Typography,
    CardContent,
    CircularProgress,
} from '@mui/material';

import { fCurrency, fDateTime } from 'src/utils';
import { getPendingDeposit } from 'src/infrastructure/api';

import { Iconify } from 'src/components/iconify';

import { DialogEvicenceTopUp } from './dialog-evidence';

const COMPONENT_CONFIG = {
    REFETCH_INTERVAL: 30000, // 30 seconds
} as const;

export const PendingConfirmation = () => {
    const dialogUpdateEvidence = useBoolean(false);
    const [selectedTransaction, setSelectedTransaction] = useState<DepositResponse | null>(null);

    const pendingDeposit = useQuery({
        queryKey: ['deposit', 'pending'],
        queryFn: () => getPendingDeposit(),
        refetchOnWindowFocus: true,
        refetchInterval: COMPONENT_CONFIG.REFETCH_INTERVAL,
    });

    const handleUpdateEvidence = (transaction: DepositResponse) => {
        setSelectedTransaction(transaction);
        dialogUpdateEvidence.onTrue();
    };

    if (pendingDeposit.isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (pendingDeposit.error) {
        return (
            <Card sx={{ mb: 3, bgcolor: 'error.lighter' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Iconify icon="eva:alert-circle-fill" sx={{ color: 'error.main' }} />
                        <Typography variant="body2" color="error.main">
                            Gagal memuat data transaksi pending
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    if (pendingDeposit?.data?.data?.length === 0) {
        return null; // Don't show anything if no pending transactions
    }

    return (
        <Card sx={{ bgcolor: 'warning.lighter' }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Iconify icon="eva:clock-fill" sx={{ color: 'warning.main' }} />
                    <Typography variant="h6" color="warning.main">
                        Menunggu Bukti Transfer
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                    Anda memiliki {pendingDeposit?.data?.data?.length} transaksi top up yang menunggu bukti transfer.
                </Typography>

                {pendingDeposit?.data?.data?.map((transaction) => (
                    <Box
                        key={transaction.id}
                        sx={{
                            p: 2,
                            mb: 2,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'warning.light',
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h2">
                                {fCurrency(transaction.amount)}
                            </Typography>
                            <Chip
                                label="Pending"
                                color="warning"
                                size="small"
                            />
                        </Box>

                        <Typography variant="body2" color="text.secondary" mb={1}>
                            Bank: {transaction.destination_bank_name} - {transaction.destination_account_number}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" mb={2}>
                            {fDateTime(transaction.created_at, "DD/MM/YYYY HH:mm")}
                        </Typography>

                        <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            startIcon={<Iconify icon="eva:checkmark-fill" />}
                            onClick={() => handleUpdateEvidence(transaction)}
                        >
                            Kirim Bukti Transfer
                        </Button>
                    </Box>
                ))}

                <DialogEvicenceTopUp
                    open={dialogUpdateEvidence.value}
                    onClose={dialogUpdateEvidence.onFalse}
                    deposit={selectedTransaction as DepositResponse}
                    onSuccess={() => {
                        pendingDeposit.refetch(); // Refetch to update the pending transactions
                    }}
                />
            </CardContent>
        </Card>
    );
};
