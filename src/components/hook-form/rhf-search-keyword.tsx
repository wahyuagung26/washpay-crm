import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';
import { transformValue, transformValueOnBlur, transformValueOnChange } from 'minimal-shared/utils';

import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

export type RHFTextFieldProps = TextFieldProps & {
    name: string;
};

export function RHFSearchKeyword({
    name,
    helperText,
    slotProps,
    type = 'text',
    placeholder = "Search...",
    ...other
}: RHFTextFieldProps) {
    const { control } = useFormContext();

    const isNumberType = type === 'number';

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    fullWidth
                    value={isNumberType ? transformValue(field.value) : field.value}
                    onChange={(event) => {
                        const transformedValue = isNumberType
                            ? transformValueOnChange(event.target.value)
                            : event.target.value;

                        field.onChange(transformedValue);
                    }}
                    onBlur={(event) => {
                        const transformedValue = isNumberType
                            ? transformValueOnBlur(event.target.value)
                            : event.target.value;

                        field.onChange(transformedValue);
                    }}
                    type={isNumberType ? 'text' : type}
                    error={!!error}
                    helperText={error?.message ?? helperText}
                    slotProps={{
                        ...slotProps,
                        input: { startAdornment: <InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment> },
                        htmlInput: {
                            autoComplete: 'off',
                            ...slotProps?.htmlInput,
                            ...{ inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' },
                        },
                    }}
                    placeholder={placeholder}
                    {...other}
                />
            )}
        />
    );
}
