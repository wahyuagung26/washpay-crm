'use client';

import { z as zod } from 'zod';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useBoolean } from "minimal-shared/hooks";
import { useMemo, useState, useEffect } from "react";
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Card, Grid2, Stack, Button, IconButton, Typography, CardContent } from "@mui/material";

import { paths } from "src/routes/paths";

import { fCurrency } from "src/utils";
import { DashboardContent } from "src/layouts/dashboard";
import { getListCustomer } from "src/infrastructure/api";
import { DialogForm as DialogFormCustomer } from "src/modules/customers/components/dialog-form";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { Form, Field } from "src/components/hook-form";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs";

import { constant } from "../constant";
import { DialogSelectProduct } from "../components/dialog-select-product";

import type { SelectedProduct } from "../type";

type CreateOrderSchemaType = zod.infer<typeof CreateOrderSchema>;

const CreateOrderSchema = zod.object({
    customer: zod.object({
        id: zod.number().min(1, { message: "ID metode pembayaran wajib diisi!" }),
        name: zod.string().min(1, { message: "ID metode pembayaran wajib diisi!" }),
    }),
    qty: zod.record(zod.number().min(0, { message: "Qty tidak boleh kurang dari 0!" })),
});

const defaultValues: CreateOrderSchemaType = {
    customer: {
        id: 0,
        name: "",
    },
    qty: {},
};

