import {
    ActionButton,
    Badge,
    Card,
    Permissions,
    Typography
} from '@components'
import { UserRoles } from '@constants'
import { workplaceQuestionsKeys } from '@partials/common/workplace/enum'
import { RtoV2Api } from '@queries'
import { setSelectedCourse, SubAdminApi, useAppDispatch } from '@redux'
import { Course, PermissionType } from '@types'
import {
    checkJsxVisibility,
    ellipsisText,
    getUserCredentials,
    maskText,
} from '@utils'
import {
    AtSign,
    Briefcase,
    Calendar,
    CheckCircle2,
    Edit2,
    ExternalLink,
    GraduationCap,
    ListChecks,
    MapPin,
    Phone,
    User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Activity, useEffect, useMemo, useState } from 'react'
import { EditPreferredAddressModal } from '../../modal'

const getStudentProfileLink = (role: string, studentId: number) => {
    switch (role) {
        case UserRoles.ADMIN:
            return `/portals/admin/student/${studentId}/detail`
        case UserRoles.SUBADMIN:
            return `/portals/sub-admin/students/${studentId}/detail`
        default:
            return `/portals/rto/students-and-placements/all-students/${studentId}/detail`
    }
}

export const StudentQuickSummaryCard = ({
    studentDetails,
}: {
    studentDetails: any
}) => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const wpId = router.query.id
    const { data } = RtoV2Api.PlacementRequests.useStudentPlacementCourse(
        wpId,
        {
            skip: !wpId,
        }
    )
    const {
        data: courseWpTypesData,
        isLoading,
        isError,
    } = RtoV2Api.Courses.useRtoCourseWpTypes(
        { cId: data?.id, id: studentDetails?.rto?.id },
        {
            skip: !data?.id || !studentDetails?.rto?.id,
        }
    )

    const { data: questionnaireData } =
        SubAdminApi.Workplace.useStudentWorkplaceAnswers(Number(wpId), {
            skip: !wpId,
            refetchOnMountOrArgChange: true,
        })

    const preferredAddressObj = questionnaireData?.find(
        (q: any) => q.type === workplaceQuestionsKeys.suburb
    )
    const preferredAddress = preferredAddressObj?.answer

    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false)

    const parsedAddress = useMemo(() => {
        if (!preferredAddress) return { suburb: '', zip: '' }
        try {
            const parsed = JSON.parse(preferredAddress)
            return { suburb: parsed.suburb || '', zip: parsed.zip || '' }
        } catch (e) {
            return { suburb: preferredAddress, zip: '' }
        }
    }, [preferredAddress])

    const studentAddress = studentDetails?.addressLine1
        ? `${studentDetails.addressLine1}${
              studentDetails.suburb ? `, ${studentDetails.suburb}` : ''
          }${studentDetails.zipCode ? ` ${studentDetails.zipCode}` : ''}`
        : '____'

    let formattedPreferredAddress = studentAddress
    if (preferredAddress) {
        try {
            const parsed = JSON.parse(preferredAddress)
            formattedPreferredAddress = `${parsed.suburb}${
                parsed.zip ? `, ${parsed.zip}` : ''
            }`
        } catch (e) {
            formattedPreferredAddress = preferredAddress
        }
    }

    useEffect(() => {
        if (data) {
            dispatch(setSelectedCourse(data))
        }
        return () => {
            dispatch(setSelectedCourse(null as unknown as Course))
        }
    }, [data])

    const role = getUserCredentials()?.role || ''
    function formatAIRequirements(text: string) {
        if (!text) return ''

        let html = text

        // Step 1: Add line breaks after periods for readability
        html = html.replace(/\. /g, '.<br>')

        // Step 2: Handle bullets
        // Find all * bullets, split by *, remove empty
        const bullets = html.match(/\*[^*]+/g)
        if (bullets) {
            const bulletHtml = bullets
                .map((b) => `<li>${b.replace('*', '').trim()}</li>`)
                .join('')
            html = html.replace(html, `<ul>${bulletHtml}</ul>`)
        }

        // Step 3: Bold the main heading (e.g., unit code at the start)
        html = html.replace(/^(SITH\w+\d+)/, '<strong>$1</strong>')

        return html
    }
    const rtoCourseReq =
        data?.rtoCourseFiles?.[0]?.rtoLogbookSummary?.length > 0
            ? data.rtoCourseFiles[0].rtoLogbookSummary[0]?.summary
            : data?.requirements
    return (
        <>
            <Card
                noPadding
                className="group border-0 shadow-2xl shadow-slate-300/30 overflow-hidden bg-linear-to-br from-white via-blue-50/50 to-indigo-50/50 backdrop-blur-sm hover:shadow-3xl hover:shadow-slate-300/40 transition-all duration-500 hover:-translate-y-1"
            >
                <div className="relative p-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-[#044866]/10 via-[#0D5468]/5 to-transparent rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700" />

                    <div className="relative flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#044866] via-[#0D5468] to-[#044866] flex items-center justify-center text-white shadow-xl ring-4 ring-white ring-offset-2 ring-offset-blue-50/50">
                                    <User className="h-7 w-7" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                </div>
                            </div>
                            <div className="">
                                <div className="flex gap-1 group">
                                    <Link
                                        href={getStudentProfileLink(
                                            role,
                                            studentDetails?.id
                                        )}
                                        className="flex gap-1 text-[#044866] text-xl font-bold hover:underline"
                                    >
                                        <span>
                                            {studentDetails?.user?.name ??
                                                '___'}{' '}
                                            {studentDetails?.familyName ??
                                                '___'}{' '}
                                            (
                                            {ellipsisText(
                                                studentDetails?.rto?.user?.name,
                                                30
                                            ) ?? '___'}
                                            )
                                        </span>

                                        {/* Hover icon */}
                                        <ExternalLink
                                            className="
                                            w-4 h-4 text-[#64748B]
                                            opacity-0 scale-95
                                            transition-all duration-200
                                            group-hover:opacity-100 group-hover:scale-100
                                        "
                                        />
                                    </Link>
                                </div>

                                <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                    {ellipsisText(
                                        studentDetails?.studentId,
                                        8
                                    ) ?? '____'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {studentDetails?.studentStatus === 'active' && (
                                <Badge
                                    text="Active"
                                    className="bg-linear-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg shadow-emerald-500/30 px-3 py-1.5"
                                />
                            )}
                        </div>
                    </div>

                    <div className="relative grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-[#044866]/20 transition-all duration-300">
                            <div className="p-2 bg-linear-to-br from-[#044866]/10 to-[#0D5468]/10 rounded-lg">
                                <Calendar className="h-4 w-4 text-[#044866]" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">
                                    Age
                                </p>
                                <p className="text-sm text-slate-900 font-semibold">
                                    {studentDetails?.age ?? '____'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-[#044866]/20 transition-all duration-300">
                            <div className="p-2 bg-linear-to-br from-[#044866]/10 to-[#0D5468]/10 rounded-lg">
                                <Phone className="h-4 w-4 text-[#044866]" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">
                                    Phone
                                </p>
                                <p className="text-sm text-slate-900 font-semibold">
                                    {maskText(
                                        studentDetails?.phone ?? '____',
                                        4
                                    )}
                                </p>
                            </div>
                        </div>
                        <div>
                            <Typography
                                variant="label"
                                className="text-xs text-slate-600"
                            >
                                Email
                            </Typography>
                            <div className="flex items-center mt-1 gap-2 p-0.5 bg-white rounded-lg border border-slate-200">
                                <div className="flex py-3 px-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg">
                                    <AtSign className="h-3.5 w-3.5 text-slate-500" />
                                </div>
                                <Typography
                                    variant="label"
                                    className="text-xs text-slate-600"
                                >
                                    {studentDetails?.user?.email ?? '____'}
                                </Typography>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <Typography
                                    variant="label"
                                    className="text-xs text-slate-600"
                                >
                                    Workplace Preferred Address
                                </Typography>

                                <Permissions
                                    permission={[
                                        PermissionType.CHANGE_WORKPLACE_ADDRESS,
                                    ]}
                                >
                                    <Activity
                                        mode={checkJsxVisibility(
                                            preferredAddressObj
                                        )}
                                    >
                                        <ActionButton
                                            variant="info"
                                            small
                                            title="Edit Address"
                                            onClick={() =>
                                                setIsEditAddressModalOpen(true)
                                            }
                                            Icon={Edit2}
                                        />
                                    </Activity>
                                </Permissions>
                            </div>
                            <div className="flex items-center mt-1 gap-2 p-0.5 bg-white rounded-lg border border-slate-200">
                                <div className="flex py-3 px-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg">
                                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                                </div>
                                <Typography
                                    variant="label"
                                    className="text-[9px] text-slate-600"
                                >
                                    {formattedPreferredAddress}
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <div className="relative space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                            <Briefcase className="h-3.5 w-3.5 text-[#044866]" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-slate-500">
                                    Sector
                                </p>
                                <p className="text-xs text-slate-900 font-medium truncate">
                                    {data?.sector?.name ?? '___'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                            <GraduationCap className="h-3.5 w-3.5 text-[#044866]" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-slate-500">
                                    Course
                                </p>
                                <p className="text-xs text-slate-900 font-medium truncate">
                                    {data?.code ?? '___'} –{' '}
                                    {data?.title ?? '___'}
                                </p>
                            </div>
                        </div>
                        {/* Workplace types */}
                        <div className="flex  gap-2 p-2 bg-white rounded-lg border border-slate-200">
                            <Briefcase className="h-3.5 w-3.5 text-[#044866]" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-slate-500">
                                    Workplace Type
                                </p>
                                <div className="flex flex-col">
                                    {isLoading ? (
                                        <p className="text-xs text-slate-900 font-medium">
                                            Loading...
                                        </p>
                                    ) : isError ? (
                                        <p className="text-xs text-red-600 font-medium">
                                            Error loading data
                                        </p>
                                    ) : courseWpTypesData &&
                                      courseWpTypesData?.length > 0 ? (
                                        <ul className="list-disc list-inside text-xs text-slate-900 font-medium">
                                            {courseWpTypesData?.map(
                                                (type: any, index: number) => (
                                                    <li
                                                        key={index}
                                                        className="truncate"
                                                    >
                                                        {
                                                            type?.workplaceType
                                                                ?.name
                                                        }
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-slate-400 font-medium">
                                            ___
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-linear-to-br from-white to-blue-50/50 rounded-lg border border-[#044866]/20">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                    <ListChecks className="h-3.5 w-3.5 text-[#044866]" />
                                    <p className="text-xs text-[#044866] font-medium">
                                        Requirements
                                    </p>
                                </div>
                                {/* <Badge
                                text={data?.requirements?.length.toString()}
                                className="bg-[#044866]/10 text-[#044866] border-0 text-[10px] px-1.5 py-0"
                            /> */}
                            </div>
                            <div
                                className="space-y-1.5 customTailwingStyles-inline-style customTailwingStyles text-xs  bg-transparent! leading-relaxed overflow-auto max-h-44"
                                dangerouslySetInnerHTML={{
                                    __html: formatAIRequirements(
                                        rtoCourseReq ?? '____'
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Card>
            <EditPreferredAddressModal
                isOpen={isEditAddressModalOpen}
                onClose={() => setIsEditAddressModalOpen(false)}
                initialData={parsedAddress}
                qId={preferredAddressObj?.id}
                studentId={studentDetails?.id}
                wpId={wpId as string}
            />
        </>
    )
}
