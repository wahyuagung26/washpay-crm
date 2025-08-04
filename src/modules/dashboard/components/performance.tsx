import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { Box, Card, CardHeader, CardContent, ToggleButton } from "@mui/material";

import { getOutletPerformance } from "src/infrastructure/api";

import { Form, Field } from "src/components/hook-form";
import { LoadingList } from "src/components/loading-screen";

const ChartLine = dynamic(() => import("src/components/chart").then(mod => mod.ChartLine), {
  loading: () => <LoadingList />,
  ssr: false,
});

export const Performance = () => {
    const method = useForm({
        defaultValues: {
            type: "transaction", // Default type can be set to 'transaction' or 'revenue'
        }
    });

    const performance = useQuery({
        queryKey: ["dashboard", "performance", method.watch("type")],
        queryFn: () => getOutletPerformance((method.watch("type") ?? "transaction") as any),
        refetchOnWindowFocus: true,
    });

    return (
        <Form methods={method}>
            <Card>
                <CardHeader
                    title="Kinerja Cabang"
                    action={<Box sx={{ mt : { xs: 1, sm: 0 } }}>
                        <Field.ToggleButton name="type" sx={{background: '#f2f4f5'}}>
                        <ToggleButton color="primary" size="small" value="transaction">
                            Total order
                        </ToggleButton>
                        <ToggleButton color="primary" size="small" value="revenue">
                            Omset
                        </ToggleButton>
                    </Field.ToggleButton>
                    </Box>}
                    sx={{
                        '& .MuiCardHeader-action': {
                            width: {
                                xs: '100%',
                                sm: '200px'
                            }
                        },
                        display: 'flex !important',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row'
                        },
                        alignItems: {
                            xs: 'flex-start',
                            sm: 'center !important'
                        },
                    }}
                />
                <CardContent>
                    {
                        performance.isLoading ? <LoadingList /> : (
                            <ChartLine
                                chart={{
                                    categories: performance.data?.data?.periods ?? [],
                                    series: performance.data?.data?.data ?? [],
                                }}
                            />
                        )
                    }
                </CardContent>
            </Card>
        </Form>
    )
}