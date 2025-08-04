# .copilot-instructions.md

## React TypeScript Development Guidelines

This project follows enterprise-grade React TypeScript patterns. All suggestions should adhere to these guidelines.

---

## 🎯 Core Principles

1. **Type Safety First**: Always prefer strict typing over `any` or loose types
2. **Performance Conscious**: Implement memoization and optimize re-renders
3. **Accessibility by Default**: Include ARIA attributes and keyboard navigation
4. **Error Resilience**: Implement comprehensive error handling
5. **Maintainable Code**: Favor readability and consistency over cleverness

---

## 📁 Project Structure Patterns

```
src/
├── app/                 # Next.js App Router pages
├── assets/              # Static assets (images, icons, etc.)
├── components/          # Reusable UI components
├── infrastructure/      # API layer, types, services
├── layouts/            # Layout components (dashboard, auth, etc.)
├── modules/            # Feature-based modules
├── routes/             # Route definitions and path constants
├── theme/              # Theme configuration and styling
├── utils/              # Utility functions and helpers
├── global-config.ts    # Global configuration
└── global.css          # Global styles
```

### Module-Based Architecture
```
src/modules/
├── customers/          # Customer feature module
│   ├── components/     # Customer-specific components (dialog-form.tsx)
│   ├── hooks/         # Customer-related hooks (use-customer-list.ts, use-customer-form.ts, use-customer-delete.ts)
│   ├── page/          # Customer pages (list.tsx)
│   └── index.ts       # Module barrel export
├── product/           # Product feature module
└── shared/            # Shared utilities across modules
```

---

## 🔧 Code Patterns to Follow

### State Management
```typescript
// ✅ Preferred: Proper state typing
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);

// ✅ Custom hooks for complex state
const useFormValidation = (schema: ValidationSchema) => {
  // Hook implementation
};
```

### Data Fetching
```typescript
// ✅ Use React Query pattern with pagination and search
const useCustomerList = () => {
  const form = useForm();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState('');

  const debounce = useDebouncedCallback((value: string) => {
    setKeyword(value);
  }, 500);

  const list = useQuery({
    queryKey: ['customer', 'list', page, perPage, keyword],
    queryFn: () => getListCustomer({ page, per_page: perPage, keyword }),
  });

  const handleSearch = (value: string) => {
    form.setValue('search', value);
    debounce(value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  return {
    form,
    list,
    page,
    perPage,
    keyword,
    handleSearch,
    handlePageChange,
    handlePerPageChange,
  };
};
```

### Form Management with Zod Validation
```typescript
// ✅ Define Zod schema for validation
export const CustomerSchema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(1, { message: 'Nama Pelanggan wajib diisi!' }),
  phone_number: zod.string().min(3, { message: 'No. telepon wajib diisi!' }),
  address: zod.string().min(1, { message: 'Alamat Pelanggan wajib diisi!' }),
});

export type CustomerSchemaType = zod.infer<typeof CustomerSchema>;

// ✅ Form hook with create/edit modes
const useCustomerForm = ({
  initialValues = null,
  mode = 'create',
  onSuccess,
}: UseCustomerFormOptions) => {
  const values = useMemo(
    () => (initialValues ? { ...initialValues } : { ...defaultValues }),
    [initialValues]
  );

  const form = useForm<CustomerSchemaType>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: values,
  });

  const { mutateAsync: createCustomer, isPending: isCreating } = useMutation({
    mutationKey: ['customer', 'create'],
    mutationFn: postCustomer,
  });

  const { mutateAsync: updateCustomer, isPending: isUpdating } = useMutation({
    mutationKey: ['customer', 'update'],
    mutationFn: putCustomer,
  });

  const onSubmit = async (data: CustomerSchemaType) => {
    try {
      const save = await (mode === 'create'
        ? createCustomer(data as Customer)
        : updateCustomer(data as Customer));
      
      toast.success('Berhasil', {
        description: save?.message ?? 'Berhasil menyimpan data',
      });
      
      onSuccess?.();
    } catch (error) {
      toast.error('Gagal', {
        description:
          (error as any)?.response?.data?.errors?.[0] ??
          'Gagal menyimpan data',
      });
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    handleReset: () => form.reset(),
    isLoading: isCreating || isUpdating,
    mode,
  };
};
```

