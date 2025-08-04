import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, useMutation } from "@tanstack/react-query";

import LoadingButton from "@mui/lab/LoadingButton";
import { Grid2, Dialog, Button, Divider, Typography, DialogTitle, DialogContent, DialogActions, TablePagination } from "@mui/material";

import { getWorkspace } from "src/modules/auth/context/jwt";
import { patchUpdateInventory, getListProductInventory } from "src/infrastructure/api";

import { Form, Field } from "src/components/hook-form";
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";

import type { SelectedInventory } from '../type';

interface DialogSelectInventoryProps {
    open: boolean;
    onClose: () => void;
    selectedProduct?: SelectedInventory[];
    setSelectedProduct?: React.Dispatch<React.SetStateAction<SelectedInventory[]>>;
    transactionId?: number;
}

export const DialogSelectInventory = ({
    open,
    onClose,
    selectedProduct = [],
    setSelectedProduct,
    transactionId
}: DialogSelectInventoryProps) => {
    const form = useForm();
    const [tempSelectedProduct, setTempSelectedProduct] = useState<SelectedInventory[]>(selectedProduct);

    const categoriInventory = 4;
    const [outletId, setOutletId] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        const workspace = getWorkspace();
        if (workspace) {
            setOutletId(workspace.id);
        }
    }, []);

    const products = useQuery({
        queryKey: ["inventory", "list", categoriInventory, outletId, page, perPage, keyword],
        queryFn: () => getListProductInventory({ page, per_page: perPage, outlet_id: outletId, keyword }),
    });

    const { mutateAsync: updateInventory, isPending: isUpdatingInventory } = useMutation({
        mutationKey: ["transactions", "update-inventory"],
        mutationFn: patchUpdateInventory
    });

    useEffect(() => {
        if (open) {
            const temp = products?.data?.data?.map((item: any) => ({
                product_id: item.id,
                name: item.name,
                price: item.price,
                qty: selectedProduct.find((sp) => sp?.product_id === item?.id)?.qty || 0,
            })) || [];

            setTempSelectedProduct(temp);
        }
    }, [selectedProduct, open, products?.data?.data]);

    const debounce = useDebouncedCallback((value: string) => {
        setKeyword(value);
    }, 500);

    const handleClose = () => {
        onClose();
    };

    const handleQtyChange = (product_id: number, qty: number) => {
        // if qty <= 0, remove the product from tempSelectedProduct
        if (qty <= 0) {
            setTempSelectedProduct((prev) =>
                prev.map((item) => item.product_id === product_id ? { ...item, qty } : item)
            );
            form.setValue(`qty.${product_id}`, 0);
            return;
        }

        // if qty > 0, add or update the product in tempSelectedProduct
        const existingProduct = tempSelectedProduct.find((item) => item.product_id === product_id);
        if (existingProduct) {
            setTempSelectedProduct((prev) =>
                prev.map((item) => item.product_id === product_id ? { ...item, qty } : item)
            );
        } else {
            const newProduct = products.data?.data?.find((item: any) => item.id === product_id);
            if (newProduct) {
                setTempSelectedProduct((prev) => [
                    ...prev,
                    {
                        product_id: newProduct.id,
                        name: newProduct.name,
                        price: 0,
                        qty
                    }
                ]);
            }
        }

        // Update the form value for qty
        form.setValue(`qty.${product_id}`, qty);
    };

    const handleSubmit = async () => {
        try {
            const action = await updateInventory({
                transaction_id: transactionId as any, 
                items: tempSelectedProduct.map((item) => ({
                    product_id: item.product_id,
                    name: item.name,
                    qty: item.qty
                }))
            });

            toast.success("Berhasil", {
                description: action?.message ?? "Berhasil menyimpan data",
            });

            if (setSelectedProduct) {
                setSelectedProduct(tempSelectedProduct);
            }

            handleClose();
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menyimpan data",
            });
        }
    };

    const renderItem = () => (
        (tempSelectedProduct).length > 0 ? renderList() : <EmptyContent />
    );

    const renderList = () => (
        <>
            {
                (tempSelectedProduct).map((item: any) => (
                    <Grid2 size={12} key={`product-${item.id}`}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 7, sm: 9 }}>
                                <Typography variant="body1">{item.name}</Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 5, sm: 3 }} display="flex" justifyContent="center" alignItems="center">
                                <Field.NumberInput
                                    name={`qty.${item.product_id}`}
                                    min={0}
                                    max={100}
                                    defaultValue={item?.qty || 0}
                                    onChange={(_, value) => handleQtyChange(item.product_id, value)}
                                    sx={{ width: "100%" }}
                                    value={item?.qty}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12 }}>
                                <Divider />
                            </Grid2>
                        </Grid2>
                    </Grid2>
                ))
            }
            <Grid2 size={12}>
                <TablePagination
                    component="div"
                    count={products.data?.meta?.total ?? 0}
                    page={(products.data?.meta?.page ?? 1) - 1}
                    onPageChange={(_, newPage) => {
                        setPage(newPage + 1);
                    }}
                    rowsPerPage={products.data?.meta?.per_page ?? 10}
                    onRowsPerPageChange={(event) => {
                        setPerPage(parseInt(event.target.value, 10));
                        setPage(1);
                    }}
                />
            </Grid2>
        </>
    );

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose();
                }
            }}
            maxWidth="sm"
            fullWidth
            hideBackdrop={false}
            disableEscapeKeyDown
            scroll="paper"
        >
            <DialogTitle>
                <Typography variant="h6" component="span" fontWeight={600}>
                    Pilih Inventaris
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ py: 2, gap: 2, flexDirection: "column", display: "flex" }} >
                <Form methods={form}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                            <Field.SearchKeyword
                                size="small"
                                name="search"
                                placeholder="Cari berdasarkan nama inventaris"
                                onChange={(event) => {
                                    form.setValue("search", event.target.value);
                                    debounce(event.target.value);
                                }}
                            />
                        </Grid2>
                        {
                            products.isLoading ? <LoadingList /> : renderItem()
                        }
                    </Grid2>
                </Form>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClose}
                >
                    Batal
                </Button>
                <LoadingButton
                    type="submit"
                    variant="contained"
                    loadingPosition="start"
                    color="primary"
                    loading={isUpdatingInventory}
                    onClick={handleSubmit}
                >
                    Simpan
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}