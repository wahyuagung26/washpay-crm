import * as React from 'react';

import { Menu, Stack, Button, MenuItem } from '@mui/material';

import { Iconify } from '../iconify';

interface Items {
    id?: number;
    name: string;
    icon: string;
    onClick: () => void;
    hide?: boolean;
    color?: string;
}

interface BasicMenuProps {
    items: Items[];
    label: string;
    id?: string | number;
}

export const BasicMenu = ({ items, label, id }: BasicMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Stack key={`basic-menu-${label}-${id ?? ''}`}>
            <Button
                id={`basic-button-${label}-${id ?? ''}`}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant='outlined'
            >
                {label}
            </Button>
            <Menu
                id={`basic-menu-${label}-${id ?? ''}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': `basic-button-${label}-${id ?? ''}`,
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {items?.filter(v => !v.hide).map((item, idx) => (
                    <MenuItem key={`basic-menu-${label}-${id ?? ''}-${idx}`} onClick={() => {
                        handleClose();
                        item.onClick();
                    }} sx={{ color: item.color ?? 'inherit' }}>
                        {item.icon && <Iconify icon={item.icon} sx={{ mr: 1 }} />}
                        {item.name}
                    </MenuItem>
                ))}
            </Menu>
        </Stack>
    );
}
