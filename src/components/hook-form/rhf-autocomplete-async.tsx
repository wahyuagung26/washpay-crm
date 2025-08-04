import type {
    AutocompleteProps
} from '@mui/material';

import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Controller, useFormContext } from 'react-hook-form';

import {
    Box,
    List,
    Dialog,
    MenuItem,
    ListItem,
    useTheme,
    TextField,
    IconButton,
    Typography,
    DialogTitle,
    Autocomplete,
    ListItemText,
    DialogContent,
    ListItemButton,
    InputAdornment,
    CircularProgress,
    ClickAwayListener
} from '@mui/material';

import { Iconify } from '../iconify';
import { StyledPopper, PopperComponent } from './custom-style';

// ----------------------------------------------------------------------
export type BaseAutoCompleteProps = Omit<
    AutocompleteProps<any, boolean, boolean, boolean>,
    'renderInput'
>;

export type RHFAutocompleteAsyncProps = BaseAutoCompleteProps & {
    name: string;
    label?: string | undefined;
    placeholder?: string;
    hiddenLabel?: boolean;
    helperText?: React.ReactNode;
    renderValue?: any;
    renderOption?: (props: any, option: any) => React.ReactNode;
    required?: boolean;
    caption?: string;
    direction?: 'row' | 'column';
    freeSolo?: boolean;
    size?: 'small' | 'medium';
    onSelect?: undefined | any;
    createable?: boolean;
    async: {
        isLoading: boolean;
        isOpen?: (isOpen: boolean) => void;
        onSearch?: (keyword: string) => void;
        placeholderSearchBox?: string;
        keyValue?: string;
        keyLabel?: string;
    };
};

