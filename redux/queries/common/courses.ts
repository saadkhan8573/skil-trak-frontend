import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

export const coursesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getAllCourses: builder.query<any, void>({
        query: () => `filter/courses/all`,
        providesTags: ['Course'],
    }),
    getAllCoursesByRto: builder.query<any, number>({
        query: (rto) => {
            const params = rto ? { id: rto } : {}
            return {
                url: `appointments/courses/get`,
                params,
            }
        },
        providesTags: ['Course'],
    }),
    getAppointmentCourses: builder.query<any, number>({
        query: (id) => {
            const params = id ? { id } : {}
            return {
                url: `appointments/courses/get/by-user`,
                params,
            }
        },
        providesTags: ['Course'],
    }),
    getCoursesList: builder.query<any, void>({
        query: () => `shared/courses/list`,
        providesTags: ['Course'],
    }),
    getCoursesListBySector: builder.query<any, number>({
        query: (id) => `shared/sector/${id}/courses-list`,
        providesTags: ['Course'],
    }),
    getSubadminCoursesList: builder.query<any, void>({
        query: () => `subadmin/courses/list`,
        providesTags: ['Course'],
    }),
    getSectorWPTypes: builder.query<any, number>({
        query: (id) => `shared/sector/${id}/workplace-types-list`,
        providesTags: ['Course'],
    }),
    getSectorByCourseId: builder.query<any, number>({
        query: (id) => `subadmin/course/${id}/sector`,
        providesTags: ['Course'],
    }),
})
