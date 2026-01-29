import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'department'
export const departmentEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getDepartmentCoordinators: builder.query<any, number[] | undefined>({
        query: (sectorIds) => {
            const params =
                sectorIds && sectorIds?.length > 0 ? { sectorIds } : {}
            return {
                url: `admin/subadmin/list-for-department`,
                params,
            }
        },
        providesTags: ['Departments'],
    }),
    getDepartmentFilterList: builder.query<any, void>({
        query: () => `admin/departments/list`,
        providesTags: ['Departments'],
    }),
    getDepartments: builder.query<any, any>({
        query: (params) => ({
            url: PREFIX,
            params,
        }),
        providesTags: ['Departments'],
    }),

    getDepartmentDetails: builder.query<any, number>({
        query: (id) => `${PREFIX}/${id}`,
        providesTags: ['Departments'],
    }),

    getDeptCoordinatorsList: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}/${id}/members-list`,
            params,
        }),
        providesTags: ['Departments'],
    }),
    getDeptStudentsList: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}/${id}/students/list`,
            params,
        }),
        providesTags: ['Departments'],
    }),
    getDeptCoordinatorsDropdownList: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}/${id}/members`,
        }),
        providesTags: ['Departments'],
    }),
    getDepartmentCounts: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}/${id}/count`,
        }),
        providesTags: ['Departments'],
    }),
    getDepartmentChartStats: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}/${id}/workplace/count`,
        }),
        providesTags: ['Departments'],
    }),
    getSectorsAddingList: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}/${id}/sectors/list`,
        }),
        providesTags: ['Departments'],
    }),
    toggleHod: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/member/${id}/hod-toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Departments'],
    }),
    changeHod: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/member/${id}/make-hod`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Departments'],
    }),
    updateDepartment: builder.mutation<
        any,
        { departmentId: number; email: string }
    >({
        query: ({ departmentId, ...body }) => ({
            url: `${PREFIX}/${departmentId}`,
            body,
            method: 'PATCH',
        }),
        invalidatesTags: ['Departments'],
    }),
    removeDepartmentCoordinator: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/member/${id}/remove`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Departments'],
    }),
    // department/id/courses/list
    departmentCourses: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}/${id}/courses-list`,
        }),
        providesTags: ['Departments'],
    }),

    addDepartment: builder.mutation<any, any>({
        query: (body) => ({
            url: PREFIX,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Departments'],
    }),
    addDepartmentMembers: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/${id}/members/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Departments'],
    }),
    deleteDepartment: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Departments'],
    }),

    // Map
    getDepartmentStudentsForMap: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}/${id}/students/for-map`,
            params,
        }),
        providesTags: ['Departments'],
    }),
    getDepartmentIndustriesForMap: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}/${id}/industries/for-map`,
            params,
        }),
        providesTags: ['Departments'],
    }),
    getDepartmentFutureIndustriesForMap: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}/${id}/future/industries/for-map`,
            params,
        }),
        providesTags: ['Departments'],
    }),
    getStudentsSuburbsForMap: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}/${id}/students/suburbs/for-map`,
            params,
        }),
        providesTags: ['Departments'],
    }),
    // get department sectors
    getDepartmentSectors: builder.query<any, void>({
        query: () => ({
            url: `${PREFIX}/sectors-list`,
        }),
        providesTags: ['Departments'],
    }),

    // Line graph
    getDepartmentLineChartCounts: builder.query<any, any>({
        query: (id) => ({
            url: `admin/${PREFIX}/${id}/students-count`,
            // params,
        }),
        providesTags: ['Departments'],
    }),
})
