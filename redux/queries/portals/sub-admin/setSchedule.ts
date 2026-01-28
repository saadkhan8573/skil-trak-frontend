import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'subadmin'
export const setScheduleEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    setSchedule: builder.mutation<any, any | null>({
        query: (body: any) => {
            return {
                url: `${PREFIX}/schedule/add`,
                method: 'POST',
                body,
            }
        },
        invalidatesTags: ['SetSchedule'],
    }),
    setScheduledList: builder.query<any, void>({
        query: () => `${PREFIX}/availabilities/list`,
        providesTags: ['SetSchedule'],
    }),
})
