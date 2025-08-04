import { Grid2, Skeleton } from "@mui/material";

export const LoadingList = () => (
    <Grid2 container spacing={2} sx={{width: '100%'}}>
        {
            [1, 2, 3, 4, 5].map((item) => (
                <Grid2 size={12} key={item}>
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={60}
                        sx={{
                            borderRadius: 1,
                        }}
                    />
                </Grid2>
            ))
        }
    </Grid2>
)