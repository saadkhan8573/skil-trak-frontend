import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'students'
export const coursesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getStudentCourses: builder.query<any, void>({
        query: (params: any) => {
            return {
                url: `${PREFIX}/courses/view`,
                params,
            }
        },
        providesTags: ['StudentCourses'],
    }),
    getStudentCoursesLs: builder.query<any, void>({
        query: (params: any) => {
            return {
                url: `${PREFIX}/courses/list`,
                params,
            }
        },
        providesTags: ['StudentCourses'],
    }),
})