### Performance Optimization
```typescript
// ✅ Memoize expensive calculations
const processedData = useMemo(() => 
  data?.map(transformData).filter(isValid) ?? [],
  [data]
);

// ✅ Callback optimization
const handleAction = useCallback((id: string) => {
  // Action logic
}, [dependency]);
```

### Delete Operations with Confirmation
```typescript
// ✅ Delete hook with confirmation and error handling
const useCustomerDelete = ({ onSuccess }: UseCustomerDeleteOptions = {}) => {
  const { mutateAsync: deleteData, isPending: isDeleting } = useMutation({
    mutationFn: deleteCustomer,
  });

  const handleDelete = async ({ id, reason }: { id: number; reason?: string }) => {
    try {
      const del = await deleteData({ id, reason: reason as string });

      toast.success('Berhasil', {
        description: del?.message ?? 'Berhasil menghapus data',
      });

      onSuccess?.();
    } catch (error) {
      toast.error('Gagal', {
        description:
          (error as any)?.response?.data?.errors?.[0] ??
          'Gagal menghapus data',
      });
    }
  };

  return {
    handleDelete,
    isDeleting,
  };
};
```

### Type Definitions
```typescript
// ✅ Place types in infrastructure/type/index.ts
export interface ComponentProps {
  data: EntityData[];
  loading?: boolean;
  onAction: (item: EntityData) => void;
  className?: string;
}

// ✅ API response types following project pattern
export interface ApiResponse<T> {
  data: T[];
  meta: PaginationMeta;
  status: 'success' | 'error';
}

// ✅ Import from infrastructure layer
import type { CustomerResponse } from "src/infrastructure/type";
```

### Error Handling
```typescript
// ✅ Centralized error handling with toast notifications
import { toast } from "sonner";

const handleApiError = (error: unknown): string => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as any).response;
    errorMessage = response?.data?.errors?.[0] ?? errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  toast.error("Gagal", {
    description: errorMessage,
  });
  
  return errorMessage;
};

// ✅ API integration following project pattern
import { getListCustomer, deleteCustomer } from "src/infrastructure/api";
```

### Constants Management
```typescript
// ✅ Global constants in global-config.ts
// global-config.ts
export const APP_CONFIG = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL,
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
  },
  UI: {
    DEBOUNCE_DELAY: 500,
    PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    DEBOUNCE_DELAY: 500,
  },
} as const;

// ✅ Feature-specific constants
const CUSTOMER_CONFIG = {
  VALIDATION: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
  },
  UI: {
    CARD_ELEVATION: 2,
    GRID_SPACING: 2,
  },
} as const;
```

---

## 🧩 Component Architecture

