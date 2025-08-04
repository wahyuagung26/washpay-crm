export interface QueryParams {
    page?: number;
    per_page?: number;
}

export interface ResponseData<T> {
  message?: string;
  data?: T;
  errors?: any;
  meta?: MetaPage;
}

export interface MetaPage {
  last_page: number;
  page: number;
  per_page: number;
  total: number;
}