import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { providesTagsOnSuccess } from '@redux/utils'

const PREFIX = 'students'
export const studentsScheduleEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getStudentSchedule: builder.query<
        any,
        { courseId: number; userId?: number; workplace: number }
    >({
        query: ({ courseId, userId, workplace }) => ({
            url: `${PREFIX}/schedule/view`,
            params: { course: courseId, stdUser: userId, workplace },
        }),
        providesTags: ['StudentSchedule', 'SubAdminWorkplace'],
    }),
    getStudentScheduleTimeSlots: builder.query<
        any,
        { scheduleId: number; search: string }
    >({
        query: ({ scheduleId, ...params }) => ({
            url: `${PREFIX}/schedule/${scheduleId}/slots/view`,
            params,
        }),
        providesTags: ['StudentSchedule', 'SubAdminWorkplace'],
    }),

    createStudentSchedule: builder.mutation({
        query: ({ stdUser, ...body }) => ({
            url: `${PREFIX}/schedule/add`,
            method: 'POST',
            params: { stdUser },
            body,
        }),
        invalidatesTags: providesTagsOnSuccess(['StudentSchedule', 'SubAdminWorkplace']),
    }),
    editStudentSchedule: builder.mutation({
        query: ({ id, stdUser, ...body }) => ({
            url: `${PREFIX}/schedule/edit/${id}`,
            method: 'POST',
            params: { stdUser },
            body,
        }),
        invalidatesTags: providesTagsOnSuccess(['StudentSchedule', 'SubAdminWorkplace']),
    }),
    addScheduleNote: builder.mutation<any, any>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/schedule/comment/add/${id}`,
            body,
            method: 'POST',
        }),
        invalidatesTags: ['StudentSchedule'],
    }),
    cancelScheduleShift: builder.mutation<any, { id: number; comment: string }>(
        {
            query: ({ id, comment }) => ({
                url: `${PREFIX}/schedule/cancel/${id}`,
                body: { comment },
                method: 'PATCH',
            }),
            invalidatesTags: ['StudentSchedule'],
        }
    ),
    rescheduleShift: builder.mutation<any, any>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/schedule/re-schedule/slot/${id}`,
            body,
            method: 'PATCH',
        }),
        invalidatesTags: ['StudentSchedule', 'IndustryWorkplace'],
    }),
})
