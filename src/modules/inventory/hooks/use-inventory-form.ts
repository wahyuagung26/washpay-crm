import type { ProductInventory } from 'src/infrastructure/type';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { useMemo, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { putProductInventory, postProductInventory } from 'src/infrastructure/api';

type InventorySchemaType = zod.infer<typeof InventorySchema>;

const InventorySchema = zod.object({
    id: zod.number().optional(),
    name: zod.string().min(1, { message: "Nama barang wajib diisi!" }),
    unit: zod.string().min(1, { message: "Satuan wajib diisi!" }),
    stock: zod.number().min(0, { message: "Stok wajib diisi!" }),
    stock_min: zod.number().min(0, { message: "Stok minimal wajib diisi!" }),
    description: zod.string().optional().nullable(),
});

const defaultValues: InventorySchemaType = {
    id: undefined,
    name: "",
    unit: "",
    stock: 0,
    stock_min: 0,
    description: "",
};

interface UseInventoryFormProps {
    initialValues?: any | null;
    mode?: "create" | "edit";
    onSuccess?: () => void;
}

export const useInventoryForm = ({ 
    initialValues = null, 
    mode = "create",
    onSuccess 
}: UseInventoryFormProps) => {
    const values = useMemo(() => 
        initialValues ? { ...initialValues } : { ...defaultValues }, 
        [initialValues]
    );

    const form = useForm<InventorySchemaType>({
        resolver: zodResolver(InventorySchema),
        defaultValues: values,
    });

    const { mutateAsync: createInventory, isPending: isCreating } = useMutation({
        mutationKey: ["inventory", "create"],
        mutationFn: postProductInventory,
    });

    const { mutateAsync: updateInventory, isPending: isUpdating } = useMutation({
        mutationKey: ["inventory", "update"],
        mutationFn: putProductInventory,
    });

    const isLoading = isCreating || isUpdating;

    const onSubmit = useCallback(async (data: InventorySchemaType) => {
        try {
            const save = await (mode === "create" ? createInventory(data as ProductInventory) : updateInventory(data as ProductInventory));
            toast.success("Berhasil", {
                description: save?.message ?? "Berhasil menyimpan data",
            });
            onSuccess?.();
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menyimpan data",
            });
        }
    }, [mode, createInventory, updateInventory, onSuccess]);

    const handleReset = useCallback(() => {
        form.reset();
    }, [form]);

    return {
        form,
        isLoading,
        isCreating,
        isUpdating,
        onSubmit,
        handleReset,
        InventorySchema,
    };
};