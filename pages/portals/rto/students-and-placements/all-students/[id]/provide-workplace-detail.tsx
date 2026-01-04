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
import { RtoLayoutV2 } from '@layouts'
import {
    Industry,
    NextPageWithLayout,
    ProvideIndustryDetail,
    UserStatus,
} from '@types'

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
import {
    SubAdminApi,
    useAddCustomIndustyForWorkplaceMutation,
    useFindByAbnWorkplaceMutation,
    useGetSubAdminStudentDetailQuery,
    useSubAdminCancelStudentWorkplaceRequestMutation,
} from '@queries'
import { checkStudentProfileCompletion, WorkplaceCurrentStatus } from '@utils'
import { ArrowLeft, CalendarCheck, CheckCircle2, User } from 'lucide-react'
import { IWorkplaceIndustries } from 'redux/queryTypes'

type Props = {}

const ProvideWorkplaceDetail: NextPageWithLayout = (props: Props) => {
    const router = useRouter()
    const { id } = router.query
    const [active, setActive] = useState(1)
    const [answer, setAnswer] = useState('')
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

    const { data } = useGetSubAdminStudentDetailQuery(Number(id), {
        skip: !id,
    })

    const rtoDetail = SubAdminApi.Student.getStudentRtoDetail(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
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
    }, [profileCompletion])

    const [findAbn, result] = useFindByAbnWorkplaceMutation()
    const [addWorkplace, addWorkplaceResult] =
        useAddCustomIndustyForWorkplaceMutation()
    const [cancelRequest, cancelRequestResult] =
        useSubAdminCancelStudentWorkplaceRequestMutation()

    const workplace = {
        data: workplaceData ? [workplaceData] : [],
        isLoading: false,
    }

    useEffect(() => {
        if (addWorkplaceResult.isSuccess && addWorkplaceResult.data) {
            setWorkplaceData(addWorkplaceResult.data?.workplaceRequest)
            setActive((active: number) => active + 1)
        }
    }, [addWorkplaceResult])

    useEffect(() => {
        if (!result.data && result.isSuccess) {
            notification.error({
                title: 'Industry Not Found',
                description:
                    'Your Industry Not found in our record, we are redirecting you to industry signup page, pleae provide the details',
            })
            setTimeout(() => {
                setActive((active: number) => active + 1)
            }, 2000)
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

    const onSubmit = (values: any) => {
        if (values?.type === 'abn') {
            findAbn(values?.value)
        }

        if (values?.type == 'name') {
            setActive(2)
        }
        setFindIndustryType(values?.type)
        setIndustrySearchValue(values?.value)
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

            <div className="min-h-screen bg-slate-50/50 py-4 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto">
                    <ShowErrorNotifications result={addWorkplaceResult} />

                    {/* Header Section */}
                    <div className="mb-8">
                        <Button
                            variant="primaryNew"
                            outline
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Student Detail
                        </Button>

                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                    Provide Workplace
                                    <span className="px-3 py-1 rounded-full bg-[#044866]/10 text-[#044866] text-xs font-medium border border-[#044866]/20">
                                        Placement
                                    </span>
                                </h1>
                                <p className="mt-2 text-slate-600">
                                    Enter the details of your self-sourced
                                    placement.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#044866]/5 to-[#F7A619]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                        {/* Progress Steps (Visual Only) */}
                        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`flex items-center gap-2 ${
                                        active === 1
                                            ? 'text-[#044866] font-semibold'
                                            : 'text-slate-500'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                                            active === 1
                                                ? 'bg-[#044866] text-white shadow-lg shadow-[#044866]/30'
                                                : active > 1
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-200'
                                        }`}
                                    >
                                        {active > 1 ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            '1'
                                        )}
                                    </div>
                                    <span>Personal Info</span>
                                </div>
                                <div className="w-12 h-0.5 bg-slate-200 rounded-full"></div>
                                <div
                                    className={`flex items-center gap-2 ${
                                        active === 2
                                            ? 'text-[#044866] font-semibold'
                                            : 'text-slate-500'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                                            active === 2
                                                ? 'bg-[#044866] text-white shadow-lg shadow-[#044866]/30'
                                                : active > 2
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-200'
                                        }`}
                                    >
                                        {active > 2 ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            '2'
                                        )}
                                    </div>
                                    <span>Industry Details</span>
                                </div>
                                <div className="w-12 h-0.5 bg-slate-200 rounded-full"></div>
                                <div
                                    className={`flex items-center gap-2 ${
                                        active >= 3
                                            ? 'text-[#044866] font-semibold'
                                            : 'text-slate-500'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                                            active >= 3
                                                ? 'bg-[#044866] text-white shadow-lg shadow-[#044866]/30'
                                                : 'bg-slate-200'
                                        }`}
                                    >
                                        3
                                    </div>
                                    <span>Confirmation</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {active === 1 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-800">
                                                Review Personal Details
                                            </h2>
                                            <p className="text-sm text-slate-500">
                                                Confirm your contact information
                                            </p>
                                        </div>
                                    </div>
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
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                                <CalendarCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-slate-800">
                                                    Industry Details
                                                </h2>
                                                <p className="text-sm text-slate-500">
                                                    Provide the details of your
                                                    workplace
                                                </p>
                                            </div>
                                        </div>
                                        <AddCustomIndustryForm
                                            setWorkplaceData={setWorkplaceData}
                                            result={addWorkplaceResult}
                                            industryABN={industryABN}
                                            onSubmit={onIndustryAdd}
                                            setActive={setActive}
                                            courses={courses?.data}
                                        />
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div className="mb-6">
                                            <BackButton
                                                onClick={() => {
                                                    setActive(1)
                                                }}
                                            />
                                        </div>
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
                                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
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
                                </div>
                            )}

                            {active === 4 && (
                                <div className="flex flex-col gap-y-7 items-center animate-in fade-in slide-in-from-right-4 duration-500">
                                    <Card>
                                        <div className="w-full ">
                                            <div className="w-full py-7 border-b border-[#D9DBE9]">
                                                <WorkplaceProgress
                                                    progressNumber={3}
                                                    activeNumber={3}
                                                />
                                            </div>

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
                                                    `/portals/rto/students-and-placements/all-students/${router?.query?.id}/detail`
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
ProvideWorkplaceDetail.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: User,
                title: 'Student Detail',
            }}
            childrenClasses="!p-0 !md:p-0"
        >
            {page}
        </RtoLayoutV2>
    )
}

export default ProvideWorkplaceDetail
