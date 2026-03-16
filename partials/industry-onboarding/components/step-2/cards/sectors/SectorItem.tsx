import { useSectorManager } from '../../hooks/useSectorManager'
import { Sector } from '../../types/sectorsAndCourses'
import { motion } from 'framer-motion'
import { SectorHeader } from './SectorHeader'
import { Collapsible, CollapsibleContent } from '@components/ui'
import { SectorDetails } from './SectorDetails'
interface SectorItemProps {
    sector: Sector
    index: number
    isExpanded: boolean
    onToggleExpand: () => void
    onRemove: () => void
    errors: Record<string, string>
    manager: ReturnType<typeof useSectorManager>
    isSectorFullyConfigured: boolean
    firstSectorEligible: boolean
}

export const SectorItem: React.FC<SectorItemProps> = ({
    sector,
    index,
    isExpanded,
    onToggleExpand,
    onRemove,
    errors,
    manager,
    isSectorFullyConfigured,
    firstSectorEligible,
}) => {
    const sectorConfig = manager.getSectorConfig(sector.name)

    return (
        <motion.div
            key={sector.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            <div
                className="border-2 rounded-2xl shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm"
                style={{
                    borderColor: `${sectorConfig.color}20`,
                    backgroundColor: sectorConfig.bgColor,
                }}
            >
                <SectorHeader
                    sector={sector}
                    sectorConfig={sectorConfig}
                    isExpanded={isExpanded}
                    onToggleExpand={onToggleExpand}
                    onRemove={onRemove}
                />

                <Collapsible open={isExpanded}>
                    <CollapsibleContent>
                        <SectorDetails
                            sector={sector}
                            index={index}
                            sectorConfig={sectorConfig}
                            errors={errors}
                            isEligible={firstSectorEligible}
                            isSectorFullyConfigured={isSectorFullyConfigured}
                            getFilteredCoursesForSector={
                                manager.getFilteredCoursesForSector
                            }
                            getCoursePrerequisites={
                                manager.getCoursePrerequisites
                            }
                            getIndustryCheckInfo={manager.getIndustryCheckInfo}
                            onUpdateSector={(updates) =>
                                manager.updateSector(sector.id, updates)
                            }
                            onUpdateIndustryCheck={(checkId, field, value) =>
                                manager.updateIndustryCheck(
                                    sector.id,
                                    checkId,
                                    field,
                                    value
                                )
                            }
                            onUpdateCoursePrerequisite={(
                                courseId,
                                field,
                                value
                            ) =>
                                manager.updateCoursePrerequisite(
                                    sector.id,
                                    courseId,
                                    field,
                                    value
                                )
                            }
                            onConfirmSector={() =>
                                manager.updateSector(sector.id, {
                                    confirmed: true,
                                })
                            }
                        />
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </motion.div>
    )
}
