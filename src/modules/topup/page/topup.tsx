'use client';

import { useState } from 'react';

import { Box, Tab, Tabs } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { MainBreadchumbs } from 'src/components/breadcrumbs';

import { TopUpTab } from '../components/tab-topup';
import { RiwayatTab } from '../components/tab-riwayat';
import { PendingConfirmation } from '../components/pending-confirmation';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`topup-tabpanel-${index}`}
        aria-labelledby={`topup-tab-${index}`}
        {...other}
    >
        {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
);

const a11yProps = (index: number) => ({
    id: `topup-tab-${index}`,
    'aria-controls': `topup-tabpanel-${index}`,
});

export const TopUpPage = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <DashboardContent>
            <MainBreadchumbs
                heading="Top Up Saldo"
                links={[
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'Top Up Saldo' },
                ]}
            />

            <PendingConfirmation />

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="top up tabs"
                >
                    <Tab label="Top Up" {...a11yProps(0)} />
                    <Tab label="Riwayat" {...a11yProps(1)} />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <TopUpTab />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <RiwayatTab />
            </TabPanel>
        </DashboardContent>
    );
};
