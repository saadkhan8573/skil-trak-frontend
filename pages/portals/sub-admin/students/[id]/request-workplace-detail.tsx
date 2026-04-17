import { ReactElement, useEffect, useState } from 'react'

import {
    LoadingAnimation,
    PageTitle,
    StepIndicator,
    TechnicalError,
    withPermission,
} from '@components'

import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout, PermissionType } from '@types'

// query
import { CompleteProfileBeforeWpModal } from '@partials/common/StudentProfileDetail/components'
import {
    Availability,
    IndustrySelection,
    PersonalInfo,
} from '@partials/sub-admin/students'
import { AlreadyWPCreatedModal } from '@partials/sub-admin/students/workplace/requestWorkplaceDetail/modal'
import {
    SubAdminApi,
    useGetSubAdminStudentDetailQuery,
    useGetSubAdminStudentWorkplaceQuery,
} from '@queries'
import { WorkplaceCurrentStatus, checkStudentProfileCompletion } from '@utils'
import { useRouter } from 'next/router'
import { IWorkplaceIndustries } from '@redux/queryTypes'

const RequestWorkplaceDetail: NextPageWithLayout = () => {
    const [active, setActive] = useState(1)
    const [personalInfoData, setPersonalInfoData] = useState({})
    const [availabilities, setAvailabilities] = useState<any | null>(Array())
    const [isCancelled, setIsCancelled] = useState<boolean>(false)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const router = useRouter()
    const { id } = router.query

    const student = useGetSubAdminStudentDetailQuery(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })
    const rtoDetail = SubAdminApi.Student.getStudentRtoDetail(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })
    const workplace = useGetSubAdminStudentWorkplaceQuery(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })

    const courses = SubAdminApi.Student.useCourses(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })

    const values = {
        ...student?.data,
        ...student?.data?.user,
        courses: courses?.data,
        rto: rtoDetail?.data,
    }
    const profileCompletion = checkStudentProfileCompletion(values)

    useEffect(() => {
        if (
            workplace.data &&
            workplace.isSuccess &&
            workplace?.data?.filter(
                (wp: IWorkplaceIndustries) =>
                    wp?.currentStatus !== WorkplaceCurrentStatus.Completed
            )?.length > 1
        ) {
            setModal(<AlreadyWPCreatedModal />)
        } else if (
            profileCompletion &&
            profileCompletion > 0 &&
            profileCompletion < 100
        ) {
            setModal(
                <CompleteProfileBeforeWpModal
                    workplaceType={'request-workplace-detail'}
                />
            )
        } else if (profileCompletion === 100) {
            setModal(null)
        }
    }, [profileCompletion])

    const StepIndicatorOptions = [
        {
            label: 'Personal Info',
            visited: false,
            last: false,
        },
        {
            label: 'General Availability',
            visited: false,
            last: false,
        },
        {
            label: 'Select Industry',
            visited: false,
            last: false,
        },
        {
            label: 'Placement Progress',
            visited: false,
            last: true,
        },
    ]

    return (
        <>
            {modal}
            <PageTitle
                title="Request Workplace Detail"
                backTitle="Student Detail"
            />

            <div className="mt-10">
                {workplace.isError && <TechnicalError />}
                {workplace.isLoading || workplace?.isFetching ? (
                    <LoadingAnimation />
                ) : (
                    !workplace?.isError && (
                        <div className="flex gap-x-5 w-full">
                            {/* <GoBackButton>Workplace Choice</GoBackButton> */}

                            {/*  */}
                            <div className="py-4 w-[25%]">
                                <StepIndicator
                                    steps={StepIndicatorOptions}
                                    currentStep={
                                        StepIndicatorOptions[active - 1]
                                    }
                                    vertical
                                />
                            </div>

                            <div className="w-[75%]">
                                {active === 1 && (
                                    <PersonalInfo
                                        setActive={setActive}
                                        setPersonalInfoData={
                                            setPersonalInfoData
                                        }
                                        courses={courses}
                                        userId={Number(student?.data?.user?.id)}
                                        personalInfoData={personalInfoData}
                                    />
                                )}

                                {active === 2 && (
                                    <Availability
                                        setActive={setActive}
                                        personalInfoData={personalInfoData}
                                        userId={Number(student?.data?.user?.id)}
                                        setAvailabilities={setAvailabilities}
                                        availabilities={availabilities}
                                    />
                                )}

                                {(active === 3 || active === 4) && (
                                    <IndustrySelection
                                        setActive={setActive}
                                        workplace={workplace}
                                        userId={Number(student?.data?.user?.id)}
                                        setIsCancelled={(e: any) => {
                                            setIsCancelled(e)
                                        }}
                                        isCancelled={isCancelled}
                                    />
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    )
}
RequestWorkplaceDetail.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(RequestWorkplaceDetail, {
    permissions: [PermissionType.ALLOW_STUDENT_NEED_WORKPLACE],
})
