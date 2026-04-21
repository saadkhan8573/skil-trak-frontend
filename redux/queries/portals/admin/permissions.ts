import {
    IPermission,
    IAssignedPermission,
    PaginatedResponse,
    PaginationWithSearch,
    CreatePermissionDto,
} from '@types'
import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'permissions'

export const permissionEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getPermissions: builder.query<
        PaginatedResponse<IPermission>,
        Partial<
            PaginationWithSearch & { userId?: number; all?: boolean }
        > | void
    >({
        query: (args) => {
            const { limit, skip, search, userId, all } = (args as any) || {}
            return {
                url: `${PREFIX}`,
                params: {
                    limit,
                    skip,
                    search,
                    userId,
                    all,
                },
            }
        },
        providesTags: ['Permissions'],
    }),

    addPermission: builder.mutation<IPermission, CreatePermissionDto>({
        query: (body: CreatePermissionDto) => ({
            url: `${PREFIX}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Permissions'],
    }),

    updatePermission: builder.mutation<
        IPermission,
        { id: number; body: Partial<CreatePermissionDto> }
    >({
        query: ({ id, body }) => ({
            url: `${PREFIX}/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Permissions'],
    }),

    deletePermission: builder.mutation<void, number>({
        query: (id) => ({
            url: `${PREFIX}/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Permissions'],
    }),

    toggleRtoPermission: builder.mutation<
        void,
        {
            userId: string | number
            permissionId: string | number
            userPermissionId?: number
        }
    >({
        query: ({ userId, permissionId, userPermissionId }) => ({
            url: `${PREFIX}/assign-or-revoke`,
            method: 'POST',
            body: { userId, permissionId },
            params: userPermissionId ? { userPermissionId } : {},
        }),
        invalidatesTags: ['Permissions'],
    }),

    getMyPermissions: builder.query<IAssignedPermission[], number | undefined>({
        query: (userId) => ({
            url: `${PREFIX}/my-permissions`,
            params: { userId },
        }),
        providesTags: ['Permissions'],
    }),
})
