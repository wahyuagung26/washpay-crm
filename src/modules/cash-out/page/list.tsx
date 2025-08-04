'use client';

import { useForm } from "react-hook-form";

import { Tab, Card, Grid2, Stack, Button, Typography, CardContent, TablePagination } from "@mui/material";

import { paths } from "src/routes/paths";

import { fDateTime } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";

import { DashboardContent } from "src/layouts/dashboard";
import { checkAccess } from "src/modules/auth/context/jwt";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { BasicMenu } from "src/components/custom-menu";
import { CustomTabs } from "src/components/custom-tabs";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs";
import { LoadingList, LoadingScreen } from "src/components/loading-screen";
import { DialogConfirmDelete } from "src/components/dialog/confirm-delete";

import { DialogForm } from "../components/dialog-form";
import { useCashOutList, useCashOutDelete } from "../hooks";

export const ListCashOutPage = () => {
    const form = useForm();
    const {
        selected,
        categoryId,
        openForm,
        tab,
        list,
        categories,
        debounce,
        handleCloseForm,
        handleAddCashOut,
        handleEditCashOut,
        handleTabChange,
        handlePageChange,
        handleRowsPerPageChange,
    } = useCashOutList();

    const {
        selected: selectedForDelete,
        openFormDelete,
        isDeleting,
        handleCloseDelete,
        handleDeleteCashOut,
        handleActionDelete,
    } = useCashOutDelete();

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
                                            <Typography variant="h6">{fCurrency(item.amount)}</Typography>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Iconify icon="solar:notebook-bold-duotone" width={16} height={16} />
                                                <Typography variant="body1" color="text.secondary">{item.description}</Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Iconify icon="solar:clock-circle-bold-duotone" width={16} height={16} />
                                                <Typography variant="body1" color="text.secondary">{fDateTime(item.created?.at)}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid2>
                                    {
                                        checkAccess("cashouts") && (
                                            <Grid2 size={{ xs: 2, sm: 1 }} display="flex" alignItems="center" justifyContent="center">
                                                <BasicMenu
                                                    items={[
                                                        {
                                                            id: 1,
                                                            name: "Edit",
                                                            icon: "eva:edit-fill",
                                                            onClick: () => handleEditCashOut(item),
                                                        },
                                                        {
                                                            id: 2,
                                                            name: "Delete",
                                                            icon: "eva:trash-2-outline",
                                                            onClick: () => handleDeleteCashOut(item),
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
                    onPageChange={handlePageChange}
                    rowsPerPage={list.data?.meta?.per_page ?? 10}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </Grid2>
        </>
    );

    const renderTabs = () => (
        <CustomTabs value={tab.value} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" indicatorColor="primary">
            {
                categories.data?.data?.map((item) => (
                    <Tab key={item.id} value={`${item.id}`} label={item.name} />
                ))
            }
        </CustomTabs>
    );

    if (categories.isLoading || categoryId === "0") {
        return <LoadingScreen />;
    }

    return (
        <DashboardContent>
            <MainBreadchumbs
                links={[
                    { name: "Dashboard", href: "/" },
                    { name: "Pengeluaran", href: paths.cashOut.root },
                    { name: "Daftar Pengeluaran" },
                ]}
                heading="Daftar Pengeluaran"
                action={
                    checkAccess("cashouts") && (
                        <Button
                            variant="contained"

                            startIcon={<Iconify icon="eva:plus-fill" />}
                            color="primary"
                            onClick={handleAddCashOut}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "auto",
                                }
                            }}
                        >
                            Tambah Pengeluaran
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
                        initialValues={selectedForDelete}
                        onSubmit={(data, reason) => {
                            handleActionDelete({
                                id: data?.id ?? 0,
                                reason,
                            }, () => {
                                list.refetch();
                            })
                        }}
                        isLoading={isDeleting}
                        message={
                            <Typography variant="body1" textAlign="center">
                                Apakah anda yakin ingin menghapus pengeluaran <strong>{selectedForDelete?.description}</strong>?
                            </Typography>
                        }
                    />
                )
            }

        </DashboardContent>
    );
}