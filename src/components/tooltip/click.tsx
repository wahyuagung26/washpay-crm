import { useState } from "react";

import { Box, Tooltip, ClickAwayListener } from "@mui/material";

interface ClickTooltipProps {
    title: string;
    children: React.ReactNode;
}

export const ClickTooltip = ({ title, children }: ClickTooltipProps) => {
    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
                <Tooltip
                    onClose={handleTooltipClose}
                    open={open}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={title}
                    slotProps={{
                        popper: {
                            disablePortal: true,
                        },
                    }}
                >
                    <Box onClick={handleTooltipOpen} sx={{ '&:hover': { cursor: 'pointer' }, display: 'flex' }}>{children}</Box>
                </Tooltip>
            </div>
        </ClickAwayListener>
    );
};
