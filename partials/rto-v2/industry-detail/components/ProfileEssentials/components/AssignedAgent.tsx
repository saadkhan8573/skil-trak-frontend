import { Button } from '@components'
import { UserRoles } from '@constants'
import { useAppSelector } from '@redux/hooks'
import { getUserCredentials } from '@utils'
import { User, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { ReassignAgentModal } from './ReassignAgentModal'

export function AssignedAgent() {
    const [showAssignModal, setShowAssignModal] = useState(false)
    const { assignedAgent, industryId } = useAppSelector((state) => ({
        assignedAgent: state.industry.industryDetail?.favoriteBy?.user,
        industryId: state.industry.industryDetail?.id,
    }))

    const user = getUserCredentials()

    return (
        <div className="bg-linear-to-br from-[#FAFBFC] to-white rounded-xl border-2 border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* Header */}
            <div className="bg-linear-to-r from-[#044866]/5 to-[#0D5468]/5 px-4 py-3 border-b border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-md">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A2332] text-sm">
                                Assigned Agent
                            </h3>
                            <p className="text-[9px] text-[#64748B]">
                                Direct point of contact for this industry
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-linear-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center">
                        {assignedAgent?.avatar ? (
                            <img
                                src={assignedAgent.avatar}
                                alt={assignedAgent.name}
                                className="w-full h-full rounded-lg object-cover"
                            />
                        ) : (
                            <span className="text-white font-medium">
                                {assignedAgent?.name?.charAt(0) || (
                                    <User className="w-5 h-5" />
                                )}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-[#1A2332] text-xs font-medium">
                            {assignedAgent?.name || 'N/A'}
                        </p>
                        <p className="text-[#64748B] text-[10px]">
                            {assignedAgent?.email || 'N/A'}
                        </p>
                    </div>
                </div>

                {(user?.role === UserRoles.ADMIN ||
                    [78, 4453].includes(user?.id)) && (
                    <div className="flex items-center gap-2">
                        <Button
                            fullWidth
                            onClick={() => setShowAssignModal(true)}
                            variant="primaryNew"
                        >
                            <UserPlus className="w-3 h-3 mr-1" />
                            {assignedAgent ? 'Reassign' : 'Assign'}
                        </Button>
                    </div>
                )}
            </div>

            {showAssignModal && industryId && (
                <ReassignAgentModal
                    open={showAssignModal}
                    onOpenChange={setShowAssignModal}
                    industryId={industryId}
                    currentAgentId={assignedAgent?.id}
                />
            )}
        </div>
    )
}
