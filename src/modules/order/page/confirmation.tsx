'use client';

import type { PayloadCreateTransaction, Customer as CustomerModel } from "src/infrastructure/type";

import { z as zod } from 'zod';
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBoolean } from "minimal-shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";

import LoadingButton from "@mui/lab/LoadingButton";
import { Card, Grid2, Stack, Button, Dialog, Divider, CardHeader, Typography, CardContent, DialogTitle, ToggleButton, DialogContent, DialogActions, InputAdornment } from "@mui/material";

import { paths } from "src/routes/paths";

import { fCurrency } from "src/utils";
import { DashboardContent } from "src/layouts/dashboard";
import { postTransaction, getPaymentMethods } from "src/infrastructure/api";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { MainBreadchumbs } from "src/components/breadcrumbs";

import { constant } from "../constant";

import type { SelectedProduct } from "../type";

type ConfirmationSchemaType = zod.infer<typeof ConfirmationSchema>;

const ConfirmationSchema = zod.object({
    is_discount: zod.boolean().optional(),
    discount_nominal: zod.number(),
    discount_percentage: zod.number(),
    discount_type: zod.enum(["nominal", "percentage"]).optional(),
    total_product: zod.number(),
    is_priority: zod.boolean().optional(),
    payment_type: zod.enum(["cash", "debt"]),
    payment_method: zod.object({
        id: zod.number(),
        name: zod.string(),
    }),
    estimation_day: zod.number().min(1, { message: "Estimasi hari wajib diisi!" }),
    note: zod.string().optional(),
}).superRefine((data, ctx) => {
    if (data.is_discount) {
        if (data.discount_nominal <= 0) {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                message: "Nominal diskon harus lebih besar dari 0",
                path: ["discount_nominal"],
            });
        }
        if (data.discount_nominal > data.total_product) {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                message: "Nominal diskon tidak boleh lebih besar dari total produk",
                path: ["discount_nominal"],
            });
        }
        if ((data.discount_percentage <= 0 || data.discount_percentage > 100) && data.discount_type === "percentage") {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                message: "Persentase diskon harus lebih besar dari 0 dan kurang dari atau sama dengan 100",
                path: ["discount_percentage"],
            });
        }
    }
    if (data.payment_type === "cash" && !data.payment_method.id) {
        ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: "Metode pembayaran wajib diisi untuk pembayaran tunai",
            path: ["payment_method"]
        });
    }
})

const defaultValues: ConfirmationSchemaType = {
    payment_type: "cash",
    payment_method: { id: 0, name: "" },
    estimation_day: 1,
    note: "",
    is_priority: false,
    is_discount: false,
    discount_nominal: 0,
    discount_percentage: 0,
    discount_type: "nominal",
    total_product: 0,
};

