import { Typography } from "@mui/material";

interface StatusPaymentProps {
    isPaymentComplete: boolean;
    paymentMethodName: string | null;
}

export const StatusPayment = ({ isPaymentComplete, paymentMethodName }: StatusPaymentProps) => {
    if (isPaymentComplete) {
        return (
            <Typography variant="body1" color="success" fontWeight={600}>
                Lunas - {paymentMethodName}
            </Typography>
        );
    }

    return (
        <Typography variant="body1" color="error" fontWeight={600}>
            Belum Lunas
        </Typography>
    );
}