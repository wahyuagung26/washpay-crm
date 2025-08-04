import type { CardProps } from '@mui/material';

import { Box, Card, Stack, Skeleton } from '@mui/material';

import { fNumber, fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

type Props = CardProps & {
    title: string;
    totalAmount: number;
    totalOrder: number;
    isLoading?: boolean;
};

export const Revenue = ({ title, totalAmount, totalOrder, isLoading, sx, ...other }: Props) => {

    const renderTotalOrder = () => (
        <Box
            sx={{
                typography: 'subtitle1',
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {
                isLoading ? (
                    <Skeleton
                        variant="text"
                        width={100}
                        sx={{ typography: 'subtitle1', color: 'text.secondary' }}
                    />
                ) : (
                    <Label
                        variant="soft"
                        color="info"
                        startIcon={<Iconify icon="mynaui:cart-solid" />}
                    >
                        {fNumber(totalOrder)} Pesanan
                    </Label>
                )
            }
        </Box>
    );

    const renderRevenue = () => (
        <Box sx={{ typography: 'h4' }}>
            {isLoading ? (
                <Skeleton variant="text" width={100} sx={{ typography: 'h4' }} />
            ) : (
                fCurrency(totalAmount)
            )}
        </Box>
    );

    return (
        <Card
            sx={[
                () => ({
                    p: 3,
                    display: 'flex',
                    zIndex: 'unset',
                    overflow: 'unset',
                    alignItems: 'center',
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            <Stack direction="column" gap={1} sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ typography: 'subtitle1' }}>{title}</Box>
                    </Stack>
                </Stack>

                {renderRevenue()}

                {renderTotalOrder()}
            </Stack>
        </Card>
    );
}
