import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

const PREFIX = 'rtos/'
export const coursesEndPoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    rtoCourses: builder.query<any, void>({
        query: () => `${PREFIX}courses/list`,
        providesTags: ['RTOCourses', 'RTO', 'RTO-V2-Courses'],
    }),

    addCourseDocument: builder.mutation<any, any>({
        query: ({ body, params }) => ({
            url: `${PREFIX}document/add`,
            method: 'POST',
            body,
            params,
        }),
        invalidatesTags: ['RTOCourses', 'RTO'],
    }),

    createRtoWpType: builder.mutation<
        any,
        { id: number; name: string; workplaceTypeId?: number }
    >({
        query: ({ id, workplaceTypeId, ...body }) => ({
            url: `${PREFIX}course/${id}/workplace-type/create`,
            method: 'POST',
            params: { workplaceTypeId },
            body,
        }),
        invalidatesTags: ['RTOCourses', 'RTO'],
    }),

    updateFacilityChecklist: builder.mutation<any, any>({
        query: ({ body, id }) => {
            return {
                url: `${PREFIX}course-file/${id}/facility-checklist-update`,
                method: 'PATCH',
                body,
            }
        },
        invalidatesTags: ['RTOCourses', 'RTO'],
    }),
    updateAgreementFile: builder.mutation<any, any>({
        query: ({ body, id }) => {
            return {
                url: `${PREFIX}course-file/${id}/agreement-update`,
                method: 'PATCH',
                body,
            }
        },
        invalidatesTags: ['RTOCourses', 'RTO'],
    }),
    updateLogbookFile: builder.mutation<any, any>({
        query: ({ body, id }) => {
            return {
                url: `${PREFIX}logbook-file/${id}/update`,
                method: 'PATCH',
                body,
            }
        },
        invalidatesTags: ['RTOCourses', 'RTO'],
    }),

    // rtos/summary/:id/summary/update
    updateCourseSummary: builder.mutation<any, any>({
        query: ({ body, id }) => ({
            url: `${PREFIX}summary/${id}/summary/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RTOCourses', 'RTO'],
    }),
    // rtos/summary/:id/tasks-add
    addCourseHighlightedTask: builder.mutation<any, any>({
        query: ({ body, id }) => ({
            url: `${PREFIX}summary/${id}/tasks-add`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RTOCourses', 'RTO'],
    }),
    // rtos/summary/:id/tasks-remove
    removeCourseHighlightedTask: builder.mutation<any, any>({
        query: ({ body, id, params }) => ({
            url: `${PREFIX}summary/${id}/highlighted-task/remove`,
            method: 'PATCH',
            body,
            params,
        }),
        invalidatesTags: ['RTOCourses', 'RTO'],
    }),

    // rtos/summary/:id/differnces-add
    addAICourseDifference: builder.mutation<any, any>({
        query: ({ body, id }) => ({
            url: `${PREFIX}summary/${id}/differnces-add`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RTOCourses', 'RTO', 'RTO-V2-Courses'],
    }),
    // rtos/summary/:id/differnces/remove
    removeAICourseDifference: builder.mutation<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}summary/${id}/differnces/remove`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['RTOCourses', 'RTO'],
    }),

    // rtos/course/:id/workplace-types
    getCourseWorkplaceTypes: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}course/${id}/workplace-types`,
        }),
        providesTags: ['RTOCourses', 'RTO'],
    }),

    updateSupervisorRequirements: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}course/supervisor/qualification-add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOCourses', 'RTO'],
    }),

    setupConfirmationPercentage: builder.query<any, any>({
        query: (id) => `${PREFIX}course/${id}/setup-confirmation`,
        providesTags: ['RTOCourses', 'RTO'],
    }),
})
