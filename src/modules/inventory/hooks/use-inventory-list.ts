import type { ProductInventoryResponse } from "src/infrastructure/type";

import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useBoolean } from "minimal-shared/hooks";
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect, useCallback } from "react";

import { getWorkspace } from "src/modules/auth/context/jwt";
import { getListProductInventory } from "src/infrastructure/api";

export const useInventoryList = () => {
    const form = useForm();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [selected, setSelected] = useState<ProductInventoryResponse | null>(null);
    const [outletId, setOutletId] = useState(0);
    
    const openForm = useBoolean(false);
    const openFormDelete = useBoolean(false);
    const openFormStock = useBoolean(false);

    useEffect(() => {
        const workspace = getWorkspace();
        if (workspace) {
            setOutletId(workspace.id);
        }
    }, []);

    const debounce = useDebouncedCallback((value: string) => {
        setKeyword(value);
    }, 500);

    const list = useQuery({
        queryKey: ["inventory", "list", page, perPage, keyword, outletId],
        queryFn: () => getListProductInventory({ page, per_page: perPage, keyword, outlet_id: outletId }),
    });

    const handleSearch = useCallback((value: string) => {
        form.setValue("search", value);
        debounce(value);
    }, [form, debounce]);

    const handlePageChange = useCallback((_: any, newPage: number) => {
        setPage(newPage + 1);
    }, []);

    const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(1);
    }, []);

    const handleCloseForm = useCallback(() => {
        setSelected(null);
        openForm.onFalse();
    }, [openForm]);

    const handleAddInventory = useCallback(() => {
        setSelected(null);
        openForm.onTrue();
    }, [openForm]);

    const handleEditInventory = useCallback((item: ProductInventoryResponse) => {
        setSelected(item);
        openForm.onTrue();
    }, [openForm]);

    const handleEditStock = useCallback((item: ProductInventoryResponse) => {
        setSelected(item);
        openFormStock.onTrue();
    }, [openFormStock]);

    const handleCloseDelete = useCallback(() => {
        setSelected(null);
        openFormDelete.onFalse();
    }, [openFormDelete]);

    const handleDeleteInventory = useCallback((item: ProductInventoryResponse) => {
        setSelected(item);
        openFormDelete.onTrue();
    }, [openFormDelete]);

    return {
        // Form state
        form,
        
        // Pagination state
        page,
        perPage,
        keyword,
        selected,
        outletId,
        
        // Boolean states
        openForm,
        openFormDelete,
        openFormStock,
        
        // Data
        list,
        
        // Actions
        handleSearch,
        handlePageChange,
        handleRowsPerPageChange,
        handleCloseForm,
        handleAddInventory,
        handleEditInventory,
        handleEditStock,
        handleCloseDelete,
        handleDeleteInventory,
    };
};