import type { ProductInventoryResponse } from "src/infrastructure/type";

import { memo } from 'react';

import { Grid2, TablePagination } from "@mui/material";

import { EmptyContent } from "src/components/empty-content";

import { InventoryItem } from "./inventory-item";

interface InventoryListProps {
    data: ProductInventoryResponse[];
    total: number;
    page: number;
    perPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEdit: (item: ProductInventoryResponse) => void;
    onEditStock: (item: ProductInventoryResponse) => void;
    onDelete: (item: ProductInventoryResponse) => void;
}

export const InventoryList = memo(({
    data,
    total,
    page,
    perPage,
    onPageChange,
    onRowsPerPageChange,
    onEdit,
    onEditStock,
    onDelete,
}: InventoryListProps) => {
    if (data.length === 0) {
        return <EmptyContent />;
    }

    return (
        <>
            {data.map((item) => (
                <InventoryItem
                    key={`inventory-${item.id}`}
                    item={item}
                    onEdit={onEdit}
                    onEditStock={onEditStock}
                    onDelete={onDelete}
                />
            ))}
            <Grid2 size={12}>
                <TablePagination
                    component="div"
                    count={total}
                    page={page - 1}
                    onPageChange={onPageChange}
                    rowsPerPage={perPage}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            </Grid2>
        </>
    );
});

InventoryList.displayName = 'InventoryList';