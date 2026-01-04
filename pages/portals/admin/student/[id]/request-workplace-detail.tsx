import { ReactElement, useEffect, useState } from 'react'

import {
    LoadingAnimation,
    TechnicalError,
    Button,
} from '@components'

import { AdminLayout } from '@layouts'
import { NextPageWithLayout } from '@types'

// query
import { CompleteProfileBeforeWpModal } from '@partials/common/StudentProfileDetail/components'
import {
    Availability,
    PersonalInfo,
} from '@partials/sub-admin/students'
import {
    SubAdminApi,
    useGetSubAdminStudentDetailQuery,
} from '@queries'
import { checkStudentProfileCompletion } from '@utils'
import { useRouter } from 'next/router'
import { ArrowLeft, User, CalendarCheck, CheckCircle2 } from 'lucide-react'

const RequestWorkplaceDetail: NextPageWithLayout = () => {
    const [active, setActive] = useState(1)
    const [personalInfoData, setPersonalInfoData] = useState({})
    const [availabilities, setAvailabilities] = useState<any | null>(Array())
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

    return (
        <>
            {modal}

            <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <Button
                            className="pl-0 text-slate-500 hover:text-slate-800 mb-4 bg-transparent border-none shadow-none hover:bg-transparent"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Student Detail
                        </Button>

                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                    Request Workplace
                                    <span className="px-3 py-1 rounded-full bg-[#044866]/10 text-[#044866] text-xs font-medium border border-[#044866]/20">
                                        Placement
                                    </span>
                                </h1>
                                <p className="mt-2 text-slate-600">
                                    Complete the details below to start your placement journey.
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
                                <div className={`flex items-center gap-2 ${active === 1 ? 'text-[#044866] font-semibold' : 'text-slate-500'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${active === 1 ? 'bg-[#044866] text-white shadow-lg shadow-[#044866]/30' : active > 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>
                                        {active > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                                    </div>
                                    <span>Personal Info</span>
                                </div>
                                <div className="w-12 h-0.5 bg-slate-200 rounded-full"></div>
                                <div className={`flex items-center gap-2 ${active === 2 ? 'text-[#044866] font-semibold' : 'text-slate-500'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${active === 2 ? 'bg-[#044866] text-white shadow-lg shadow-[#044866]/30' : 'bg-slate-200'}`}>
                                        2
                                    </div>
                                    <span>Availability</span>
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
                                            <h2 className="text-xl font-semibold text-slate-800">Review Personal Details</h2>
                                            <p className="text-sm text-slate-500">Confirm your contact information and preferences</p>
                                        </div>
                                    </div>
                                    <PersonalInfo
                                        setActive={setActive}
                                        setPersonalInfoData={
                                            setPersonalInfoData
                                        }
                                        courses={courses}
                                        userId={Number(student?.data?.user?.id)}
                                        personalInfoData={personalInfoData}
                                    />
                                </div>
                            )}

                            {active === 2 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                            <CalendarCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-800">Set Availability</h2>
                                            <p className="text-sm text-slate-500">When are you available for placement?</p>
                                        </div>
                                    </div>
                                    <Availability
                                        setActive={setActive}
                                        personalInfoData={personalInfoData}
                                        userId={Number(student?.data?.user?.id)}
                                        setAvailabilities={setAvailabilities}
                                        availabilities={availabilities}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
RequestWorkplaceDetail.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default RequestWorkplaceDetail
