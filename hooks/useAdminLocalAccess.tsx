import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'

/**
 * Custom hook to restrict access to specific pages.
 * Access is granted ONLY if:
 * 1. User role is 'admin'
 * 2. NEXT_PUBLIC_NODE_ENV is 'local'
 * 3. User ID is either 24631 or 20365
 * 
 * Otherwise, the user is redirected back.
 */
export const useAdminLocalAccess = () => {
    const router = useRouter()
    const credentials = getUserCredentials()
    const env = process.env.NEXT_PUBLIC_NODE_ENV
    const allowedIds = [24631, 20365]

    useEffect(() => {
        if (!credentials) {
            router.back()
            return
        }

        const isAdmin = credentials.role === UserRoles.ADMIN
        const isLocal = env === 'local'
        const isAllowedId = allowedIds.includes(Number(credentials.id))

        if (!(isAdmin || isLocal || isAllowedId)) {
            router.back()
        }
    }, [credentials, env, router])
}
