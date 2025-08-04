import type { CashOutResponse } from "src/infrastructure/type";

import { toast } from "sonner";
import { useState } from "react";
import { useBoolean } from "minimal-shared/hooks";
import { useMutation } from "@tanstack/react-query";

import { deleteCashOut } from "src/infrastructure/api";

export const useCashOutDelete = () => {
    const [selected, setSelected] = useState<CashOutResponse | null>(null);
    const openFormDelete = useBoolean(false);

    const { mutateAsync: deleteData, isPending: isDeleting } = useMutation({
        mutationFn: deleteCashOut,
    });

    const handleCloseDelete = () => {
        setSelected(null);
        openFormDelete.onFalse();
    };

    const handleDeleteCashOut = (item: CashOutResponse) => {
        setSelected(item);
        openFormDelete.onTrue();
    };

    const handleActionDelete = async ({ id, reason }: any, onSuccess?: () => void) => {
        try {
            if (selected) {
                const del = await deleteData({ id, reason });

                toast.success("Berhasil", {
                    description: del?.message ?? "Berhasil menghapus data",
                });

                if (onSuccess) {
                    onSuccess();
                }
                handleCloseDelete();
            }
        } catch (error) {
            toast.error("Gagal", {
                description: (error as any)?.response?.data?.errors?.[0] ?? "Gagal menghapus data",
            });
        }
    };

    return {
        // State
        selected,
        
        // Boolean states
        openFormDelete,
        
        // Loading states
        isDeleting,
        
        // Actions
        handleCloseDelete,
        handleDeleteCashOut,
        handleActionDelete,
    };
};