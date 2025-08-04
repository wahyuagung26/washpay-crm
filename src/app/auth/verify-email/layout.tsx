import { Container } from '@mui/material';

import { AuthGuard } from 'src/modules/auth/guard';

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <AuthGuard>
            <Container maxWidth="sm" sx={{ height: '100%', paddingTop: 3 }}>
                {children}
            </Container>
        </AuthGuard>
    );
}
