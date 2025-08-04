import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useForm } from "react-hook-form";
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';

import { putCashOut, postCashOut, getListCategory } from 'src/infrastructure/api';

type CustomerSchemaType = zod.infer<typeof CustomerSchema>;

const CustomerSchema = zod.object({
    id: zod.number().optional(),
    category: zod.object({
        id: zod.number().min(1, { message: "Kategori pengeluaran wajib diisi!" }),
        name: zod.string().optional(),
    }),
    description: zod.string().min(1, { message: "Catatan wajib diisi!" }),
    amount: zod.number().min(1, { message: "Nominal wajib diisi!" }),
});

const defaultValues: CustomerSchemaType = {
    id: undefined,
    category: {
        id: 0,
        name: "",
    },
    description: "",
    amount: 0,
};

interface UseCashOutFormProps {
    initialValues?: any | null;
    mode?: "create" | "edit";
    onSuccess?: () => void;
}

export const useCashOutForm = ({
    initialValues = null,
    mode = "create",
    onSuccess = () => { },
}: UseCashOutFormProps) => {
    const values = useMemo(() => initialValues ? { ...initialValues } : { ...defaultValues }, [initialValues]);

    const form = useForm<CustomerSchemaType>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: values,
    });

    const categoryOpen = useBoolean(false);
    
    const category = useQuery({
        queryKey: ["cash-out", "category"],
        queryFn: () => getListCategory({ type: "cashout" }),
        enabled: categoryOpen.value,
    });

    const { mutateAsync: createCashOut, isPending: isCreating } = useMutation({
        mutationKey: ["cash-out", "create"],
        mutationFn: postCashOut,
    });

    const { mutateAsync: updateCashOut, isPending: isUpdating } = useMutation({
        mutationKey: ["cash-out", "update"],
        mutationFn: putCashOut,
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data: any) => {
        try {
            if (data.category) {
                data.category_id = data.category.id;
                delete data.category;
            }

            const save = await (mode === "create" ? createCashOut(data) : updateCashOut(data));
            toast.success("Berhasil", {
                description: save?.message ?? "Berhasil menyimpan data",
            });
            onSuccess();
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menyimpan data",
            });
        }
    };

    const handleReset = () => {
        reset();
    };

    return {
        // Form
        form,
        
        // Data
        category,
        categoryOpen,
        
        // Loading states
        isCreating,
        isUpdating,
        isLoading: isCreating || isUpdating,
        
        // Actions
        handleSubmit,
        onSubmit,
        handleReset,
        
        // Schema
        CustomerSchema,
    };
};