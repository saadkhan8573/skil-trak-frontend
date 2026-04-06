import { Button, EmptyData, ShowErrorNotifications } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { AdminApi, RtoV2Api } from '@queries'
import { UserStatus } from '@types'
import { Check, Search, UserPlus } from 'lucide-react'
import { useState } from 'react'

interface ReassignAgentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    industryId: number
    currentAgentId?: number
}

export function ReassignAgentModal({
    open,
    onOpenChange,
    industryId,
    currentAgentId,
}: ReassignAgentModalProps) {
    const [search, setSearch] = useState('')
    const [selectedAgentId, setSelectedAgentId] = useState<number | null>(
        currentAgentId || null
    )

    // Fetch coordinators
    const { data, isLoading } = AdminApi.SubAdmins.useListQuery(
        {
            search: `status:${
                UserStatus.Approved
            },isAssociatedWithRto:${false}${search ? `,name:${search}` : ''}`,
            skip: 0,
            limit: 50, // Fetch top 50 matches
        },
        {
            skip: !open,
        }
    )

    const [assignAgent, assignAgentResult] =
        RtoV2Api.Industries.assignIndustryToCoordinator()

    const handleConfirm = async () => {
        if (!selectedAgentId) return

        try {
            await assignAgent({
                id: industryId,
                subadminId: selectedAgentId,
            }).unwrap()
            onOpenChange(false)
        } catch (error) {
            console.error('Failed to assign agent:', error)
        }
    }

    const coordinators = data?.data || []

    return (
        <>
            <ShowErrorNotifications result={assignAgentResult} />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden p-0 [&>button]:text-white">
                    <DialogHeader className="bg-linear-to-r from-[#044866] to-[#0D5468] px-6 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-white font-bold text-lg">
                                    Reassign Coordinator
                                </DialogTitle>
                                <DialogDescription className="text-white/80 text-sm">
                                    Select a coordinator to manage this industry
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="px-6 space-y-2">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search coordinators..."
                                className="block w-full pl-10 pr-3 py-2 bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8] border border-[#E2E8F0] rounded-md text-sm text-[#1A2332] placeholder-[#94A3B8] hover:border-[#044866]/30 focus:outline-none focus:ring-2 focus:ring-[#044866]/20 focus:border-[#044866] transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Coordinators List */}
                        <div className="overflow-y-auto pr-1 space-y-2 max-h-[50vh]">
                            {isLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="h-16 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : coordinators.length > 0 ? (
                                coordinators.map((coordinator: any) => {
                                    const isSelected =
                                        selectedAgentId === coordinator.id
                                    return (
                                        <div
                                            key={coordinator.id}
                                            onClick={() =>
                                                setSelectedAgentId(
                                                    coordinator.id
                                                )
                                            }
                                            className={`
                                            group flex items-center justify-between px-4 py-2 rounded-lg border-2 transition-all cursor-pointer
                                            ${
                                                isSelected
                                                    ? 'border-[#044866] bg-linear-to-br from-[#044866]/5 to-[#0D5468]/5 shadow-md'
                                                    : 'border-[#E2E8F0] hover:border-[#044866]/30 hover:bg-linear-to-br hover:from-gray-50 hover:to-gray-100'
                                            }
                                        `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`
                                                w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all
                                                ${
                                                    isSelected
                                                        ? 'bg-linear-to-br from-[#044866] to-[#0D5468] text-white shadow-lg'
                                                        : 'bg-linear-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-white group-hover:to-gray-50'
                                                }
                                            `}
                                                >
                                                    {coordinator.user.avatar ? (
                                                        <img
                                                            src={
                                                                coordinator.user
                                                                    .avatar
                                                            }
                                                            alt={
                                                                coordinator.user
                                                                    .name
                                                            }
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        coordinator.user.name
                                                            ?.charAt(0)
                                                            .toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <h4
                                                        className={`text-sm font-semibold ${
                                                            isSelected
                                                                ? 'text-[#044866]'
                                                                : 'text-[#1A2332]'
                                                        }`}
                                                    >
                                                        {coordinator.user.name}
                                                    </h4>
                                                    <p className="text-xs text-[#64748B]">
                                                        {coordinator.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className={`
                                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                            ${
                                                isSelected
                                                    ? 'border-[#044866] bg-[#044866] shadow-md'
                                                    : 'border-gray-300'
                                            }
                                        `}
                                            >
                                                {isSelected && (
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-center p-8">
                                    <EmptyData
                                        title="No coordinators found"
                                        description="Try adjusting your search terms"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-3">
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            loading={assignAgentResult.isLoading}
                            disabled={
                                !selectedAgentId ||
                                selectedAgentId === currentAgentId ||
                                assignAgentResult.isLoading
                            }
                            variant="primaryNew"
                        >
                            <UserPlus className="w-4 h-4" />
                            Assign Coordinator
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
