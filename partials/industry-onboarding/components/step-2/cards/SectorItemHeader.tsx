import {
    Award,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    GraduationCap,
    School,
    Users,
    X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge, Button } from '@components'
import { SupervisorQualification } from '@partials/common'

interface SectorItemHeaderProps {
    sector: any
    sectorState: any
    sectorConfig: { color: string; icon: string }
    isExpanded: boolean
    onToggleExpand: () => void
    onRemove: () => void
}

export function SectorItemHeader({
    sector,
    sectorState,
    sectorConfig,
    isExpanded,
    onToggleExpand,
    onRemove,
}: SectorItemHeaderProps) {
    const displayName = sector.code
        ? `${sector.name} - ${sector.code}`
        : sector.name

    const supervisorLevelLabel =
        SupervisorQualification.find(
            (q) => q.value === sectorState?.supervisorLevel
        )?.label ?? sectorState?.supervisorLevel
    return (
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div
                            className="size-10 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg"
                            style={{ backgroundColor: sectorConfig.color }}
                        >
                            <School />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {displayName}
                                </h3>
                                {sectorState?.confirmed && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="text-xs font-semibold uppercase tracking-wide">
                                            Confirmed
                                        </span>
                                    </motion.div>
                                )}
                            </div>
                            {sectorState?.supervisorName && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Award
                                        className="w-4 h-4"
                                        style={{ color: sectorConfig.color }}
                                    />
                                    <span className="font-medium text-gray-600">
                                        Supervisor:{' '}
                                        {sectorState?.supervisorName}
                                    </span>
                                    {sectorState?.supervisorLevel && (
                                        <>
                                            <span className="text-gray-300">
                                                •
                                            </span>
                                            <span
                                                className="font-semibold"
                                                style={{
                                                    color: sectorConfig.color,
                                                }}
                                            >
                                                {supervisorLevelLabel}
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            onClick={onToggleExpand}
                            className="hover:bg-white/50"
                            title={
                                isExpanded
                                    ? 'Collapse sector details'
                                    : 'Expand sector details'
                            }
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </Button>
                        <Button
                            variant="error"
                            onClick={onRemove}
                            disabled={!sector.isClusterSector}
                            title={
                                !sector.isClusterSector
                                    ? 'API-mapped sectors cannot be removed'
                                    : 'Remove sector'
                            }
                            className="hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-4">
                <div className="flex items-center gap-3">
                    {/* <motion.div
                        className=""
                        whileHover={{ scale: 1.02 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 10,
                        }}
                    > */}

                    <Badge
                        text={`${sector?.capacity?.capacity ?? sector?.capacity ?? 0} Capacity`}
                        Icon={Users}
                        variant="info"
                    />
                    {/* </motion.div> */}

                    <div className="flex-1 flex items-center gap-2 flex-wrap">
                        {/* <Badge
                            text="Facility Checklist Required"
                            Icon={CheckCircle}
                            variant="info"
                        /> */}

                        {(sectorState?.title || sector?.qualificationTitle) && (
                            <Badge
                                className="text-xs bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
                                Icon={GraduationCap}
                                text={sectorState?.title || sector?.qualificationTitle}
                                title="Qualification title"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
