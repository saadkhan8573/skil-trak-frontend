import { AdminApi } from '@queries'

export const useUserPermissions = ({
    userId,
    anotherUserId,
}: {
    userId?: number
    anotherUserId?: number
}) => {
    const allPermissions = AdminApi.Permissions.useListQuery({
        all: true,
        limit: 1000,
    })

    // Fetch userId's permissions (or current user if userId not provided)
    const userPermissions = AdminApi.Permissions.useMyPermissions(userId)

    // If anotherUserId is provided, fetch that user's permissions too
    // Always call the hook, but skip the request if anotherUserId is not provided
    const anotherUserPermissions = AdminApi.Permissions.useMyPermissions(
        anotherUserId,
        {
            skip: !anotherUserId,
        }
    )

    return {
        allPermissions,
        userPermissions,
        anotherUserPermissions,
    }
}
