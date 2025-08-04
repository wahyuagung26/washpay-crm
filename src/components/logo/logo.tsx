import type { LinkProps } from '@mui/material/Link';

import { forwardRef } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
    isSingle?: boolean;
    disabled?: boolean;
};

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>((props, ref) => {
    const { className, href = '/', isSingle = true, disabled, sx, ...other } = props;

    const singleLogo = (
        <img src="/logo/logo-single.png" alt="Single logo" width={36} height={36} />
    );

    const fullLogo = (
        <img src="/logo/logo-full.png" alt="Full logo" height={36} />
    );

    return (
        <LogoRoot
            ref={ref}
            component={RouterLink}
            href={href}
            aria-label="Logo"
            underline="none"
            className={mergeClasses([logoClasses.root, className])}
            sx={[
                () => ({
                    width: 40,
                    height: 40,
                    ...(!isSingle && { width: 102, height: 36 }),
                    ...(disabled && { pointerEvents: 'none' }),
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            {isSingle ? singleLogo : fullLogo}
        </LogoRoot>
    );
});

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
    flexShrink: 0,
    color: 'transparent',
    display: 'inline-flex',
    verticalAlign: 'middle',
}));
