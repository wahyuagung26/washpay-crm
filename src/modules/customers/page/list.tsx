'use client';

import type { CustomerResponse } from "src/infrastructure/type";

import { useState } from "react";
import { useBoolean } from "minimal-shared/hooks";

import { Card, Grid2, Stack, Button, Typography, CardContent, TablePagination } from "@mui/material";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { BasicMenu } from "src/components/custom-menu";
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs";
import { DialogConfirmDelete } from "src/components/dialog/confirm-delete";

import { DialogForm } from "../components/dialog-form";
import { useCustomerList, useCustomerDelete } from "../hooks";

export const ListCustomerPage = () => {
    const [selected, setSelected] = useState<CustomerResponse | null>(null);
    const openForm = useBoolean(false);
    const openFormDelete = useBoolean(false);

    const { form, list, handleSearch, handlePageChange, handlePerPageChange } = useCustomerList();
    
    const { handleDelete, isDeleting } = useCustomerDelete({
        onSuccess: () => {
            list.refetch();
            handleCloseDelete();
        },
    });

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
                                <Grid2 container spacing={2}>
                                    <Grid2 size={{ xs: 10, sm: 11 }}>
                                        <Stack direction="column" gap={1}>
                                            <Typography variant="h6">{item.name}</Typography>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Iconify icon="solar:phone-calling-rounded-bold-duotone" width={16} height={16} />
                                                <Typography variant="body1" color="text.secondary">{item.phone_number}</Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Iconify icon="solar:map-point-wave-bold-duotone" width={16} height={16} />
                                                <Typography variant="body1" color="text.secondary">{item.address}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={{ xs: 2, sm: 1 }} display="flex" alignItems="center" justifyContent="center">
                                        <BasicMenu
                                            items={[
                                                {
                                                    id: 1,
                                                    name: "Edit",
                                                    icon: "eva:edit-fill",
                                                    onClick: () => handleEditCustomer(item),
                                                },
                                                {
                                                    id: 2,
                                                    name: "Delete",
                                                    icon: "eva:trash-2-outline",
                                                    onClick: () => handleDeleteCustomer(item),
                                                    color: "error.main",
                                                },
                                            ]}
                                            label="Action"
                                            id={item.id}
                                        />
                                    </Grid2>
                                </Grid2>
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
                        handlePageChange(newPage);
                    }}
                    rowsPerPage={list.data?.meta?.per_page ?? 10}
                    onRowsPerPageChange={(event) => {
                        handlePerPageChange(parseInt(event.target.value, 10));
                    }}
                />
            </Grid2>
        </>
    );

    const handleCloseForm = () => {
        setSelected(null);
        openForm.onFalse();
    };

    const handleAddCustomer = () => {
        setSelected(null);
        openForm.onTrue();
    };

    const handleEditCustomer = (item: CustomerResponse) => {
        setSelected(item);
        openForm.onTrue();
    };

    const handleCloseDelete = () => {
        setSelected(null);
        openFormDelete.onFalse();
    };

    const handleDeleteCustomer = (item: CustomerResponse) => {
        setSelected(item);
        openFormDelete.onTrue();
    };

    const handleActionDelete = async ({ id, reason }: { id: number; reason?: string }) => {
        if (selected) {
            handleDelete({ id, reason });
        }
    };

    return (
        <DashboardContent>
            <MainBreadchumbs
                links={[
                    { name: "Dashboard", href: "/" },
                    { name: "Pelanggan", href: paths.customer.root },
                    { name: "Daftar Pelanggan" },
                ]}
                heading="Daftar Pelanggan"
                action={
                    <Button
                        variant="contained"
                        
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        color="primary"
                        onClick={handleAddCustomer}
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "auto",
                            }
                        }}
                    >
                        Tambah Pelanggan
                    </Button>
                }
            />
            <Form methods={form}>
                <Field.SearchKeyword
                    size="small"
                    name="search"
                    placeholder="Search..."
                    onChange={(event) => {
                        handleSearch(event.target.value);
                    }}
                />
            </Form>
            <Grid2 container spacing={2}>
                {
                    list.isLoading ? <LoadingList /> : renderItem()
                }
            </Grid2>
            {
                openForm.value && (
                    <DialogForm
                        open={openForm.value}
                        onClose={handleCloseForm}
                        initialValues={selected}
                        mode={selected ? "edit" : "create"}
                        refetch={list.refetch}
                    />
                )
            }

            {
                openFormDelete.value && (
                    <DialogConfirmDelete
                        open={openFormDelete.value}
                        onClose={handleCloseDelete}
                        initialValues={selected}
                        onSubmit={(data, reason) => {
                            handleActionDelete({
                                id: data?.id ?? 0,
                                reason,
                            })
                        }}
                        isLoading={isDeleting}
                        message={
                            <Typography variant="body1" textAlign="center">
                                Apakah anda yakin ingin menghapus pelanggan <strong>{selected?.name}</strong>?
                            </Typography>
                        }
                    />
                )
            }

        </DashboardContent>
    );
}