import type { ProductInventoryResponse } from "src/infrastructure/type";

import { memo } from 'react';

import { Card, Grid2, Stack, Typography, CardContent } from "@mui/material";

import { fNumber } from "src/utils";
import { checkAccess } from "src/modules/auth/context/jwt";

import { Iconify } from "src/components/iconify";
import { BasicMenu } from "src/components/custom-menu";

interface InventoryItemProps {
    item: ProductInventoryResponse;
    onEdit: (item: ProductInventoryResponse) => void;
    onEditStock: (item: ProductInventoryResponse) => void;
    onDelete: (item: ProductInventoryResponse) => void;
}

export const InventoryItem = memo(({ 
    item, 
    onEdit, 
    onEditStock, 
    onDelete 
}: InventoryItemProps) => (
        <Grid2 size={12}>
            <Card>
                <CardContent>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 10, sm: 11 }}>
                            <Stack direction="column" gap={1}>
                                <Typography variant="h6">{item.name}</Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Iconify icon="solar:box-bold-duotone" width={16} height={16} />
                                    <Typography variant="body1" color="text.secondary">
                                        Stok : {fNumber(item.stock)} {item.unit}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Iconify icon="solar:box-bold-duotone" width={16} height={16} />
                                    <Typography variant="body1" color="text.secondary">
                                        Min Stok : {fNumber(item.stock_min)} {item.unit}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid2>
                        {checkAccess('inventory') && (
                            <Grid2 size={{ xs: 2, sm: 1 }} display="flex" alignItems="center" justifyContent="center">
                                <BasicMenu
                                    items={[
                                        {
                                            id: 1,
                                            name: "Edit",
                                            icon: "eva:edit-fill",
                                            onClick: () => onEdit(item),
                                        },
                                        {
                                            id: 2,
                                            name: "Mutasi Stok",
                                            icon: "solar:card-transfer-bold-duotone",
                                            onClick: () => onEditStock(item),
                                        },
                                        {
                                            id: 3,
                                            name: "Delete",
                                            icon: "eva:trash-2-outline",
                                            onClick: () => onDelete(item),
                                            color: "error.main",
                                        },
                                    ]}
                                    label="Action"
                                    id={item.id}
                                />
                            </Grid2>
                        )}
                    </Grid2>
                </CardContent>
            </Card>
        </Grid2>
    ));

InventoryItem.displayName = 'InventoryItem';