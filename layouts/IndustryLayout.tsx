import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import Joyride from 'react-joyride'
// components
import {
    DisplayAlerts,
    IndustryNavbar,
    PageTitle,
    PageTitleProps,
    RedirectUnApprovedUsers,
} from '@components'

// layout
import { UserLayout } from './UserLayout'

// utils
import { useAlert, useContextBar, useJoyRide } from '@hooks'
import { UsersPendingEsignModal } from '@partials/eSign/modal/UsersPendingEsignModal'
import { ProfileModal } from '@partials/industry'
import { IndustryOnboardingFlow } from '@partials/industry-onboarding/IndustryOnboardingFlow'
import { OnboardingPendingScreen } from '@partials/industry-onboarding/components/OnboardingPendingScreen'
import { CommonApi, IndustryApi, useIndustryProfileQuery } from '@queries'
import { UserStatus } from '@types'
import { AuthUtils, EsignDocumentStatus } from '@utils'

const getRoutePath = `/portals/industry`

// Redirect Urls When not approved
const urls = [
    `/required-documents`,
    `/tasks/add-a-schedule`,
    `/tasks/add-a-schedule/schedule`,
    `/tasks/available-shifts`,
    `/students/current-students`,
    `/students/future-candidates`,
    `/students/request-a-volunteer`,
    `/students/appointments`,
    `/students/appointments/book-appointments`,
    `/jobs/advertised-jobs`,
    `/jobs/form`,
    `/jobs/[id]`,
    `/jobs/browse-candidates`,
    `/general-information/unit-requirements`,
    `/general-information/placement-workflow`,
    `/general-information/industry-consultation`,
    `/general-information/consultation`,
    `/general-information/mou`,
    `/e-mails`,
    `/tasks/apply-for-rpl`,
]

const redirectUrls = urls?.map((url: string) => `${getRoutePath}${url}`)

interface IndustryLayoutProps {
    pageTitle?: PageTitleProps
    children: ReactNode
}
export const IndustryLayout = ({
    pageTitle,
    children,
}: IndustryLayoutProps) => {
    const router = useRouter()
    const token = AuthUtils.getToken()
    const status = AuthUtils.getUserCredentials()?.status

    // hooks
    const { alert, setAlerts } = useAlert()
    const joyride = useJoyRide()
    const [mounted, setMounted] = useState(false)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { viewAgreementModal, setViewAgreementModal } = useContextBar()

    const pendingDocuments = CommonApi.ESign.usePendingDocumentsList(
        {
            status: [EsignDocumentStatus.PENDING, EsignDocumentStatus.ReSign],
            skip: 0,
            limit: 50,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    useEffect(() => {
        if (
            token &&
            redirectUrls.includes(router.pathname) &&
            status !== UserStatus.Approved
        ) {
            router.push(getRoutePath)
        }
    }, [router])

    useEffect(() => {
        if (pendingDocuments.isSuccess) {
            const route = `/portals/student/assessments/e-sign/${pendingDocuments?.data?.[0]?.id}`

            if (
                pendingDocuments?.data?.data &&
                viewAgreementModal === 0 &&
                pendingDocuments?.data?.data?.length > 0 &&
                router?.pathname !== `/portals/industry/e-sign/[id]`
            ) {
                setModal(
                    <UsersPendingEsignModal
                        documents={pendingDocuments?.data?.data}
                        onClick={() => router.push(route)}
                        route="/portals/industry/e-sign"
                        onCancel={() => {
                            setViewAgreementModal((view: number) =>
                                Number(view + 1)
                            )
                            setModal(null)
                        }}
                    />
                )
            } else if (
                router?.pathname === `/portals/industry/students/e-sign/[id]`
            ) {
                setModal(null)
            }
        } else {
            setModal(null)
        }
    }, [pendingDocuments, router])

    // ===============================
    // PROFILE COMPLETION START
    // ===============================
    const profile = useIndustryProfileQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })
    const { data: industryProfile, refetch: refetchProfile } =
        IndustryApi.Profile.useIndustryProfileQuery(undefined, {
            refetchOnMountOrArgChange: true,
        })
    const values = { ...profile?.data, ...profile?.data?.user }
    const keys = [
        'name',
        'email',
        'abn',
        'phoneNumber',
        'contactPerson',
        'contactPersonNumber',
        'zipCode',
        'addressLine1',
        // 'courses',
    ]

    let totalValues = keys?.length
    let filledValues = 0
    keys.forEach((key) => {
        const keyValue = values[key as keyof typeof values]
        if (
            keyValue &&
            keyValue != 'NA' &&
            keyValue != 'N/A' &&
            !Array.isArray(keyValue)
        ) {
            filledValues++
        } else if (Array.isArray(keyValue) && keyValue?.length > 0) {
            filledValues++
        }
    })

    const profileCompletion = Math.floor((filledValues / totalValues) * 100)

    useEffect(() => {
        if (profile.isSuccess) {
            if (profileCompletion && profileCompletion < 100) {
                setModal(
                    <ProfileModal
                        profileCompletion={profileCompletion}
                        keys={keys}
                    />
                )
            }
        }
    }, [profileCompletion, profile, router])
    // ===============================
    // PROFILE COMPLETION END
    // ===============================

    useEffect(() => {
        setMounted(true)
    }, [])

    // Show onboarding flow immediately after signup

    if (industryProfile?.showOnboarding) {
        return (
            <UserLayout>
                <IndustryOnboardingFlow
                    id={industryProfile.id}
                    onSuccess={refetchProfile}
                />
            </UserLayout>
        )
    }

    // Show pending approval screen after onboarding is submitted
    if (industryProfile?.user?.status === UserStatus.Pending) {
        return (
            <UserLayout>
                <OnboardingPendingScreen />
            </UserLayout>
        )
    }

    return (
        <RedirectUnApprovedUsers
            getRoutePath={getRoutePath}
            redirectUrls={redirectUrls}
        >
            <UserLayout>
                <>
                    {modal && modal}

                    <div className="md:px-8 px-2 mb-24">
                        <div className="mb-3">
                            <IndustryNavbar
                                pendingDocumentsCount={
                                    pendingDocuments?.data?.length
                                }
                            />
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
                            // hideCloseButton={true}
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
