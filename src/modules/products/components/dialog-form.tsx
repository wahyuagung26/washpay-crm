import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { useForm } from "react-hook-form";
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';

import LoadingButton from "@mui/lab/LoadingButton";
import { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { putProduct, postProduct, getListProductCategories } from 'src/infrastructure/api';

import { Form, Field } from "src/components/hook-form";

interface DialogFormProps {
    open: boolean;
    onClose: () => void;
    refetch?: () => void;
    initialValues?: any | null;
    mode?: "create" | "edit";
    allowEditFooterPrint?: boolean;
}

type ProductSchemaType = zod.infer<typeof ProductSchema>;

const ProductSchema = zod.object({
    id: zod.number().optional(),
    category: zod.object({
        id: zod.number().min(1, { message: "Kategori produk wajib diisi!" }),
        name: zod.string().optional(),
    }),
    name: zod.string().min(1, { message: "Nama produk wajib diisi!" }),
    price: zod.number().min(1, { message: "Harga produk wajib diisi!" }),
})

const defaultValues: ProductSchemaType = {
    id: undefined,
    category: {
        id: 0,
        name: "",
    },
    name: "",
    price: 0,
};

export const DialogForm = ({
    open,
    onClose,
    refetch = () => { },
    initialValues = null,
    mode = "create",
}: DialogFormProps) => {
    const values = useMemo(() => initialValues ? { ...initialValues } : { ...defaultValues }, [initialValues]);

    const form = useForm<ProductSchemaType>({
        resolver: zodResolver(ProductSchema),
        defaultValues: values,
    });

    const [categoryKeyword, setCategoryKeyword] = useState("");
    const categoryOpen = useBoolean(false);
    const category = useQuery({
        queryKey: ["product", "category", categoryKeyword],
        queryFn: () => getListProductCategories({ keyword: categoryKeyword }),
        enabled: categoryOpen.value,
    })

    const { mutateAsync: createProduct, isPending: isCreating } = useMutation({
        mutationKey: ["product", "create"],
        mutationFn: postProduct,
    });

    const { mutateAsync: updateProduct, isPending: isUpdating } = useMutation({
        mutationKey: ["product", "update"],
        mutationFn: putProduct,
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data: any) => {
        try {
            // Overwrite category
            if (data.category) {
                data.category_id = data.category.id;
                delete data.category;
            }

            const save = await (mode === "create" ? createProduct(data) : updateProduct(data));
            toast.success("Berhasil", {
                description: save?.message ?? "Berhasil menyimpan data",
            });
            refetch();
            handleClose();
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menyimpan data",
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

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
        >
            <Form methods={form} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    {mode === "create" ? "Tambah Produk" : "Edit Produk"}
                </DialogTitle>
                <DialogContent sx={{ py: 2, paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
                    <Stack direction="column" spacing={4}>
                        <Field.AutoCompleteAsync
                            name="category"
                            label="Kategori"
                            placeholder="Pilih kategori produk"
                            options={category?.data?.data ?? []}
                            async={{
                                keyValue: "id",
                                keyLabel: "name",
                                isLoading: category.isLoading,
                                onSearch: (value) => {
                                    setCategoryKeyword(value);
                                },
                                isOpen: categoryOpen.setValue,
                            }}
                        />
                        <Field.Text
                            name="name"
                            label="Nama"
                            placeholder="Masukkan nama Produk"
                        />
                        <Field.Number
                            name="price"
                            label="Harga"
                            placeholder="Masukkan harga Produk"
                            startAdornment="Rp"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleClose}
                        disabled={isCreating || isUpdating}
                    >
                        Batal
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isCreating || isUpdating}
                        loadingPosition="start"
                        color="primary"
                    >
                        Simpan
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    )
}