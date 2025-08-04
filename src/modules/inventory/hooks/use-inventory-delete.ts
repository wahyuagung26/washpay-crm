import { toast } from 'sonner';
import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

import { deleteProductInventory } from 'src/infrastructure/api';

interface UseInventoryDeleteProps {
    onSuccess?: () => void;
}

export const useInventoryDelete = ({ onSuccess }: UseInventoryDeleteProps = {}) => {
    const { mutateAsync: deleteData, isPending: isDeleting } = useMutation({
        mutationFn: deleteProductInventory,
    });

    const handleDelete = useCallback(async ({ id, reason }: { id: number; reason?: string }) => {
        try {
            const result = await deleteData({ id, reason: (reason ?? '') as string });

            toast.success("Berhasil", {
                description: result?.message ?? "Berhasil menghapus data",
            });

            onSuccess?.();
            return result;
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menghapus data",
            });
            throw error;
        }
    }, [deleteData, onSuccess]);

    return {
        handleDelete,
        isDeleting,
    };
};