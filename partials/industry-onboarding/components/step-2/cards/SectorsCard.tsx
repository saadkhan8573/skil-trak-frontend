import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import { Badge, Card } from '@components'
import { Label } from '@components/ui/label'
import { industryChecks } from '../mockData'
import { IndustryCheckInfoModal } from '../modal/IndustryCheckInfoModal'
import { SectorEligibilityModal } from '../modal/SectorEligibilityModal'
import { SectorItem } from './SectorItem'
import { AdminApi, IndustryApi } from '@queries'

const SECTOR_CONFIGS = [
    {
        name: 'Community Services',
        icon: '🏠',
        color: '#044866',
        bgColor: 'rgba(4, 72, 102, 0.05)',
    },
    {
        name: 'Disability',
        icon: '♿',
        color: '#0D5468',
        bgColor: 'rgba(13, 84, 104, 0.05)',
    },
    {
        name: 'Mental Health',
        icon: '🧠',
        color: '#044866',
        bgColor: 'rgba(4, 72, 102, 0.05)',
    },
    {
        name: 'Health Care',
        icon: '⚕️',
        color: '#0D5468',
        bgColor: 'rgba(13, 84, 104, 0.05)',
    },
    {
        name: 'Individual Support',
        icon: '🤝',
        color: '#044866',
        bgColor: 'rgba(4, 72, 102, 0.05)',
    },
]

const getSectorConfig = (sectorName: string) =>
    SECTOR_CONFIGS.find((s) => s.name === sectorName) || SECTOR_CONFIGS[0]

const getIndustryCheckInfo = (checkId: string) =>
    industryChecks.find((c) => c.id === checkId)

