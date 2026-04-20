import { Button, Permissions } from '@components'
import { UserRoles } from '@constants'
import { IndustryCourseApproval, PermissionType } from '@types'
import { cn, getUserCredentials } from '@utils'
import { motion } from 'framer-motion'
import { AlertCircle, FileCheck, UploadCloud } from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'
import { ApproveFacilityChecklistDialog } from '../../modals/ApproveFacilityChecklistDialog'
import { UploadFacilityChecklistDialog } from '../../modals/UploadFacilityChecklistDialog'

export const PendingCourseApproval = ({
    approval,
    hasInitiatedESign,
}: {
    approval: IndustryCourseApproval
    hasInitiatedESign?: boolean
}) => {
    const [reviewFacilityChecklist, setReviewFacilityChecklist] =
        useState(false)
    const [uploadFacilityChecklist, setUploadFacilityChecklist] =
        useState(false)

    const user = getUserCredentials()
    const isLocal = process.env.NEXT_PUBLIC_NODE_ENV === 'local'
    const isAllowedUser = [4453, 78, 5714, 20365].includes(user?.id)
    const isAdmin = user?.role === UserRoles.ADMIN
    const showActionButtons =
        (isLocal || isAllowedUser || isAdmin) && !approval?.deletedAt

    const hasFile = !!approval?.file

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-linear-to-r from-[#F7A619]/10 to-[#EA580C]/10 border border-[#F7A619]/30 rounded-lg p-3"
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-linear-to-br from-[#F7A619] to-[#EA580C] rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1A2332]">
                                {hasFile
                                    ? 'Facility Checklist Ready for Review'
                                    : hasInitiatedESign
                                      ? 'E-sign in Progress'
                                      : 'Facility Checklist Missing'}
                            </p>
                            <p className="text-[10px] text-[#64748B]">
                                {hasFile
                                    ? `Industry partner signed on ${moment(
                                          approval?.createdAt
                                      ).fromNow()}`
                                    : hasInitiatedESign
                                      ? 'Waiting for industry partner to sign the document.'
                                      : 'Please upload the facility checklist to proceed with approval.'}
                            </p>
                        </div>
                    </div>
                    <Permissions
                        permission={PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS}
                    >
                        <div className="flex items-center gap-x-2">
                            {/* {hasFile ? ( */}
                            <Button
                                onClick={() => setUploadFacilityChecklist(true)}
                                className="bg-linear-to-r from-[#044866] to-[#0D5468] text-white text-xs h-9 px-4 gap-2 shadow-lg shadow-[#044866]/30"
                            >
                                <UploadCloud className="w-3.5 h-3.5" />
                                Manual E-sign Upload
                            </Button>
                            <Button
                                disabled={!showActionButtons}
                                onClick={() => setReviewFacilityChecklist(true)}
                                className={cn({
                                    'bg-linear-to-r from-[#F7A619] to-[#EA580C] hover:from-[#EA580C] hover:to-[#D97706] text-white text-xs h-9 px-4 gap-2 shadow-lg shadow-[#F7A619]/30':
                                        showActionButtons,
                                })}
                            >
                                <FileCheck className="w-3.5 h-3.5" />
                                Review & Approve
                            </Button>
                            {/* ) : ( */}
                            {/* )} */}
                        </div>
                    </Permissions>
                </div>
            </motion.div>

            <ApproveFacilityChecklistDialog
                open={reviewFacilityChecklist}
                approval={approval}
                onOpenChange={setReviewFacilityChecklist}
            />

            <UploadFacilityChecklistDialog
                open={uploadFacilityChecklist}
                approval={approval}
                onOpenChange={setUploadFacilityChecklist}
            />
        </>
    )
}