### Component Structure Template
```typescript
'use client'; // Next.js App Router directive for pages

// 1. Type imports from infrastructure
import type { CustomerResponse } from "src/infrastructure/type";

// 2. React imports
import { useState } from "react";

// 3. Third-party library imports
import { useBoolean } from "minimal-shared/hooks";

// 4. Material-UI imports
import { Card, Grid2, Stack, Button, Typography, CardContent, TablePagination } from "@mui/material";

// 5. Route imports
import { paths } from "src/routes/paths";

// 6. Layout imports
import { DashboardContent } from "src/layouts/dashboard";

// 7. Component imports
import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { BasicMenu } from "src/components/custom-menu";
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";
import { MainBreadchumbs } from "src/components/breadcrumbs";
import { DialogConfirmDelete } from "src/components/dialog/confirm-delete";

// 8. Local module imports
import { DialogForm } from "../components/dialog-form";
import { useCustomerList, useCustomerDelete } from "../hooks";

// 9. Component
export const ListCustomerPage = () => {
  const [selected, setSelected] = useState<CustomerResponse | null>(null);
  const openForm = useBoolean(false);
  const openFormDelete = useBoolean(false);

  const { form, list, handleSearch, handlePageChange, handlePerPageChange } = useCustomerList();
  
  const { handleDelete, isDeleting } = useCustomerDelete({
    onSuccess: () => {
      list.refetch();
      handleCloseDelete();
    },
  });

  // Render methods
  const renderItem = () => (
    (list.data?.data ?? []).length > 0 ? renderList() : <EmptyContent />
  );

  const renderList = () => (
    <>
      {(list.data?.data ?? []).map((item) => (
        <Grid2 size={12} key={`customer-${item.id}`}>
          <Card>
            <CardContent>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 10, sm: 11 }}>
                  <Stack direction="column" gap={1}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:phone-calling-rounded-bold-duotone" width={16} height={16} />
                      <Typography variant="body1" color="text.secondary">{item.phone_number}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:map-point-wave-bold-duotone" width={16} height={16} />
                      <Typography variant="body1" color="text.secondary">{item.address}</Typography>
                    </Stack>
                  </Stack>
                </Grid2>
                <Grid2 size={{ xs: 2, sm: 1 }} display="flex" alignItems="center" justifyContent="center">
                  <BasicMenu
                    items={[
                      {
                        id: 1,
                        name: "Edit",
                        icon: "eva:edit-fill",
                        onClick: () => handleEditCustomer(item),
                      },
                      {
                        id: 2,
                        name: "Delete",
                        icon: "eva:trash-2-outline",
                        onClick: () => handleDeleteCustomer(item),
                        color: "error.main",
                      },
                    ]}
                    label="Action"
                    id={item.id}
                  />
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>
      ))}
      <Grid2 size={12}>
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
      </Grid2>
    </>
  );

  // Event handlers
  const handleCloseForm = () => {
    setSelected(null);
    openForm.onFalse();
  };

  const handleAddCustomer = () => {
    setSelected(null);
    openForm.onTrue();
  };

  const handleEditCustomer = (item: CustomerResponse) => {
    setSelected(item);
    openForm.onTrue();
  };

  const handleDeleteCustomer = (item: CustomerResponse) => {
    setSelected(item);
    openFormDelete.onTrue();
  };

  const handleCloseDelete = () => {
    setSelected(null);
    openFormDelete.onFalse();
  };

  return (
    <DashboardContent>
      <MainBreadchumbs
        links={[
          { name: "Dashboard", href: "/" },
          { name: "Pelanggan", href: paths.customer.root },
          { name: "Daftar Pelanggan" },
        ]}
        heading="Daftar Pelanggan"
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            color="primary"
            onClick={handleAddCustomer}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Tambah Pelanggan
          </Button>
        }
      />
      <Form methods={form}>
        <Field.SearchKeyword
          size="small"
          name="search"
          placeholder="Search..."
          onChange={(event) => handleSearch(event.target.value)}
        />
      </Form>
      <Grid2 container spacing={2}>
        {list.isLoading ? <LoadingList /> : renderItem()}
      </Grid2>
      
      {/* Dialogs */}
      {openForm.value && (
        <DialogForm
          open={openForm.value}
          onClose={handleCloseForm}
          initialValues={selected}
          mode={selected ? "edit" : "create"}
          refetch={list.refetch}
        />
      )}

      {openFormDelete.value && (
        <DialogConfirmDelete
          open={openFormDelete.value}
          onClose={handleCloseDelete}
          initialValues={selected}
          onSubmit={(data, reason) => {
            handleDelete({ id: data?.id ?? 0, reason });
          }}
          isLoading={isDeleting}
          message={
            <Typography variant="body1" textAlign="center">
              Apakah anda yakin ingin menghapus pelanggan <strong>{selected?.name}</strong>?
            </Typography>
          }
        />
      )}
    </DashboardContent>
  );
};
```

### Component Splitting Guidelines
- **Single file > 200 lines**: Consider splitting
- **Multiple responsibilities**: Extract into separate components
- **Reusable logic**: Move to custom hooks in module/hooks/
- **Complex state**: Create dedicated state management
- **Module organization**: Keep related components in modules/[feature]/components/

### Module Organization Example
```
src/modules/customers/
├── components/
│   └── dialog-form.tsx       # Dialog form component for create/edit
├── hooks/
│   ├── index.ts              # Export barrel for hooks
│   ├── use-customer-list.ts  # Data fetching and pagination logic
│   ├── use-customer-form.ts  # Form state management with Zod validation
│   └── use-customer-delete.ts # Delete operation with confirmation
├── page/
│   ├── index.ts              # Export barrel for pages
│   └── list.tsx             # Main list page component with cards layout
└── index.ts                 # Module barrel export
```

