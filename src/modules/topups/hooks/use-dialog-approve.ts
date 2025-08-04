import type { TopUpResponse } from "src/infrastructure/type";

import { z as zod } from 'zod';
import { toast } from "sonner";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { putApprovalTopUp } from "src/infrastructure/api";

export const ApproveTopUpSchema = zod.object({
    id: zod.number().optional(),
    status: zod.number().min(1, { message: 'Status wajib diisi!' }),
    status_notes: zod.string().min(1, { message: 'Catatan wajib diisi!' }),
    approved_amount: zod.number().min(1, { message: 'Jumlah yang disetujui wajib diisi!' }),
    net_amount: zod.number().min(1, { message: 'Jumlah bersih wajib diisi!' }),
});

export type ApproveTopUpSchemaType = zod.infer<typeof ApproveTopUpSchema>;

const defaultValues: ApproveTopUpSchemaType = {
    id: undefined,
    status: 1,
    status_notes: '',
    approved_amount: 0,
    net_amount: 0,
};

interface UseDialogApproveOptions {
    initialValues?: TopUpResponse;
    onSuccess?: () => void;
}

export const useDialogApprove = ({ initialValues, onSuccess }: UseDialogApproveOptions) => {
    const values = useMemo(
        () => (initialValues ? { ...initialValues, approved_amount: initialValues.net_amount } : { ...defaultValues }),
        [initialValues]
    );

    const form = useForm({
        resolver: zodResolver(ApproveTopUpSchema),
        defaultValues: values || null,
    });

    const { mutateAsync: approveTopUp, isPending: isSubmitting } = useMutation({
        mutationKey: ['topup', 'approvel'],
        mutationFn: putApprovalTopUp,
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data: any) => {
        try {
            const save = await approveTopUp(data);

            toast.success('Berhasil', {
                description: save?.message ?? 'Berhasil menyimpan data',
            });

            onSuccess?.();
        } catch (error) {
            toast.error('Gagal', {
                description:
                    (error as any)?.response?.data?.errors?.[0] ??
                    'Gagal menyimpan data',
            });
        }
    };

    return {
        form,
        handleSubmit: handleSubmit(onSubmit),
        handleReset: reset,
        isLoading: isSubmitting,
    };
}