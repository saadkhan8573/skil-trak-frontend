import { Typography } from '@components'
import { useEffect, useState } from 'react'
import { StudentApi } from '@queries'
import { getLatLng } from '@utils'
import { PrePlacementForm } from './PrePlacementForm'
import { StudentWorkplaceInfo } from './StudentWorkplaceInfo'
import { UploadIndustryRequiredDocs } from './UploadIndustryRequiredDocs'
import { WorkplaceApprovalActions } from './WorkplaceApprovalActions'
import { WorkplaceAvailableSlots } from './WorkplaceAvailableSlots'
import { WorkplaceDetail } from './WorkplaceDetail'
import { WorkplaceMapBoxView } from './WorkplaceMapBoxView'
import { RtoApprovalWorkplaceRequest } from '@types'

export const WorkplaceApproval = ({
    onCancel,
    wpApprovalData,
}: {
    wpApprovalData: RtoApprovalWorkplaceRequest
    onCancel?: () => void
}) => {
    const { data, isLoading, isError } =
        StudentApi.Workplace.useWpApprovalRequestIndustryChecks(
            wpApprovalData.id,
            { skip: !wpApprovalData?.id }
        )

    const [preferableLatLng, setPreferableLatLng] = useState<{
        lat: number
        lng: number
    } | null>(null)

    useEffect(() => {
        const fetchLatLng = async () => {
            if (wpApprovalData?.workplaceRequest?.preferableLocation) {
                try {
                    const coords = await getLatLng(
                        wpApprovalData?.workplaceRequest?.preferableLocation
                    )
                    setPreferableLatLng(coords)
                } catch (error) {
                    console.error('Error fetching latlng:', error)
                }
            }
        }
        fetchLatLng()
    }, [wpApprovalData?.workplaceRequest?.preferableLocation])

    const studentLoc = preferableLatLng
        ? [String(preferableLatLng?.lat), String(preferableLatLng?.lng)]
        : wpApprovalData?.student?.location?.split(',') || []

    const allArrays = [
        ...(data?.assessmentEvidence || []),
        ...(data?.otherDocs || []),
    ]

    const anyDocumentUploaded = allArrays
        .filter((doc: any) => doc.id)
        .every((doc: any) => doc.studentResponse?.[0]?.files?.length > 0)
    const placementUrl = wpApprovalData?.industry?.placementUrl

    const hasExternalLink =
        typeof placementUrl === 'string' && placementUrl.trim().length > 0
    const shouldDisableApprove =
        !anyDocumentUploaded ||
        (hasExternalLink && !wpApprovalData?.isMarkedComplete)
    return (
        <div className="px-4 py-2 w-full max-w-[inherit] h-full bg-white rounded-[10px]">
            <div className="grid grid-cols-4 gap-x-5">
                <div className="col-span-2">
                    <WorkplaceDetail student={wpApprovalData?.student} />
                </div>

                {/* <div className="">
                    <AvailableMeetingDates dates={wpApprovalData?.dates} />
                </div> */}

                <div className="col-span-2 w-full">
                    <Typography variant="label" medium center block>
                        Workplace on map
                    </Typography>
                    <div className="rounded-xl w-full overflow-hidden mt-2">
                        <WorkplaceMapBoxView
                            industryLocation={
                                !wpApprovalData?.location
                                    ? wpApprovalData?.industry?.location?.split(
                                          ','
                                      )
                                    : wpApprovalData?.location.location?.split(
                                          ','
                                      )
                            }
                            studentLocation={studentLoc}
                            workplaceName={wpApprovalData?.industry}
                            showMap
                        />
                    </div>
                </div>
            </div>
            {data?.assessmentEvidence?.length > 0 ||
            data?.otherDocs?.length > 0 ? (
                <UploadIndustryRequiredDocs
                    data={data}
                    workplaceRequest={wpApprovalData}
                />
            ) : null}
            {hasExternalLink && (
                <PrePlacementForm wpApprovalData={wpApprovalData} />
            )}

            <div className="w-full border border-[#D5D5D5] rounded-md p-3 grid grid-cols-5 gap-x-2.5 mt-3">
                <div className="col-span-2">
                    <StudentWorkplaceInfo industry={wpApprovalData} />
                </div>

                <div className="col-span-3">
                    <WorkplaceAvailableSlots
                        workingHours={wpApprovalData?.industry?.workingHours}
                    />
                </div>
            </div>

            {/*  */}
            {/* {allRequiredDocumentsUploaded && ( */}
            <WorkplaceApprovalActions
                onCancel={() => {
                    if (onCancel) {
                        onCancel()
                    }
                }}
                declaration={wpApprovalData?.declaration}
                wpApprovalId={wpApprovalData?.id}
                dates={wpApprovalData?.dates}
                subAdminUserId={wpApprovalData?.student?.subadmin?.user?.id}
                shouldDisableApprove={shouldDisableApprove}
            />
            {/* )} */}
        </div>
    )
}
