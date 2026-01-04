import { AuthorizedUserComponent, Button } from '@components'
import { useAppSelector } from '@redux/hooks'
import { User, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { ReassignAgentModal } from './ReassignAgentModal'
import { UserRoles } from '@constants'

export function AssignedAgent() {
    const [showAssignModal, setShowAssignModal] = useState(false)
    const { assignedAgent, industryId } = useAppSelector((state) => ({
        assignedAgent: state.industry.industryDetail?.favoriteBy?.user,
        industryId: state.industry.industryDetail?.id,
    }))

    return (
        <>
            <div className="space-y-2.5 bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-3 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <h3 className="text-[#1A2332] flex items-center gap-1.5 text-sm">
                        <div className="w-5 h-5 bg-[#044866]/10 rounded-lg flex items-center justify-center">
                            <User className="w-3 h-3 text-[#044866]" />
                        </div>
                        Assigned Agent
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center">
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

                <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
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
                </AuthorizedUserComponent>
            </div>

            {showAssignModal && industryId && (
                <ReassignAgentModal
                    open={showAssignModal}
                    onOpenChange={setShowAssignModal}
                    industryId={industryId}
                    currentAgentId={assignedAgent?.id}
                />
            )}
        </>
    )
}
