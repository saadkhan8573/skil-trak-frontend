import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { Student } from '@types'

const PREFIX = 'rtos/'
export const dashboardEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    autoWpCount: builder.query<any, void>({
        query: () => `${PREFIX}automatic/count`,
        providesTags: ['RTO'],
    }),

    navBarCounts: builder.query<
        {
            waitingForRto: number
            openIssues: number
            pendingSubmissions: number
            pendingSign: number
            allStudents: number
            appointments: number
            emails: number
            notification: number
            nonContactable: number
            snoozed: number
            placementRequests: number
            skiltrakFlagged: number
        },
        void
    >({
        query: () => `${PREFIX}navbar/counts`,
        providesTags: [
            'RTO',
            'Mails',
            'E-Sign',
            'Appointments',
            'Rto-Students',
            'Notifications',
            'AllNotifications',
        ],
    }),

    last24HoursWp: builder.query<Student[], void>({
        query: () => `${PREFIX}yesterday-automatic/list`,
        providesTags: ['RTO'],
    }),

    rtoDashboardCounts: builder.query<any, void>({
        query: () => `${PREFIX}students/waiting-for-rto/count`,
        providesTags: ['RTO'],
    }),

    aupdateRTOProfile: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: 'rtos/profile/update',
            method: 'PATCH',
            params: { rto: id },
            body,
        }),
        invalidatesTags: ['RTO'],
    }),

    adminMessage: builder.query<any, void>({
        query: () => `${PREFIX}message/by-admin`,
        providesTags: ['RTO'],
    }),
})
