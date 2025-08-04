'use client';

import { useQuery } from '@tanstack/react-query';
import { useBoolean } from 'minimal-shared/hooks';
import { useForm, useWatch } from 'react-hook-form';

import {
    Box,
    Card,
    List,
    Grid2,
    Button,
    ListItem,
    Typography,
    CardContent,
    ListItemText,
    ListItemIcon,
} from '@mui/material';

import { getListBankAccounts } from 'src/infrastructure/api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { DialogConfirmTopUp } from './dialog-confirm-topup';

export const TopUpTab = () => {
    const dialogConfirm = useBoolean(false);

    const method = useForm({
        defaultValues: {
            amount: 50000,
            bank_accounts: {
                id: 0,
                bank_name: '',
            },
        },
    });

    const bankAccounts = useQuery({
        queryKey: ["master-data", "bank-accounts"],
        queryFn: () => getListBankAccounts(),
        refetchOnWindowFocus: true,
    });

    const amount = useWatch({
        control: method.control,
        name: 'amount',
    });

    const selectedBankAccount = useWatch({
        control: method.control,
        name: 'bank_accounts',
    });

    const handleTopUp = () => {
        dialogConfirm.onTrue();
    };

    return (
        <Box padding={0}>
            <Grid2 container spacing={2}>
                {/* Top Up Form */}
                <Grid2 size={12}>
                    <Form methods={method}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Form Top Up Saldo
                                </Typography>

                                <Grid2 container spacing={3}>
                                    <Grid2 size={12}>
                                        <Field.AutoCompleteAsync
                                            name="bank_accounts"
                                            label="Pilih Bank Tujuan"
                                            placeholder="Pilih Bank Tujuan"
                                            options={bankAccounts.data?.data || []}
                                            async={{
                                                keyLabel: "bank_name",
                                                keyValue: "id",
                                                isLoading: bankAccounts.isLoading,
                                            }}
                                        />
                                    </Grid2>

                                    <Grid2 size={12}>
                                        <Field.Number
                                            name="amount"
                                            label="Nominal Top Up"
                                            fullWidth
                                            startAdornment="Rp"
                                        />
                                    </Grid2>

                                    <Grid2 size={12}>
                                        <Button
                                            type="button"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            color="primary"
                                            disabled={amount <= 0 || !(selectedBankAccount?.id > 0)}
                                            startIcon={<Iconify icon="eva:plus-fill" />}
                                            onClick={handleTopUp}
                                        >
                                            Top Up
                                        </Button>
                                    </Grid2>
                                </Grid2>
                            </CardContent>
                        </Card>
                    </Form>
                </Grid2>
                {/* Instructions Card */}
                <Grid2 size={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Cara Melakukan Top Up
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Pilih bank tujuan" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Masukkan nominal top up" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Klik tombol Top Up" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Anda akan diarahkan ke halaman konfirmasi top up" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Transfer sejumlah nominal top up beserta 3 digit unik sesuai pada halaman konfirmasi top up ke salah satu rekening di bawah ini" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Setelah admin melakukan verifikasi, saldo akan bertambah sesuai dengan nominal top up beserta 3 digit unik yang telah Anda transfer" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>

            {
                dialogConfirm.value && (
                    <DialogConfirmTopUp
                        onClose={dialogConfirm.onFalse}
                        open={dialogConfirm.value}
                        amount={amount}
                        bank={bankAccounts.data?.data?.find(bank => bank.id === selectedBankAccount?.id)}
                    />
                )
            }
        </Box>
    );
};
