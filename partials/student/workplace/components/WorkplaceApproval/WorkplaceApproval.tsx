import { Typography } from '@components'
import { AvailableMeetingDates } from './AvailableMeetingDates'
import { StudentWorkplaceInfo } from './StudentWorkplaceInfo'
import { WorkplaceApprovalActions } from './WorkplaceApprovalActions'
import { WorkplaceAvailableSlots } from './WorkplaceAvailableSlots'
import { WorkplaceDetail } from './WorkplaceDetail'
import { WorkplaceMapBoxView } from './WorkplaceMapBoxView'
import { UploadIndustryRequiredDocs } from './UploadIndustryRequiredDocs'
import { StudentApi } from '@queries'
import { PrePlacementForm } from './PrePlacementForm'

export const WorkplaceApproval = ({
    onCancel,
    wpApprovalData,
}: {
    wpApprovalData: any
    onCancel?: () => void
}) => {
    const { data, isLoading, isError } =
        StudentApi.Workplace.useWpApprovalRequestIndustryChecks(
            wpApprovalData.id,
            { skip: !wpApprovalData?.id }
        )

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
                        {/* <WorkplaceMapView
                            industryLocation={wpApprovalData?.industry?.location?.split(
                                ','
                            )}
                            studentLocation={wpApprovalData?.student?.location?.split(
                                ','
                            )}
                            workplaceName={wpApprovalData?.industry?.user?.name}
                            showMap
                        /> */}
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
                            studentLocation={wpApprovalData?.student?.location?.split(
                                ','
                            )}
                            workplaceName={wpApprovalData?.industry}
                            showMap
                        />
                    </div>
                </div>
            </div>
            {data?.assessmentEvidence?.length > 0 && (
                <UploadIndustryRequiredDocs
                    data={data}
                    workplaceRequest={wpApprovalData}
                />
            )}
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
