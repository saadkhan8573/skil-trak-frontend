import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

export const rtosEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getAllRtos: builder.query<any, void>({
        query: () => `filter/rtos/all`,
        providesTags: ['RTO'],
    }),
    getFilterSubAdminRtos: builder.query<any, void>({
        query: () => `subadmin/rtos/list/all`,
        providesTags: ['RTO'],
    }),
    getRtosList: builder.query<any, void>({
        query: () => `shared/rtos/list`,
        providesTags: ['RTO'],
    }),
    getRtoWpTypes: builder.query<any, number>({
        query: (id) => `rtos/course/${id}/workplace-types/list`,
        providesTags: ['RTO'],
    }),
    addRtoWpType: builder.mutation<
        any,
        {
            userId?: number
            courseId: number
            typeIds: number[]
        }
    >({
        query: ({ typeIds, courseId, ...params }) => ({
            url: `rtos/course/${courseId}/workplace-type/add`,
            method: 'POST',
            params,
            body: { typeIds },
        }),
        invalidatesTags: ['RTO', 'RTOCourses', 'Profile', 'RTOS'],
    }),
    removeRtoWpType: builder.mutation<
        any,
        { courseId: number; wpTypeId: number }
    >({
        query: ({ courseId, wpTypeId }) => ({
            url: `rtos/course/${courseId}/workplace-type/${wpTypeId}/remove`,
            method: 'DELETE',
        }),
        invalidatesTags: ['RTO', 'RTOCourses', 'Profile', 'RTOS'],
    }),
    // student/:id/workplace-type/update
    updateStudentWorkplaceType: builder.mutation<
        any,
        { studentId: number; params: any }
    >({
        query: ({ studentId, params }) => ({
            url: `shared/student/${studentId}/workplace-type/update`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['Profile', 'StudentDetail', 'RTO'],
    }),
})
