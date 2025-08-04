import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { getListCustomer } from 'src/infrastructure/api';

export const useCustomerList = () => {
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