export function SectorsCard({
    data,
    onChange,
    errors,
    handleAddSector,
    uniqueSectors,
    course,
}: any) {
    const [expandedSector, setExpandedSector] = useState<string | null>(
        uniqueSectors?.length > 0 ? uniqueSectors[0]?.id : null
    )
    const [selectedIndustryCheck, setSelectedIndustryCheck] = useState<
        string | null
    >(null)
    const [eligibilityDialogOpen, setEligibilityDialogOpen] = useState(false)
    const [confirmedSectorId, setConfirmedSectorId] = useState<string>('')
    const [qualificationLevel, setQualificationLevel] = useState<string>('')
    const [confirmedSectorsData, setConfirmedSectorsData] = useState<any[]>([])

    // Restore saved qualification level when switching sectors so re-expanded
    // confirmed sectors immediately show their available courses.
    // React.useEffect(() => {
    //     const saved = data.sectors?.find(
    //         (s: any) => String(s.id) === String(expandedSector)
    //     )?.supervisorLevel
    //     setQualificationLevel(saved || '')
    // }, [expandedSector])
    React.useEffect(() => {
        if (!expandedSector) return

        const sector = data.sectors?.find(
            (s: any) => String(s.id) === String(expandedSector)
        )

        const savedLevel = sector?.supervisorLevel
        const fallbackLevel = course?.level // 👈 ONLY SOURCE

        const finalLevel = savedLevel || fallbackLevel || ''

        setQualificationLevel(finalLevel)

        // 🔥 Sync into actual form state
        if (!savedLevel && fallbackLevel) {
            updateSector(expandedSector, {
                supervisorLevel: fallbackLevel,
            })
        }
    }, [expandedSector, course])

    const {
        data: questions,
        isLoading: questionsLoading,
        isError: questionsError,
    } = AdminApi.SectorClusters.useSectorClusterQuestions(
        Number(expandedSector),
        {
            skip: !expandedSector,
        }
    )
    const resolvedLevel = qualificationLevel || course?.level
    const {
        data: coursesByLevel,
        isLoading: coursesLoading,
        isError: coursesError,
    } = IndustryApi.Supervisor.useCoursesBySupervisorLevel(
        {
            id: expandedSector,
            params: { level: resolvedLevel },
        },
        { skip: !expandedSector || !resolvedLevel }
    )

    // -------------------------------------------------------------------------
    // Sector state helpers
    // -------------------------------------------------------------------------

    const toggleSectorExpansion = (sectorId: any) => {
        setExpandedSector((prev) =>
            String(prev) === String(sectorId) ? null : sectorId
        )
    }

    const removeSector = (sectorId: any) => {
        onChange({
            ...data,
            sectors: data.sectors.filter(
                (s: any) => String(s.id) !== String(sectorId)
            ),
        })
        setExpandedSector((prev) =>
            String(prev) === String(sectorId) ? null : prev
        )
    }

    // Cluster sectors are updated directly; API-mapped sectors are rebuilt from
    // uniqueSectors so their static API data is never lost.
    const updateSector = (sectorId: any, updates: any) => {
        const clusterSectors =
            data.sectors?.filter((s: any) => s.isClusterSector) || []
        const isCluster = clusterSectors.some(
            (s: any) => String(s.id) === String(sectorId)
        )

        if (isCluster) {
            onChange({
                ...data,
                sectors: data.sectors.map((s: any) =>
                    String(s.id) === String(sectorId) ? { ...s, ...updates } : s
                ),
            })
        } else {
            onChange({
                ...data,
                sectors: [
                    ...(uniqueSectors?.map((s: any) => {
                        const existing =
                            data.sectors?.find(
                                (ds: any) =>
                                    !ds.isClusterSector &&
                                    String(ds.id) === String(s.id)
                            ) || {}
                        return String(s.id) === String(sectorId)
                            ? { ...s, ...existing, ...updates }
                            : { ...s, ...existing }
                    }) || []),
                    ...clusterSectors,
                ],
            })
        }
    }

    const updateIndustryCheck = (
        sectorId: string,
        checkId: any,
        updates: Record<string, any>
    ) => {
        const sectorState = data.sectors.find(
            (s: any) => String(s.id) === String(sectorId)
        )
        const existing = sectorState?.industryChecks || []
        const alreadyTracked = existing.some(
            (c: any) => String(c.id) === String(checkId)
        )

        // Upsert: if this check hasn't been toggled before, add it; otherwise update it
        const updatedChecks = alreadyTracked
            ? existing.map((c: any) =>
                  String(c.id) === String(checkId) ? { ...c, ...updates } : c
              )
            : [...existing, { id: checkId, ...updates }]

        updateSector(sectorId, { industryChecks: updatedChecks })
    }

    const toggleCustomCheck = (sectorId: string, enabled: boolean) => {
        const sectorState = data.sectors.find((s: any) => s.id === sectorId)
        const current = (sectorState as any)?.customCheck || {
            name: '',
            capacity: '',
            link: '',
            description: '',
            required: false,
            enabled: false,
        }
        updateSector(sectorId, { customCheck: { ...current, enabled } } as any)
    }

    const updateCustomCheckField = (
        sectorId: string,
        field: string,
        value: any
    ) => {
        const sectorState = data.sectors.find((s: any) => s.id === sectorId)
        const current = (sectorState as any)?.customCheck || {
            name: '',
            capacity: '',
            link: '',
            description: '',
            required: false,
            enabled: true,
        }
        updateSector(sectorId, {
            customCheck: { ...current, [field]: value },
        } as any)
    }

    const toggleQuestion = (
        sectorId: string,
        questionId: number,
        checked: boolean
    ) => {
        const sectorState = data.sectors.find((s: any) => s.id === sectorId)
        updateSector(sectorId, {
            questionChecks: {
                ...(sectorState?.questionChecks || {}),
                [questionId]: checked,
            },
        })
    }

    const toggleTask = (sectorId: string, courseId: number, taskId: number) => {
        const current: Record<
            string,
            Record<number, number[]>
        > = data.selectedTaskIds || {}
        const sectorTasks = current[sectorId] || {}
        const courseTasks = sectorTasks[courseId] || []
        const isSelected = courseTasks.includes(taskId)
        onChange({
            ...data,
            selectedTaskIds: {
                ...current,
                [sectorId]: {
                    ...sectorTasks,
                    [courseId]: isSelected
                        ? courseTasks.filter((id: number) => id !== taskId)
                        : [...courseTasks, taskId],
                },
            },
        })
    }

    // -------------------------------------------------------------------------
    // Validation helpers
    // -------------------------------------------------------------------------

    const areAllQuestionsChecked = (sectorId: any) => {
        const sectorState = data.sectors.find(
            (s: any) => String(s.id) === String(sectorId)
        )
        const checks = sectorState?.questionChecks || {}

        // Static questions must all be checked
        const staticIds = ['static_1', 'static_2', 'static_3']
        const allStaticChecked = staticIds.every((id) => checks[id])

        // API questions must all be checked (if loaded)
        if (questionsLoading || questionsError) return false
        const allApiChecked =
            !questions || questions.length === 0
                ? true
                : questions.every((q: any) => checks[q.id])
        // && allApiChecked
        return allStaticChecked
    }

    const isSectorReadyToConfirm = (sectorId: any) => {
        const s = data.sectors.find(
            (ds: any) => String(ds.id) === String(sectorId)
        )
        if (!s) return false
        return !!(
            s.supervisorName?.trim() &&
            (s.supervisorLevel || course?.level) &&
            s.title?.trim() &&
            s.capacity >= 1
        )
    }

    // -------------------------------------------------------------------------
    // Confirm + cluster sector handlers
    // -------------------------------------------------------------------------

    const handleConfirmSector = (sectorId: any) => {
        const sectorState = data.sectors.find(
            (s: any) => String(s.id) === String(sectorId)
        )
        const isCluster = !!sectorState?.isClusterSector

        updateSector(sectorId, { confirmed: true })
        setConfirmedSectorsData((prev) => {
            const exists = prev.find((s) => String(s.id) === String(sectorId))
            if (exists) {
                return prev.map((s) =>
                    String(s.id) === String(sectorId)
                        ? { ...sectorState, confirmed: true }
                        : s
                )
            }
            return [...prev, { ...sectorState, confirmed: true }]
        })

        // Only open the suggested sectors modal for non-cluster (API-mapped) sectors.
        // if (!isCluster) {
        //     setConfirmedSectorId(String(sectorId))
        //     setEligibilityDialogOpen(true)
        // }
        const hasCourse = !!course?.level

        if (!isCluster && !hasCourse) {
            setConfirmedSectorId(String(sectorId))
            setEligibilityDialogOpen(true)
        }

        // Collapse the confirmed sector and auto-expand the next one.
        const clusterSectors =
            data.sectors?.filter((s: any) => s.isClusterSector) || []
        const allSectorsNow = [...(uniqueSectors || []), ...clusterSectors]
        const currentIndex = allSectorsNow.findIndex(
            (s: any) => String(s.id) === String(sectorId)
        )
        const nextSector = allSectorsNow[currentIndex + 1]
        setExpandedSector(nextSector ? nextSector.id : null)
    }

    const handleAddClusterSector = (clusterSector: any) => {
        if (
            data.sectors?.some(
                (s: any) => String(s.id) === String(clusterSector.id)
            )
        )
            return
        onChange({
            ...data,
            sectors: [
                ...(data.sectors || []),
                {
                    ...clusterSector,
                    isClusterSector: true,
                    supervisorName: '',
                    supervisorLevel: '',
                    qualificationTitle: '',
                    capacity: undefined,
                    industryChecks: clusterSector.industryChecks || [],
                    questionChecks: {},
                    confirmed: false,
                },
            ],
        })
        setExpandedSector(clusterSector.id)
    }

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------

    // API-mapped sectors always come first; cluster-added sectors follow.
    const allSectors = [
        ...(uniqueSectors || []),
        ...(data.sectors?.filter((s: any) => s.isClusterSector) || []),
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card
                noPadding
                className="border-0 shadow-xl bg-linear-to-br from-white to-gray-50/30 hover-lift"
            >
                <div
                    className="rounded-t-xl p-4"
                    style={{
                        background: `linear-gradient(135deg, rgba(4, 72, 102, 0.08) 0%, rgba(13, 84, 104, 0.05) 100%)`,
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="size-10 rounded-xl flex items-center justify-center shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, #044866 0%, #0D5468 100%)`,
                            }}
                        >
                            <Building2 className="size-6 text-white" />
                        </div>
                        <div>
                            <h3 className="gradient-text text-lg">
                                Industry Sectors Configuration
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                🏢 Set up sectors where you can provide quality
                                professional placements
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base font-semibold">
                                    Your Active Sectors
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ✅ Configure details for each sector below
                                </p>
                            </div>
                            <Badge variant="secondary" className="px-3 py-1">
                                {allSectors.length} Configured
                            </Badge>
                        </div>

                        <AnimatePresence>
                            {allSectors.map((sector: any, index: number) => {
                                const sectorConfig = getSectorConfig(
                                    sector.name
                                )
                                const isExpanded =
                                    String(expandedSector) === String(sector.id)
                                const sectorState = data.sectors.find(
                                    (s: any) =>
                                        String(s.id) === String(sector.id)
                                )

                                return (
                                    <SectorItem
                                        key={sector.id}
                                        sector={sector}
                                        sectorState={sectorState}
                                        sectorConfig={sectorConfig}
                                        index={index}
                                        isExpanded={isExpanded}
                                        questions={questions}
                                        questionsLoading={questionsLoading}
                                        questionsError={questionsError}
                                        coursesByLevel={coursesByLevel}
                                        {...(course
                                            ? { courseLevel: course?.level }
                                            : {})}
                                        coursesLoading={coursesLoading}
                                        coursesError={coursesError}
                                        qualificationLevel={qualificationLevel}
                                        selectedTaskIds={
                                            data.selectedTaskIds || {}
                                        }
                                        errors={errors || {}}
                                        allQuestionsChecked={areAllQuestionsChecked(
                                            sector.id
                                        )}
                                        isReadyToConfirm={isSectorReadyToConfirm(
                                            sector.id
                                        )}
                                        onToggleExpand={() =>
                                            toggleSectorExpansion(sector.id)
                                        }
                                        onRemove={() => {
                                            if (sector.isClusterSector) {
                                                removeSector(sector.id)
                                            } else {
                                                // TODO: Remove via delete API when available
                                                console.log(
                                                    'Remove API sector via delete endpoint:',
                                                    sector.id,
                                                    sector.name
                                                )
                                            }
                                        }}
                                        onUpdateSector={(updates) =>
                                            updateSector(sector.id, updates)
                                        }
                                        onUpdateIndustryCheck={(
                                            checkId,
                                            updates
                                        ) =>
                                            updateIndustryCheck(
                                                sector.id,
                                                checkId,
                                                updates
                                            )
                                        }
                                        onToggleCustomCheck={(enabled) =>
                                            toggleCustomCheck(
                                                sector.id,
                                                enabled
                                            )
                                        }
                                        onUpdateCustomCheckField={(
                                            field,
                                            value
                                        ) =>
                                            updateCustomCheckField(
                                                sector.id,
                                                field,
                                                value
                                            )
                                        }
                                        onToggleQuestion={(
                                            questionId,
                                            checked
                                        ) =>
                                            toggleQuestion(
                                                sector.id,
                                                questionId,
                                                checked
                                            )
                                        }
                                        onToggleTask={(courseId, taskId) =>
                                            toggleTask(
                                                sector.id,
                                                courseId,
                                                taskId
                                            )
                                        }
                                        onQualificationLevelChange={
                                            setQualificationLevel
                                        }
                                        onConfirmSector={() =>
                                            handleConfirmSector(sector.id)
                                        }
                                    />
                                )
                            })}
                        </AnimatePresence>

                        {allSectors.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>
                                    No sectors configured yet. Add your first
                                    sector above to get started.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            <IndustryCheckInfoModal
                selectedIndustryCheck={selectedIndustryCheck}
                setSelectedIndustryCheck={setSelectedIndustryCheck}
                getIndustryCheckInfo={getIndustryCheckInfo}
            />

            <SectorEligibilityModal
                data={data}
                confirmedSectorId={confirmedSectorId}
                eligibilityDialogOpen={eligibilityDialogOpen}
                setEligibilityDialogOpen={setEligibilityDialogOpen}
                onAddClusterSector={handleAddClusterSector}
            />
        </motion.div>
    )
}