export function RHFAutocompleteAsync({
    name,
    label = undefined,
    helperText,
    hiddenLabel,
    placeholder,
    required,
    caption,
    direction = 'column',
    freeSolo = false,
    size = 'medium',
    renderValue = undefined,
    renderOption = undefined,
    async = {
        isLoading: false,
        isOpen: () => { },
        onSearch: () => { },
        placeholderSearchBox: 'Cari...',
        keyValue: 'id',
        keyLabel: 'label',
    },
    ...other
}: RHFAutocompleteAsyncProps) {
    const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = true;

    const [list, setList] = useState<any[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { control, setValue, watch } = useFormContext();
    const open = Boolean(anchorEl);
    const keyValue = async.keyValue ?? 'id';
    const keyLabel = async.keyLabel ?? 'name';

    useEffect(() => {
        setList((other?.options ?? []) as any);
    }, [other?.options, setList]);

    const currentValue = watch(name) || {};

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (isMobile) {
            setDialogOpen(true);
            setSearchTerm('');
            async?.onSearch?.('');
        } else {
            async?.onSearch?.('');
            setAnchorEl(event.currentTarget);
        }
        async?.isOpen?.(true);
    };

    const handleClose = () => {
        if (isMobile) {
            setDialogOpen(false);
            setSearchTerm('');
        } else {
            if (anchorEl) {
                anchorEl.focus();
            }
            setAnchorEl(null);
        }
        async?.isOpen?.(false);
    };

    const handleSelectOption = (option: any) => {
        setValue(name, option, { shouldValidate: true });
        handleClose();
    };

    const handleClearValue = (event: React.MouseEvent) => {
        event.stopPropagation();
        setValue(name, null, { shouldValidate: true });
    };

    const debouncedFetch = useDebouncedCallback((value: string) => {
        async?.onSearch?.(value);
    }, 500);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedFetch(value);
    };

    // Desktop version with Popper
    const renderDesktopVersion = (field: any, error: any) => (
        <>
            <Autocomplete
                open={false}
                {...field}
                fullWidth
                id={`rhf-autocomplete-async-value-${name}`}
                getOptionLabel={(option: any) =>
                    typeof option === 'string' ? option : option?.[keyLabel] || ''
                }
                isOptionEqualToValue={(option: any, value) => option?.[keyValue] === value?.[keyValue]}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={currentValue?.[keyValue] ? '' : placeholder}
                        error={!!error}
                        helperText={error ? error?.message : helperText}
                        inputProps={{ ...params.inputProps, sx: { caretColor: 'white' } }}
                        InputProps={{
                            ...params.InputProps,
                            value: '',
                            startAdornment:
                                renderValue && !!currentValue?.[keyValue]
                                    ? renderValue?.(currentValue)
                                    : undefined,
                            endAdornment: currentValue?.[keyValue] && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={handleClearValue}
                                    >
                                        <Iconify icon="material-symbols:close" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            }
                        }}
                        size={size ?? 'small'}
                        onClick={(e) => {
                            if (!other?.disabled) {
                                handleClick(e);
                            }
                        }}
                        label={label}
                        onKeyDown={(e) => e.preventDefault()}
                        value={renderValue ? undefined : renderValue?.(currentValue)}
                    />
                )}
                value={renderValue ? '' : currentValue}
                {...other}
            />
            <StyledPopper
                open={open}
                anchorEl={anchorEl}
                placement="bottom-start"
                sx={{ width: anchorEl?.clientWidth }}
            >
                <ClickAwayListener onClickAway={handleClose}>
                    <Autocomplete
                        open
                        fullWidth
                        id={`rhf-autocomplete-async-${name}`}
                        onChange={(_, newValue) => setValue(name, newValue, { shouldValidate: true })}
                        isOptionEqualToValue={(option, value) => option?.[keyValue] === value?.[keyValue]}
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option?.[keyLabel] || ''
                        }
                        forcePopupIcon={false}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={async?.placeholderSearchBox ?? `Cari...`}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: <Iconify icon="material-symbols:search" />,
                                    endAdornment: (
                                        <>
                                            {async?.isLoading && <CircularProgress color="inherit" size={20} />}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                                onChange={(e) => debouncedFetch(e.target.value)}
                                size={size ?? 'small'}
                            />
                        )}
                        renderOption={(props, option) => (
                            <MenuItem {...props} key={`${props.id}-${option?.[keyLabel]}-${option?.index}`}>
                                {option?.[keyLabel] ?? option}
                            </MenuItem>
                        )}
                        PopperComponent={PopperComponent}
                        {...other}
                        options={list ?? []}
                    />
                </ClickAwayListener>
            </StyledPopper>
        </>
    );

    // Mobile version with Dialog
    const renderMobileVersion = (field: any, error: any) => (
        <>
            <TextField
                {...field}
                fullWidth
                placeholder={placeholder}
                error={!!error}
                helperText={error ? error?.message : helperText}
                onClick={(e) => {
                    if (!other?.disabled) {
                        handleClick(e);
                    }
                }}
                size={size ?? 'small'}
                label={label}
                value={currentValue?.[keyLabel] || ''}
                readOnly
                InputProps={{
                    startAdornment:
                        renderValue && !!currentValue?.[keyValue]
                            ? renderValue?.(currentValue)
                            : undefined,
                    endAdornment: (
                        <InputAdornment position="end">
                            {
                                currentValue?.[keyValue] ? (
                                    <IconButton
                                        size="small"
                                        onClick={handleClearValue}
                                    >
                                        <Iconify icon="material-symbols:close" />
                                    </IconButton>
                                ) : <Iconify icon="lsicon:down-outline" />
                            }
                        </InputAdornment>
                    ),
                }}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    }
                }}
                sx={{
                    cursor: 'pointer',
                    '& input': {
                        cursor: 'pointer',
                    }
                }}
            />

            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1
                }}>
                    <Typography variant="h6" component="span" fontWeight={600}>
                        {label || 'Pilih Opsi'}
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <Iconify icon="material-symbols:close" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ padding: 2 }}>
                    <TextField
                        fullWidth
                        placeholder={async?.placeholderSearchBox ?? 'Cari...'}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="material-symbols:search" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <List sx={{ pt: 0, maxHeight: '400px', overflow: 'auto' }}>
                        {list?.map((option, index) => {
                            const uniqueKey = `option-${option?.[keyValue] || 'unknown'}-${index}`;
                            return (
                                <ListItem key={uniqueKey} disablePadding>
                                    <ListItemButton
                                        onClick={() => handleSelectOption(option)}
                                        selected={currentValue?.[keyValue] === option?.[keyValue]}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 0.5,
                                            '&.Mui-selected': {
                                                backgroundColor: theme.palette.primary.light + '20',
                                            }
                                        }}
                                    >
                                        {renderOption ? renderOption({ key: `${uniqueKey}-content` }, option) : (
                                            <ListItemText
                                                primary={option?.[keyLabel] ?? option}
                                                sx={{
                                                    '& .MuiListItemText-primary': {
                                                        fontWeight: currentValue?.[keyValue] === option?.[keyValue] ? 600 : 400
                                                    }
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                        {(!list || list.length === 0) && !async?.isLoading && (
                            <ListItem key="no-results">
                                <ListItemText
                                    primary="Tidak ada hasil ditemukan"
                                    sx={{
                                        textAlign: 'center',
                                        color: 'text.secondary',
                                        fontStyle: 'italic'
                                    }}
                                />
                            </ListItem>
                        )}
                        {async?.isLoading && list?.length === 0 && (
                            <ListItem key="loading" sx={{ justifyContent: 'center' }}>
                                <CircularProgress size={30} />
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Box flex={1}>
                    {isMobile ? renderMobileVersion(field, error) : renderDesktopVersion(field, error)}
                </Box>
            )}
        />
    );
}