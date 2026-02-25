import { WpAppRequEnum } from '@partials/rto/wpApprovalReq/enum'
import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginationWithSearch } from '@types'

const PREFIX = 'rtos'
export const workplaceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getRTOWorkplaces: builder.query<any, any>({
        query: (params) => {
            return {
                url: `${PREFIX}/work-place/list`,
                params,
            }
        },
        providesTags: ['RTOWorkplace'],
    }),
    getRTOWorkplaceDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/work-place/view/${id}`,
        providesTags: ['RTOWorkplace'],
    }),
    wpApprovalRequest: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}/workplace-approval/request/pending/list`,
            params,
        }),
        providesTags: ['RTOWorkplace'],
    }),
    wpApprovalRequestByStatus: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}/workplace-approval/requests/list`,
            params,
        }),
        providesTags: ['RTOWorkplace'],
    }),
    wpApprovalRequestCount: builder.query<any, void>({
        query: () => `${PREFIX}/workplace-approval/request/pending/count`,
        providesTags: ['RTOWorkplace'],
    }),
    wpApprovalRequestChangeStatus: builder.mutation<
        any,
        { id: number; status: WpAppRequEnum }
    >({
        query: ({ id, ...params }) => ({
            url: `subadmin/approval-request/${id}/status/update`,
            params,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOWorkplace', 'SubAdminWorkplace'],
    }),
})
