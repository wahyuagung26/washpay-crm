import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import { Typography, InputAdornment } from '@mui/material';

// ----------------------------------------------------------------------

export type RHFTextPhoneProps = TextFieldProps & {
    name: string;
};

export function RHFTextPhone({
    name,
    helperText,
    slotProps,
    ...other
}: RHFTextPhoneProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    fullWidth
                    value={(field?.value ?? '').replace(/^\+62/, '')}
                    onChange={(event) => {
                        const rawValue = event.target.value;
                        // Save value with +62 prefix
                        field.onChange(`+62${rawValue.replace(/^\+62/, '')}`);
                    }}
                    onBlur={(event) => {
                        const rawValue = event.target.value;
                        // Save value with +62 prefix
                        field.onChange(`+62${rawValue.replace(/^\+62/, '')}`);
                    }}
                    type="text"
                    error={!!error}
                    helperText={error?.message ?? helperText}
                    slotProps={{
                        ...slotProps,
                        input: { startAdornment: <InputAdornment position="start"><Typography variant="body2">+62</Typography></InputAdornment> },
                        htmlInput: {
                            autoComplete: 'off',
                            ...slotProps?.htmlInput,
                            ...{ inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' },
                        },
                    }}
                    {...other}
                />
            )}
        />
    );
}
