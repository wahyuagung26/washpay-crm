import { useState, useEffect } from "react";
import { useTabs } from "minimal-shared/hooks";
import { useQuery } from "@tanstack/react-query";

import LoadingButton from "@mui/lab/LoadingButton";
import { Tab, Card, Grid2, Stack, Dialog, Button, useTheme, Typography, DialogTitle, CardContent, DialogContent, DialogActions, TablePagination } from "@mui/material";

import { fCurrency } from "src/utils";
import { getWorkspace } from "src/modules/auth/context/jwt";
import { getListProduct, getListCategory } from "src/infrastructure/api";

import { Iconify } from "src/components/iconify";
import { CustomTabs } from "src/components/custom-tabs";
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";

import type { SelectedProduct } from '../type';

interface DialogSelectProductProps {
    open: boolean;
    onClose: () => void;
    selectedProduct?: SelectedProduct[];
    setSelectedProduct?: React.Dispatch<React.SetStateAction<SelectedProduct[]>>;
}

export const DialogSelectProduct = ({
    open,
    onClose,
    selectedProduct = [],
    setSelectedProduct
}: DialogSelectProductProps) => {
    const theme = useTheme();
    const [tempSelectedProduct, setTempSelectedProduct] = useState<SelectedProduct[]>(selectedProduct);

    useEffect(() => {
        if (open) {
            setTempSelectedProduct(selectedProduct);
        }
    }, [selectedProduct, open]);

    const defaultTab = "1";
    const [outletId, setOutletId] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [categoryId, setCategoryId] = useState(defaultTab);
    const tab = useTabs(defaultTab);

    useEffect(() => {
        const workspace = getWorkspace();
        if (workspace) {
            setOutletId(workspace.id);
        }
    }, []);

    const categories = useQuery({
        queryKey: ["order", "select-product", "category"],
        queryFn: () => getListCategory({ type: "product" }),
        enabled:  open && outletId > 0,
    });

    const products = useQuery({
        queryKey: ["product", "list", categoryId, outletId, page, perPage],
        queryFn: () => getListProduct({ page, per_page: perPage, category_id: categoryId, outlet_id: outletId }),
        enabled: open && categoryId != "",
    });

    const handleClose = () => {
        onClose();
    };

    const handleSelect = (item: any) => {
        const selected = tempSelectedProduct.find((product) => product.id === item.id);
        if (selected) {
            setTempSelectedProduct?.((prev: SelectedProduct[]) => prev.filter((product) => product.id !== item.id));
        } else {
            setTempSelectedProduct?.((prev: SelectedProduct[]) => [
                ...prev,
                { ...item, qty: 1 }, // Add the selected item with qty 1
            ]);
        }
    };

    const handleSubmit = () => {
        if (setSelectedProduct) {
            setSelectedProduct(tempSelectedProduct);
        }
        handleClose();
    };

    const renderTabs = () => (
        <CustomTabs value={tab.value} onChange={(e, v) => {
            tab.onChange(e, v);
            setCategoryId(v);
            setPage(1);
        }} variant="scrollable" scrollButtons="auto" indicatorColor="primary" sx={{ mt: 1 }}>
            {
                categories.data?.data?.map((item) => (
                    <Tab key={item.id} value={`${item.id}`} label={item.name} />
                ))
            }
        </CustomTabs>
    );

    const renderItem = () => (
        (products.data?.data ?? []).length > 0 ? renderList() : <EmptyContent />
    );

    const renderList = () => (
        <>
            {
                (products.data?.data ?? []).map((item) => (
                    <Grid2 size={12} key={`product-${item.id}`}>
                        <Card
                            sx={{
                                '&.MuiPaper-root': {
                                    border: "1px solid",
                                    borderColor: tempSelectedProduct.some((product) => product.id === item.id) ? "primary.main" : "transparent",
                                    boxShadow: tempSelectedProduct.some((product) => product.id === item.id) ? theme.vars.customShadows.primary : theme.vars.customShadows.z4,
                                },
                                cursor: "pointer",
                            }}
                            onClick={() => handleSelect(item)}
                        >
                            <CardContent>
                                <Grid2 container spacing={2}>
                                    <Grid2 size={{ xs: 10, sm: 11 }}>
                                        <Stack direction="column" gap={1}>
                                            <Typography variant="body1" fontWeight={600}>{item.name}</Typography>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Iconify icon="solar:wad-of-money-bold-duotone" width={16} height={16} />
                                                <Typography variant="body1" color="text.secondary">{fCurrency(item.price)}</Typography>
                                            </Stack>
                                        </Stack>
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
            sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        height: "100%",
                    },
                },
            }}
        >
            <DialogTitle>
                <Typography variant="h6" component="span" fontWeight={600}>
                    Pilih Produk
                </Typography>
                {renderTabs()}
            </DialogTitle>
            <DialogContent sx={{ py: 2, gap: 2, flexDirection: "column", display: "flex" }} >
                <Grid2 container spacing={2}>
                    {
                        products.isLoading ? <LoadingList /> : renderItem()
                    }
                </Grid2>
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
                    onClick={handleSubmit}
                >
                    Simpan
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}