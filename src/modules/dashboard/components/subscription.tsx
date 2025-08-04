import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Card, Grid2, Button, Skeleton, CardHeader, Typography, CardContent } from "@mui/material";

import { paths } from "src/routes/paths";

import { fDate, fCurrency } from "src/utils";
import { getClientStatus } from "src/infrastructure/api";

export const Subscription = () => {
    const router = useRouter();
    
    const clientStatus = useQuery({
        queryKey: ["dashboard", "client-status"],
        queryFn: () => getClientStatus(),
        refetchOnWindowFocus: true,
    });

    const handleTopUpClick = () => {
        router.push(paths.topup.root);
    };

    return (
        <Card>
            <CardHeader title="Saldo Anda" />
            <CardContent>
                <Typography variant="h5" fontWeight={700} mb={2}>
                    {clientStatus?.isLoading ? <Skeleton width={100} /> : fCurrency(clientStatus?.data?.data?.client_balance ?? 0)}
                </Typography>

                <Grid2 container spacing={1}>
                    <Grid2 size={6}>
                        <Typography variant="body2" color="text.secondary">
                            Paket Terdaftar
                        </Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="body2" fontWeight={700} textAlign="right">
                            {clientStatus?.isLoading ? <Skeleton width={100} /> : clientStatus?.data?.data?.subscription_package_name ?? '-'}
                        </Typography>
                    </Grid2>

                    <Grid2 size={6}>
                        <Typography variant="body2" color="text.secondary">
                            Tanggal Expired
                        </Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="body2" fontWeight={700} textAlign="right">
                            {clientStatus?.isLoading ? <Skeleton width={100} /> : clientStatus?.data?.data?.subscription_expired_at ? fDate(clientStatus?.data?.data?.subscription_expired_at) : '-'}
                        </Typography>
                    </Grid2>

                    <Grid2 size={6}>
                        <Typography variant="body2" color="text.secondary">
                            Total Cabang
                        </Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="body2" fontWeight={700} textAlign="right">
                            {clientStatus?.isLoading ? <Skeleton width={100} /> : clientStatus?.data?.data?.total_outlets ?? '-'}
                        </Typography>
                    </Grid2>
                </Grid2>

                <Grid2 container spacing={2} mt={3}>
                    <Grid2 size={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="warning"
                        >
                            Beli Paket
                        </Button>
                    </Grid2>
                    <Grid2 size={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            onClick={handleTopUpClick}
                        >
                            Top Up
                        </Button>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );
};
