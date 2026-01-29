import {
    InvoiceCategoriesEnum,
    PaymentStatusEnum,
} from '@partials/admin/invoices'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginationWithSearch } from '@types'

const PREFIX = 'invoice-setting'
export const invoiceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    invoiceCategorisList: builder.query<any, void>({
        query: () => `${PREFIX}/actions/list`,
        providesTags: ['Invoice'],
    }),

    addInvoiceCategory: builder.mutation<any, { name: string }>({
        query: (body) => ({
            url: `${PREFIX}/actions/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Invoice', 'RTOS'],
    }),

    addRtoInvoiceSetting: builder.mutation<
        any,
        { id: number; type: string; invoiceAction: number[]; startDate: string }
    >({
        query: ({ id, invoiceAction, ...body }) => ({
            url: `${PREFIX}/rto/${id}/add`,
            method: 'POST',
            params: { ids: invoiceAction },
            body,
        }),
        invalidatesTags: ['Invoice', 'RTOS'],
    }),

    markDuplicateToggle: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/${id}/duplicate/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Invoice', 'RTOS'],
    }),

    invoiceRtosList: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}/rtos/allowed-invoicing/list`,
            params,
        }),
        providesTags: ['Invoice'],
    }),

    invoiceRtoDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/rto/${id}/data`,
        providesTags: ['Invoice'],
    }),

    invoiceRtoDataList: builder.query<
        any,
        PaginationWithSearch & { id: number }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/rto/${id}/data/list`,
            params,
        }),
        providesTags: ['Invoice'],
    }),

    changePaymentStatus: builder.mutation<
        any,
        { id: number; status: PaymentStatusEnum }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/invoice/${id}/payment-status/update`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['Invoice', 'RTOS'],
    }),

    confirmPayment: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/invoice/${id}/confirm`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Invoice', 'RTOS'],
    }),

    confirmAllPayment: builder.mutation<any, { ids: number[] }>({
        query: (body) => ({
            url: `${PREFIX}/invoices/confirm`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Invoice', 'RTOS'],
    }),

    invoiceRtoDataDownload: builder.query<
        any,
        PaginationWithSearch & { id: number }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/rto/${id}/data/download`,
            params,
        }),
        providesTags: ['Invoice'],
    }),

    getInvoiceStatus: builder.query<any, number>({
        query: (id) => `${PREFIX}/workplace/${id}/payment-status`,
        providesTags: ['Invoice'],
    }),

    addCustomInvoice: builder.mutation<
        any,
        {
            rto: number
            student: number
            course: number
            invoiceAction: InvoiceCategoriesEnum
        }
    >({
        query: (body) => ({
            url: `${PREFIX}/custom-invoice`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Invoice', 'RTOS'],
    }),
})
