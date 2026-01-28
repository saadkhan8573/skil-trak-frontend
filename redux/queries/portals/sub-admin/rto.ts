import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { Course, Rto, RtoStatsCount } from '@types'

const PREFIX = 'subadmin'
export const subAdminRtoEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    subadminRtoStatisticsCount: builder.query<RtoStatsCount, number>({
        query: (id) => `${PREFIX}/rto/dashboard/count/${id}`,
        providesTags: ['RTOS'],
    }),
    getSubAdminRtos: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/rtos/list`,
            params,
        }),
        providesTags: ['SubAdminRtos', 'RTOS'],
    }),
    getSubAdminRtosFilterList: builder.query<Rto[], void>({
        query: () => `${PREFIX}/rtos/filter-list`,
        providesTags: ['SubAdminRtos'],
    }),
    getSubAdminRTODetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/rto/profile/${id}`,
        providesTags: ['SubAdminRtos'],
    }),
    getSubAdminRTOStatistics: builder.query<any, number>({
        query: (id) => `${PREFIX}/rto/${id}/dashboard/count`,
        providesTags: ['SubAdminRtos'],
    }),
    getSubAdminRtosStudents: builder.query<
        any,
        { id: number; skip: number; limit: number }
    >({
        query: (params) => ({
            url: `${PREFIX}/rto/students/list/${params.id}`,
            params,
        }),
        providesTags: ['SubAdminRtos'],
    }),
    getSubAdminRtoAppointments: builder.query<any, string>({
        query: (id) => ({
            url: `${PREFIX}/rto/appointments/${id}`,
            params: { id },
        }),
        providesTags: ['SubAdminRtos'],
    }),

    updateSubAdminRtoStudentStatus: builder.mutation<any, any | null>({
        query: ({ id, status }: any) => ({
            url: `${PREFIX}/student/update-status/${id}`,
            method: 'PATCH',
            body: { status },
        }),
        invalidatesTags: ['SubAdminRtos'],
    }),
    getRTOAssessmentTools: builder.query<
        any,
        { id: number; rtoId: number; status: string }
    >({
        query: ({ id, rtoId, status }) => ({
            // url: `${PREFIX}/rto/assessment-tool/list/${id}`,
            url: `${PREFIX}/rto/assessment-tool/list/${rtoId}/${id}`,
            params: { status },
        }),
        providesTags: ['SubAdminRtos'],
    }),
    getSubAdminRTOCourses: builder.query<Course[], number>({
        query: (id) => `${PREFIX}/rto/courses/${id}`,
        providesTags: ['SubAdminRtos'],
    }),
    createRtoSubAdminAssessmentTools: builder.mutation<any, any | null>({
        query: ({ body, id }) => ({
            url: `${PREFIX}/rto/assessment-tool/create/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdminRtos'],
    }),
    updateRtoSubAdminAssessmentTools: builder.mutation<any, any | null>({
        query: ({ body, assessment }) => ({
            url: `${PREFIX}/rto/assessment-tool/update/${assessment}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SubAdminRtos'],
    }),
    updateSubAdminAssessmentToolArchive: builder.mutation<any, any | null>({
        query: (id: any) => ({
            url: `${PREFIX}/rto/assessment-tool/archived/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminRtos'],
    }),
    removeSubAdminRTOAssessmentTools: builder.mutation<any, any | null>({
        query: (id: any) => ({
            url: `${PREFIX}/rto/assessment-tool/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['SubAdminRtos'],
    }),
    subadminRtoImportStudents: builder.mutation<any, any>({
        query: ({ id, body }: any) => {
            return {
                url: `${PREFIX}/students/import/${id}`,
                method: 'POST',
                body,
            }
        },
        invalidatesTags: ['RTOS'],
    }),

    //============================ RTO Listing ======================== //

    // =====  Notes ============= //
    addRtoListingDetailsNote: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `rtolisting/${id}/note-add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOListing'],
    }),

    getRtoListingNotes: builder.query<any, any>({
        query: (id) => ({
            url: `rtolisting/${id}/notes/list-all`,
        }),
        providesTags: ['RTOListing'],
    }),
    getListingRtoDetails: builder.query<any, any>({
        query: (id) => ({
            url: `rtolisting/${id}`,
        }),
        providesTags: ['RTOListing'],
    }),
    // Mails
    composeListingRtoMail: builder.mutation({
        query: ({ body, id }) => ({
            url: `rtolisting/${id}/mail/send`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['RTOListing'],
    }),
    getListingRtoMails: builder.query<any, any>({
        query: (id) => ({
            url: `rtolisting/${id}/mails-list`,
        }),
        providesTags: ['RTOListing'],
    }),
})
