import {
    DisplayAlerts,
    PageTitle,
    PageTitleProps,
    RedirectUnApprovedUsers,
    RtoNavbar,
    usePermissions,
} from '@components'
import { useAlert, useContextBar, useJoyRide } from '@hooks'
import { UsersPendingEsignModal } from '@partials/eSign/modal/UsersPendingEsignModal'
import { CommonApi } from '@queries'
import { EsignDocumentStatus } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import Joyride from 'react-joyride'
import { UserLayout } from './UserLayout'
import { PermissionType } from '@types'

interface RtoLayoutProps {
    pageTitle?: PageTitleProps
    children: ReactNode
}

const getRoutePath = `/portals/rto`

// Redirect Urls When not approved

const urls = [
    `/create`,
    `/students`,
    `/coordinators`,
    `/students/[id]`,
    `/industries/mous`,
    `/coordinators/[id]`,
    `/tasks/appointments`,
    `/industries/workplaces`,
    `/admins/contact-person`,
    `/tasks/assessment-tools`,
    `/industries/mous/[mouDetail]`,
    `/tasks/appointments/create-appointments`,
]
const redirectUrls = urls?.map((url: string) => `${getRoutePath}${url}`)

export const RtoLayout = ({ pageTitle, children }: RtoLayoutProps) => {
    const [mounted, setMounted] = useState(false)
    const joyride = useJoyRide()
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { viewAgreementModal, setViewAgreementModal } = useContextBar()
    const hasPermission = usePermissions({
        permission: PermissionType.ALLOW_OLD_DASHBOARD,
    })

    const pendingDocuments = CommonApi.ESign.usePendingDocumentsList(
        {
            status: [EsignDocumentStatus.PENDING, EsignDocumentStatus.ReSign],
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const otherAllUserSigned = pendingDocuments?.data?.data?.filter(
        (agreement: any) => {
            const allSigned = agreement.signers
                ?.filter((signer: any) => signer?.user?.role !== 'rto')
                ?.every((signer: any) => signer.status === 'signed')

            return allSigned
        }
    )

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!hasPermission) {
            router.replace('/portals/rto/dashboard')
        }
    }, [hasPermission])

    useEffect(() => {
        if (
            otherAllUserSigned &&
            pendingDocuments.isSuccess &&
            otherAllUserSigned?.length > 0
        ) {
            const route = `/portals/student/assessments/e-sign/${otherAllUserSigned?.[0]?.id}`

            if (
                pendingDocuments?.data?.data &&
                viewAgreementModal === 0 &&
                pendingDocuments?.data?.data?.length > 0 &&
                router?.pathname !== `/portals/rto/tasks/e-sign/[id]`
            ) {
                setModal(
                    <UsersPendingEsignModal
                        documents={pendingDocuments?.data?.data}
                        onClick={() => router.push(route)}
                        route="/portals/rto/tasks/e-sign"
                        onCancel={() => {
                            setViewAgreementModal((view: number) =>
                                Number(view + 1)
                            )
                            setModal(null)
                        }}
                    />
                )
            } else if (router?.pathname === `/portals/rto/tasks/e-sign/[id]`) {
                setModal(null)
            }
        } else {
            setModal(null)
        }
    }, [pendingDocuments, router])

    if (!mounted) {
        return <></>
    }

    return (
        <RedirectUnApprovedUsers
            getRoutePath={getRoutePath}
            redirectUrls={redirectUrls}
        >
            <UserLayout>
                <>
                    {modal}

                    <div className="px-8">
                        <div className="mb-4">
                            <RtoNavbar />
                            <DisplayAlerts />
                        </div>
                        {pageTitle && pageTitle.title && (
                            <div className="mb-6">
                                <PageTitle
                                    title={pageTitle.title}
                                    navigateBack={pageTitle?.navigateBack}
                                    backTitle={pageTitle?.backTitle}
                                />
                            </div>
                        )}
                        <div>{children}</div>
                    </div>
                    {mounted && (
                        <Joyride
                            callback={joyride.state.callback}
                            continuous
                            run={joyride.state.run}
                            stepIndex={joyride.state.stepIndex}
                            steps={joyride.state.steps}
                            showSkipButton={true}
                            disableScrollParentFix
                            disableOverlayClose={true}
                            hideBackButton={true}
                            locale={{
                                skip: 'Close Tour',
                            }}

                            // styles={{
                            //     options: {
                            //         arrowColor: theme.black,
                            //         backgroundColor: theme.black,
                            //         primaryColor: theme.colors.purple,
                            //         textColor: theme.white,
                            //     },
                            // }}
                        />
                    )}
                </>
            </UserLayout>
        </RedirectUnApprovedUsers>
    )
}