export const CreateOrderPage = () => {
    const router = useRouter();
    const form = useForm<CreateOrderSchemaType>({
        resolver: zodResolver(CreateOrderSchema),
        defaultValues,
    });

    const [keywordCustomer, setCustomerKeyword] = useState("");
    const openCustomerDialog = useBoolean(false);
    const dialogCustomer = useBoolean(false);
    const dialogProduct = useBoolean(false);
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct[]>([]);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    useEffect(() => clearSessionStorage(), []);

    const fetchCustomers = () => getListCustomer({
        keyword: keywordCustomer,
        page: 1,
        per_page: 100,
    });

    const customers = useQuery({
        queryKey: ["master", "customer", keywordCustomer],
        queryFn: fetchCustomers,
        enabled: openCustomerDialog.value
    });

    const calculateTotalPrice = (products: SelectedProduct[]) =>
        products.reduce((acc, item) => acc + (item.price * (item.qty || 0)), 0);

    const totalItem = selectedProduct.length ?? 0;
    const totalPrice = useMemo(() => calculateTotalPrice(selectedProduct), [selectedProduct]);

    const clearSessionStorage = () => {
        sessionStorage.removeItem(constant.KEY_STORAGE_ITEM);
        sessionStorage.removeItem(constant.KEY_STORAGE_CUSTOMER);
    };

    const handleQtyChange = (id: number, qty: number) => {
        if (qty === 0) {
            setSelectedProduct((prev) => prev.filter((item) => item.id !== id));
        }

        form.setValue(`qty.${id}`, qty);
        setSelectedProduct((prev) => {
            const index = prev.findIndex((item) => item.id === id);
            if (index !== -1) {
                const updatedProduct = { ...prev[index], qty };
                return [...prev.slice(0, index), updatedProduct, ...prev.slice(index + 1)];
            }
            return prev;
        });
    };

    const handleConfirmation = () => {
        sessionStorage.setItem(constant.KEY_STORAGE_ITEM, JSON.stringify(selectedProduct));
        sessionStorage.setItem(constant.KEY_STORAGE_CUSTOMER, JSON.stringify(form.getValues("customer")));
        router.push(paths.cashier.confirmation);
    };

    const renderSelectCustomer = () => (
        <Stack direction="row" spacing={2} alignItems="center">
            <Box flex={1}>
                <Field.AutoCompleteAsync
                    name="customer"
                    label="Pelanggan"
                    placeholder="Pilih Pelanggan"
                    options={customers.data?.data || []}
                    async={{
                        keyValue: "id",
                        keyLabel: "name",
                        isLoading: customers.isLoading,
                        onSearch: setCustomerKeyword,
                        isOpen: openCustomerDialog.onTrue,
                    }}
                    renderOption={(props: any, option: any) => (
                        <Stack {...props} direction="column" key={`customer-${option.id}`}>
                            <Typography variant="subtitle1">{option.name}</Typography>
                            <Typography variant="body1" color="text.secondary">{option.phone_number}</Typography>
                        </Stack>
                    )}
                />
            </Box>
            <Box>
                <IconButton size="large" color="primary" onClick={dialogCustomer.onTrue}>
                    <Iconify icon="eva:plus-fill" />
                </IconButton>
            </Box>
            {dialogCustomer.value && (
                <DialogFormCustomer
                    mode="create"
                    open={dialogCustomer.value}
                    onClose={dialogCustomer.onFalse}
                    refetch={customers.refetch}
                />
            )}
        </Stack>
    );

    const renderSelectProduct = () => (
        <>
            <Stack>
                <Button
                    variant="contained"

                    startIcon={<Iconify icon="eva:plus-fill" />}
                    color="primary"
                    fullWidth
                    onClick={dialogProduct.onTrue}
                >
                    Pilih Produk
                </Button>
            </Stack>
            <DialogSelectProduct
                open={dialogProduct.value}
                onClose={dialogProduct.onFalse}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
            />
        </>
    );

    const renderSelectedProduct = () => {
        if (selectedProduct.length === 0) return <EmptyContent />;

        return (
            <Grid2 container spacing={2}>
                {selectedProduct.map((item) => (
                    <Grid2 size={12} key={`product-${item.id}`}>
                        <Card>
                            <CardContent>
                                <Grid2 container spacing={2}>
                                    <Grid2 size={{ xs: 8, sm: 9, md: 10 }} display="flex" alignItems="center">
                                        <Stack direction="column" gap={1}>
                                            <Typography variant="body1" fontWeight={600}>{item.name}</Typography>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Iconify icon="solar:tag-bold-duotone" width={16} height={16} />
                                                <Typography variant="body1" color="text.secondary">{item.category.name}</Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Iconify icon="solar:wad-of-money-bold-duotone" width={16} height={16} />
                                                <Typography variant="body1" color="text.secondary">{fCurrency(item.price)}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={{ xs: 4, sm: 3, md: 2 }} display="flex" justifyContent="center" alignItems="center">
                                        <Field.NumberInput
                                            name={`qty.${item.id}`}
                                            min={0}
                                            max={100}
                                            defaultValue={1}
                                            onChange={(_, value) => handleQtyChange(item.id, value)}
                                            sx={{ width: "100%" }}
                                            value={item.qty}
                                        />
                                    </Grid2>
                                </Grid2>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        );
    };

    useEffect(() => {
        const handleResize = () => setViewportHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <DashboardContent>
            <MainBreadchumbs heading="Transaksi" />
            <Form methods={form}>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>{renderSelectCustomer()}</Grid2>
                    <Grid2 size={12}>{renderSelectProduct()}</Grid2>
                    <Grid2 size={12}>
                        {/* <Scrollbar sx={{ height: { xs: "calc(100vh - 340px)", sm: "calc(100vh - 370px)" } }}> */}
                        <Scrollbar sx={{ height: `${viewportHeight - 380}px` }}>
                            {renderSelectedProduct()}
                        </Scrollbar>
                    </Grid2>
                </Grid2>
                <Stack sx={{ mt: 3 }}>
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={handleConfirmation}
                        disabled={totalItem === 0 || form.watch("customer")?.id === 0}
                        sx={{ height: "fit-content" }}
                    >
                        <Stack direction="row" gap={1} width="100%" justifyContent="space-between" alignItems="center">
                            <Stack direction="column">
                                <Stack direction="row" alignItems="center" gap={1}>
                                    <Iconify icon="solar:cart-3-bold" width={24} height={24} />
                                    <Typography variant="body1" fontWeight={600}>{totalItem} Produk</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" gap={1}>
                                    <Iconify icon="solar:wad-of-money-bold-duotone" width={24} height={24} />
                                    <Typography variant="body1" fontWeight={600}>{fCurrency(totalPrice)}</Typography>
                                </Stack>
                            </Stack>
                            <Stack>
                                <Stack direction="row" alignItems="center" gap={1}>
                                    <Typography variant="body1" fontWeight={600}>Selanjutnya</Typography>
                                    <Iconify icon="solar:alt-arrow-right-linear" width={24} height={24} />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Button>
                </Stack>
            </Form>
        </DashboardContent>
    );
};