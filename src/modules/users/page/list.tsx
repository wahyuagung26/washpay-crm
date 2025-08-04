'use client';

import type { UserResponse } from "src/infrastructure/type";

import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBoolean } from "minimal-shared/hooks";
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, useMutation } from "@tanstack/react-query";

import { Card, Grid2, Stack, Button, Typography, CardContent, TablePagination } from "@mui/material";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";
import { deleteUser, getListUser } from "src/infrastructure/api";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { BasicMenu } from "src/components/custom-menu";
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs";
import { DialogConfirmDelete } from "src/components/dialog/confirm-delete";

import { DialogForm } from "../components/dialog-form";

export const ListUserPage = () => {
    const form = useForm();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [selected, setSelected] = useState<UserResponse | null>(null);
    const openForm = useBoolean(false);
    const openFormDelete = useBoolean(false);

    const debounce = useDebouncedCallback((value: string) => {
        setKeyword(value);
    }, 500);

    const list = useQuery({
        queryKey: ["users", "list", page, perPage, keyword],
        queryFn: () => getListUser({ page, per_page: perPage, keyword }),
    });

    const { mutateAsync: deleteData, isPending: isDeleting } = useMutation({
        mutationFn: deleteUser,
    })

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
                                                <Iconify icon="heroicons:users-20-solid" width={16} height={16} />
                                                <Typography variant="body1" color="text.secondary">{item.role.name}</Typography>
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
                                                    onClick: () => handleEditUser(item),
                                                },
                                                {
                                                    id: 2,
                                                    name: "Delete",
                                                    icon: "eva:trash-2-outline",
                                                    onClick: () => handleDeleteUser(item),
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

    const handleCloseForm = () => {
        setSelected(null);
        openForm.onFalse();
    };

    const handleAddUser = () => {
        setSelected(null);
        openForm.onTrue();
    };

    const handleEditUser = (item: UserResponse) => {
        setSelected(item);
        openForm.onTrue();
    };

    const handleCloseDelete = () => {
        setSelected(null);
        openFormDelete.onFalse();
    };

    const handleDeleteUser = (item: UserResponse) => {
        setSelected(item);
        openFormDelete.onTrue();
    };

    const handleActionDelete = async ({id, reason}: any) => {
        try {
            if (selected) {
                const del = await deleteData({ id, reason });

                toast.success("Berhasil", {
                    description: del?.message ?? "Berhasil menghapus data",
                });

                list.refetch();
                handleCloseDelete();
            }
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menghapus data",
            });
        }
    };

    return (
        <DashboardContent>
            <MainBreadchumbs
                links={[
                    { name: "Dashboard", href: "/" },
                    { name: "Pengguna", href: paths.user.root },
                    { name: "Daftar Pengguna" },
                ]}
                heading="Daftar Pengguna"
                action={
                    <Button
                        variant="contained"
                        
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        color="primary"
                        onClick={handleAddUser}
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "auto",
                            }
                        }}
                    >
                        Tambah Pengguna
                    </Button>
                }
            />
            <Form methods={form}>
                <Field.SearchKeyword
                    size="small"
                    name="search"
                    placeholder="Search..."
                    onChange={(event) => {
                        form.setValue("search", event.target.value);
                        debounce(event.target.value);
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
                                Apakah anda yakin ingin menghapus pengguna <strong>{selected?.name}</strong>?
                            </Typography>
                        }
                    />
                )
            }

        </DashboardContent>
    );
}