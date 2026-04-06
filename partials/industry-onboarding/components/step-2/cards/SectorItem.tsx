import { motion } from 'framer-motion'
import { Collapsible, CollapsibleContent } from '@components/ui'
import { SectorItemHeader } from './SectorItemHeader'
import { SectorPrerequisites } from './SectorPrerequisites'
import { SupervisorForm } from './SupervisorForm'
import { IndustryChecksForm } from './IndustryChecksForm'
import { AvailableCourses } from './AvailableCourses'
import { ConfirmSectorBanner } from './ConfirmSectorBanner'

interface SectorItemProps {
    sector: any
    sectorState: any
    sectorConfig: any
    index: number
    isExpanded: boolean
    questions: any[]
    questionsLoading: boolean
    questionsError: boolean
    coursesByLevel: any
    coursesLoading: boolean
    coursesError: boolean
    qualificationLevel: string
    selectedTaskIds: Record<string, Record<number, number[]>>
    errors: Record<string, string>
    allQuestionsChecked: boolean
    isReadyToConfirm: boolean
    onToggleExpand: () => void
    onRemove: () => void
    onUpdateSector: (updates: any) => void
    onUpdateIndustryCheck: (checkId: any, updates: Record<string, any>) => void
    onToggleCustomCheck: (enabled: boolean) => void
    onUpdateCustomCheckField: (field: string, value: any) => void
    onToggleQuestion: (questionId: number, checked: boolean) => void
    onToggleTask: (courseId: number, taskId: number) => void
    onQualificationLevelChange: (value: string) => void
    onConfirmSector: () => void
}

export function SectorItem({
    sector,
    sectorState,
    sectorConfig,
    index,
    isExpanded,
    questions,
    questionsLoading,
    questionsError,
    coursesByLevel,
    coursesLoading,
    coursesError,
    qualificationLevel,
    selectedTaskIds,
    errors,
    allQuestionsChecked,
    isReadyToConfirm,
    onToggleExpand,
    onRemove,
    onUpdateSector,
    onUpdateIndustryCheck,
    onToggleCustomCheck,
    onUpdateCustomCheckField,
    onToggleQuestion,
    onToggleTask,
    onQualificationLevelChange,
    onConfirmSector,
}: SectorItemProps) {
    const showSupervisorFields = sector.isClusterSector || allQuestionsChecked

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            <div
                className="border-2 rounded-2xl shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm"
                style={{ borderColor: `${sectorConfig.color}20`, backgroundColor: sectorConfig.bgColor }}
            >
                <SectorItemHeader
                    sector={sector}
                    sectorState={sectorState}
                    sectorConfig={sectorConfig}
                    isExpanded={isExpanded}
                    onToggleExpand={onToggleExpand}
                    onRemove={onRemove}
                />

                <Collapsible open={isExpanded}>
                    <CollapsibleContent>
                        <div className="p-6 space-y-6 bg-white/60 backdrop-blur-sm">
                            {!sector.isClusterSector && (
                                <SectorPrerequisites
                                    sector={sector}
                                    sectorState={sectorState}
                                    questions={questions}
                                    questionsLoading={questionsLoading}
                                    questionsError={questionsError}
                                    allQuestionsChecked={allQuestionsChecked}
                                    onToggleQuestion={onToggleQuestion}
                                />
                            )}

                            {showSupervisorFields && (
                                <>
                                    <SupervisorForm
                                        sector={sector}
                                        sectorState={sectorState}
                                        index={index}
                                        errors={errors}
                                        onUpdateSector={onUpdateSector}
                                        onQualificationLevelChange={onQualificationLevelChange}
                                    />

                                    <IndustryChecksForm
                                        sector={sector}
                                        sectorState={sectorState}
                                        sectorConfig={sectorConfig}
                                        onUpdateSector={onUpdateSector}
                                        onUpdateIndustryCheck={onUpdateIndustryCheck}
                                        onToggleCustomCheck={onToggleCustomCheck}
                                        onUpdateCustomCheckField={onUpdateCustomCheckField}
                                    />

                                    <AvailableCourses
                                        qualificationLevel={qualificationLevel}
                                        coursesByLevel={coursesByLevel}
                                        coursesLoading={coursesLoading}
                                        coursesError={coursesError}
                                        sectorConfig={sectorConfig}
                                        sectorId={sector.id}
                                        selectedTaskIds={selectedTaskIds}
                                        onToggleTask={onToggleTask}
                                    />

                                    {isReadyToConfirm && !sectorState?.confirmed && (
                                        <ConfirmSectorBanner onConfirm={onConfirmSector} />
                                    )}
                                </>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </motion.div>
    )
}
