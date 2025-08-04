'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { usePopover } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import { getWorkspace, setWorkspace } from 'src/modules/auth/context/jwt';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
    data?: {
        id: string;
        name: string;
        logo: string;
        plan: string;
    }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
    const mediaQuery = 'sm';

    const { open, anchorEl, onClose, onOpen } = usePopover();
    const [activeWorkspace, setActiveWorkspace] = useState<(typeof data)[0] | null>(null);

    useEffect(() => {
        const workspace = getWorkspace();
        if (workspace) {
            setActiveWorkspace(workspace);
        }
    }, []);

    const handleChangeWorkspace = useCallback(
        (newValue: (typeof data)[0]) => {
            setWorkspace(newValue);
            setActiveWorkspace(newValue);
            onClose();

            // reload page
            window.location.reload();
        },
        [onClose]
    );

    const buttonBg: SxProps<Theme> = {
        height: 1,
        zIndex: -1,
        opacity: 0,
        content: "''",
        borderRadius: 1,
        position: 'absolute',
        visibility: 'hidden',
        bgcolor: 'action.hover',
        width: 'calc(100% + 8px)',
        transition: (theme) =>
            theme.transitions.create(['opacity', 'visibility'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.shorter,
            }),
        ...(open && {
            opacity: 1,
            visibility: 'visible',
        }),
    };

    const renderButton = () => (
        <ButtonBase
            disableRipple
            onClick={onOpen}
            sx={[
                {
                    py: 0.5,
                    gap: { xs: 0.5, [mediaQuery]: 1 },
                    '&::before': buttonBg,
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            {
                activeWorkspace?.logo ? (
                    <Avatar alt={activeWorkspace?.name} src={activeWorkspace?.logo ?? null} sx={{ width: 24, height: 24 }} />
                ) : (
                    <Avatar alt={activeWorkspace?.name} sx={{ width: 24, height: 24 }}>{activeWorkspace?.name.split('', 1)}</Avatar>
                )
            }

            <Box
                component="span"
                sx={{ typography: 'subtitle2', display: { xs: 'none', [mediaQuery]: 'inline-flex' } }}
            >
                {activeWorkspace?.name}
            </Box>

            <Label
                color={activeWorkspace?.plan === 'Free' ? 'default' : 'info'}
                sx={{
                    height: 22,
                    cursor: 'inherit',
                    display: { xs: 'none', [mediaQuery]: 'inline-flex' },
                }}
            >
                {activeWorkspace?.plan}
            </Label>

            <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
        </ButtonBase>
    );

    const renderMenuList = () => (
        <CustomPopover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            slotProps={{
                arrow: { placement: 'top-left' },
                paper: { sx: { mt: 0.5, ml: -1.55 } },
            }}
        >
            <MenuList sx={{ width: 240 }}>
                {data.map((option) => (
                    <MenuItem
                        key={option.id}
                        selected={option.id === activeWorkspace?.id}
                        onClick={() => handleChangeWorkspace(option)}
                        sx={{ height: 48 }}
                    >
                        {
                            option?.logo ? (
                                <Avatar alt={option.name} src={option.logo ?? null} sx={{ width: 24, height: 24 }} />
                            ) : (
                                <Avatar alt={option.name} sx={{ width: 24, height: 24 }}>{option.name.split('', 1)}</Avatar>
                            )
                        }

                        <Box component="span" sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}>
                            {option.name}
                        </Box>
                    </MenuItem>
                ))}
            </MenuList>
        </CustomPopover>
    );

    return (
        <>
            {renderButton()}
            {renderMenuList()}
        </>
    );
}
