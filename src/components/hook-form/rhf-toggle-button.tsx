
import { Controller, useFormContext } from 'react-hook-form';

import { ToggleButtonGroup } from '@mui/material';


// ----------------------------------------------------------------------

export type RHFToggleButtonProps = {
    name: string;
    onChange?: (event: React.MouseEvent<HTMLElement>, newValue: string) => void;
    children: React.ReactNode;
} & React.ComponentProps<typeof ToggleButtonGroup>;

export function RHFToggleButton({
    name,
    children,
    onChange,
    ...other
}: RHFToggleButtonProps) {
    const form = useFormContext();

    const handleOnChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
        form.setValue(name, newValue);
        onChange?.(event, newValue);
    };

    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState: { error } }) => (
                <ToggleButtonGroup value={form.watch(name)} exclusive onChange={handleOnChange} fullWidth {...other}>
                    {children}
                </ToggleButtonGroup>
            )}
        />
    );
}
