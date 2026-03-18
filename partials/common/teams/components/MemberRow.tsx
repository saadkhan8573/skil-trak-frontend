import { useMemo, useState } from 'react'
import {
    TicketType,
    TicketTypeCategory,
    TICKETS_CONFIG,
    TICKET_TYPE_GROUPS,
    getTicketTypeLabel,
} from '../types'
import { InitialAvatar, Switch } from '@components'
import { cn } from '@utils'
import {
    AlertTriangle,
    Check,
    ChevronDown,
    ChevronUp,
    CreditCard,
    Headphones,
    MessageSquare,
    Settings,
} from 'lucide-react'

// We will use the TicketType enum and a config object instead of a hardcoded array here
// to support dynamic filtering by category

interface MemberRowProps {
    member: any
    canReceiveTickets: boolean
    selectedTypes: string[]
    category: TicketTypeCategory
    onUpdate: (updates: {
        canReceiveTickets?: boolean
        ticketTypes?: string[]
    }) => void
}

export function MemberRow({
    member,
    canReceiveTickets,
    selectedTypes,
    category = 'ALL',
    onUpdate,
}: MemberRowProps) {
    const [isPanelOpen, setIsPanelOpen] = useState(false)

    const name = member.subadmin?.user?.name || 'Unknown Member'
    const role = member.subadmin?.role?.name || member?.role || 'Team Member'

    const handleToggle = (e: any) => {
        const newValue = e.target.checked
        onUpdate({ canReceiveTickets: newValue })

        if (newValue && selectedTypes.length === 0) {
            setIsPanelOpen(true)
        } else if (!newValue) {
            setIsPanelOpen(false)
        }
    }

    const toggleType = (key: string) => {
        const newTypes = selectedTypes.includes(key)
            ? selectedTypes.filter((k) => k !== key)
            : [...selectedTypes, key]

        onUpdate({ ticketTypes: newTypes })
    }

    const availableTypes = useMemo(() => {
        const keys = TICKET_TYPE_GROUPS[category] || TICKET_TYPE_GROUPS.ALL
        return keys.map((key) => ({
            key,
            label: getTicketTypeLabel(key),
            ...TICKETS_CONFIG[key],
        }))
    }, [category])

    const activeBadges = useMemo(() => {
        return availableTypes.filter((t) => selectedTypes.includes(t.key))
    }, [selectedTypes, availableTypes])

    const isWarning = canReceiveTickets && selectedTypes.length === 0

    return (
        <div
            className={cn(
                'group flex flex-col rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md',
                canReceiveTickets
                    ? 'bg-emerald-50/20 border-emerald-300 shadow-emerald-900/5'
                    : 'bg-white border-slate-300 shadow-slate-900/5',
                isWarning &&
                    'border-amber-300 bg-amber-50/20 shadow-amber-900/5'
            )}
        >
            <div className="flex items-center gap-3 p-2.5">
                <div className="relative">
                    {name && (
                        <InitialAvatar
                            name={name}
                            imageUrl={member.subadmin?.user?.avatar}
                        />
                    )}
                    {canReceiveTickets && (
                        <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-800 truncate leading-none">
                        {name}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">
                        {role}
                    </p>
                    {canReceiveTickets && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                            {activeBadges.length > 0 ? (
                                activeBadges.map((t) => (
                                    <span
                                        key={t.key}
                                        className={cn(
                                            'text-[9px] font-bold px-1.5 py-0.5 rounded-md',
                                            t.color === 'indigo' &&
                                                'bg-indigo-100/80 text-indigo-700',
                                            t.color === 'orange' &&
                                                'bg-orange-100/80 text-orange-700',
                                            t.color === 'emerald' &&
                                                'bg-emerald-100/80 text-emerald-700',
                                            t.color === 'purple' &&
                                                'bg-purple-100/80 text-purple-700',
                                            t.color === 'blue' &&
                                                'bg-blue-100/80 text-blue-700',
                                            t.color === 'amber' &&
                                                'bg-amber-100/80 text-amber-700',
                                            t.color === 'rose' &&
                                                'bg-rose-100/80 text-rose-700',
                                            t.color === 'slate' &&
                                                'bg-slate-100/80 text-slate-700'
                                        )}
                                    >
                                        {t.label}
                                    </span>
                                ))
                            ) : (
                                <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600">
                                    <AlertTriangle className="size-2.5" />
                                    No types
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-5">
                    {canReceiveTickets && (
                        <button
                            onClick={() => setIsPanelOpen(!isPanelOpen)}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 flex items-center gap-1.5',
                                isPanelOpen
                                    ? 'bg-slate-800 text-white shadow-lg'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            )}
                        >
                            {isPanelOpen ? 'Done' : 'Manage Types'}
                            {isPanelOpen ? (
                                <ChevronUp className="size-2.5" />
                            ) : (
                                <ChevronDown className="size-2.5" />
                            )}
                        </button>
                    )}

                    <div className="flex flex-col items-end gap-1">
                        <span
                            className={cn(
                                'text-[8px] uppercase tracking-wider font-extrabold',
                                canReceiveTickets
                                    ? 'text-emerald-600'
                                    : 'text-slate-400'
                            )}
                        >
                            Ticket Access
                        </span>
                        <Switch
                            name={`canReceiveTickets_${member.id}`}
                            isChecked={canReceiveTickets}
                            onChange={handleToggle}
                            customStyleClass="profileSwitch"
                        />
                    </div>
                </div>
            </div>

            {/* Expandable Management Panel */}
            <div
                className={cn(
                    'overflow-auto transition-all duration-500 ease-in-out',
                    isPanelOpen && canReceiveTickets
                        ? 'max-h-[400px] opacity-100'
                        : 'max-h-0 opacity-0'
                )}
            >
                <div className="p-2.5 pt-0">
                    <div className="bg-white rounded-2xl border border-emerald-100/50 p-2.5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                                Assign Ticket Types
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium">
                                Select at least one
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {availableTypes.map((t) => (
                                <div
                                    key={t.key}
                                    onClick={() => toggleType(t.key)}
                                    className={cn(
                                        'relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200',
                                        selectedTypes.includes(t.key)
                                            ? 'border-emerald-500 bg-emerald-50/50'
                                            : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/50'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'size-8 rounded-lg flex items-center justify-center',
                                            t.color === 'indigo' &&
                                                'bg-indigo-100 text-indigo-600',
                                            t.color === 'orange' &&
                                                'bg-orange-100 text-orange-600',
                                            t.color === 'emerald' &&
                                                'bg-emerald-100 text-emerald-600',
                                            t.color === 'purple' &&
                                                'bg-purple-100 text-purple-600',
                                            t.color === 'blue' &&
                                                'bg-blue-100 text-blue-600',
                                            t.color === 'amber' &&
                                                'bg-amber-100 text-amber-600',
                                            t.color === 'rose' &&
                                                'bg-rose-100 text-rose-600',
                                            t.color === 'slate' &&
                                                'bg-slate-100 text-slate-600'
                                        )}
                                    >
                                        {t.icon && (
                                            <t.icon className="size-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800">
                                            {t.label}
                                        </p>
                                        <p className="text-[9px] text-slate-400 font-medium truncate">
                                            {t.desc || 'No description'}
                                        </p>
                                    </div>
                                    <div
                                        className={cn(
                                            'size-4 rounded-full border-2 flex items-center justify-center transition-all',
                                            selectedTypes.includes(t.key)
                                                ? 'bg-emerald-500 border-emerald-500'
                                                : 'bg-white border-slate-200'
                                        )}
                                    >
                                        {selectedTypes.includes(t.key) && (
                                            <Check className="size-2.5 text-white stroke-4" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isWarning && (
                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100 animate-in fade-in slide-in-from-top-1 duration-300">
                                <AlertTriangle className="size-3.5 text-amber-600" />
                                <p className="text-[10px] font-bold text-amber-700">
                                    Turn off ticket access if this member
                                    shouldn't receive any tickets.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
