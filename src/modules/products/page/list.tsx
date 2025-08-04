'use client';

import type { ProductResponse } from "src/infrastructure/type";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { useTabs, useBoolean } from "minimal-shared/hooks";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Tab, Card, Grid2, Stack, Button, Typography, CardContent, TablePagination } from "@mui/material";

import { paths } from "src/routes/paths";

import { fCurrency } from "src/utils/format-number";

import { DashboardContent } from "src/layouts/dashboard";
import { checkAccess, getWorkspace } from "src/modules/auth/context/jwt";
import { deleteProduct, getListProduct, getListCategory } from "src/infrastructure/api";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { BasicMenu } from "src/components/custom-menu";
import { CustomTabs } from "src/components/custom-tabs";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs";
import { LoadingList, LoadingScreen } from "src/components/loading-screen";
import { DialogConfirmDelete } from "src/components/dialog/confirm-delete";

import { DialogForm } from "../components/dialog-form";

export const ListProductPage = () => {
    const defaultTab = "1";

    const form = useForm();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [selected, setSelected] = useState<ProductResponse | null>(null);
    const [outletId, setOutletId] = useState(0);
    const [categoryId, setCategoryId] = useState(defaultTab);
    const openForm = useBoolean(false);
    const openFormDelete = useBoolean(false);
    const tab = useTabs(defaultTab);

    useEffect(() => {
        const workspace = getWorkspace();
        if (workspace) {
            setOutletId(workspace.id);
        }
    }, []);

    const debounce = useDebouncedCallback((value: string) => {
        setKeyword(value);
    }, 500);

    const list = useQuery({
        queryKey: ["product", "list", page, perPage, keyword, categoryId, outletId],
        queryFn: () => getListProduct({ page, per_page: perPage, keyword, category_id: categoryId, outlet_id: outletId }),
    });

    const categories = useQuery({
        queryKey: ["category", "product", "list"],
        queryFn: () => getListCategory({ type: "product" }),
    });

    const { mutateAsync: deleteData, isPending: isDeleting } = useMutation({
        mutationFn: deleteProduct,
    })

    const renderItem = () => (
        (list.data?.data ?? []).length > 0 ? renderList() : <EmptyContent />
    );

    const renderList = () => (
        <>
            {
                (list.data?.data ?? []).map((item) => (
                    <Grid2 size={12} key={`product-${item.id}`}>
                        <Card>
                            <CardContent>
                                <Grid2 container spacing={2}>
                                    <Grid2 size={{ xs: 10, sm: 11 }}>
                                        <Stack direction="column" gap={1}>
                                            <Typography variant="h6">{item.name}</Typography>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Iconify icon="solar:tag-price-bold-duotone" width={18} height={18} />
                                                <Typography variant="body1" color="text.secondary">{fCurrency(item.price)}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid2>
                                    {
                                        checkAccess("products") && (
                                            <Grid2 size={{ xs: 2, sm: 1 }} display="flex" alignItems="center" justifyContent="center">
                                                <BasicMenu
                                                    items={[
                                                        {
                                                            id: 1,
                                                            name: "Edit",
                                                            icon: "eva:edit-fill",
                                                            onClick: () => handleEditProduct(item),
                                                        },
                                                        {
                                                            id: 2,
                                                            name: "Delete",
                                                            icon: "eva:trash-2-outline",
                                                            onClick: () => handleDeleteProduct(item),
                                                            color: "error.main",
                                                        },
                                                    ]}
                                                    label="Action"
                                                    id={item.id}
                                                />
                                            </Grid2>
                                        )
                                    }
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

    const renderTabs = () => (
        <CustomTabs value={tab.value} onChange={(e, v) => {
            tab.onChange(e, v);
            setCategoryId(v);
            setPage(1);
        }} variant="scrollable" scrollButtons="auto" indicatorColor="primary">
            {
                categories.data?.data?.map((item) => (
                    <Tab key={item.id} value={`${item.id}`} label={item.name} />
                ))
            }
        </CustomTabs>
    );

    const handleCloseForm = () => {
        setSelected(null);
        openForm.onFalse();
    };

    const handleAddProduct = () => {
        setSelected(null);
        openForm.onTrue();
    };

    const handleEditProduct = (item: ProductResponse) => {
        setSelected(item);
        openForm.onTrue();
    };

    const handleCloseDelete = () => {
        setSelected(null);
        openFormDelete.onFalse();
    };

    const handleDeleteProduct = (item: ProductResponse) => {
        setSelected(item);
        openFormDelete.onTrue();
    };

    const handleActionDelete = async ({ id, reason }: any) => {
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

    if (categories.isLoading) {
        return <LoadingScreen />;
    }

    return (
        <DashboardContent>
            <MainBreadchumbs
                links={[
                    { name: "Dashboard", href: "/" },
                    { name: "Produk", href: paths.product.root },
                    { name: "Daftar Produk" },
                ]}
                heading="Daftar Produk"
                action={
                    checkAccess("products") && (
                        <Button
                            variant="contained"

                            startIcon={<Iconify icon="eva:plus-fill" />}
                            color="primary"
                            onClick={handleAddProduct}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "auto",
                                }
                            }}
                        >
                            Tambah Produk
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
                        form.setValue("search", event.target.value);
                        debounce(event.target.value);
                    }}
                />
            </Form>
            {renderTabs()}
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
                                Apakah anda yakin ingin menghapus produk <strong>{selected?.name}</strong>?
                            </Typography>
                        }
                    />
                )
            }

        </DashboardContent>
    );
}