---

## 🎨 UI/UX Standards

### UI/UX Standards

### Material-UI with Project Theme
```typescript
// ✅ Use sx prop with project theme system
<Grid2 
  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
  sx={{
    display: { xs: 'block', md: 'flex' },
    padding: { xs: 1, sm: 2, md: 3 },
    width: {
      xs: "100%",
      sm: "auto",
    }
  }}
>

// ✅ Follow DashboardContent layout pattern
<DashboardContent>
  <MainBreadchumbs
    links={[
      { name: "Dashboard", href: "/" },
      { name: "Feature", href: paths.feature.root },
      { name: "Current Page" },
    ]}
    heading="Page Title"
    action={
      <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
        Action Button
      </Button>
    }
  />
  {/* Page content */}
</DashboardContent>
```

### Loading States
```typescript
// ✅ Comprehensive loading states with project components
import { LoadingList } from "src/components/loading-screen";
import { EmptyContent } from "src/components/empty-content";

{isLoading ? (
  <LoadingList />
) : error ? (
  <ErrorMessage error={error} onRetry={refetch} />
) : data?.length > 0 ? (
  <DataList data={data} />
) : (
  <EmptyContent />
)}

// ✅ Button loading states
<Button
  variant="contained"
  disabled={isLoading}
  startIcon={isLoading ? <CircularProgress size={16} /> : <Iconify icon="eva:save-fill" />}
>
  {isLoading ? "Menyimpan..." : "Simpan"}
</Button>
```

### Accessibility
```typescript
// ✅ ARIA attributes with Iconify and project patterns
<Button
  aria-label={`Edit ${item.name}`}
  aria-describedby={`edit-help-${item.id}`}
  role="button"
  tabIndex={0}
  startIcon={<Iconify icon="eva:edit-fill" />}
  onKeyDown={handleKeyDown}
>
  Edit
</Button>

// ✅ BasicMenu component with accessibility
<BasicMenu
  items={[
    {
      id: 1,
      name: "Edit",
      icon: "eva:edit-fill",
      onClick: () => handleEdit(item),
    },
    {
      id: 2,
      name: "Delete",
      icon: "eva:trash-2-outline",
      onClick: () => handleDelete(item),
    },
  ]}
  label={`Actions for ${item.name}`}
  aria-label={`Customer actions for ${item.name}`}
  id={item.id}
/>
```

---

## 🛡️ Error Prevention

### Input Validation
```typescript
// ✅ Runtime validation with proper types
const validateInput = (input: unknown): input is ValidInput => {
  return typeof input === 'object' && 
         input !== null && 
         'requiredField' in input;
};
```

### Null Safety
```typescript
// ✅ Safe property access
const userName = user?.profile?.name ?? 'Anonymous';
const itemCount = items?.length ?? 0;
```

### Memory Leak Prevention
```typescript
// ✅ Cleanup subscriptions
useEffect(() => {
  const subscription = createSubscription();
  
  return () => {
    subscription.unsubscribe();
    debouncedCallback.cancel();
  };
}, []);
```

---

## 📊 Performance Guidelines

### Memoization Rules
- **useMemo**: For expensive calculations
- **useCallback**: For event handlers passed to child components
- **React.memo**: For components that receive stable props

### Bundle Optimization
```typescript
// ✅ Lazy loading for code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Dynamic imports for utilities
const utilityFunction = async () => {
  const { heavyUtility } = await import('./heavyUtility');
  return heavyUtility();
};
```

---

## 🧪 Testing Considerations

### Component Testing
```typescript
// ✅ Test component props and behavior
interface TestProps {
  testId?: string;
  'aria-label'?: string;
}

export const Component: React.FC<Props & TestProps> = ({
  testId,
  ...props
}) => (
  <div data-testid={testId} {...props}>
    {/* Component content */}
  </div>
);
```

---

## 🚫 Anti-Patterns to Avoid

