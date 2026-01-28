import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

export const studentAssessmentGalleryEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getAllRtoGalleryStudents: builder.query<
        any,
        { id: number; search: string }
    >({
        query: ({ id, search }) => ({
            url: `shared/rto/students/${id}`,
            params: { search },
        }),
        providesTags: ['RTO'],
    }),
    getAllStudentAssessmentFiles: builder.query<any, number>({
        query: (id) => `shared/student/files/${id}`,
        providesTags: ['RTO'],
    }),
    galleryFileViewDetail: builder.query<any, number>({
        query: (id) => `shared/student/file/view/${id}`,
        providesTags: ['RTO'],
    }),
    makeAsHighPriority: builder.mutation<any, any>({
        query: (id: any) => ({
            url: `shared/high-priority/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: [
            'Students',
            'HighPriority',
            'SubAdminStudents',
            'SubAdminWorkplace',
            'SubAdminStudents',
            'SubAdminStudents',
        ],
    }),
})
