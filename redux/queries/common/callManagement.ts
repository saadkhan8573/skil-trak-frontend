import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginatedResponse, PaginationWithSearch, Student } from '@types'
import { PlacementCall } from 'types/placement-call.type'

export const callManagementLoginEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getAllAiCallList: builder.query<
        PaginatedResponse<PlacementCall>,
        PaginationWithSearch
    >({
        query: (params) => {
            return {
                url: `ai-voice-calls/summaries/list`,
                params,
            }
        },
        providesTags: ['CallManagement'],
    }),

    getAiCallStatistics: builder.query<
        {
            totalCalls: number
            resoved: number
            pending: number
            scheduled: number
        },
        void
    >({
        query: () => {
            return {
                url: `ai-voice-calls/summaries/get-stastistics`,
            }
        },
        providesTags: ['CallManagement'],
    }),
    getCallRecording: builder.query<{ url: string }, string>({
        query: (callId) => ({
            url: `ai-voice-calls/${callId}/recording-get`,
        }),
        providesTags: ['CallManagement'],
    }),

    completeCall: builder.mutation<any, string>({
        query: (callId) => ({
            url: `ai-voice-calls/${callId}/update-status`,
            method: 'PATCH',
        }),
        invalidatesTags: ['CallManagement'],
    }),

    getStudentsToCallList: builder.query<
        PaginatedResponse<Student>,
        PaginationWithSearch
    >({
        query: (params) => {
            return {
                url: `shared/students/without-workplace-requests`,
                params,
            }
        },
        providesTags: ['CallManagement'],
    }),

    initiateAiCall: builder.mutation<
        any,
        { studentId: number; courseId: number }
    >({
        query: ({ studentId, courseId }) => ({
            url: `ai-voice-calls/student/${studentId}/make-call`,
            method: 'POST',
            body: { courseId },
        }),
        invalidatesTags: ['CallManagement'],
    }),

    scheduleAiCall: builder.mutation<
        any,
        {
            studentId: number
            course: number
            scheduledAt: string
            phone: string
            isSchedualed: boolean
        }
    >({
        query: ({ studentId, course, scheduledAt, phone, isSchedualed }) => ({
            url: `ai-voice-calls/student/${studentId}/schedule-call`,
            method: 'POST',
            body: { course, scheduledAt, phone, isSchedualed },
        }),
        invalidatesTags: ['CallManagement'],
    }),

    bulkScheduleAiCall: builder.mutation<
        any,
        {
            studentIds: number[]
            course: number
            scheduledAt: string
            studentPhones: string[]
            isSchedualed: boolean
        }
    >({
        query: (body) => ({
            url: `ai-voice-calls/bulk-schedule-call`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['CallManagement'],
    }),

    getScheduledAiCallList: builder.query<
        PaginatedResponse<any>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `ai-voice-calls/scheduled-calls/list`,
            params,
        }),
        providesTags: ['CallManagement'],
    }),
})
