'use client';

import { 
  Card, 
  Chip, 
  Table, 
  Stack, 
  TableRow, 
  TableBody, 
  TableCell, 
  TableHead, 
  Typography, 
  TableContainer, 
  TablePagination 
} from "@mui/material";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs";

import { useClientList } from "../hooks";

export const ListClientPage = () => {
  const { form, list, handleSearch, handlePageChange, handlePerPageChange } = useClientList();

  const renderTable = () => (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Klien</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="center">Statistik</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(list.data?.data ?? []).map((item) => (
              <TableRow key={`client-${item.id}`} hover>
                <TableCell>
                  <Stack direction="column" spacing={0.5}>
                    <Typography variant="subtitle2">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {item.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="column" spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:user-bold-duotone" width={16} height={16} />
                      <Typography variant="body1">{item.owner_name}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:phone-calling-rounded-bold-duotone" width={16} height={16} />
                      <Typography variant="body2" color="text.secondary">{item.owner_phone}</Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="column" spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:crown-star-bold-duotone" width={16} height={16} />
                      <Typography variant="body1">{item.subscription_name}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:calendar-bold-duotone" width={16} height={16} />
                      <Typography variant="body2" color="text.secondary">
                        {item?.subscription_expired_at ? new Date(item.subscription_expired_at).toLocaleDateString('id-ID') : '-'}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                    <Iconify icon="solar:wallet-money-bold-duotone" width={16} height={16} />
                    <Typography variant="body1" fontWeight="medium">
                      Rp {item.balance.toLocaleString('id-ID')}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap">
                    <Chip 
                      size="small" 
                      label={`${item.total_outlet} Outlet`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip 
                      size="small" 
                      label={`${item.total_user} User`}
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip 
                      size="small" 
                      label={`${item.total_transaction_today} Transaksi`}
                      color="info"
                      variant="outlined"
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={list.data?.meta?.total ?? 0}
        page={(list.data?.meta?.page ?? 1) - 1}
        onPageChange={(_, newPage) => handlePageChange(newPage)}
        rowsPerPage={list.data?.meta?.per_page ?? 10}
        onRowsPerPageChange={(event) => {
          handlePerPageChange(parseInt(event.target.value, 10));
        }}
      />
    </Card>
  );

  return (
    <DashboardContent>
      <MainBreadchumbs
        links={[
          { name: "Dashboard", href: "/" },
          { name: "Klien", href: paths.clients.root },
          { name: "Daftar Klien" },
        ]}
        heading="Daftar Klien"
      />
      <Form methods={form}>
        <Field.SearchKeyword
          size="small"
          name="search"
          placeholder="Cari klien..."
          onChange={(event) => handleSearch(event.target.value)}
        />
      </Form>
      {list.isLoading ? (
        <LoadingList />
      ) : (list.data?.data ?? []).length > 0 ? (
        renderTable()
      ) : (
        <EmptyContent />
      )}
    </DashboardContent>
  );
};