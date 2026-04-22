import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'

import {
    ActionAlert,
    ActionButton,
    BackButton,
    Button,
    Card,
    LoadingAnimation,
    PageTitle,
    Typography,
} from '@components'
import { ShowErrorNotifications } from '@components/ShowErrorNotifications'
import { SubAdminLayout } from '@layouts'
import {
    Industry,
    NextPageWithLayout,
    ProvideIndustryDetail,
    UserStatus,
} from '@types'

// query
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { AddCustomIndustryForm } from '@partials/common'
import { CompleteProfileBeforeWpModal } from '@partials/common/StudentProfileDetail/components'
import {
    UpdatedExistingIndustry,
    UpdatedExistingIndustryByName,
    UpdatedPersonalInfo,
    WorkplaceProgress,
} from '@partials/student'
import { EmployerDocuments } from '@partials/student/workplace/modal'
import { IndustrySelection } from '@partials/sub-admin/students'
import { AlreadyWPCreatedModal } from '@partials/sub-admin/students/workplace/requestWorkplaceDetail/modal'
import {
    SubAdminApi,
    useAddCustomIndustyForWorkplaceMutation,
    useFindByAbnWorkplaceMutation,
    useGetSubAdminStudentDetailQuery,
    useGetSubAdminStudentWorkplaceQuery,
    useGetWorkplaceIndustriesQuery,
    useSubAdminCancelStudentWorkplaceRequestMutation,
} from '@queries'
import { checkStudentProfileCompletion, WorkplaceCurrentStatus } from '@utils'
import { IWorkplaceIndustries } from '@redux/queryTypes'

type Props = {}

