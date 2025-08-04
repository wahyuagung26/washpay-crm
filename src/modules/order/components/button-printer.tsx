import { toast } from "sonner";
import { useState, useEffect } from "react";

import { Button } from "@mui/material";

import { Iconify } from "src/components/iconify";

export const ButtonPrinter = () => {
    const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);

    useEffect(() => {
        const result = window?.getSelectedPrinter?.();
        if (result?.printer?.name) {
            setSelectedPrinter(result?.printer?.name || null);
        }
    }, [])

    const handleChoosePrinter = () => {
        try {
            window?.showPrinterSelectionDialog?.();
            if (!window?.showPrinterSelectionDialog?.()) {
                toast.error('Gagal menampilkan daftar printer. Pastikan anda mengakses menggunakan Aplikasi Android.');
            }
        } catch (_) {
            toast.error('Gagal menampilkan daftar printer. Pastikan anda mengakses menggunakan Aplikasi Android.');
        } finally {
            // setLoading(false);
        }
    }

    return (
        <Button onClick={handleChoosePrinter} fullWidth variant="outlined" color="primary" startIcon={<Iconify icon="mdi:printer" />}>
            {selectedPrinter ? `Printer: ${selectedPrinter}` : "Pilih Printer"}
        </Button>
    )
}