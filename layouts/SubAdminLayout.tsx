import {
    DisplayAlerts,
    PageTitle,
    PageTitleProps,
    RedirectRestrictedUsers,
    RedirectUnApprovedUsers,
    SubAdminNavbar,
} from '@components'
import { useContextBar, useJoyRide } from '@hooks'
import { UsersPendingEsignModal } from '@partials/eSign/modal/UsersPendingEsignModal'
import { CommonApi, SubAdminApi } from '@queries'
import { EsignDocumentStatus, getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import Joyride from 'react-joyride'
import { UserLayout } from './UserLayout'
import Head from 'next/head'
import { UserRoles } from '@constants'
import { SubAdminLayoutSkeleton } from '@partials/sub-admin/skeletonLoader/SubAdminLayoutSkeleton'

interface SubAdminLayoutProps {
    pageTitle?: PageTitleProps
    children: ReactNode
}

const getBasePath = `/portals/sub-admin`
const urls = [
    `/students`,
    `/students/[id]/detail`,
    `/users/rtos`,
    `/users/rtos/[id]`,
    `/users/industries`,
    `/users/industries/[id]`,
    `/tasks/workplace`,
    `/history`,
    `/e-sign`,
    `/e-sign/[id]`,
    `/volunteer-requests`,
    `/report`,
    `/setting`,
    `/tasks/appointments`,
    `/tasks/appointments/create-appointment`,
    `/tasks/appointments/set-schedule`,
    `/tasks/appointments/set-unavailability`,
    `/tasks/assessment-evidence`,
    `/notifications/e-mails`,
    `/notifications/bulk-email`,
    `/email-draft`,
    `/create-email-draft`,
    `/notifications/all-notifications`,
    `/tasks/my-students-report`,
    `/tasks/industry-listing`,
]

const redirectUrls = urls?.map((url: string) => `${getBasePath}${url}`)

export const SubAdminLayout = ({
    pageTitle,
    children,
}: SubAdminLayoutProps) => {
    const [mounted, setMounted] = useState(false)
    const joyride = useJoyRide()

    const router = useRouter()

    const [modal, setModal] = useState<ReactElement | null>(null)

    const role = getUserCredentials()?.role

    const { viewAgreementModal, setViewAgreementModal } = useContextBar()

    const subadmin = SubAdminApi.SubAdmin.useProfile(undefined, {
        skip: role !== UserRoles.SUBADMIN,
        refetchOnMountOrArgChange: true,
    })
    const pendingDocuments = CommonApi.ESign.usePendingDocumentsList(
        {
            status: [EsignDocumentStatus.PENDING, EsignDocumentStatus.ReSign],
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (pendingDocuments.isSuccess) {
            const route = `/portals/student/assessments/e-sign/${pendingDocuments?.data?.[0]?.id}`

            if (
                pendingDocuments?.data &&
                viewAgreementModal === 0 &&
                pendingDocuments?.data?.length > 0 &&
                router?.pathname !== `/portals/sub-admin/e-sign/[id]`
            ) {
                setModal(
                    <UsersPendingEsignModal
                        documents={pendingDocuments?.data}
                        onClick={() => router.push(route)}
                        route="/portals/sub-admin/e-sign"
                        onCancel={() => {
                            setViewAgreementModal((view: number) =>
                                Number(view + 1)
                            )
                            setModal(null)
                        }}
                    />
                )
            } else if (router?.pathname === `/portals/sub-admin/e-sign/[id]`) {
                setModal(null)
            }
        } else {
            setModal(null)
        }
    }, [pendingDocuments, router, viewAgreementModal])
    // const MemoNavbar = React.memo(SubAdminNavbar)

    const getRoutePath = (path: string) => `${getBasePath}${path}`

    const urlsData = {
        canAccessRtoProfile: [
            getRoutePath('/users/rtos/[id]'),
            getRoutePath('/users/rtos/[id]/detail'),
        ],
        canViewRtoList: getRoutePath('/users/rtos'),
    }

    const urls = () => {
        let updatedUrl: string[] = []
        if (subadmin?.data && subadmin?.isSuccess) {
            Object.keys(urlsData as any)?.forEach((key: any) => {
                if (!(subadmin?.data as any)?.[key]) {
                    if (Array.isArray((urlsData as any)?.[key])) {
                        updatedUrl.push(...(urlsData as any)?.[key])
                    } else {
                        updatedUrl.push((urlsData as any)?.[key])
                    }
                }
            })
        }
        return updatedUrl
    }

    if (subadmin.isLoading) {
        return <SubAdminLayoutSkeleton />
    }

    return (
        <RedirectRestrictedUsers
            getRoutePath={getBasePath}
            redirectUrls={urls()}
        >
            <RedirectUnApprovedUsers
                getRoutePath={getBasePath}
                redirectUrls={redirectUrls}
            >
                <UserLayout>
                    <>
                        {modal}

                        <Head>
                            <title>{pageTitle?.title}</title>
                        </Head>

                        <div className="px-2 lg:px-8">
                            <div className="mb-2">
                                <SubAdminNavbar />
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
                            <div id="main-content-scroll">{children}</div>
                        </div>
                        {mounted && (
                            <Joyride
                                callback={joyride.state.callback}
                                continuous
                                run={joyride.state.run}
                                stepIndex={joyride.state.stepIndex}
                                steps={joyride.state.steps}
                                showSkipButton={true}
                                // hideCloseButton={true}
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
        </RedirectRestrictedUsers>
    )
}
