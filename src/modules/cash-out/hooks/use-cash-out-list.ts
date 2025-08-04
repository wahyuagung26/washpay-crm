import type { CashOutResponse } from "src/infrastructure/type";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from 'use-debounce';
import { useTabs, useBoolean } from "minimal-shared/hooks";

import { getWorkspace } from "src/modules/auth/context/jwt";
import { getListCashOut, getListCategory } from "src/infrastructure/api";

export const useCashOutList = () => {
    const defaultTab = "0";
    
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [selected, setSelected] = useState<CashOutResponse | null>(null);
    const [outletId, setOutletId] = useState(0);
    const [categoryId, setCategoryId] = useState(defaultTab);
    
    const openForm = useBoolean(false);
    const tab = useTabs(categoryId);

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
        queryKey: ["cash-out", "list", page, perPage, keyword, categoryId, outletId],
        queryFn: () => getListCashOut({ page, per_page: perPage, keyword, category_id: parseInt(categoryId), outlet_id: outletId }),
        enabled: tab.value !== "0",
    });

    const categories = useQuery({
        queryKey: ["category", "cash-out", "list"],
        queryFn: () => getListCategory({ type: "cashout" }),
    });

    useEffect(() => {
        if (categories.data?.data?.length) {
            setCategoryId(String(categories.data?.data[0]?.id));
            tab.setValue(String(categories.data?.data[0]?.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories.data]);

    const handleCloseForm = () => {
        setSelected(null);
        openForm.onFalse();
    };

    const handleAddCashOut = () => {
        setSelected(null);
        openForm.onTrue();
    };

    const handleEditCashOut = (item: CashOutResponse) => {
        setSelected(item);
        openForm.onTrue();
    };

    const handleTabChange = (e: any, value: string) => {
        tab.onChange(e, value);
        setCategoryId(value);
        setPage(1);
    };

    const handlePageChange = (_: any, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    return {
        // State
        page,
        perPage,
        keyword,
        selected,
        categoryId,
        
        // Boolean states
        openForm,
        
        // Tab management
        tab,
        
        // Data
        list,
        categories,
        
        // Actions
        debounce,
        handleCloseForm,
        handleAddCashOut,
        handleEditCashOut,
        handleTabChange,
        handlePageChange,
        handleRowsPerPageChange,
    };
};