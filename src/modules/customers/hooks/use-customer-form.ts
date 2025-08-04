import type { Customer } from 'src/infrastructure/type';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { putCustomer, postCustomer } from 'src/infrastructure/api';

export const CustomerSchema = zod.object({
    id: zod.number().optional(),
    name: zod.string().min(1, { message: 'Nama Pelanggan wajib diisi!' }),
    phone_number: zod.string().min(3, { message: 'No. telepon wajib diisi!' }),
    address: zod.string().min(1, { message: 'Alamat Pelanggan wajib diisi!' }),
});

export type CustomerSchemaType = zod.infer<typeof CustomerSchema>;

const defaultValues: CustomerSchemaType = {
    id: undefined,
    name: '',
    phone_number: '',
    address: '',
};

interface UseCustomerFormOptions {
    initialValues?: any | null;
    mode?: 'create' | 'edit';
    onSuccess?: () => void;
}

export const useCustomerForm = ({
    initialValues = null,
    mode = 'create',
    onSuccess,
}: UseCustomerFormOptions) => {
    const values = useMemo(
        () => (initialValues ? { ...initialValues } : { ...defaultValues }),
        [initialValues]
    );

    const form = useForm<CustomerSchemaType>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: values,
    });

    const { mutateAsync: createCustomer, isPending: isCreating } = useMutation({
        mutationKey: ['customer', 'create'],
        mutationFn: postCustomer,
    });

    const { mutateAsync: updateCustomer, isPending: isUpdating } = useMutation({
        mutationKey: ['customer', 'update'],
        mutationFn: putCustomer,
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data: CustomerSchemaType) => {
        try {
            const save = await (mode === 'create'
                ? createCustomer(data as Customer)
                : updateCustomer(data as Customer));
            
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

    const handleReset = () => {
        reset();
    };

    const isLoading = isCreating || isUpdating;

    return {
        form,
        handleSubmit: handleSubmit(onSubmit),
        handleReset,
        isLoading,
        mode,
    };
};