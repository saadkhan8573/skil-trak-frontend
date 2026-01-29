import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginationValues } from '@types'

const PREFIX = 'subadmin'
export const profileEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    myProfile: builder.query<any, void>({
        query: () => `${PREFIX}/me/profile`,
        providesTags: ['SubAdmin'],
    }),
    globalSearchList: builder.query<any, PaginationValues & { search: string }>(
        {
            query: (params) => ({
                url: `${PREFIX}/search/all`,
                params,
            }),
            providesTags: ['SubAdmin'],
        }
    ),
    updateSubAdminProfile: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/profile/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SubAdmin'],
    }),
    saveCoordinatesForMap: builder.mutation<any, any>({
        query: (body) => ({
            url: `preferences/map/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Coordinates'],
    }),
    getSavedCoordinates: builder.query<any, void>({
        query: () => `preferences/map/coordinates/get`,
        providesTags: ['Coordinates'],
    }),
    // map/get
    getSubAdminMapStudents: builder.query<any, any>({
        query: (params) => {
            return {
                url: `${PREFIX}/students/list/for-map`,
                params,
            }
        },
        providesTags: ['SubAdmin'],
    }),
    getSubAdminMapIndustries: builder.query<any, any>({
        query: (params) => {
            return {
                url: `${PREFIX}/industries/list/for-map`,
                params,
            }
        },
        providesTags: ['SubAdmin', 'SubAdminIndustries'],
    }),

    getSubAdminRtosForMap: builder.query<any, void>({
        query: () => {
            return {
                url: `${PREFIX}/rtos/list/for-map`,
            }
        },
        providesTags: ['SubAdmin'],
    }),
    getSubAdminStudentSuburbsForMap: builder.query<any, void>({
        query: () => {
            return {
                url: `${PREFIX}/students/suburb/for-map`,
            }
        },
        providesTags: ['SubAdmin'],
    }),
    getSubAdminMapStudentDetail: builder.query<any, any>({
        query: (id) => ({
            url: `students/student/${id}/detail/for-map`,
            // params,
        }),
        providesTags: ['SubAdmin', 'Workplace', 'Industries'],
    }),
    assignCoordinatorToStudent: builder.mutation<any, any>({
        query: ({ studentId, coordinatorId }) => ({
            url: `${PREFIX}/student/${studentId}/coordinator/${coordinatorId}/assign`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Students', 'SubAdminStudents', 'SubAdmin'],
    }),
})
