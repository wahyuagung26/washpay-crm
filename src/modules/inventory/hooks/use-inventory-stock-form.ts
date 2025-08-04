import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import { patchUpdateStockRequest } from 'src/infrastructure/api';

type InventoryStockSchemaType = zod.infer<typeof InventoryStockSchema>;

const TypeSchema = zod.object({
    id: zod.string({required_error: "Tipe stok wajib diisi!"}).min(1, { message: "Tipe stok wajib diisi!" }),
    name: zod.string(),
});

const InventoryStockSchema = zod.object({
    id: zod.number().optional(),
    is_with_cashout: zod.boolean().optional(),
    type: TypeSchema.nullable(),
    stock: zod.number().optional(),
    qty: zod.number({required_error: "Jumlah stok wajib diisi!"}),
    real_stock: zod.number().optional(),
    note: zod.string({required_error: "Catatan wajib diisi!"}).min(1, { message: "Catatan wajib diisi!" }),
    cashout_amount: zod.number().optional(),
}).superRefine((data, ctx) => {
    if (data.type === null || data.type?.id === "") {
        ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: "Tipe stok wajib diisi!",
            path: ["type"],
        });
    }

    if (data.is_with_cashout && !data.cashout_amount) {
        ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: "Jumlah pengeluaran wajib diisi jika mencatat sebagai pengeluaran.",
            path: ["cashout_amount"],
        });
    }

    if (data.type?.id === "opname" && !data.real_stock) {
        ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: "Stok real wajib diisi jika tipe stok adalah opname.",
            path: ["real_stock"],
        });
    }
});

const defaultValues: InventoryStockSchemaType = {
    id: undefined,
    is_with_cashout: false,
    type: {
        id: "",
        name: "",
    },
    stock: 0,
    qty: 0,
    real_stock: 0,
    note: "",
    cashout_amount: 0,
};

const optionsType = [
    { id: "in", name: "Stok Masuk" },
    { id: "out", name: "Stok Keluar" },
    { id: "opname", name: "Stok Opname" },
];

interface UseInventoryStockFormProps {
    initialValues?: any | null;
    onSuccess?: () => void;
}

export const useInventoryStockForm = ({ 
    initialValues = null, 
    onSuccess 
}: UseInventoryStockFormProps) => {
    const values = useMemo(() => 
        initialValues ? { ...initialValues } : { ...defaultValues }, 
        [initialValues]
    );

    const form = useForm<InventoryStockSchemaType>({
        resolver: zodResolver(InventoryStockSchema),
        defaultValues: values,
        mode: "all",
        reValidateMode: "onChange",
        shouldUnregister: true,
        criteriaMode: "all",
    });

    const { mutateAsync: updateStock, isPending: isLoading } = useMutation({
        mutationKey: ["inventory", "update-stock"],
        mutationFn: patchUpdateStockRequest,
    });

    const onSubmit = useCallback(async (data: InventoryStockSchemaType) => {
        try {
            const type = data.type?.id === "opname" && data.qty < 0 ? "out" : "in";
            const payload = {
                id: values.id,
                is_with_cashout: data.is_with_cashout,
                type,
                qty: Math.abs(data.qty),
                note: data.note,
                cashout_amount: data.cashout_amount,
            };

            const save = await updateStock(payload);
            toast.success("Berhasil", {
                description: save?.message ?? "Berhasil menyimpan data",
            });
            onSuccess?.();
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menyimpan data",
            });
        }
    }, [updateStock, values.id, onSuccess]);

    const handleReset = useCallback(() => {
        form.reset();
    }, [form]);

    const handleTypeChange = useCallback((value: any) => {
        form.setValue("type", value, {shouldValidate: true});
        form.resetField("qty");
        form.resetField("real_stock");
    }, [form]);

    const typeId = form.watch("type")?.id;
    const stockValue = form.watch("stock");
    const qtyValue = form.watch("qty");
    const realStockValue = form.watch("real_stock");

    useEffect(() => {
        if (typeId !== "opname") {
            const stock = stockValue ?? 0;
            const qty = qtyValue ?? 0;
            const real = + (typeId === "in" ? stock + qty : stock - qty);

            form.setValue("real_stock", real);
        }
    }, [qtyValue, typeId, stockValue, form]);

    useEffect(() => {
        if (typeId === "opname") {
            const stock = stockValue ?? 0;
            const real = realStockValue ?? 0;
            const qty = real - stock;
            
            form.setValue("qty", qty);
        }
    }, [realStockValue, typeId, stockValue, form]);

    return {
        form,
        isLoading,
        onSubmit,
        handleReset,
        handleTypeChange,
        optionsType,
        InventoryStockSchema,
    };
};