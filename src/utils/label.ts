import { constant } from "../modules/order/constant";

export function labelStatus(status: string): string {
    switch (status) {
        case constant.STATUS_ORDER_FINISHED:
            return 'Selesai';
        case constant.STATUS_ORDER_PROCESSED:
            return 'Diproses';
        case constant.STATUS_ORDER_COMPLETED:
            return 'Selesai';
        default:
            return 'Unknown';
    }
}

export function labelPaymentType(status: string): string {
    switch (status) {
        case "cash":
            return 'Lunas';
        case "debt":
            return 'Bayar Nanti';
        default:
            return 'Unknown';
    }
}