import { ReactElement, useEffect, useState } from 'react'

import {
    ActionAlert,
    ActionButton,
    BackButton,
    Badge,
    Button,
    Card,
    LoadingAnimation,
    Typography,
} from '@components'
import { ShowErrorNotifications } from '@components/ShowErrorNotifications'
import { StudentLayout } from '@layouts'
import { Industry, NextPageWithLayout, UserStatus } from '@types'

// query
import { MediaQueries, UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { AddCustomIndustryForm } from '@partials/common'
import {
    AppliedIndustry,
    UpdatedExistingIndustry,
    UpdatedExistingIndustryByName,
    UpdatedPersonalInfo,
    WorkplaceProgress,
} from '@partials/student'
import { EmployerDocuments } from '@partials/student/workplace/modal'
import {
    useAddWorkplaceMutation,
    useCancelWorkplaceRequestMutation,
    useGetStudentCoursesQuery,
    useGetWorkplaceIndustriesQuery,
    useUpdateFindAbnMutation,
} from '@queries'
import { WorkplaceCurrentStatus } from '@utils'
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive'

const HaveWorkplace: NextPageWithLayout = () => {
    const isMobile = useMediaQuery(MediaQueries.Mobile)
    const [active, setActive] = useState(1)
    const [answer, setAnswer] = useState('')
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [industrySearchValue, setIndustrySearchValue] = useState<
        string | null
    >(null)
    const [findIndustryType, setFindIndustryType] = useState<string | null>(
        null
    )
    const [cIndustryDetail, setCIndustryDetail] = useState<any>({})
    const [showEmployerDocModal, setShowEmployerDocModal] = useState<
        boolean | null
    >(null)

    const [industryNotFound, setIndustryNotFound] = useState(false)

    const [workplaceData, setWorkplaceData] = useState<any | null>({})
    const { notification } = useNotification()
    const router = useRouter()
    // query
    const workplace = useGetWorkplaceIndustriesQuery()
    const [findAbn, result] = useUpdateFindAbnMutation()
    const [addWorkplace, addWorkplaceResult] = useAddWorkplaceMutation()
    const courses = useGetStudentCoursesQuery()
    const [cancelRequest, cancelRequestResult] =
        useCancelWorkplaceRequestMutation()

    useEffect(() => {
        if (addWorkplaceResult.isSuccess && addWorkplaceResult.data) {
            notification.success({
                title: 'Workplace request sent',
                description: 'Workplace Request sent to your coordinator',
            })

            setActive((active: number) => active + 1)
        }
    }, [addWorkplaceResult])

    useEffect(() => {
        if (!workplaceData) return
        const approval = workplaceData?.studentProvidedWorkplaceRequestApproval

        const industryId = approval?.industry?.id
        const isOnboarding = approval?.industry?.showOnboarding

        // if (industryId && isOnboarding) {
        //     router.push(
        //         `/portals/student/workplace/my-workplace/have-workplace/provided-industry-onboarding/${industryId}`
        //     )
        // }
    }, [workplaceData, workplace])

    useEffect(() => {
        if (
            workplace.isSuccess &&
            workplace?.data &&
            workplace?.data?.length > 0
        ) {
            setWorkplaceData(workplace?.data[0])

            setActive(3)
        }
    }, [workplace])

    useEffect(() => {
        if (!result.data && result.isSuccess) {
            setIndustryNotFound(true)
            setTimeout(() => {
                setActive((active: number) => active + 1)
            }, 3000)
        }
        if (result.data && result.isSuccess) {
            setActive((active: number) => active + 1)
        }
    }, [result])

    useEffect(() => {
        if (cancelRequestResult.isSuccess) {
            setActive(1)
        }
    }, [cancelRequestResult.isSuccess])

    const workplaceCancelRequest = (simple: boolean = false) => {
        const workplaceStatus = [
            WorkplaceCurrentStatus.NotRequested,
            WorkplaceCurrentStatus.Applied,
            WorkplaceCurrentStatus.CaseOfficerAssigned,
            WorkplaceCurrentStatus.Interview,
            WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
        ]

        if (workplaceStatus.includes(workplaceData?.currentStatus)) {
            return (
                <div className="mt-3">
                    <ActionButton
                        variant={'error'}
                        onClick={async () => {
                            await cancelRequest()
                        }}
                        loading={cancelRequestResult.isLoading}
                        disabled={cancelRequestResult.isLoading}
                        simple={simple}
                    >
                        Cancel Request
                    </ActionButton>
                </div>
            )
        }
        return null
    }

    const onSubmit = (values: any) => {
        if (values?.type === 'abn') {
            findAbn({ abn: values?.value })
        }
        if (values?.type == 'name') {
            setActive(2)
        }
        setFindIndustryType(values?.type)
        setIndustrySearchValue(values?.value)
        // setActive((active: number) => active + 1)
    }

    const onAddIndustry = (values: any) => {
        setCIndustryDetail({
            ...values,
            courses: [values?.courses],
            role: UserRoles.INDUSTRY,
            password: 'NA',
        })
        setShowEmployerDocModal(true)
    }

    return (
        <>
            {modal}
            {showEmployerDocModal && (
                <EmployerDocuments
                    onCancel={() => {
                        setShowEmployerDocModal(null)
                    }}
                    action={async (document: any) => {
                        return await addWorkplace({
                            ...cIndustryDetail,
                            document: document?.id,
                            answer: answer,
                        })
                    }}
                    test={'Student side'}
                    setAnswer={setAnswer}
                    answer={answer}
                    result={addWorkplaceResult}
                    setActive={setActive}
                />
            )}
            <ShowErrorNotifications result={addWorkplaceResult} />
            {workplace?.isLoading || workplace?.isLoading ? (
                <LoadingAnimation />
            ) : (
                <div className="flex flex-col md:flex-row gap-x-5 w-full">
                    {/* <GoBackButton>Workplace Choice</GoBackButton> */}

                    {/*  */}
                    {/* <div className="py-4 w-full md:w-[25%]">
                        <StepIndicator
                            steps={StepIndicatorOptions}
                            currentStep={StepIndicatorOptions[active - 1]}
                            vertical={!isMobile}
                        />
                    </div> */}

                    <div className="max-w-5xl w-full mx-auto">
                        {active === 1 && (
                            <div className="w-full">
                                {industryNotFound ? (
                                    <div className="bg-red-200 rounded-lg px-2 py-1 mb-2">
                                        <p className="text-sm font-semibold text-red-500">
                                            Industry for provided ABN not found
                                        </p>
                                        <p className="text-xs text-red-400">
                                            You will be redirected to Industry
                                            Form so you can add your
                                            industry&apos;s information
                                        </p>
                                    </div>
                                ) : null}
                                {/* <FindWorkplaceForm
                                    onSubmit={onSubmit}
                                    result={result}
                                /> */}
                                <UpdatedPersonalInfo
                                    onSubmit={onSubmit}
                                    result={result}
                                />
                            </div>
                        )}

                        {active === 2 &&
                            (!result?.data &&
                            (findIndustryType === 'abn' ||
                                !findIndustryType) ? (
                                <div className="mb-4">
                                    <AddCustomIndustryForm
                                        onSubmit={onAddIndustry}
                                        setWorkplaceData={setWorkplaceData}
                                        result={addWorkplaceResult}
                                        industryABN={industrySearchValue}
                                        setActive={setActive}
                                        courses={courses?.data}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <BackButton
                                        onClick={() => {
                                            setActive(1)
                                        }}
                                    />
                                    {findIndustryType === 'abn' ? (
                                        <UpdatedExistingIndustry
                                            industry={result?.data as Industry}
                                            abn={industrySearchValue + ''}
                                            setActive={setActive}
                                        />
                                    ) : (
                                        <UpdatedExistingIndustryByName
                                            industrySearchValue={
                                                industrySearchValue
                                            }
                                            setActive={setActive}
                                            setFindIndustryType={
                                                setFindIndustryType
                                            }
                                        />
                                    )}
                                </div>
                            ))}

                        {active === 3 && (
                            <>
                                {(workplaceData?.industryStatus ===
                                    UserStatus.Approved &&
                                    workplaceData?.approvalStatus ===
                                        UserStatus.Approved) ||
                                workplaceData?.byExistingAbn ? (
                                    <AppliedIndustry
                                        appliedIndustry={
                                            workplaceData?.industries[0]
                                        }
                                        status={workplaceData?.currentStatus}
                                        workplaceRequest={workplaceData}
                                        studentAdded
                                        course={workplaceData?.courses[0]}
                                    />
                                ) : workplaceData?.industryStatus ===
                                  'rejected' ? (
                                    <Card>
                                        <div className="px-5 py-16 border-2 border-dashed border-gray-600 flex justify-center">
                                            <Typography
                                                variant={'label'}
                                                center
                                                color={'text-gray-700'}
                                            >
                                                Your Workplace Industry has been
                                                Rejected, You can recreate a
                                                workplace after canceling the
                                                workplace
                                            </Typography>
                                        </div>
                                        {workplaceCancelRequest()}
                                    </Card>
                                ) : workplaceData?.studentProvidedWorkplace ? (
                                    <Card>
                                        <div className="">
                                            <Typography
                                                variant={'label'}
                                                center
                                                color={'text-gray-700'}
                                            >
                                                Workplace Status:{' '}
                                            </Typography>
                                            {workplaceData?.currentStatus ===
                                            'industryEligibility' ? (
                                                <>
                                                    <Badge
                                                        variant="info"
                                                        text={
                                                            'Industry Eligibility'
                                                        }
                                                        className="mb-4"
                                                    />
                                                </>
                                            ) : (
                                                'NA'
                                            )}
                                        </div>
                                        <div className="px-5 py-16 border-2 border-dashed border-gray-600 flex justify-center">
                                            {workplaceData?.currentStatus ===
                                            'industryEligibility' ? (
                                                <Typography
                                                    variant={'label'}
                                                    center
                                                    color={'text-gray-700'}
                                                >
                                                    We have received your
                                                    workplace request. Our team
                                                    is currently reviewing the
                                                    information you have
                                                    provided about the work
                                                    industry. Once the industry
                                                    eligibility is approved,
                                                    your workplace request
                                                    process will proceed
                                                    further. We will contact you
                                                    if any additional
                                                    information is required.
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant={'label'}
                                                    center
                                                    color={'text-gray-700'}
                                                >
                                                    We have received your
                                                    workplace request. Our team
                                                    is currently reviewing the
                                                    information you have
                                                    provided about the work
                                                    industry. Once the industry
                                                    eligibility is approved,
                                                    your workplace request
                                                    process will proceed
                                                    further. We will contact you
                                                    if any additional
                                                    information is required.
                                                </Typography>
                                            )}
                                        </div>
                                        {workplaceCancelRequest()}
                                    </Card>
                                ) : null}
                            </>
                        )}

                        {active === 4 && (
                            <div className="flex flex-col gap-y-7 items-center">
                                <Card>
                                    <div className="w-full ">
                                        <div className="w-full py-7 border-b border-[#D9DBE9]">
                                            <WorkplaceProgress
                                                progressNumber={3}
                                                activeNumber={3}
                                            />
                                        </div>

                                        {/*  */}
                                        <div className="w-full px-10 pt-5 pb-9">
                                            <ActionAlert
                                                title={
                                                    'Workplace Request Successfully Added'
                                                }
                                                description={`We have successfully processed your workplace request. A case officer will be assigned to your case promptly to assist you further. ${
                                                    answer === 'yes'
                                                        ? '<p class="italic mt-4 font-semibold text-sm">You have been successfully added to the Talent Pool Programme! Industries in your field can now view your profile and contact you with opportunities.</p>'
                                                        : answer === 'no' &&
                                                          '<p class="italic mt-4 font-semibold text-sm">You can join the Talent Pool Programme later from your dashboard.</p>'
                                                }`}
                                                variant={'primary'}
                                                redirect
                                            />
                                        </div>
                                    </div>
                                </Card>
                                <div className="w-44">
                                    <Button
                                        text="Done"
                                        fullWidth
                                        onClick={() => {
                                            workplace?.refetch()
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
HaveWorkplace.getLayout = (page: ReactElement) => {
    return (
        <StudentLayout
            pageTitle={{ title: 'Add Workplace', backTitle: 'Workplace' }}
        >
            {page}
        </StudentLayout>
    )
}

export default HaveWorkplace
