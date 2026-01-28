import { StudentFeedbackType } from '@partials/common/StudentProfileDetail/components/Workplace/enum'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = `users`

export const studentFeedbackEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    studentFeedback: builder.mutation<
        any,
        {
            rating: number
            course: number
            student: number
            industry: number
            workplaceRequest: number
            type?: StudentFeedbackType
            questions: { question: string; answer: string }[]
        }
    >({
        query: (body) => ({
            url: `student-feedback`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Feedback', 'SubAdminWorkplace'],
    }),
    getStudentCoordinatorFeedback: builder.query<
        any,
        { type?: StudentFeedbackType }
    >({
        query: (params) => ({
            url: `student-feedback`,
            params,
        }),
        providesTags: ['Feedback'],
    }),
    submitCoordinatorFeedback: builder.mutation<any, any>({
        query: (body) => ({
            url: `rating`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Rating'],
    }),

    //rating/by-user
    getUserReviewForCoordinator: builder.query<any, void>({
        query: () => ({
            url: `rating/by-user`,
        }),
        providesTags: ['Rating'],
    }),

    getCourseSchedules: builder.query<any, { userId?: number }>({
        query: ({ userId }) => ({
            url: `students/schedules/check`,
            params: userId ? { userId } : undefined,
        }),
        providesTags: ['Rating'],
    }),

    placementFeedback: builder.mutation<any, { stdUserId?: number; body: any }>(
        {
            query: ({ stdUserId, body }) => ({
                url: `rating/placement-feedback`,
                method: 'POST',
                params: stdUserId ? { stdUserId } : undefined,
                body,
            }),
            invalidatesTags: ['Rating'],
        }
    ),
    getPlacementFeedback: builder.query<any, { userId?: number }>({
        query: ({ userId }) => ({
            url: `rating/placement-feedback`,
            params: userId ? { userId } : undefined,
        }),
        providesTags: ['Rating'],
    }),

    // industry feedback from student
    getOverAllIndustryRatingsFromStudent: builder.query<
        { averageRating: number; totalFeedbacks: string },
        { id: number }
    >({
        query: ({ id }) => ({
            url: `rating/for-industry/${id}/over-all`,
        }),
        providesTags: ['IndustryFeedback'],
    }),
    getIndustryFeedbackListFromStudent: builder.query<any, any>({
        query: ({ params }) => ({
            url: `rating/industry/feedbacks`,
            params,
        }),
        providesTags: ['IndustryFeedback'],
    }),
})
