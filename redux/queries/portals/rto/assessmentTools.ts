import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'rtos'
export const assessmentToolsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getAssessmentToolByCourse: builder.query<
        any,
        { id: number; status: string }
    >({
        query: ({ id, status }) => ({
            url: `${PREFIX}/course-assessment-tool/list/${id}`,
            params: { status },
        }),
        providesTags: ['RtoAssessmentToolsList'],
    }),
    createRtoAssessmentTools: builder.mutation<any, any>({
        query: (body) => {
            return {
                url: `${PREFIX}/course-assessment-tool/create`,
                method: 'POST',
                body,
            }
        },
        invalidatesTags: ['RtoAssessmentToolsList'],
    }),
    getAssessmentTool: builder.query<any, string>({
        query: (status: string) => {
            return {
                url: `${PREFIX}/assessment-tool/list`,
                params: { status },
            }
        },
        providesTags: ['RtoAssessmentToolsList'],
    }),
    getAssessmentToolDetail: builder.query<any, number | null>({
        query: (id: number | null) => `${PREFIX}/assessment-tool/${id}`,
        providesTags: ['RtoAssessmentToolsList'],
    }),
    // getAssessmentToolCourses: builder.query<any, number | null>({
    //     query: (id: number | null) => {
    //         return {
    //             url: `${PREFIX}/rtos/assessmenttool/${id}`,
    //         }
    //     },
    //     providesTags: ['RtoAssessmentToolsList'],
    // }),

    updateAssessmentToolArchive: builder.mutation<any, any | null>({
        query: (id: any) => {
            return {
                url: `${PREFIX}/assessment-tool/archived/${id}`,
                method: 'PATCH',
            }
        },
        invalidatesTags: ['RtoAssessmentToolsList'],
    }),
    removeRTOAssessmentTools: builder.mutation<any, any | null>({
        query: (id: any) => ({
            url: `${PREFIX}/assessment-tool/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['RtoAssessmentToolsList'],
    }),
})
