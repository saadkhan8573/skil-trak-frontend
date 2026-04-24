import { IWorkplaceIndustries } from '@redux/queryTypes'
import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'students/'
export const studentsWorkplaceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getStudentWorkplaceList: builder.query<IWorkplaceIndustries[], number>({
        query: (id) => `${PREFIX}${id}/workplaces`,
        providesTags: ['StudentsWorkplace'],
    }),

    getStudentWorkplaceCount: builder.query<
        {
            pending: number
            placementCompleted: number
            placementStarted: number
        },
        number
    >({
        query: (id) => `${PREFIX}${id}/workplaces/count`,
        providesTags: ['StudentsWorkplace'],
    }),
    // students/workplace-requests/student/${id}/interview-availability/get
    getIndustryAvailabilityForStudent: builder.query<any, any>({
        query: (id) => ({
            // url: `students/workplace-requests/workplace/${id}/interview-availability/get`,
            url: `students/workplace-requests/student/${id}/interview-availability/get`,
        }),
        providesTags: ['RTOIndustries', 'StudentsWorkplace'],
    }),
    getStudentWorkplacesByCourse: builder.query<
        IWorkplaceIndustries[],
        { id: number; courseId: number }
    >({
        query: ({ id, courseId }) =>
            `${PREFIX}${id}/course/${courseId}/workplaces-list`,
        providesTags: ['StudentsWorkplace'],
    }),
    getStudentProfileWorkplaceApprovalRequest: builder.query<any, any>({
        query: (id) => `students/${id}/workplace/approval-request/get`,
        providesTags: ['Workplace'],
    }),
})
