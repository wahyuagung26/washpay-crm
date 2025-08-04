import type { TextFieldProps } from '@mui/material/TextField';

import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { fDateRangeShortLabel } from 'src/utils';

import { Iconify } from '../iconify';
import { useDateRangePicker, CustomDateRangePicker } from '../custom-date-range-picker';

// ----------------------------------------------------------------------

export type RHFTextFieldProps = TextFieldProps & {
    name: string;
    onChangeDate?: (startDate: Date | null, endDate: Date | null) => void;
};

export function RHFDaterangepicker({
    name,
    helperText,
    slotProps,
    onChangeDate,
    ...other
}: RHFTextFieldProps) {
    const form = useFormContext();

    const rangeCalendarPicker = useDateRangePicker(dayjs(new Date()), null);

    const handleSubmit = () => {
        onChangeDate?.(
            rangeCalendarPicker.startDate?.toDate() ?? null,
            rangeCalendarPicker.endDate?.toDate() ?? null
        );
        
        form.setValue(name, fDateRangeShortLabel(rangeCalendarPicker.startDate, rangeCalendarPicker.endDate));
    }

    const renderDateRangePicker = () => (
        <CustomDateRangePicker
            variant="calendar"
            open={rangeCalendarPicker.open}
            startDate={rangeCalendarPicker.startDate}
            endDate={rangeCalendarPicker.endDate}
            onChangeStartDate={rangeCalendarPicker.onChangeStartDate}
            onChangeEndDate={rangeCalendarPicker.onChangeEndDate}
            onClose={rangeCalendarPicker.onClose}
            error={rangeCalendarPicker.error}
            onSubmit={handleSubmit}
        />
    )

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={name}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        fullWidth
                        value={field.value ?? ''}
                        onChange={(event) => {
                            field.onChange(event.target.value);
                        }}
                        onBlur={(event) => {
                            field.onChange(event.target.value);
                        }}
                        onClick={rangeCalendarPicker.onOpen}
                        type="text"
                        error={!!error}
                        helperText={error?.message ?? helperText}
                        slotProps={{
                            ...slotProps,
                            htmlInput: {
                                readOnly: true,
                                autoComplete: 'off',
                                ...slotProps?.htmlInput,
                            },
                            input: { endAdornment: <InputAdornment position="end"><Iconify icon="solar:calendar-bold-duotone" /></InputAdornment> },
                            inputLabel: {
                                shrink: true,
                            }
                        }}
                        {...other}
                    />
                )}
            />
            {renderDateRangePicker()}
        </LocalizationProvider>
    );
}
