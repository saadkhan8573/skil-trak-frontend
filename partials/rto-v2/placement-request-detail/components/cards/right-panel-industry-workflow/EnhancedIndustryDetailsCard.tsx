import { Button, Card } from '@components'
import { Separator } from '@components/ui/separator'
import { UserRoles } from '@constants'
import { DocumentsView } from '@hooks'
import { VerifyCapacityComponent } from '@partials/common/StudentProfileDetail/components/Workplace/components/WorkplaceApprovalReq/VerifyCapacityComponent'
import { WorkplaceMapBoxView } from '@partials/student'
import { RtoV2Api } from '@queries'
import { getUserCredentials, WorkplaceCurrentStatus } from '@utils'
import {
    BadgeInfo,
    Building2,
    ExternalLink,
    Mail,
    MapPin,
    MapPinned,
    User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useRouteInfo } from '../../../../student-detail/components/StudentOverview/hooks'

function getIndustryProfileLink(role: string, industryId: number) {
    switch (role) {
        case UserRoles.ADMIN:
            return `/portals/admin/industry/${industryId}`
        case UserRoles.SUBADMIN:
            return `/portals/sub-admin/users/industries/${industryId}/?tab=students`
        default:
            return `portals/rto/manage/industries/${industryId}/detail`
    }
}

