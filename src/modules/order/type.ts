export interface SelectedProduct {
    id: number;
    name: string;
    price: number;
    qty: number;
    category: {
        id: number;
        name: string;
    }
}

export interface SelectedInventory {
    product_id: number;
    name: string;
    price: number;
    qty: number;
}