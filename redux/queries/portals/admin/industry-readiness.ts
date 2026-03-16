import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'admin'
export const industryReadinessEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    // ==================== Student Forecast ================== //
    getStudentForecast: builder.query<any, void>({
        query: () => `forecast/detailed-prediction/students`,
        providesTags: ['StudentForecast'],
    }),
    getForecastList: builder.query<any, any>({
        query: (params) => ({
            url: `forecast`,
            params,
        }),
        providesTags: ['StudentForecast'],
    }),
    // forecast/future/industries
    getForecastFutureIndustriesList: builder.query<any, any>({
        query: (params) => ({
            url: `forecast/future/industries`,
            params,
        }),
        providesTags: ['StudentForecast', 'Industries'],
    }),
    getForecastSignedUpIndustriesList: builder.query<any, any>({
        query: (params) => ({
            url: `forecast/signup/industries`,
            params,
        }),
        providesTags: ['StudentForecast', 'Industries'],
    }),
    //forecast/status/counts
    getForecastCounts: builder.query<any, any>({
        query: (params) => ({
            url: `/forecast/status/counts`,
            params,
        }),
        providesTags: ['StudentForecast'],
    }),
    addDocuments: builder.mutation<any, FormData>({
        query: (body) => ({
            url: `${PREFIX}/document/add`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Documents'],
    }),
})
