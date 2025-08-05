'use client';

import type { TopUpResponse } from "src/infrastructure/type";

import { useState } from "react";
import { useBoolean } from "minimal-shared/hooks";

import {
    Card,
    Chip,
    Table,
    Stack,
    Button,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    TableContainer,
    TablePagination
} from "@mui/material";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";
import { fCurrency, fDateTime, STATUS_TOPUP_APPROVED, STATUS_TOPUP_REJECTED, STATUS_TOPUP_PENDING_APPROVAL } from "src/utils";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs";

import { useTopupList } from "../hooks";
import { DialogApprove } from "../components/dialog-approve";

export const ListTopupPage = () => {
    const { form, list, handleSearch, handlePageChange, handlePerPageChange } = useTopupList();

    const [selectedTopUp, setSelectedTopUp] = useState<TopUpResponse | null>(null);

    const dialogApprove = useBoolean(false);

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0:
                return 'warning'; // Pending
            case STATUS_TOPUP_PENDING_APPROVAL:
                return 'info'; // Pending
            case STATUS_TOPUP_APPROVED:
                return 'success'; // Approved
            case STATUS_TOPUP_REJECTED:
                return 'error';   // Rejected
            default:
                return 'default';
        }
    };

    const handleOpenApproveDialog = (topup: TopUpResponse) => {
        setSelectedTopUp(topup);
        dialogApprove.onTrue();
    };

    const renderTable = () => (
        <Card>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Klien</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell align="right">Jumlah</TableCell>
                            <TableCell>Bank Tujuan</TableCell>
                            <TableCell>Bank Sumber</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(list.data?.data ?? []).map((item) => (
                            <TableRow key={`topup-${item.id}`} hover>
                                <TableCell>
                                    <Stack direction="column" spacing={0.5}>
                                        <Typography variant="body1" fontWeight="medium">
                                            {item.client_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {item.client_id}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Iconify icon="solar:user-bold-duotone" width={16} height={16} />
                                            <Typography variant="body1">{item.owner_name}</Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Iconify icon="solar:phone-calling-rounded-bold-duotone" width={16} height={16} />
                                            <Typography variant="body2" color="text.secondary">{item.owner_phone}</Typography>
                                        </Stack>
                                    </Stack>
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="column" spacing={0.5} alignItems="flex-end">
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body1" fontWeight="medium">
                                                {fCurrency(item.net_amount)}
                                            </Typography>
                                        </Stack>
                                        {item.approved_amount !== item.net_amount && (
                                            <Typography variant="body2" color="success.main">
                                                Disetujui: {fCurrency(item.approved_amount)}
                                            </Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body1">{item.destination_bank_name}</Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.destination_account_number}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.destination_account_holder_name}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body1">{item.source_bank_name}</Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.source_account_number}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.source_account_holder_name}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="column" spacing={0.5} alignItems="center">
                                        <Chip
                                            size="small"
                                            label={item.status_text}
                                            color={getStatusColor(item.status)}
                                            variant="filled"
                                        />
                                        {item.status_notes && (
                                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                                Note : {item.status_notes}
                                            </Typography>
                                        )}
                                        {item?.processed_at && (
                                            <Stack direction="column">
                                                <Typography variant="body2" color="text.secondary">
                                                    diproses pada : {fDateTime(item.processed_at)}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        item.status === STATUS_TOPUP_PENDING_APPROVAL && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="primary"
                                                onClick={() => handleOpenApproveDialog(item)}
                                            >
                                                <Iconify icon="solar:check-bold-duotone" width={16} height={16} />
                                                Setujui
                                            </Button>
                                        )
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={list.data?.meta?.total ?? 0}
                page={(list.data?.meta?.page ?? 1) - 1}
                onPageChange={(_, newPage) => handlePageChange(newPage)}
                rowsPerPage={list.data?.meta?.per_page ?? 10}
                onRowsPerPageChange={(event) => {
                    handlePerPageChange(parseInt(event.target.value, 10));
                }}
            />
        </Card>
    );

    return (
        <DashboardContent>
            <MainBreadchumbs
                links={[
                    { name: "Dashboard", href: "/" },
                    { name: "Top Up", href: paths.topup.root },
                    { name: "Daftar Top Up" },
                ]}
                heading="Daftar Top Up"
            />
            <Form methods={form}>
                <Field.SearchKeyword
                    size="small"
                    name="search"
                    placeholder="Cari top up..."
                    onChange={(event) => handleSearch(event.target.value)}
                />
            </Form>
            {list.isLoading ? (
                <LoadingList />
            ) : (list.data?.data ?? []).length > 0 ? (
                renderTable()
            ) : (
                <EmptyContent />
            )}

            {
                dialogApprove.value && (
                    <DialogApprove
                        open={dialogApprove.value}
                        onClose={() => dialogApprove.onFalse()}
                        refetch={() => list.refetch()}
                        initialValues={selectedTopUp}
                    />
                )
            }
        </DashboardContent>
    );
};