import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

import {
    Course,
    CourseWithAssessmentEvidence,
    PaginatedResponse,
    PaginationValues,
    PaginationWithSearch,
    CourseProgramType,
} from '@types'

const PREFIX = 'admin'
export const courseEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    courses: builder.query<
        PaginatedResponse<Course>,
        PaginationWithSearch | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/course/list`,
            params,
        }),
        providesTags: ['Courses'],
    }),

    courseDetail: builder.query<CourseWithAssessmentEvidence, number>({
        query: (id) => `${PREFIX}/course/view/${id}`,
        providesTags: ['Courses'],
    }),

    courseAdd: builder.mutation<Course, Course>({
        query: (body) => ({
            url: `${PREFIX}/course/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Courses'],
    }),

    courseUpdate: builder.mutation<Course, Course>({
        query: (body) => ({
            url: `${PREFIX}/course/update/${body.id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Courses'],
    }),

    courseRemove: builder.mutation<Course, number>({
        query: (id) => ({
            url: `${PREFIX}/course/delete/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Courses'],
    }),

    selectedWpTypes: builder.query<
        PaginatedResponse<Course>,
        PaginationWithSearch | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace/types-list`,
            params,
        }),
        providesTags: ['WorkplaceTypes'],
    }),

    addWpTypesToCourse: builder.mutation<Course, number>({
        query: (id) => ({
            url: `${PREFIX}/course/wp-type/delete/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Courses'],
    }),
    removeWpTypesFromCourse: builder.mutation<Course, number>({
        query: (id) => ({
            url: `${PREFIX}/course/wp-type/delete/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Courses'],
    }),

    // admin/course/id/supersede/toggle
    courseToggleSupersede: builder.mutation<Course, number>({
        query: (id) => ({
            url: `${PREFIX}/course/${id}/supersede-toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Courses'],
    }),

    addCourseProgram: builder.mutation<
        Course,
        { title: string; course: number }
    >({
        query: (body) => ({
            url: `${PREFIX}/course-program/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Courses'],
    }),

    updateCourseProgram: builder.mutation<
        Course,
        { title: string; id: number }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/course-program/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Courses'],
    }),

    courseProgramList: builder.query<
        PaginatedResponse<CourseProgramType>,
        PaginationValues & { id: number }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/course/${id}/programs/list`,
            params,
        }),
        providesTags: ['Courses'],
    }),

    

    deleteHighlightedTask: builder.mutation<Course, number>({
        query: (id) => ({
            url: `${PREFIX}/course/task/${id}/remove`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Courses'],
    }),
})
