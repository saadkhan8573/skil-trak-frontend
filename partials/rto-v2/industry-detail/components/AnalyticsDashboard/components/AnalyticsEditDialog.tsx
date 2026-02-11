import { Button, TextInput } from '@components'
import { Dialog, DialogContent, DialogTitle } from '@components/ui/dialog'
import { ScrollArea } from '@components/ui/scroll-area'
import { ArrowUp, Edit2, LucideIcon, X } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

interface AnalyticsEditDialogProps {
    selectedCard: {
        title: string
        value: string
        change: string
        changeText: string
        icon: LucideIcon
        gradient: string
        trend: string
        percentage?: number
        color: string
        showChart?: boolean
    } | null
    weeklyData: Array<{ value: number }>
    editedValue: string
    onEditedValueChange: (value: string) => void
    onClose: () => void
    open: boolean
}

export function AnalyticsEditDialog({
    selectedCard,
    weeklyData,
    editedValue,
    onEditedValueChange,
    onClose,
    open,
}: AnalyticsEditDialogProps) {
    if (!selectedCard) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 gap-0 bg-white border-none">
                {/* Header */}
                <div
                    className={`bg-linear-to-br ${selectedCard.gradient} p-6 text-white relative overflow-hidden rounded-t-2xl`}
                >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

                    <div className="relative flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl">
                                {selectedCard.icon && (
                                    <selectedCard.icon className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold mb-1 text-white">
                                    {selectedCard.title}
                                </DialogTitle>
                                <p className="text-white/80 text-sm">
                                    View and edit metric details
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="p-6 space-y-6">
                        {/* Current Value */}
                        <div className="bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8] rounded-xl p-6 border border-[#E2E8F0]">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-[#1A2332]">
                                    Current Value
                                </h4>
                                {selectedCard.trend === 'up' && (
                                    <div className="flex items-center gap-1.5 bg-[#10B981]/10 text-[#10B981] px-3 py-1.5 rounded-lg text-xs font-medium border border-[#10B981]/20">
                                        <ArrowUp className="w-4 h-4" />
                                        <span>
                                            {selectedCard.percentage}% increase
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-baseline gap-3">
                                <p className="text-5xl font-bold text-[#044866]">
                                    {selectedCard.value}
                                </p>
                                <div className="text-sm text-[#64748B]">
                                    <span className="font-semibold text-[#044866]">
                                        {selectedCard.change}
                                    </span>{' '}
                                    {selectedCard.changeText}
                                </div>
                            </div>
                        </div>

                        {/* Chart Section */}
                        {selectedCard.showChart && (
                            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
                                <h4 className="font-bold text-[#1A2332] mb-4">
                                    Trend Analysis (Last 7 Days)
                                </h4>
                                <div className="h-48">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart data={weeklyData}>
                                            <defs>
                                                <linearGradient
                                                    id="modal-gradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor={
                                                            selectedCard.color
                                                        }
                                                        stopOpacity={0.3}
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor={
                                                            selectedCard.color
                                                        }
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke={selectedCard.color}
                                                strokeWidth={3}
                                                fill="url(#modal-gradient)"
                                                dot={false}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Edit Value */}
                        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
                            <div className="flex items-center gap-2 mb-4">
                                <Edit2 className="w-5 h-5 text-[#044866]" />
                                <h4 className="font-bold text-[#1A2332]">
                                    Update Value
                                </h4>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <TextInput
                                        name="newValue"
                                        label="New Value"
                                        id="newValue"
                                        type="text"
                                        value={editedValue}
                                        onChange={(e: any) =>
                                            onEditedValueChange(e.target.value)
                                        }
                                        placeholder="Enter new value"
                                    />
                                </div>
                                <div className="bg-linear-to-br from-[#FEF3C7] to-[#FDE68A] rounded-lg p-4 border border-[#FDE68A]">
                                    <p className="text-xs text-[#92400E] leading-relaxed">
                                        <strong>Note:</strong> Updating this
                                        value will affect all related reports
                                        and analytics. Changes are tracked and
                                        can be audited.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8] rounded-xl p-4 border border-[#E2E8F0]">
                                <p className="text-xs font-medium text-[#64748B] mb-2 uppercase tracking-wide">
                                    Last Week
                                </p>
                                <p className="text-xl font-bold text-[#1A2332]">
                                    235
                                </p>
                                <p className="text-xs text-[#64748B] mt-1">
                                    Previous period
                                </p>
                            </div>
                            <div className="bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8] rounded-xl p-4 border border-[#E2E8F0]">
                                <p className="text-xs font-medium text-[#64748B] mb-2 uppercase tracking-wide">
                                    Average
                                </p>
                                <p className="text-xl font-bold text-[#1A2332]">
                                    241
                                </p>
                                <p className="text-xs text-[#64748B] mt-1">
                                    Monthly avg
                                </p>
                            </div>
                            <div className="bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8] rounded-xl p-4 border border-[#E2E8F0]">
                                <p className="text-xs font-medium text-[#64748B] mb-2 uppercase tracking-wide">
                                    Goal
                                </p>
                                <p className="text-xl font-bold text-[#1A2332]">
                                    300
                                </p>
                                <p className="text-xs text-[#64748B] mt-1">
                                    Target value
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                            <Button
                                onClick={onClose}
                                variant="secondary"
                                className="flex-1 px-6 py-3 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFB] text-[#64748B] rounded-xl font-medium transition-all duration-300 h-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-linear-to-br from-[#044866] to-[#0D5468] hover:shadow-xl text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 h-auto"
                            >
                                <Edit2 className="w-4 h-4" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
