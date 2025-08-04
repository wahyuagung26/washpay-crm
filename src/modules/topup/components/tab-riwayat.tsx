'use client';

import type { DepositResponse } from 'src/infrastructure/type';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
    Box,
    Card,
    Chip,
    Grid2,
    Stack,
    Button,
    Typography,
    CardContent,
    TablePagination,
} from '@mui/material';

import { getListDeposit } from 'src/infrastructure/api';
import { useAuthContext } from 'src/modules/auth/hooks';
import { fCurrency, fDateTime, ADMIN_PHONE_NUMBER } from 'src/utils';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingList } from 'src/components/loading-screen';

const getStatusColor = (status: number) => {
    switch (status) {
        case 0:
            return 'warning';
        case 2:
            return 'success';
        case 3:
            return 'error';
        default:
            return 'default';
    }
};

export const RiwayatTab = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const {user} = useAuthContext();

    const list = useQuery({
        queryKey: ["product", "list", page, perPage],
        queryFn: () => getListDeposit({ page, per_page: perPage }),
    });

    const handleFollowUp = (transaction: DepositResponse) => {
        const message = `Halo Admin, saya ingin follow up transaksi top up saya dengan detail sebagai berikut:\n`
            + `Nama Merchant: ${user?.client_name}\n`
            + `PIC Merchant: ${user?.name}\n`
            + `Jumlah: ${fCurrency(transaction.amount)}\n`
            + `Bank Tujuan: ${transaction.destination_bank_name} - ${transaction.destination_account_number} a/n ${transaction.destination_account_holder_name}\n`
            + `Bank Pengirim: ${transaction.source_bank_name} - ${transaction.source_account_number} a/n ${transaction.source_account_holder_name}\n`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const renderItem = () => (
        (list.data?.data ?? []).length > 0 ? renderList() : <EmptyContent />
    );

    const renderList = () => (
        <>
            {
                (list.data?.data ?? []).map((item) => (
                    <Grid2 size={12} key={`outlet-${item.id}`}>
                        <Card>
                            <CardContent>
                                <Stack direction="column" gap={1}>
                                    <Typography variant="h3">{item?.approved_amount ? fCurrency(item.approved_amount) : fCurrency(item.amount)}</Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Iconify icon="solar:calendar-bold-duotone" width={16} height={16} />
                                        <Typography variant="body1" color="text.secondary">{fDateTime(item.created_at, "DD/MM/YYYY HH:mm:ss")}</Typography>
                                    </Stack>
                                    <Stack>
                                        <Typography variant="body1" color="text.secondary">Bank Tujuan <Typography component="span" color="#000">{item.destination_bank_name} - {item.destination_account_number} a/n {item.destination_account_holder_name}</Typography></Typography>
                                    </Stack>
                                    <Stack>
                                        <Typography variant="body1" color="text.secondary">Bank Pengirim <Typography component="span" color="#000">{item.source_bank_name} - {item.source_account_number} a/n {item.source_account_holder_name}</Typography></Typography>
                                    </Stack>
                                    <Stack>
                                        Note : {item.status_notes ?? '-'}
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Chip
                                            label={item.status_text}
                                            color={getStatusColor(item.status)}
                                            size="small"
                                        />
                                    </Stack>
                                    {
                                        item.status === 1 && (
                                            <Stack>
                                                <Button
                                                    fullWidth
                                                    startIcon={<Iconify icon="logos:whatsapp-icon" />}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleFollowUp(item)}
                                                >
                                                    Follow Up Via Whatsapp
                                                </Button>
                                            </Stack>
                                        )
                                    }
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))
            }
            <Grid2 size={12}>
                <TablePagination
                    component="div"
                    count={list.data?.meta?.total ?? 0}
                    page={(list.data?.meta?.page ?? 1) - 1}
                    onPageChange={(_, newPage) => {
                        setPage(newPage + 1);
                    }}
                    rowsPerPage={list.data?.meta?.per_page ?? 10}
                    onRowsPerPageChange={(event) => {
                        setPerPage(parseInt(event.target.value, 10));
                        setPage(1);
                    }}
                />
            </Grid2>
        </>
    );

    return (
        <Box padding={0}>
            {/* Transaction History Table */}
            <Grid2 container spacing={2}>
                {
                    list.isLoading ? <LoadingList /> : renderItem()
                }
            </Grid2>
        </Box>
    );
};
