import { Badge, Button, Card } from '@components'
import { Separator } from '@components/ui/separator'
import { DocumentsView } from '@hooks'
import { VerifyCapacityComponent } from '@partials/common/StudentProfileDetail/components/Workplace/components/WorkplaceApprovalReq/VerifyCapacityComponent'
import { WorkplaceMapBoxView } from '@partials/student'
import { RtoV2Api } from '@queries'
import {
    AlertCircle,
    BadgeInfo,
    Building2,
    FileCheck,
    Mail,
    MapPin,
    MapPinned,
    User,
} from 'lucide-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export const EnhancedIndustryDetailsCard = ({
    // showIndustryDetails,
    selectedIndustry,
    workplaceType,
    proofSkipped,
    student,
    workplace,
}: any) => {
    const [showMap, setShowMap] = useState(false)
    const router = useRouter()
    const { onFileClicked, documentsViewModal } = DocumentsView()
    const wpId = router?.query?.id
    const { data, isLoading, isError } =
        RtoV2Api.PlacementRequests.useStudentPlacementIndustryDetails(wpId, {
            skip: !wpId,
        })
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
        !!data &&
        typeof data.distance === 'number' &&
        data?.distance > 0 &&
        typeof data?.employmentDocument === 'string' &&
        data?.employmentDocument?.trim()?.length > 0

    return (
        <>
            {documentsViewModal}
            {shouldRenderIndustryCard && (
                <Card noPadding className="border-0 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] px-5 py-4">
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
                                {roundCustom(data?.distance || 0)} km
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
                            {/* {data?.addressLine1 || "---"} */}
                        </p>
                        {showMap && (
                            <>
                                <WorkplaceMapBoxView
                                    industryLocation={data?.location?.split(
                                        ','
                                    )}
                                    studentLocation={student?.location?.split(
                                        ','
                                    )}
                                    workplaceName={data?.user?.name}
                                    showMap={
                                        !data?.industry?.location &&
                                        !!student?.location
                                    }
                                />
                            </>
                        )}
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[#044866] font-semibold text-lg">
                                    {data?.user?.name ?? '———'}
                                </h4>
                                <p className="text-slate-600 text-sm">
                                    Verified Industry{' '}
                                    {data?.isPartner
                                        ? 'Partner'
                                        : 'Non-Partner'}
                                </p>
                            </div>
                            {workplaceType === 'provided' && (
                                <div className="flex items-center gap-x-2">
                                    {proofSkipped ? (
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
                                    )}
                                    <BadgeInfo
                                        className="cursor-pointer text-primary size-5"
                                        onClick={() =>
                                            onFileClicked({
                                                file: data?.employmentDocument,
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
                            <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                                <p className="text-slate-600 text-xs mb-1">
                                    Location
                                </p>
                                <p className="text-slate-900 font-medium">
                                    {data?.addressLine1 ?? '———'}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                                <p className="text-slate-600 text-xs mb-1">
                                    Distance
                                </p>
                                <p className="text-slate-900 font-medium">
                                    {roundCustom(data?.distance || 0)} km
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
                                        {data?.contactPerson ?? '————'}
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
                                        {data?.user?.email ?? '————'}
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
