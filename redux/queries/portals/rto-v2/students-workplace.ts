import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { IWorkplaceIndustries } from 'redux/queryTypes'

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

    getStudentWorkplacesByCourse: builder.query<
        IWorkplaceIndustries[],
        { id: number; courseId: number }
    >({
        query: ({ id, courseId }) =>
            `${PREFIX}${id}/course/${courseId}/workplaces-list`,
        providesTags: ['StudentsWorkplace'],
    }),
})