### Don't Do These
```typescript
// ❌ Using any type
const handleData = (data: any) => { };

// ❌ Direct state mutation
setState(state.items.push(newItem));

// ❌ Missing dependencies
useEffect(() => {
  fetchData(id);
}, []); // Missing 'id' dependency

// ❌ Creating objects in render
<Component 
  style={{ margin: 10 }} // Creates new object every render
  onClick={() => handleClick(id)} // Creates new function every render
/>

// ❌ Magic numbers and strings
setTimeout(() => {}, 500); // Use named constant
```

---

## 🎯 Copilot Instructions

When generating code suggestions:

1. **Always include proper TypeScript types**
2. **Implement error boundaries and error handling**
3. **Add accessibility attributes to interactive elements**
4. **Use performance optimizations (memo, callback, useMemo)**
5. **Include loading and error states for async operations**
6. **Follow the component structure template**
7. **Extract reusable logic into custom hooks**
8. **Use semantic HTML elements**
9. **Implement proper cleanup in useEffect**
10. **Prefer composition over inheritance**

### Code Review Checklist
Before suggesting code, verify:
- [ ] Proper TypeScript typing
- [ ] Error handling implemented
- [ ] Performance optimizations applied
- [ ] Accessibility attributes included
- [ ] Memory leaks prevented
- [ ] Constants used instead of magic values
- [ ] Component responsibility is single and clear

---

## 📚 Additional Resources

- **Styling**: Material-UI with sx prop and theme system from src/theme/
- **Forms**: react-hook-form with Form and Field components from src/components/hook-form
- **State Management**: 
  - React Query for server state with infrastructure/api
  - useState/useReducer for UI state
  - Custom hooks with minimal-shared/hooks
- **Routing**: Next.js App Router with paths from src/routes/paths
- **Icons**: Iconify component from src/components/iconify
- **Layouts**: DashboardContent from src/layouts/dashboard
- **Testing**: React Testing Library with user-centric tests
- **Documentation**: Include JSDoc comments for complex functions

### Dialog Form Patterns
```typescript
// ✅ Dialog form component with create/edit modes
export const DialogForm = ({
  open,
  onClose,
  refetch = () => {},
  initialValues = null,
  mode = "create",
}: DialogFormProps) => {
  const { form, handleSubmit, handleReset, isLoading } = useCustomerForm({
    initialValues,
    mode,
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      hideBackdrop={false}
      disableEscapeKeyDown
    >
      <Form methods={form} onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === "create" ? "Tambah Pelanggan" : "Edit Pelanggan"}
        </DialogTitle>
        <DialogContent sx={{ py: 2, paddingTop: "16px !important", gap: 2, flexDirection: "column", display: "flex" }}>
          <Stack direction="column" spacing={4}>
            <Field.Text
              name="name"
              label="Nama Pelanggan"
              placeholder="Masukkan nama Pelanggan"
            />
            <Field.Phone
              name="phone_number"
              label="No. Telepon / HP"
              placeholder="Masukkan no. telepon"
            />
            <Field.Text
              name="address"
              label="Alamat Pelanggan"
              placeholder="Masukkan alamat Pelanggan"
              multiline
              rows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            loadingPosition="start"
            color="primary"
          >
            Simpan
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
```

### Project-Specific Patterns
- Use `paths.customer.root` for navigation (note: plural form for modules)
- Module naming: Use plural form (e.g., `customers/`, not `customer/`)
- Import types from `src/infrastructure/type`
- Use `DashboardContent` layout wrapper for all pages
- Implement `MainBreadchumbs` with proper breadcrumb structure
- Use `useBoolean` from `minimal-shared/hooks` for modal states
- Follow Indonesian toast notification patterns with sonner ("Berhasil", "Gagal")
- Use `BasicMenu` for action menus with consistent icon patterns
- Import loading components from `src/components/loading-screen`
- Use `DialogConfirmDelete` for delete confirmations
- Grid2 layout with responsive sizing: `size={{ xs: 12, sm: 6, md: 4 }}`
- Card-based list layouts with `CardContent`
- Search with debounced input using `useDebouncedCallback`
- Pagination using Material-UI `TablePagination` component

---

**Remember**: Code should be self-documenting, performant, accessible, and maintainable. When in doubt, favor explicit over implicit, and safe over fast.