import { AdminApi } from '@queries'

export const useUserPermissions = (userId?: number) => {
    const allPermissions = AdminApi.Permissions.useListQuery({
        limit: 1000,
    })

    const myPermissions = AdminApi.Permissions.useMyPermissions(userId)

    return {
        allPermissions,
        myPermissions,
    }
}
