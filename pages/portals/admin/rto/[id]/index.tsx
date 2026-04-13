import { EmptyData, TechnicalError } from '@components'
import { useAlert, useContextBar, useNavbar } from '@hooks'
import { AdminLayout } from '@layouts'
import { RtoProfileDetail, RtoProfileSkeleton } from '@partials'
import {
    ProfileViewContextBar,
    ProfileViewContextBarSkeleton,
} from '@partials/admin/rto/UpdatedRtoProfileDetail/ProfileViewContextBar'
import { AdminApi } from '@queries'
import { UserStatus } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'

const RtoProfile = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const router = useRouter()

    const navBar = useNavbar()
    const contextBar = useContextBar()

    const { alert: alertMessage, setAlerts, alerts } = useAlert()

    const rto = AdminApi.Rtos.useDetailQuery(Number(router.query.id), {
        skip: !router.query?.id,
        refetchOnMountOrArgChange: true,
    })

    useEffect(() => {
        navBar.setTitle('RTO Detail')
        navBar.setSubTitle(rto?.data?.user?.name)
    }, [rto.data])

    useEffect(() => {
        if (rto?.isSuccess && rto?.data) {
            const showAlert = () => {
                switch (rto?.data?.user?.status) {
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
    }, [rto])

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
        if (rto?.isLoading) {
            contextBar.setContent(<ProfileViewContextBarSkeleton />)
            contextBar.show(false)
        } else if (rto?.isSuccess) {
            contextBar.setContent(<ProfileViewContextBar rto={rto?.data} />)
            contextBar.show(false)
        }

        return () => {
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [rto?.data, mousePosition, rto?.isLoading, rto?.isSuccess])
    return (
        <div>
            {rto.isError && <TechnicalError />}
            {rto?.isLoading ? (
                <RtoProfileSkeleton />
            ) : rto.data ? (
                <RtoProfileDetail rto={rto?.data} />
            ) : (
                !rto.isError &&
                rto.isSuccess && (
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
    return <AdminLayout>{page}</AdminLayout>
}

export default RtoProfile