export const EnhancedIndustryDetailsCard = ({
    // showIndustryDetails,
    workplaceType,
    student,
    workplace,
}: any) => {
    const [showMap, setShowMap] = useState(false)
    const router = useRouter()
    const { onFileClicked, documentsViewModal } = DocumentsView()
    const wpId = router?.query?.id
    const role = getUserCredentials()?.role || ''
    const { data, isLoading, isError } =
        RtoV2Api.PlacementRequests.useStudentPlacementIndustryDetails(wpId, {
            skip: !wpId,
        })
    const wpApprovalStatus = workplace.workplaceApprovaleRequest?.filter(
        (req: any) =>
            req.status !== 'rejected' && req.rtoApprovalStatus !== 'rejected'
    )
    const workplaceIndustry =
        workplace?.industries?.length > 0
            ? data
            : wpApprovalStatus?.length > 0
              ? wpApprovalStatus?.[0]?.industry
              : null

    const workplaceEligibilityIndustry =
        workplace?.currentStatus === WorkplaceCurrentStatus.IndustryEligibility
            ? data
            : null
    const industry = workplaceEligibilityIndustry || workplaceIndustry

    const { travelInfo } = useRouteInfo({
        studentLocation: student?.location?.split(',') || [],
        industryLocation: industry?.location?.split(',') || [],
        modes: ['driving'],
    })

    const drivingInfo = travelInfo.find((info) => info.mode === 'driving')
    const calculatedDistanceValue = drivingInfo?.distance
        ? parseFloat(drivingInfo.distance.replace(' km', ''))
        : industry?.distance

    const displayDistance = calculatedDistanceValue || 0

    const roundCustom = (value: number) => {
        const decimal = value % 1
        return decimal >= 0.7 ? Math.ceil(value) : Math.floor(value)
    }

    const onToggleShowMap = () => {
        setShowMap(!showMap)
    }
    const fileUrl = data?.employmentDocument ?? ''

    const fileName = fileUrl.split('/').pop() ?? ''
    const extension = fileName.split('.').pop()?.toLowerCase()
    const shouldRenderIndustryCard =
        industry && Object.keys(industry)?.length > 0

    return (
        <>
            {documentsViewModal}
            {shouldRenderIndustryCard && (
                <Card noPadding className="border-0 shadow-xl overflow-hidden">
                    <div className="bg-linear-to-r from-[#044866] to-[#0D5468] px-5 py-4">
                        <div className="flex items-center gap-2.5 text-white">
                            <Building2 className="h-5 w-5" />
                            <h3 className="font-semibold">Matched Industry</h3>
                        </div>
                    </div>

                    {workplace?.workplaceApprovaleRequest?.[0] &&
                        !workplace?.workplaceApprovaleRequest?.[0]
                            ?.hasVerifiedCapacity &&
                        workplaceType === 'needs' && (
                            <VerifyCapacityComponent
                                courseId={workplace?.courses?.[0]?.id}
                                wpReqApproval={workplace}
                            />
                        )}
                    <div className="p-4 m-4 bg-white rounded-xl border border-slate-200 mb-3">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#F7A619]" />
                                <span className="text-slate-900 font-semibold">
                                    Distance
                                </span>
                            </div>
                            <span className="text-[#044866] font-bold text-lg">
                                {roundCustom(displayDistance)} km
                            </span>
                        </div>
                        <Button
                            className={`w-full  hover:to-[#F7A619] text-white h-10`}
                            onClick={onToggleShowMap}
                            variant={showMap ? 'error' : 'primary'}
                        >
                            <MapPinned className="h-4 w-4 mr-2" />
                            {showMap ? 'Close Map' : 'View Map'}
                        </Button>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            {/* {industry?.addressLine1 || "---"} */}
                        </p>
                        {showMap && (
                            <>
                                <WorkplaceMapBoxView
                                    industryLocation={industry?.location?.split(
                                        ','
                                    )}
                                    studentLocation={student?.location?.split(
                                        ','
                                    )}
                                    workplaceName={industry?.user?.name}
                                    showMap={
                                        !!industry?.location &&
                                        !!student?.location
                                    }
                                />
                            </>
                        )}
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[#044866] font-semibold text-lg">
                                    {industry?.user?.name ?? '———'}
                                </h4>
                                <p className="text-slate-600 text-sm">
                                    Verified Industry{' '}
                                    {industry?.isPartner
                                        ? 'Partner'
                                        : 'Non-Partner'}
                                </p>
                            </div>
                            <Link
                                href={getIndustryProfileLink(
                                    role,
                                    industry?.id
                                )}
                            >
                                <ExternalLink className="w-3 h-3 text-[#64748B] hover:text-[#044866] cursor-pointer" />
                            </Link>
                            {workplaceType === 'provided' && (
                                <div className="flex items-center gap-x-2">
                                    {/* {proofSkipped ? (
                                        <Badge
                                            text="Proof Pending"
                                            Icon={AlertCircle}
                                            outline
                                            className="border-amber-300 text-amber-700 bg-amber-50"
                                        />
                                    ) : (
                                        <Badge
                                            text="Proof Verified"
                                            Icon={FileCheck}
                                            className="bg-emerald-100 text-emerald-700 border-emerald-200"
                                        />
                                    )} */}
                                    <BadgeInfo
                                        className="cursor-pointer text-primary size-5"
                                        onClick={() =>
                                            onFileClicked({
                                                file: industry?.employmentDocument,
                                                extension,
                                                type: 'all',
                                            })
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-linear-to-br from-slate-50 to-slate-100/50 rounded-lg">
                                <p className="text-slate-600 text-xs mb-1">
                                    Location
                                </p>
                                <p className="text-slate-900 font-medium">
                                    {industry?.addressLine1 ?? '———'}
                                </p>
                            </div>
                            <div className="p-3 bg-linear-to-br from-slate-50 to-slate-100/50 rounded-lg">
                                <p className="text-slate-600 text-xs mb-1">
                                    Distance
                                </p>
                                <p className="text-slate-900 font-medium">
                                    {roundCustom(displayDistance)} km
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                                <User className="h-4 w-4 text-[#044866]" />
                                <div>
                                    <p className="text-slate-600 text-xs">
                                        Contact Person
                                    </p>
                                    <p className="text-slate-900 font-medium text-sm">
                                        {industry?.contactPerson ?? '————'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                                <Mail className="h-4 w-4 text-[#044866]" />
                                <div>
                                    <p className="text-slate-600 text-xs">
                                        Email
                                    </p>
                                    <p className="text-slate-900 font-medium text-sm">
                                        {industry?.user?.email ?? '————'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </>
    )
}
