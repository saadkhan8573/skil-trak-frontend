import { AnimatePresence } from 'framer-motion'
import { SectorItem } from './SectorItem'
import { Badge } from '@components/ui/badge'
import { Label } from '@components/ui/label'
import { EmptySectorState } from './EmptySecotrState'
import { Sector } from '../../types/sectorsAndCourses'
import { useSectorManager } from '../../hooks/useSectorManager'

interface SectorListProps {
    sectors: Sector[]
    expandedSector: string | null
    onToggleExpand: (id: string) => void
    onRemove: (id: string) => void
    errors: Record<string, string>
    manager: ReturnType<typeof useSectorManager>
    firstSectorEligible: boolean
}

export const SectorList: React.FC<SectorListProps> = ({
    sectors,
    expandedSector,
    onToggleExpand,
    onRemove,
    errors,
    manager,
    firstSectorEligible,
}) => {
    if (sectors.length === 0) return <EmptySectorState />

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-base font-semibold">
                        Your Active Sectors
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                        ✅ All sectors shown expanded - configure details for
                        each sector below
                    </p>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                    {sectors.length} Configured
                </Badge>
            </div>

            <AnimatePresence>
                {sectors.map((sector: Sector, index: number) => (
                    <SectorItem
                        key={sector.id}
                        sector={sector}
                        index={index}
                        isExpanded={expandedSector === sector.id}
                        onToggleExpand={() => onToggleExpand(sector.id)}
                        onRemove={() => onRemove(sector.id)}
                        errors={errors}
                        manager={manager}
                        isSectorFullyConfigured={manager.isSectorFullyConfigured(
                            sector
                        )}
                        firstSectorEligible={firstSectorEligible}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}
