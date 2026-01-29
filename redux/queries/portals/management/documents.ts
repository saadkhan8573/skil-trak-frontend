import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { DocumentsType } from 'types/documents.type'

const PREFIX = 'management'
export const documentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    // getDocuments: builder.query<DocumentsType[], void>({
    //     query: () => `${PREFIX}/document/list`,
    //     providesTags: ['Documents'],
    // }),
    uploadKpiReport: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/kpi-report/create`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['KpiReportDocument', 'KpiProgress'],
    }),
})
