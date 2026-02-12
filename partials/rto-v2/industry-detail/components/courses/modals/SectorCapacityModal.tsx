import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@components/ui/dialog'
import { Button } from '@components'
import { Label } from '@components/ui/label'
import { SubAdminApi } from '@queries'
import { useNotification } from '@hooks'
import { Loader2, Users, TrendingUp, AlertCircle, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils'

import { useAppSelector } from '@redux/hooks'

interface SectorCapacityModalProps {
    isOpen: boolean
    onClose: () => void
    industryId: number
    sectorId: number
    sectorName: string
}

export function SectorCapacityModal({
    isOpen,
    onClose,
    industryId,
    sectorId,
    sectorName,
}: SectorCapacityModalProps) {
    const { notification } = useNotification()
    const [capacity, setCapacity] = useState<string>('') // Use string for input handling
    const [isEditing, setIsEditing] = useState(false)

    const { industrySectorCapacity } = useAppSelector((state) => state.industry)

    // Mutation to update capacity
    const [updateCapacity, { isLoading: isUpdating }] =
        SubAdminApi.Industry.useSectorBaseCapacity()

    const [updateOldCapacity, { isLoading: isUpdatingOld }] =
        SubAdminApi.Industry.useUpdateOldCapacityToSectorBase()

    const currentSectorData = industrySectorCapacity?.find(
        (data: any) => data.sector.id === sectorId
    )

    const currentCapacity = currentSectorData?.capacity || 0
    const enrolledCount = currentSectorData?.enrolled || 0

    // Initialize input when data loads
    useEffect(() => {
        if (currentSectorData) {
            setCapacity(currentSectorData.capacity.toString())
        }
    }, [currentSectorData])

    const handleUpdate = async () => {
        const val = parseInt(capacity)
        if (isNaN(val) || val < 1 || val > 100) {
            notification.error({
                title: 'Invalid Capacity',
                description: 'Capacity must be between 1 and 100.',
            })
            return
        }

        try {
            if (currentSectorData) {
                await updateCapacity({
                    id: currentSectorData.id,
                    body: { capacity: val },
                }).unwrap()
            } else {
                await updateOldCapacity({
                    id: industryId,
                    body: {
                        capacity: [
                            {
                                sector: sectorId,
                                capacity: val,
                            },
                        ],
                    },
                }).unwrap()
            }

            notification.success({
                title: 'Capacity Updated',
                description: `Capacity for ${sectorName} updated to ${val}.`,
            })
            setIsEditing(false)
            onClose()
        } catch (error) {
            console.error(error)
            // Error notification is usually handled globally or we can add it here
        }
    }

    const utilization =
        currentCapacity > 0
            ? Math.round((enrolledCount / currentCapacity) * 100)
            : 0

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
                {/* Header with Gradient */}
                <div className="bg-linear-to-r from-[#044866] to-[#0D5468] p-6 text-white pb-8">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                            <Users className="w-5 h-5 opacity-80" />
                            Manage Capacity
                        </DialogTitle>
                        <DialogDescription className="text-teal-100/80">
                            Adjust placement slots for {sectorName}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 -mt-6">
                    {/* Stats Card */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 mb-6 relative z-10">
                        {false ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">
                                            Current Utilization
                                        </p>
                                        <h3 className="text-2xl font-bold text-slate-800 flex items-baseline gap-1">
                                            {utilization}%
                                            <span className="text-sm font-normal text-slate-400">
                                                filled
                                            </span>
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-teal-600" />
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${utilization}%`,
                                            }}
                                            className={cn(
                                                'h-full rounded-full transition-all duration-500',
                                                utilization >= 100
                                                    ? 'bg-red-500'
                                                    : utilization >= 80
                                                        ? 'bg-amber-500'
                                                        : 'bg-teal-500'
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>{enrolledCount} Enrolled</span>
                                        <span>
                                            {currentCapacity} Total Slots
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Edit Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="capacity"
                                className="text-sm font-semibold text-slate-700"
                            >
                                New Capacity Target
                            </Label>
                            <div className="relative">
                                <input
                                    id="capacity"
                                    type="number"
                                    min={1}
                                    max={100}
                                    placeholder="Enter capacity (1-100)"
                                    value={capacity}
                                    onChange={(e) =>
                                        setCapacity(e.target.value)
                                    }
                                    className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 h-11 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-lg"
                                />
                                <Users className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            </div>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Increasing capacity will open new slots for
                                students.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-2">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="h-11 px-6 border-slate-200 hover:bg-slate-50 text-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={
                                isUpdating ||
                                isUpdatingOld ||
                                !capacity ||
                                parseInt(capacity) === currentCapacity
                            }
                            className="h-11 px-6 bg-[#044866] hover:bg-[#0D5468] text-white shadow-lg shadow-teal-900/10"
                        >
                            {isUpdating || isUpdatingOld ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Update Capacity
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
