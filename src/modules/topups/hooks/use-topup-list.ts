'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { getListTopUp } from 'src/infrastructure/api';

export const useTopupList = () => {
  const form = useForm();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState('');

  const debounce = useDebouncedCallback((value: string) => {
    setKeyword(value);
  }, 500);

  const list = useQuery({
    queryKey: ['topups', 'list', page, perPage, keyword],
    queryFn: () => getListTopUp({ page, per_page: perPage, keyword }),
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