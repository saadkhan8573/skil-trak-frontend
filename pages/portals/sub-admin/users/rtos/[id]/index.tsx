import {
    EmptyData,
    LoadingAnimation,
    TechnicalError,
    withPermission,
} from '@components'
import { useAlert, useContextBar, useNavbar } from '@hooks'
import { SubAdminLayout } from '@layouts'
import { RtoProfileDetail } from '@partials'
import { ProfileViewContextBar } from '@partials/admin/rto/UpdatedRtoProfileDetail/ProfileViewContextBar'
import { useGetSubAdminRTODetailQuery } from '@queries'
import { PermissionType, UserStatus } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'

const RtoProfile = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const router = useRouter()

    const navBar = useNavbar()
    const contextBar = useContextBar()

    const { alert: alertMessage, setAlerts, alerts } = useAlert()

    const rtoDetail = useGetSubAdminRTODetailQuery(Number(router.query?.id), {
        skip: !router.query?.id,
        refetchOnMountOrArgChange: true,
    })

    useEffect(() => {
        navBar.setTitle('RTO Detail')
        navBar.setSubTitle(rtoDetail?.data?.user?.name)

        return () => {
            navBar.setTitle('')
        }
    }, [rtoDetail.data])

    useEffect(() => {
        if (rtoDetail?.isSuccess && rtoDetail?.data) {
            const showAlert = () => {
                switch (rtoDetail?.data?.user?.status) {
                    case UserStatus.Pending:
                        alertMessage.warning({
                            title: 'RTO is Pending',
                            description: 'RTO is Pending',
                            autoDismiss: false,
                        })
                        break
                    case UserStatus.Archived:
                        alertMessage.warning({
                            title: 'RTO is Archived',
                            description: 'RTO is Archived',
                            autoDismiss: false,
                        })
                        break
                    case UserStatus.Rejected:
                        alertMessage.error({
                            title: 'RTO is Rejected',
                            description: 'RTO is Rejected',
                            autoDismiss: false,
                        })
                        break
                    case UserStatus.Blocked:
                        alertMessage.error({
                            title: 'RTO is Blocked',
                            description: 'RTO is Blocked',
                            autoDismiss: false,
                        })
                        break

                    default:
                        break
                }
            }
            if (!alerts?.length) {
                showAlert()
            }
        }

        return () => {
            setAlerts([])
        }
    }, [rtoDetail])

    const handleMouseMove = (event: any) => {
        if (!contextBar.content) {
            setMousePosition({ x: event.clientX, y: event.clientY })
        }
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [contextBar])

    useEffect(() => {
        if (rtoDetail.isSuccess) {
            contextBar.setContent(
                <ProfileViewContextBar rto={rtoDetail?.data} />
            )
            contextBar.show(false)
        }

        return () => {
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [rtoDetail.data, mousePosition])
    return (
        <div>
            {rtoDetail.isError && <TechnicalError />}
            {rtoDetail?.isLoading ? (
                <LoadingAnimation height={'h-[70vh]'} />
            ) : rtoDetail.data ? (
                <RtoProfileDetail rto={rtoDetail?.data} />
            ) : (
                !rtoDetail.isError &&
                rtoDetail.isSuccess && (
                    <EmptyData
                        title={'No RTO Found'}
                        description={'There is no RTO Detail found'}
                    />
                )
            )}
        </div>
    )
}

RtoProfile.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(RtoProfile, {
    permissions: [PermissionType.VIEW_RTO_DETAIL],
})
