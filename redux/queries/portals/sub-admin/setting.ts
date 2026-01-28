import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'subadmin'
export const subAdminSettingEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getSettingData: builder.query<any, void>({
        query: () => ({
            url: `${PREFIX}/settings/get`,
        }),
        providesTags: ['Setting'],
    }),
    subAdminSetting: builder.mutation<any, any | null>({
        query: (setting: any) => {
            return {
                url: `${PREFIX}/settings/update`,
                method: 'PATCH',
                params: { setting },
            }
        },
        invalidatesTags: ['Setting'],
    }),
})
