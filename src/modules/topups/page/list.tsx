'use client';

import {
    Card,
    Chip,
    Table,
    Stack,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    TableContainer,
    TablePagination
} from "@mui/material";

import { paths } from "src/routes/paths";

import { fCurrency, fDateTime } from "src/utils";
import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs";

import { useTopupList } from "../hooks";

export const ListTopupPage = () => {
    const { form, list, handleSearch, handlePageChange, handlePerPageChange } = useTopupList();

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0: return 'warning'; // Pending
            case 1: return 'success'; // Approved
            case 2: return 'error';   // Rejected
            default: return 'default';
        }
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(list.data?.data ?? []).map((item) => (
                            <TableRow key={`topup-${item.id}`} hover>
                                <TableCell>
                                    <Stack direction="column" spacing={0.5}>
                                        <Typography variant="body2" fontWeight="medium">
                                            {item.client_name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ID: {item.client_id}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Iconify icon="solar:user-bold-duotone" width={16} height={16} />
                                            <Typography variant="body2">{item.owner_name}</Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Iconify icon="solar:phone-calling-rounded-bold-duotone" width={16} height={16} />
                                            <Typography variant="caption" color="text.secondary">{item.owner_phone}</Typography>
                                        </Stack>
                                    </Stack>
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="column" spacing={0.5} alignItems="flex-end">
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body2" fontWeight="medium">
                                                {fCurrency(item.net_amount)}
                                            </Typography>
                                        </Stack>
                                        {item.approved_amount !== item.net_amount && (
                                            <Typography variant="caption" color="success.main">
                                                Disetujui: {fCurrency(item.approved_amount)}
                                            </Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body2">{item.destination_bank_name}</Typography>
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.destination_account_number}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.destination_account_holder_name}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body2">{item.source_bank_name}</Typography>
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.source_account_number}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.source_account_holder_name}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="column" spacing={1} alignItems="center">
                                        <Chip
                                            size="small"
                                            label={item.status_text}
                                            color={getStatusColor(item.status)}
                                            variant="filled"
                                        />
                                        {item.status_notes && (
                                            <Typography variant="caption" color="text.secondary" textAlign="center">
                                                {item.status_notes}
                                            </Typography>
                                        )}
                                        {item?.processed_at && (
                                            <Stack direction="column" spacing={0.5}>
                                                <Typography variant="body2">
                                                    {fDateTime(item.processed_at)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    oleh: {item.processed_by || '-'}
                                                </Typography>
                                                {item.update_evidence_at && (
                                                    <Typography variant="caption" color="info.main">
                                                        Bukti: {fDateTime(item.update_evidence_at)}
                                                    </Typography>
                                                )}
                                            </Stack>
                                        )}
                                    </Stack>
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
        </DashboardContent>
    );
};