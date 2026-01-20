export const getDetailedTimeStuck = (createdAt?: string | Date) => {
    if (!createdAt) return 'N/A'

    let diff = Date.now() - new Date(createdAt).getTime()
    if (diff < 0) return 'N/A'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    diff %= 1000 * 60 * 60 * 24
    const hours = Math.floor(diff / (1000 * 60 * 60))
    diff %= 1000 * 60 * 60
    const minutes = Math.floor(diff / (1000 * 60))

    const parts = []
    if (days) parts.push(`${days}d`)
    if (hours) parts.push(`${hours}h`)
    if (minutes) parts.push(`${minutes}m`)

    return parts.join(' ') || 'Just now'
}

// utils/profileRoutes.ts
type Role = 'admin' | 'subadmin' | 'rto'
type Origin = 'STUDENT' | 'INDUSTRY'

export const getProfileUrl = ({
    role,
    origin,
    studentId,
    industryId,
}: {
    role: Role
    origin: Origin
    studentId?: number | string
    industryId?: number | string
}) => {
    if (origin === 'STUDENT' && studentId !== null) {
        const studentRoutes: Record<Role, string> = {
            admin: `/portals/admin/student/${studentId}/detail`,
            subadmin: `/portals/sub-admin/students/${studentId}/detail`,
            rto: `/portals/rto/students-and-placements/all-students/${studentId}/detail`,
        }

        return studentRoutes[role]
    }

    if (origin === 'INDUSTRY' && industryId !== null) {
        const industryRoutes: Record<Role, string> = {
            admin: `/portals/admin/industry/${industryId}`,
            subadmin: `/portals/sub-admin/users/industries/${industryId}`,
            rto: `/portals/rto/manage/industries/${industryId}/detail`,
        }

        return industryRoutes[role]
    }

    return '#'
}

export const getPlacementProfileUrl = ({
    role,
    origin,
    workplaceRequestId,
    studentId,
}: {
    role: Role
    origin: Origin
    workplaceRequestId?: number | string
    studentId?: number | string
}) => {
    if (!workplaceRequestId || !studentId) return '#'

    const placementRoutes: Record<Role, string> = {
        admin: `/portals/admin/workplaces/${workplaceRequestId}/${studentId}`,
        subadmin: `/portals/sub-admin/tasks/workplace/${workplaceRequestId}/${studentId}`,
        rto: `/portals/rto/students-and-placements/placement-requests/${workplaceRequestId}/${studentId}`,
    }

    return placementRoutes[role]
}
