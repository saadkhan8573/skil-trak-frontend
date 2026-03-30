import { useState, useMemo, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { ScrollArea } from '@components/ui/scroll-area'
import { User, Search, Info } from 'lucide-react'
import { MemberRow } from '../components'
import {
    BulkUpdateMemberItem,
    TeamMemberRole,
    TicketTypeCategory,
} from '../types'
import { useNotification } from '@hooks'
import { CommonApi } from '@redux'

interface TeamMembersModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    members: any[]
    teamName: string
    category?: string
}

export function TeamMembersModal({
    isOpen,
    onOpenChange,
    members = [],
    teamName,
    category,
}: TeamMembersModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [localMembers, setLocalMembers] = useState<any[]>([])
    const [initialMembers, setInitialMembers] = useState<any[]>([])
    const [bulkUpdate, { isLoading: isSaving }] =
        CommonApi.Teams.useBulkUpdateMembers()
    const { notification } = useNotification()

    // Initialize local state when members prop changes or modal opens
    useEffect(() => {
        if (isOpen && members) {
            const mapped = members.map((m) => ({
                id: m.id,
                name: m.subadmin?.user?.name || 'Unknown',
                canReceiveTickets: m?.canReceiveTickets || false,
                role: m?.role || TeamMemberRole.MEMBER,
                assignedRtoOnly: m?.assignedRtoOnly || false,
                assignedStudentOnly: m?.assignedStudentOnly || false,
                ticketTypes: m?.supportedTicketTypes || [],
                original: m,
            }))
            setLocalMembers(mapped)
            setInitialMembers(JSON.parse(JSON.stringify(mapped)))
        }
    }, [isOpen, members])

    const handleMemberUpdate = (
        id: string | number,
        updates: {
            canReceiveTickets?: boolean
            ticketTypes?: string[]
            role?: TeamMemberRole
            assignedRtoOnly?: boolean
            assignedStudentOnly?: boolean
        }
    ) => {
        setLocalMembers((prev) =>
            prev.map((m) => {
                if (m.id === id) {
                    return { ...m, ...updates }
                }
                // If we're setting a new lead, disable all other leads
                if (updates.role === TeamMemberRole.LEAD) {
                    return { ...m, role: TeamMemberRole.MEMBER }
                }
                return m
            })
        )
    }

    const filteredMembers = useMemo(() => {
        if (!searchQuery) return localMembers
        return localMembers.filter((m) =>
            (m.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [localMembers, searchQuery])

    const stats = useMemo(() => {
        const active = localMembers.filter((m) => m.canReceiveTickets).length
        return {
            active,
            inactive: localMembers.length - active,
        }
    }, [localMembers])

    const handleSave = async () => {
        try {
            // Only send changed members
            const updates: BulkUpdateMemberItem[] = localMembers
                .filter((m) => {
                    const initial = initialMembers.find((im) => im.id === m.id)
                    if (!initial) return true

                    const hasAccessChanged =
                        initial.canReceiveTickets !== m.canReceiveTickets
                    const hasRoleChanged = initial.role !== m.role
                    const hasRtoOnlyChanged =
                        initial.assignedRtoOnly !== m.assignedRtoOnly
                    const hasStudentOnlyChanged =
                        initial.assignedStudentOnly !== m.assignedStudentOnly
                    const hasTypesChanged =
                        JSON.stringify(initial.ticketTypes) !==
                        JSON.stringify(m.ticketTypes)

                    return (
                        hasAccessChanged ||
                        hasTypesChanged ||
                        hasRoleChanged ||
                        hasRtoOnlyChanged ||
                        hasStudentOnlyChanged
                    )
                })
                .map((m) => ({
                    memberId: m.id,
                    canReceiveTickets: m.canReceiveTickets,
                    role: m.role,
                    assignedRtoOnly: m.assignedRtoOnly,
                    assignedStudentOnly: m.assignedStudentOnly,
                    ticketTypes: m.canReceiveTickets ? m.ticketTypes : [],
                }))

            if (updates.length === 0) {
                onOpenChange(false)
                return
            }

            await bulkUpdate({ data: updates }).unwrap()

            notification.success({
                title: 'Success',
                description: 'Team member settings updated successfully',
            })
            onOpenChange(false)
        } catch (error: any) {
            notification.error({
                title: 'Error',
                description:
                    error?.data?.message || 'Failed to update team members',
            })
        }
    }

    const getTeamCategory = (name: string): TicketTypeCategory => {
        const lowerName = name.toLowerCase()
        if (lowerName.includes('student services')) return 'STUDENT_SERVICES'
        if (
            lowerName.includes('industry sourcing') ||
            lowerName.includes('sourcing')
        )
            return 'INDUSTRY_SOURCING'
        return 'ALL'
    }

    const teamCategory = getTeamCategory(category || teamName)

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl! h-auto max-h-[90vh] p-0 gap-0 overflow-hidden border shadow-2xl rounded-2xl bg-white flex flex-col">
                <div className="bg-primaryNew p-4 space-y-2.5 relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 size-28 bg-white/10 rounded-full -mr-14 -mt-14 blur-2xl" />

                    <DialogHeader className="p-0">
                        <div className="flex items-start justify-between">
                            <DialogTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
                                <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/10 shadow-sm backdrop-blur-sm">
                                    <User className="size-4 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="leading-tight">
                                        {teamName} Members
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-white/60 font-medium">
                                            Manage ticket assignment permissions
                                        </span>
                                        <span className="text-[9px] font-bold text-white bg-white/20 px-1.5 py-0.5 rounded-md border border-white/10">
                                            {teamCategory.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="relative mt-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
                        <input
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 border-white/15 text-white text-xs placeholder:text-white/40 pl-9 focus-visible:outline-none h-8.5 rounded-lg border"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/20">
                            <div className="size-1 rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-50">
                                {stats.active} can receive tickets
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                            <div className="size-1 rounded-full bg-white/30" />
                            <span className="text-[10px] font-bold text-white/70">
                                {stats.inactive} inactive
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0 p-3.5">
                    <ScrollArea className="max-h-[37vh]! md:max-h-[45vh]! lg:max-h-[50vh]! overflow-y-auto pr-4 -mr-4">
                        <div className="space-y-3">
                            {filteredMembers.map((m) => (
                                <MemberRow
                                    key={m.id}
                                    member={m.original}
                                    category={teamCategory}
                                    canReceiveTickets={m.canReceiveTickets}
                                    role={m.role}
                                    assignedRtoOnly={m.assignedRtoOnly}
                                    assignedStudentOnly={m.assignedStudentOnly}
                                    selectedTypes={m.ticketTypes}
                                    onUpdate={(updates) =>
                                        handleMemberUpdate(m.id, updates)
                                    }
                                />
                            ))}
                            {filteredMembers.length === 0 && (
                                <div className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                                    <Search className="size-10 opacity-20 mb-3" />
                                    <p className="text-sm font-medium">
                                        No members found matching "{searchQuery}
                                        "
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <div className="bg-slate-50 border-t p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground/70">
                        <Info className="size-3.5" />
                        <span className="text-[11px] font-medium">
                            Enable access, then choose which ticket types each
                            member can receive
                        </span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-primaryNew text-white text-xs font-bold rounded-xl shadow-lg shadow-primaryNew/20 hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
                    >
                        {isSaving ? 'Saving...' : 'Save & Close'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
