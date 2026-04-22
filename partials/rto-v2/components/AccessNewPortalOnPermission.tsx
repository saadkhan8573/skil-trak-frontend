import { PageNotFound } from '@components'
import { RtoApi } from '@queries'
import { ReactNode, useEffect } from 'react'
import { setRtoDetail, useAppDispatch } from '@redux'
import { RtoLayoutSkeleton } from '../skeletonLoader'

export const AccessNewPortalOnPermission = ({
    children,
}: {
    children: ReactNode
}) => {
    const rto = RtoApi.Rto.useProfile()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (rto?.isSuccess && rto?.data) {
            dispatch(setRtoDetail(rto.data))
        }
    }, [rto?.isSuccess, rto?.data, dispatch])

    if (rto?.isLoading) return <RtoLayoutSkeleton />

    return <>{children}</>
}
