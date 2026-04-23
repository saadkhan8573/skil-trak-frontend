// useWorldwideStudentDataRestriction.ts
import { usePermissionCheck } from '@components/Permissions'
import { PermissionType } from '@types'

export const useWorldwideStudentDataRestriction = ({
    userId,
}: {
    userId?: number
}) => {
    // Instance 1: is THIS student flagged as restricted?
    const {
        checkPermission: checkRestriction,
        isLoading: isRestrictionLoading,
        isError: isRestrictionError,
    } = usePermissionCheck({ userId, shouldCheckRole: false })

    // Instance 2: does the logged-in user have access to restricted data?
    const {
        checkPermission: checkAccess,
        isLoading: isAccessLoading,
        isError: isAccessError,
    } = usePermissionCheck({})

    // ✅ Both instances must be fully settled before we trust any result
    const isLoading = isRestrictionLoading || isAccessLoading
    const isError = isRestrictionError || isAccessError

    // ✅ Only evaluate when data is ready — avoids stale intermediate values
    const isRestricted =
        !isLoading &&
        !isError &&
        checkRestriction([
            PermissionType.RESTRICT_WORLDWIDE_STUDENT_INFORMATION,
        ])

    const hasAccess =
        !isLoading &&
        !isError &&
        checkAccess(PermissionType.ACCESS_WORLDWIDE_STUDENT_INFORMATION)

    // ✅ Single boolean — the ONLY thing the component needs:
    //    blur while loading, blur if restricted without access, show otherwise
    const shouldBlur = isLoading || isError || (isRestricted && !hasAccess)

    const filterData = <T extends { hasPermission?: boolean }>(
        data: T[]
    ): T[] =>
        data.filter((option) => {
            if (option.hasPermission) {
                return !shouldBlur
            }
            return true
        })

    return {
        shouldBlur,
        hasPermission: !shouldBlur,
        isLoading,
        isError,
        // Still expose these if other consumers need them
        isRestricted,
        hasAccess,
        filterData,
    }
}