export const ConfirmationOrderPage = () => {
    const router = useRouter();
    const form = useForm<ConfirmationSchemaType>({
        resolver: zodResolver(ConfirmationSchema),
        defaultValues,
    });

    const [customer, setCustomer] = useState<CustomerModel | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct[]>([]);
    const [subTotal, setSubTotal] = useState(0);
    const openDialog = useBoolean(false);

    useEffect(() => {
        initializeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initializeData = () => {
        const customerData = sessionStorage.getItem(constant.KEY_STORAGE_CUSTOMER);
        const selectedProductData = sessionStorage.getItem(constant.KEY_STORAGE_ITEM);

        if (customerData) setCustomer(JSON.parse(customerData));
        if (selectedProductData) {
            const products = JSON.parse(selectedProductData);
            setSelectedProduct(products);
            const totalProductPrice = calculateSubTotal(products);
            setSubTotal(totalProductPrice);
            form.setValue("total_product", totalProductPrice);
        }

        if (!customerData || !selectedProductData) router.push(paths.cashier.root);
    };

    const calculateSubTotal = (products: SelectedProduct[]) =>
        products.reduce((acc, item) => acc + item.price * item.qty, 0);

    const handleDiscountChange = () => {
        const isDiscount = form.watch("is_discount");
        const discountType = form.watch("discount_type");
        const discountPercentage = form.watch("discount_percentage");

        if (isDiscount) {
            if (discountType === "nominal") {
                form.setValue("discount_percentage", 0);
            } else {
                const nominal = (subTotal * discountPercentage) / 100;
                form.setValue("discount_nominal", nominal);
            }
        } else {
            resetDiscount();
        }
    };

    const resetDiscount = () => {
        form.setValue("discount_nominal", 0);
        form.setValue("discount_percentage", 0);
    };

    const { mutateAsync: createTransaction, isPending: isCreating } = useMutation({
        mutationKey: ["transactions", "create"],
        mutationFn: postTransaction,
    });

    const paymentMethods = useQuery({
        queryKey: ["payment-methods", "list"],
        queryFn: () => getPaymentMethods(),
    });

    const onSubmit = async (data: ConfirmationSchemaType) => {
        try {
            const payload: PayloadCreateTransaction = {
                customer_id: customer?.id ?? 0,
                is_discount: (data.is_discount) as any,
                discount_type: (data.is_discount ? data.discount_type : null) as any,
                discount_nominal: (data.is_discount ? data.discount_nominal : 0) as any,
                total_price: subTotal,
                total_final: subTotal - (data.is_discount ? data.discount_nominal : 0),
                payment_type: data.payment_type,
                payment_method_id: data.payment_type === "cash" ? data.payment_method?.id : null,
                estimation_day: data.estimation_day,
                notes: (data.note) as any,
                is_priority: (data.is_priority) as any,
                items: selectedProduct.map(item => ({
                    product_id: item.id,
                    qty: item.qty,
                    price: item.price,
                })),
            }

            const save = await createTransaction(payload);
            toast.success("Berhasil", {
                description: save?.message ?? "Berhasil menyimpan data",
            });
            router.push(paths.cashier.root);
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menyimpan data",
            });
        }
    };

    useEffect(() => {
        handleDiscountChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch("discount_percentage"), form.watch("is_discount"), form.watch("discount_type")]);

    const renderCustomerInformation = () => (
        <Card>
            <CardHeader title="Informasi Pelanggan" />
            <CardContent>
                <Grid2 container spacing={2}>
                    {renderCustomerDetail("Nama Pelanggan", customer?.name)}
                    {renderCustomerDetail("No Telepon / HP", customer?.phone_number)}
                </Grid2>
            </CardContent>
        </Card>
    );

    const renderCustomerDetail = (label: string, value?: string) => (
        <>
            <Grid2 size={6}>
                <Typography variant="body1" color="text.secondary">{label}</Typography>
            </Grid2>
            <Grid2 size={6}>
                <Typography variant="body1" fontWeight={600} textAlign="right">{value}</Typography>
            </Grid2>
        </>
    );

    const renderDetailItem = () => (
        <Card>
            <CardHeader title="Detail Item" />
            <CardContent>
                <Grid2 container spacing={1}>
                    <Grid2 size={12}>
                        {selectedProduct.map((item) => renderProductItem(item))}
                    </Grid2>
                    <Grid2 size={12} sx={{ mt: 1 }}>
                        {renderSummary()}
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );

    const renderProductItem = (item: SelectedProduct) => (
        <Grid2 container spacing={1} key={`confirmation-item-${item.id}`} sx={{ mb: 1 }}>
            <Grid2 size={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" color="text.secondary">{item.qty}x</Typography>
                    <Typography variant="body1" color="text.secondary">{item.name}</Typography>
                </Stack>
            </Grid2>
            <Grid2 size={6}>
                <Typography variant="body1" fontWeight={600} textAlign="right">{fCurrency(item.price * item.qty)}</Typography>
            </Grid2>
            <Grid2 size={12}>
                <Divider />
            </Grid2>
        </Grid2>
    );

    const renderSummary = () => (
        <>
            {renderSummaryRow("Sub Total", fCurrency(subTotal))}
            {renderFormDiscount()}
            {renderSummaryRow("Total Akhir", fCurrency(subTotal - form.watch("discount_nominal")), "warning.dark")}
        </>
    );

    const renderSummaryRow = (label: string, value: string, color?: string) => (
        <Grid2 container spacing={2} sx={{ mb: 1 }}>
            <Grid2 size={6}>
                <Typography variant="subtitle1">{label}</Typography>
            </Grid2>
            <Grid2 size={6}>
                <Typography variant="subtitle1" fontWeight={600} textAlign="right" color={color}>{value}</Typography>
            </Grid2>
        </Grid2>
    );

    const renderOtherInformation = () => (
        <Card>
            <CardHeader title="Informasi Lainnya" />
            <CardContent>
                <Grid2 container spacing={2} sx={{ mb: 1 }}>
                    <Grid2 size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Jadikan Prioritas</Typography>
                    </Grid2>
                    <Grid2 size={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Field.Switch
                            name="is_priority"
                            label=""
                        />
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2} sx={{ mb: 1 }}>
                    <Grid2 size={12} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Metode Pembayaran</Typography>
                    </Grid2>
                    <Grid2 size={12} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Grid2 size={12}>
                            <Field.ToggleButton name="payment_type">
                                <ToggleButton color="primary" value="cash">
                                    Bayar Sekarang
                                </ToggleButton>
                                <ToggleButton color="primary" value="debt">
                                    Bayar Nanti
                                </ToggleButton>
                            </Field.ToggleButton>
                        </Grid2>
                    </Grid2>
                    {
                        form.watch("payment_type") === "cash" && (
                            <Grid2 size={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Field.AutoCompleteAsync
                                    name="payment_method"
                                    placeholder="Pilih metode pembayaran"
                                    options={paymentMethods?.data?.data ?? []}
                                    async={{
                                        keyValue: "id",
                                        keyLabel: "name",
                                        isLoading: false,
                                        onSearch: () => { },
                                        isOpen: () => { },
                                    }}
                                />
                            </Grid2>
                        )
                    }
                    <Grid2 size={12} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Catatan</Typography>
                    </Grid2>
                    <Grid2 size={12}>
                        <Field.Text
                            name="note"
                            placeholder="Masukkan catatan"
                            multiline
                            rows={4}
                        />
                    </Grid2>
                    <Grid2 size={12} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Estimasi Pengerjaan (Hari)</Typography>
                    </Grid2>
                    <Grid2 size={12}>
                        <Field.Number
                            name="estimation_day"
                            type="number"
                            placeholder="Berapa lama estimasi pengerjaan ?"
                            slotProps={{
                                input: {
                                    endAdornment: (<InputAdornment position="end"><Typography variant="body1">Hari</Typography></InputAdornment>),
                                }
                            }}
                        />
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );

    const renderFormDiscount = () => (
        <>
            <Grid2 container spacing={2} sx={{ mb: 1 }}>
                <Grid2 size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1">Diskon</Typography>
                </Grid2>
                <Grid2 size={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Field.Switch
                        name="is_discount"
                        label=""
                        onChange={() => {
                            resetDiscount();
                            form.setValue("discount_type", "nominal");
                        }}
                    />
                </Grid2>
            </Grid2>
            {
                form.watch("is_discount") && (
                    <Grid2 container spacing={1} sx={{ mb: 2 }}>
                        <Grid2 size={12}>
                            <Field.ToggleButton name="discount_type" onChange={() => resetDiscount()}>
                                <ToggleButton color="primary" value="nominal">
                                    Diskon RP
                                </ToggleButton>
                                <ToggleButton color="primary" value="percentage">
                                    Diskon %
                                </ToggleButton>
                            </Field.ToggleButton>
                        </Grid2>
                        {
                            form.watch("discount_type") === "nominal" ? (
                                <Grid2 size={12}>
                                    <Field.Number
                                        name="discount_nominal"
                                        label="Nominal Diskon"
                                        startAdornment="Rp"
                                    />
                                </Grid2>
                            ) : (
                                <Grid2 size={12}>
                                    <Grid2 container spacing={2}>
                                        <Grid2 size={{ xs: 12, sm: 6 }}>
                                            <Field.Number
                                                name="discount_percentage"
                                                label="Diskon %"
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, sm: 6 }}>
                                            <Field.Number
                                                name="discount_nominal"
                                                label="Nominal Diskon"
                                                disabled
                                                startAdornment="Rp"
                                            />
                                        </Grid2>
                                    </Grid2>
                                </Grid2>
                            )
                        }
                    </Grid2>
                )
            }
        </>
    );

    const renderDialogCancel = () => (
        <Dialog open={openDialog.value} onClose={openDialog.onFalse}>
            <DialogTitle>Batalkan pesanan ini ?</DialogTitle>
            <DialogContent sx={{ color: 'text.secondary' }}>
                <Typography variant="body1">
                    Apakah anda yakin ingin membatalkan pesanan ini ? semua data yang sudah diisi akan hilang.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Stack direction={{ xs: 'column', sm: 'row' }} sx={{width: '100%'}} gap={2}>
                    <Button variant="contained" color="primary" onClick={openDialog.onFalse} autoFocus>
                        Tidak, Lanjutkan Pesanan
                    </Button>
                    <Button variant="outlined" onClick={() => router.push(paths.cashier.root)}>
                        Ya, Saya Yakin
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );

    return (
        <DashboardContent>
            <MainBreadchumbs heading="Konfirmasi Pesanan" />
            <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>{renderCustomerInformation()}</Grid2>
                    <Grid2 size={12}>{renderDetailItem()}</Grid2>
                    <Grid2 size={12}>{renderOtherInformation()}</Grid2>
                    <Grid2 size={12}>
                        <Stack direction="column" gap={2}>
                            <LoadingButton loading={isCreating} fullWidth variant="contained" color="primary" type="submit">
                                Simpan
                            </LoadingButton>
                            <Button fullWidth variant="outlined" startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={openDialog.onTrue}>
                                Kembali
                            </Button>
                        </Stack>
                        {renderDialogCancel()}
                    </Grid2>
                </Grid2>
            </Form>
        </DashboardContent>
    );
};