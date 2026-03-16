import { Button } from '@components'
import { Award, CheckCircle, ChevronDown, ChevronRight, X } from 'lucide-react'
import { SectorMetrics } from './SectorMetrics'
import { Sector, SectorConfig } from '../../types/sectorsAndCourses'
import { motion } from 'framer-motion'
interface SectorHeaderProps {
    sector: Sector
    sectorConfig: SectorConfig
    isExpanded: boolean
    onToggleExpand: () => void
    onRemove: () => void
}

export const SectorHeader: React.FC<SectorHeaderProps> = ({
    sector,
    sectorConfig,
    isExpanded,
    onToggleExpand,
    onRemove,
}) => (
    <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="p-6 pb-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg"
                        style={{ backgroundColor: sectorConfig.color }}
                    >
                        {sectorConfig.icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground">
                                {sector.name}
                            </h3>
                            {sector.confirmed && (
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
                        {sector.supervisorName && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Award
                                    className="w-4 h-4"
                                    style={{ color: sectorConfig.color }}
                                />
                                <span className="font-medium">
                                    Supervisor: {sector.supervisorName}
                                </span>
                                {sector.supervisorLevel && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <span
                                            className="font-semibold"
                                            style={{
                                                color: sectorConfig.color,
                                            }}
                                        >
                                            {sector.supervisorLevel}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="dark"
                        onClick={onToggleExpand}
                        className="hover:bg-white/50"
                        title={
                            isExpanded
                                ? 'Collapse sector details'
                                : 'Expand sector details'
                        }
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-primary" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </Button>

                    <Button
                        variant="error"
                        onClick={onRemove}
                        className="hover:bg-red-50 hover:text-red-600"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>

        <SectorMetrics sector={sector} />
    </div>
)
