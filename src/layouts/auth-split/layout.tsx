'use client';

import type { Breakpoint } from '@mui/material/styles';

import { merge } from 'es-toolkit';

import Alert from '@mui/material/Alert';

import { CONFIG } from 'src/global-config';

import { Logo } from 'src/components/logo';

import { AuthSplitSection } from './section';
import { AuthSplitContent } from './content';
import { MainSection } from '../core/main-section';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';

import type { AuthSplitSectionProps } from './section';
import type { AuthSplitContentProps } from './content';
import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type AuthSplitLayoutProps = LayoutBaseProps & {
    layoutQuery?: Breakpoint;
    slotProps?: {
        header?: HeaderSectionProps;
        main?: MainSectionProps;
        section?: AuthSplitSectionProps;
        content?: AuthSplitContentProps;
    };
};

export function AuthSplitLayout({
    sx,
    cssVars,
    children,
    slotProps,
    layoutQuery = 'md',
}: AuthSplitLayoutProps) {
    const renderHeader = () => {
        const headerSlotProps: HeaderSectionProps['slotProps'] = {
            container: { maxWidth: false },
        };

        const headerSlots: HeaderSectionProps['slots'] = {
            topArea: (
                <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                    This is an info Alert.
                </Alert>
            ),
            leftArea: (
                <>
                    {/** @slot Logo */}
                    <Logo />
                </>
            ),
        };

        return (
            <HeaderSection
                disableElevation
                layoutQuery={layoutQuery}
                {...slotProps?.header}
                slots={{ ...headerSlots, ...slotProps?.header?.slots }}
                slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
                sx={[
                    { position: { [layoutQuery]: 'fixed' } },
                    ...(Array.isArray(slotProps?.header?.sx)
                        ? (slotProps?.header?.sx ?? [])
                        : [slotProps?.header?.sx]),
                ]}
            />
        );
    };

    const renderFooter = () => null;

    const renderMain = () => (
        <MainSection
            {...slotProps?.main}
            sx={[
                (theme) => ({ [theme.breakpoints.up(layoutQuery)]: { flexDirection: 'row' } }),
                ...(Array.isArray(slotProps?.main?.sx)
                    ? (slotProps?.main?.sx ?? [])
                    : [slotProps?.main?.sx]),
            ]}
        >
            <AuthSplitSection
                layoutQuery={layoutQuery}
                method={CONFIG.auth.method}
                {...slotProps?.section}
            />
            <AuthSplitContent layoutQuery={layoutQuery} {...slotProps?.content}>
                {children}
            </AuthSplitContent>
        </MainSection>
    );

    return (
        <LayoutSection
            /** **************************************
             * @Header
             *************************************** */
            headerSection={renderHeader()}
            /** **************************************
             * @Footer
             *************************************** */
            footerSection={renderFooter()}
            /** **************************************
             * @Styles
             *************************************** */
            cssVars={{ '--layout-auth-content-width': '420px', ...cssVars }}
            sx={sx}
        >
            {renderMain()}
        </LayoutSection>
    );
}