const ProvideWorkplaceDetail: NextPageWithLayout = (props: Props) => {
    const router = useRouter()
    const { id } = router.query
    const [active, setActive] = useState(1)
    const [answer, setAnswer] = useState('')
    const [personalInfoData, setPersonalInfoData] = useState({})
    const [industryABN, setIndustryABN] = useState<string | null>(null)
    const [isCancelled, setIsCancelled] = useState<boolean>(false)
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [workplaceData, setWorkplaceData] = useState<any | null>(null)
    const [industrySearchValue, setIndustrySearchValue] = useState<
        string | null
    >(null)
    const [findIndustryType, setFindIndustryType] = useState<string | null>(
        null
    )
    const [showEmployerDocModal, setShowEmployerDocModal] = useState<
        boolean | null
    >(null)
    const [cIndustryDetail, setCIndustryDetail] = useState<any>({})

    const { notification } = useNotification()

    // query
    const { data, isLoading, isError, isSuccess } =
        useGetSubAdminStudentDetailQuery(Number(id), {
            skip: !id,
        })
    const userId = data?.user?.id
    const workplaceRequest = useGetWorkplaceIndustriesQuery(userId, {
        skip: !userId,
    })
    const rtoDetail = SubAdminApi.Student.getStudentRtoDetail(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })
    const workplace = useGetSubAdminStudentWorkplaceQuery(Number(id), {
        skip: !id,
    })
    const courses = SubAdminApi.Student.useCourses(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })

    const values = {
        ...data,
        ...data?.user,
        courses: courses?.data,
        rto: rtoDetail?.data,
    }
    const profileCompletion = checkStudentProfileCompletion(values)

    useEffect(() => {
        if (
            workplaceRequest.data &&
            workplaceRequest.isSuccess &&
            workplaceRequest?.data?.filter(
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
                    workplaceType={'provide-workplace-detail?tab=abn'}
                />
            )
        } else if (profileCompletion === 100) {
            setModal(null)
        }
    }, [profileCompletion, workplace])

    const [findAbn, result] = useFindByAbnWorkplaceMutation()
    const [addWorkplace, addWorkplaceResult] =
        useAddCustomIndustyForWorkplaceMutation()
    const [cancelRequest, cancelRequestResult] =
        useSubAdminCancelStudentWorkplaceRequestMutation()

    useEffect(() => {
        if (!workplaceRequest) return
        const approval = workplaceData?.studentProvidedWorkplaceRequestApproval

        const industryId = approval?.industry?.id
        const isOnboarding = approval?.industry?.showOnboarding

        if (industryId && isOnboarding) {
            router.push(
                `/portals/sub-admin/students/${router.query.id}/provide-workplace-detail/${industryId}`
            )
        }
    }, [workplaceRequest])

    useEffect(() => {
        if (!result.data && result.isSuccess) {
            notification.error({
                title: 'Industry Not Found',
                description:
                    'Your Industry Not found in our record, we are redirecting you to industry signup page, please provide the details',
            })
            setTimeout(() => {
                setActive(2)
            }, 3000)
        }
        if (result.data && result.isSuccess) {
            setActive(2)
        }
    }, [result])

    useEffect(() => {
        if (workplaceRequest.isSuccess && workplaceRequest.data &&
            workplaceRequest.data.length > 0) {
            setWorkplaceData(workplaceRequest.data?.[0])
            setActive(3)
        }
    }, [workplaceRequest])

    useEffect(() => {
        if (cancelRequestResult.isSuccess) {
            setActive(1)
        }
    }, [cancelRequestResult.isSuccess])

    const workplaceCancelRequest = (simple: boolean = false) => {
        return (
            <div className="mt-3">
                <ActionButton
                    variant={'error'}
                    onClick={async () => {
                        await cancelRequest(workplace?.data[0]?.id)
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

    const StepIndicatorOptions = [
        {
            label: 'Personal Info',
            visited: false,
            last: false,
        },
        {
            label: 'Your Industry',
            visited: false,
            last: false,
        },
        {
            label: 'Select Industry',
            visited: false,
            last: false,
        },
        {
            label: 'Wait For Approval',
            visited: false,
            last: true,
        },
    ]

    const onSubmit = (values: any) => {
        if (values?.type === 'abn') {
            findAbn(values?.value)
        }

        if (values?.type == 'name') {
            setActive(2)
        }
        setFindIndustryType(values?.type)
        setIndustrySearchValue(values?.value)
        // findAbn(values?.abn)
        // setIndustryABN(values?.abn)
        // setActive((active: number) => active + 1)
    }

    const onIndustryAdd = (values: ProvideIndustryDetail) => {
        setCIndustryDetail({
            id: data?.user?.id,
            body: {
                ...values,
                courses: [values?.courses],
                role: UserRoles.INDUSTRY,
                password: 'NA',
            },
        })
        setShowEmployerDocModal(true)
        // addWorkplace({
        //     id: data?.user?.id,
        //     body: {
        //         ...values,
        //         courses: [values?.courses],
        //         role: UserRoles.INDUSTRY,
        //         password: 'NA',
        //     },
        // })
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
                    test={'SubAdmin side'}
                    setAnswer={setAnswer}
                    answer={answer}
                    result={addWorkplaceResult}
                    setActive={setActive}
                />
            )}
            <PageTitle
                title="Provide Workplace Detail"
                backTitle="Student Detail"
            />
            <div className="mt-3">
                {workplace?.isLoading ? (
                    <LoadingAnimation />
                ) : (
                    <div className="flex gap-x-5 w-full">
                        <ShowErrorNotifications result={addWorkplaceResult} />
                        {/* <GoBackButton>Workplace Choice</GoBackButton> */}
                        {/*  */}

                        {/* <div className="py-4 w-[25%]">
                            <StepIndicator
                                steps={StepIndicatorOptions}
                                currentStep={StepIndicatorOptions[active - 1]}
                                vertical
                            />
                        </div> */}
                        <div className="max-w-5xl w-full mx-auto">
                            {active === 1 && (
                                <div className="w-full">
                                    {/* <FindWorkplace
                                        result={result}
                                        onSubmit={onSubmit}
                                        setActive={setActive}
                                        setWorkplaceData={setWorkplaceData}
                                        student={data as Student}
                                    /> */}
                                    {/* {industryNotFound ? (
                                        <div className="bg-red-200 rounded-lg px-2 py-1 mb-2">
                                            <p className="text-sm font-semibold text-red-500">
                                                Industry for provided ABN not
                                                found
                                            </p>
                                            <p className="text-xs text-red-400">
                                                You will be redirected to
                                                Industry Form so you can add
                                                your industry&apos;s information
                                            </p>
                                        </div>
                                    ) : null} */}
                                    {/* <FindWorkplaceForm
                                     onSubmit={onSubmit}
                                     result={result}
                                 /> */}
                                    <div className="">
                                        <UpdatedPersonalInfo
                                            onSubmit={onSubmit}
                                            result={result}
                                        />
                                    </div>
                                </div>
                            )}

                            {active === 2 &&
                                (!result?.data &&
                                (findIndustryType === 'abn' ||
                                    !findIndustryType) ? (
                                    <AddCustomIndustryForm
                                        setWorkplaceData={setWorkplaceData}
                                        result={addWorkplaceResult}
                                        industryABN={industryABN}
                                        onSubmit={onIndustryAdd}
                                        setActive={setActive}
                                        courses={courses?.data}
                                    />
                                ) : (
                                    // <ExistinIndustryCard
                                    //     setActive={setActive}
                                    //     personalInfoData={personalInfoData}
                                    //     res={result}
                                    //     industry={result?.data}
                                    //     setWorkplaceData={setWorkplaceData}
                                    //     student={data?.user?.id}
                                    //     studentId={data?.id}
                                    // />
                                    <div>
                                        <BackButton
                                            onClick={() => {
                                                setActive(1)
                                            }}
                                        />
                                        {findIndustryType === 'abn' ? (
                                            <UpdatedExistingIndustry
                                                industry={
                                                    result?.data as Industry
                                                }
                                                student={data?.user?.id}
                                                abn={industrySearchValue + ''}
                                                setActive={setActive}
                                            />
                                        ) : (
                                            <UpdatedExistingIndustryByName
                                                industrySearchValue={
                                                    industrySearchValue
                                                }
                                                student={data?.user?.id}
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
                                    {workplaceData?.[0]?.industryStatus ===
                                    UserStatus.Approved ? (
                                        <IndustrySelection
                                            setActive={setActive}
                                            workplace={workplace}
                                            userId={Number(data?.user?.id)}
                                            studentProvidedWorkplace
                                            setIsCancelled={(e: any) => {
                                                setIsCancelled(e)
                                            }}
                                            isCancelled={isCancelled}
                                        />
                                    ) : workplaceData[0]?.industryStatus ===
                                      UserStatus.Rejected ? (
                                        <Card>
                                            <div className="px-5 py-16 border-2 border-dashed border-gray-600 flex justify-center">
                                                <Typography
                                                    variant={'label'}
                                                    center
                                                    color={'text-gray-700'}
                                                >
                                                    Your Workplace Industry has
                                                    been Rejected, You can
                                                    recreate a workplace after
                                                    canceling the workplace
                                                </Typography>
                                            </div>
                                            {workplaceCancelRequest()}
                                        </Card>
                                    ) : (
                                        <Card>
                                            <div className="px-5 py-16 border-2 border-dashed border-gray-600 flex justify-center">
                                                <Typography
                                                    variant={'label'}
                                                    center
                                                    color={'text-gray-700'}
                                                >
                                                    Your request has been
                                                    received, Our team after
                                                    confirming the provided
                                                    information will approved
                                                    your request and Will
                                                    Contact you soon
                                                </Typography>
                                            </div>
                                            {workplaceCancelRequest()}
                                        </Card>
                                    )}
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
                                                    description={`We have successfully processed your workplace request. A case officer will be assigned to your case promptly to assist you further.<br/> ${
                                                        answer === 'no'
                                                            ? '<p class="italic mt-4 font-semibold text-sm">You have been successfully added to the Talent Pool Programme! Industries in your field can now view your profile and contact you with opportunities.</p>'
                                                            : answer === 'no' &&
                                                              '<p class="italic mt-4 font-semibold text-sm">You can join the Talent Pool Programme later from your dashboard.</p>'
                                                    } `}
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
                                                router.push(
                                                    `/portals/sub-admin/students/${router?.query?.id}/detail`
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
ProvideWorkplaceDetail.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default ProvideWorkplaceDetail
