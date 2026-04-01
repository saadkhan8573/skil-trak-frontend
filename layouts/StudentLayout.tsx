import {
    DisplayAlerts,
    GlobalModal,
    PageTitle,
    PageTitleProps,
    PaymentModal,
    RedirectUnApprovedUsers,
    StudentNavbar,
    StudentTimer
} from '@components'

import { useJoyRide } from '@hooks'
import { UsersPendingEsignModal } from '@partials/eSign/modal/UsersPendingEsignModal'
import { AccountExpiredModal } from '@partials/student/Profile/modal/AccountExpiredModal'
import { ProfileModal } from '@partials/student/Profile/modal/ProfileModal'
import { studentProfileKeys } from '@partials/student/components'
import {
    IndustryChecksModal,
    WorkplaceApprovalModal,
} from '@partials/student/workplace/modal'
import {
    CommonApi,
    StudentApi,
    useGetStudentProfileDetailQuery,
    usePayAsNewUserMutation,
} from '@queries'
import { StudentStatusEnum, UserStatus } from '@types'
import { EsignDocumentStatus, getUserCredentials, userStatus } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import Joyride from 'react-joyride'
import { UserLayout } from './UserLayout'

interface StudentLayoutProps {
    pageTitle?: PageTitleProps
    children: ReactNode
}

const getRoutePath = `/portals/student`
const urls = [
    `/workplace/my-workplace`,
    `/workplace/my-workplace/have-workplace`,
    `/workplace/my-workplace/dont-have-workplace`,
    `/workplace/appointments`,
    `/workplace/book-appointment`,
    `/assessments/assessment-evidence`,
    `/assessments/assessment-tools`,
    `/assessments/schedule`,
    `/assessments/schedule/add-schedule`,
    // `/jobs`,
    `/notifications/e-mails`,
    `/notifications/all-notifications`,
    `/assessments/e-sign`,
    `/assessments/e-sign/[id]`,
]

const redirectUrls = urls?.map((url: string) => `${getRoutePath}${url}`)

export const StudentLayout = ({ pageTitle, children }: StudentLayoutProps) => {
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancel = () => {
        setModal(null)
    }
    const userData = getUserCredentials()
    const [newUserPayment, resultNewUserPayment] = usePayAsNewUserMutation()
    const pendingDocuments = CommonApi.ESign.usePendingDocumentsList(
        {
            status: [EsignDocumentStatus.PENDING, EsignDocumentStatus.ReSign],
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )
    const wpApprovalRequest = StudentApi.Workplace.wpApprovalRequest()
    const joyride = useJoyRide()

    useEffect(() => {
        setMounted(true)
    }, [])

    const profile = useGetStudentProfileDetailQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })
    const isRtoSelfPayment = profile?.data?.rto?.allowStudentSelfPayment
    const isSelfRegistered = profile?.data?.isSelfRegistered
    const industryChecks = StudentApi.Workplace.getWpIndustryChecks()

    const values = { ...profile?.data, ...profile?.data?.user }

    // const keys = Object.keys(values)

    let totalValues = studentProfileKeys?.length
    let filledValues = 0
    studentProfileKeys.forEach((key) => {
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
    const onPaymentClick = () => {
        setModal(
            <GlobalModal>
                <PaymentModal onCancel={onCancel} />
            </GlobalModal>
        )
    }

    useEffect(() => {
        if (profile.isSuccess && userData?.status === userStatus.APPROVED) {
            if (
                profileCompletion &&
                userData?.status !== 'pending' &&
                profileCompletion < 100
            ) {
                setModal(
                    <ProfileModal
                        profileCompletion={profileCompletion}
                        keys={studentProfileKeys}
                    />
                )
            } else if (wpApprovalRequest?.data) {
                setModal(
                    <WorkplaceApprovalModal
                        onCancel={onCancel}
                        wpApprovalRequest={wpApprovalRequest?.data}
                    />
                )
            } else if (pendingDocuments.isSuccess) {
                const route = `/portals/student/assessments/e-sign/${pendingDocuments?.data?.[0]?.id}`
                if (
                    pendingDocuments?.data?.data &&
                    pendingDocuments?.data?.data?.length > 0 &&
                    router?.pathname !==
                        `/portals/student/assessments/e-sign/[id]`
                ) {
                    setModal(
                        <UsersPendingEsignModal
                            documents={pendingDocuments?.data?.data}
                            onClick={() => router.push(route)}
                            route="/portals/student/assessments/e-sign"
                        />
                    )
                } else if (
                    router?.pathname ===
                        `/portals/student/assessments/e-sign/[id]` ||
                    (profileCompletion && profileCompletion === 100)
                ) {
                    setModal(null)
                }
            } else if (
                industryChecks?.data &&
                industryChecks?.isSuccess &&
                (industryChecks?.data?.assessmentEvidence?.length > 0 ||
                    industryChecks?.data?.otherDocs?.length > 0)
            ) {
                setModal(
                    <IndustryChecksModal
                        onCancel={onCancel}
                        studentId={profile?.data?.id}
                        industryChecks={industryChecks?.data}
                    />
                )
            } else if (profileCompletion && profileCompletion === 100) {
                setModal(null)
            }
        }
    }, [
        profileCompletion,
        profile,
        pendingDocuments,
        router,
        wpApprovalRequest,
        industryChecks,
    ])

    const isAccountExpiredOrArchived =
        userData?.status === UserStatus.Archived ||
        profile?.data?.studentStatus === StudentStatusEnum.EXPIRED

    return (
        <RedirectUnApprovedUsers
            getRoutePath={getRoutePath}
            redirectUrls={redirectUrls}
        >
            <AccountExpiredModal open={!!isAccountExpiredOrArchived} />
            {modal}
            <UserLayout>
                <>
                    {/* {(talentPoolLink !== '/portals/student/talent-pool' ||
                        mailsLink !== '/portals/student/mails') && (
                        <StudentContextBar />
                    )} */}

                    <div className="px-4 mb-32 md:px-8">
                        <div>
                            <div className="flex items-center gap-x-3 justify-between mb-2">
                                <StudentNavbar />
                                <div className="flex items-center gap-x-5 mt-3">
                                    {profile?.data?.expiryDate && (
                                        <StudentTimer
                                            studentId={profile.data?.user?.id}
                                            date={profile.data?.expiryDate}
                                            oldExpiry={profile?.data?.oldExpiry}
                                        />
                                    )}
                                </div>
                            </div>

                            <DisplayAlerts />
                        </div>
                        {pageTitle && pageTitle.title && (
                            <div className="mb-3">
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
