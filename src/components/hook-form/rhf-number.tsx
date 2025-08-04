import type { TextFieldProps } from '@mui/material/TextField';

import React, { memo, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import { Controller, useFormContext } from 'react-hook-form';

import { TextField, Typography, InputAdornment } from '@mui/material';

type Props = TextFieldProps & {
    startAdornment?: string | React.ReactNode | undefined;
    name: string;
    label?: string;
    required?: boolean;
    caption?: string;
    direction?: 'row' | 'column';
    rules?: Parameters<typeof Controller>[0]['rules']; // Ensuring type safety
    gap?: string | number;
    containerStyle?: Record<string, any>;
};

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

export const FieldNumber = React.forwardRef<HTMLInputElement, CustomProps>(

    function FieldNumber(props, ref) {
        const { onChange, ...other } = props;
        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values: any) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator="."
                decimalSeparator=","
                valueIsNumericString
            />
        );
    }
);

export const RHFNumberField = memo(
    ({
        name,
        helperText,
        label,
        required,
        caption,
        direction = 'column',
        rules,
        gap = 2,
        inputProps,
        containerStyle,
        startAdornment = undefined,
        ...other
    }: Props) => {
        const { control, watch } = useFormContext();

        const handleChange = useCallback(
            (
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                fieldOnChange: (value: any, options: any) => void
            ) => {
                const { value } = event.target;
                fieldOnChange(value ? Number(value) : 0, { shouldValidate: true });
            },
            []
        );

        return (
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        fullWidth
                        value={`${watch(name) === 0 ? '' : watch(name)}`}
                        type="text"
                        onChange={(event) => handleChange(event, field.onChange)}
                        error={!!error}
                        label={label}
                        helperText={
                            error?.message ? (
                                <Typography
                                    variant="caption"
                                    sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                >
                                    {error.message}
                                </Typography>
                            ) : (
                                helperText
                            )
                        }
                        {...other}
                        slotProps={{
                            input: {
                                ...other?.slotProps?.input,
                                startAdornment:
                                    typeof startAdornment === 'string' ? (
                                        <InputAdornment position="start">
                                            <Typography variant="body2" color="text.secondary">
                                                {startAdornment}
                                            </Typography>
                                        </InputAdornment>
                                    ) : (
                                        startAdornment
                                    ),
                                inputComponent: FieldNumber as any,
                            },
                            inputLabel: {
                                shrink: true,
                            }
                        }}
                    />
                )}
            />
        );
    }
);
