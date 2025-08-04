import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { deleteCustomer } from 'src/infrastructure/api';

interface UseCustomerDeleteOptions {
    onSuccess?: () => void;
}

export const useCustomerDelete = ({ onSuccess }: UseCustomerDeleteOptions = {}) => {
    const { mutateAsync: deleteData, isPending: isDeleting } = useMutation({
        mutationFn: deleteCustomer,
    });

    const handleDelete = async ({ id, reason }: { id: number; reason?: string }) => {
        try {
            const del = await deleteData({ id, reason: reason as string });

            toast.success('Berhasil', {
                description: del?.message ?? 'Berhasil menghapus data',
            });

            onSuccess?.();
        } catch (error) {
            toast.error('Gagal', {
                description:
                    (error as any)?.response?.data?.errors?.[0] ??
                    'Gagal menghapus data',
            });
        }
    };

    return {
        handleDelete,
        isDeleting,
    };
};