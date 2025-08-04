'use client';

import { useCallback } from "react";

import { Grid2, Button, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";
import { checkAccess } from "src/modules/auth/context/jwt";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { LoadingList } from "src/components/loading-screen";
import { MainBreadchumbs } from "src/components/breadcrumbs";
import { DialogConfirmDelete } from "src/components/dialog/confirm-delete";

import { DialogForm } from "../components/dialog-form";
import { InventoryList } from "../components/inventory-list";
import { useInventoryList, useInventoryDelete } from "../hooks";
import { DialogFormStock } from "../components/dialog-form-stock";

export const ListInventoryPage = () => {
    const {
        form,
        selected,
        openForm,
        openFormDelete,
        openFormStock,
        list,
        handleSearch,
        handlePageChange,
        handleRowsPerPageChange,
        handleCloseForm,
        handleAddInventory,
        handleEditInventory,
        handleEditStock,
        handleCloseDelete,
        handleDeleteInventory,
    } = useInventoryList();

    const { handleDelete, isDeleting } = useInventoryDelete({
        onSuccess: () => {
            list.refetch();
            handleCloseDelete();
        },
    });

    const handleActionDelete = useCallback(async ({ id, reason }: any) => {
        if (selected) {
            await handleDelete({ id, reason });
        }
    }, [selected, handleDelete]);

    return (
        <DashboardContent>
            <MainBreadchumbs
                links={[
                    { name: "Dashboard", href: "/" },
                    { name: "Inventori", href: paths.inventory.root },
                    { name: "Daftar Inventori" },
                ]}
                heading="Daftar Inventori"
                action={
                    checkAccess('inventory') && (
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            color="primary"
                            onClick={handleAddInventory}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "auto",
                                }
                            }}
                        >
                            Tambah Inventori
                        </Button>
                    )
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
                    list.isLoading ? (
                        <LoadingList />
                    ) : (
                        <InventoryList
                            data={list.data?.data ?? []}
                            total={list.data?.meta?.total ?? 0}
                            page={list.data?.meta?.page ?? 1}
                            perPage={list.data?.meta?.per_page ?? 10}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onEdit={handleEditInventory}
                            onEditStock={handleEditStock}
                            onDelete={handleDeleteInventory}
                        />
                    )
                }
            </Grid2>
            {
                openForm.value && (
                    <DialogForm
                        open={openForm.value}
                        onClose={handleCloseForm}
                        initialValues={selected}
                        mode={selected ? "edit" : "create"}
                        refetch={() => {
                            list.refetch();
                            handleCloseForm();
                        }}
                    />
                )
            }

            {
                openFormStock.value && (
                    <DialogFormStock
                        open={openFormStock.value}
                        onClose={() => openFormStock.onFalse()}
                        initialValues={selected}
                        refetch={() => {
                            list.refetch();
                        }}
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
                                Apakah anda yakin ingin menghapus produk inventori <strong>{selected?.name}</strong>?
                            </Typography>
                        }
                    />
                )
            }

        </DashboardContent>
    );
};