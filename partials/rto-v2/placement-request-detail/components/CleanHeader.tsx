import { Badge, Button, Typography } from '@components'
import { Select } from '@components/inputs/Select'
import { GlobalModal } from '@components/Modal/GlobalModal'
import { ScrollArea } from '@components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import { ViewQuestionsModal } from '@partials/common/StudentProfileDetail/components'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    BookOpen,
    Briefcase,
    CheckCircle2,
    CircleCheckBig,
    Play,
    Plus,
    Sparkles,
    Target,
    XCircle,
} from 'lucide-react'
import { Student } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { ManualNoteModal } from '@partials/rto-v2/placement-request-detail/modal/ManualNoteModal'
import { CancelWpRequest } from '@partials/rto-v2/student-detail/components/AllWorkplaces/components/CancelWpRequest'
import {
    CancelWorkplaceModal,
    CancelWorkplaceRequestModal,
} from '@partials/rto-v2/student-detail/components/AllWorkplaces/modals'
import { WorkplaceCurrentStatus } from '@utils'

interface CleanHeaderProps {
    isCancelled: boolean
    isPlacementStarted: boolean
    workplaceType: 'needs' | 'provided' | null
    onCancelSuccess: (reason: string) => void
    workflowStages: any[]
    currentStatus: any
    getCurrentStageIndex: () => number
    student: Student
    wpCurrStatus: WorkplaceCurrentStatus
}

export function CleanHeader({
    isCancelled,
    wpCurrStatus,
    isPlacementStarted,
    workplaceType,
    onCancelSuccess,
    workflowStages,
    currentStatus,
    getCurrentStageIndex,
    student,
}: CleanHeaderProps) {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [isWorkflowOpen, setIsWorkflowOpen] = useState(false)
    const router = useRouter()
    const wpId = router.query.id
    const lastTrueIndex = workflowStages
        ?.map((stage) => stage.completed)
        .lastIndexOf(true)

    const onViewAnswers = () => {
        setModal(
            <ViewQuestionsModal
                onCancel={() => setModal(null)}
                wpId={Number(wpId)}
                rtoUserId={student?.rto?.user?.id!}
            />
        )
    }

    const onAddNote = () => {
        setModal(<ManualNoteModal open={true} onClose={() => setModal(null)} />)
    }

    const onCancelClick = () => {
        setModal(null)
    }

    const onCancelWPClicked = () => {
        setModal(
            <CancelWorkplaceModal
                open={true}
                onOpenChange={onCancelClick}
                workplaceId={Number(wpId)}
                onSuccess={(reason) => {
                    onCancelSuccess(reason)
                    setModal(null)
                }}
            />
        )
    }

    const onCancelWPRequestClicked = () => {
        setModal(
            <CancelWorkplaceRequestModal
                open={true}
                onOpenChange={onCancelClick}
                workplaceId={Number(wpId)}
                onSuccess={(reason) => {
                    onCancelSuccess(reason)
                    setModal(null)
                }}
            />
        )
    }

    const onShowGuide = () => {
        setIsWorkflowOpen(true)
    }

    return (
        <>
            {modal}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border-b border-gray-200 sticky top-0 z-10"
            >
                <div className="px-8 py-4">
                    <div className="flex items-center justify-between max-w-[1900px] mx-auto">
                        {/* Left Section */}
                        <div className="flex items-center gap-6">
                            <div className="h-8 w-px bg-gray-200"></div>

                            <div>
                                <Typography
                                    variant="h3"
                                    className="text-primaryNew mb-1"
                                >
                                    Placement Management
                                </Typography>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2.5">
                            {/* Status Badge */}
                            {isCancelled && (
                                <Badge
                                    text="Cancelled"
                                    variant="error"
                                    outline
                                    Icon={XCircle}
                                    className="h-8 px-3"
                                />
                            )}
                            {isPlacementStarted && !isCancelled && (
                                <Badge
                                    text="Active"
                                    variant="success"
                                    Icon={Play}
                                    className="h-8 px-3"
                                />
                            )}
                            {workplaceType &&
                                !isCancelled &&
                                !isPlacementStarted && (
                                    <>
                                        <Badge
                                            text={
                                                workplaceType === 'provided'
                                                    ? 'Provided'
                                                    : 'Needs Workplace'
                                            }
                                            variant="primaryNew"
                                            Icon={Briefcase}
                                            className="py-2"
                                        />
                                        <Button
                                            variant={'info'}
                                            text="View Answers"
                                            disabled={
                                                workplaceType === 'provided'
                                            }
                                            onClick={onViewAnswers}
                                        />

                                        {/* Quick Actions */}
                                        {/* <div className="w-[140px]">
                                            <Select
                                                name="quickActions"
                                                options={quickActionOptions}
                                                onChange={(val: any) =>
                                                    handleQuickAction(val)
                                                }
                                                placeholder="Quick Actions"
                                            />
                                        </div> */}

                                        {/* Cancel Request */}
                                        {[
                                            WorkplaceCurrentStatus.Applied,
                                            WorkplaceCurrentStatus.CaseOfficerAssigned,
                                            WorkplaceCurrentStatus.Interview,
                                            WorkplaceCurrentStatus.IndustryEligibility,
                                            WorkplaceCurrentStatus.AwaitingStudentResponse,
                                            WorkplaceCurrentStatus.AwaitingRtoResponse,
                                            WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
                                            WorkplaceCurrentStatus.AppointmentBooked,
                                            WorkplaceCurrentStatus.AwaitingAgreementSigned,
                                        ].includes(wpCurrStatus) && (
                                            <CancelWpRequest
                                                fullWidth={false}
                                                onCancelWPClicked={
                                                    onCancelWPClicked
                                                }
                                                onCancelWPRequestClicked={
                                                    onCancelWPRequestClicked
                                                }
                                            />
                                        )}
                                    </>
                                )}

                            {/* Add Note */}
                            <Button
                                variant="secondary"
                                outline
                                onClick={onAddNote}
                                Icon={Plus}
                                text="Note"
                                className="h-8 border-gray-300 hover:border-primaryNew hover:bg-primaryNew/5 hover:text-primaryNew"
                            />

                            {/* Workflow Guide */}
                            <Button
                                variant="primaryNew"
                                outline
                                onClick={onShowGuide}
                                Icon={BookOpen}
                                text="Guide"
                                className="h-8"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Workflow Guide Modal */}
            {isWorkflowOpen && (
                <GlobalModal
                    onCancel={() => setIsWorkflowOpen(false)}
                    className="max-w-175"
                >
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                            <div className="p-3 bg-primaryNew rounded-xl">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <Typography
                                    variant="h2"
                                    className="text-primaryNew"
                                >
                                    Placement Workflow
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="text-gray-600 mt-1"
                                >
                                    Complete guide to placement management
                                </Typography>
                            </div>
                        </div>

                        <ScrollArea className="h-112.5 mt-6">
                            <div className="space-y-6 pr-4">
                                {/* Current Workflow */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-primaryNew rounded-lg">
                                            <Target className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <Typography
                                                variant="label"
                                                className="text-gray-900"
                                            >
                                                Active Workflow
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="text-gray-600 text-xs"
                                            >
                                                {workplaceType === 'provided'
                                                    ? 'Student Has Provided Workplace'
                                                    : workplaceType === 'needs'
                                                      ? 'Student Needs Workplace'
                                                      : 'Not Selected'}
                                            </Typography>
                                        </div>
                                    </div>
                                    {workplaceType && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg">
                                            <Badge
                                                text={`Stage ${
                                                    lastTrueIndex + 1
                                                } of ${workflowStages.length}`}
                                                variant="primaryNew"
                                                size="xs"
                                            />
                                            <Typography
                                                variant="small"
                                                className="text-gray-700"
                                            >
                                                {currentStatus?.stage}
                                            </Typography>
                                        </div>
                                    )}
                                </div>

                                {/* Workflow Stages */}
                                <div className="space-y-3">
                                    <Typography
                                        variant="label"
                                        className="text-gray-900"
                                    >
                                        Workflow Stages
                                    </Typography>

                                    <div className="space-y-2">
                                        {workflowStages.map((stage, index) => {
                                            const isCurrent =
                                                index === lastTrueIndex
                                            const isPast = index < lastTrueIndex

                                            return (
                                                <div
                                                    key={stage.id}
                                                    className={`p-3 rounded-lg border transition-all ${
                                                        isCurrent
                                                            ? 'bg-primaryNew/5 border-primaryNew'
                                                            : isPast
                                                              ? 'bg-emerald-50 border-emerald-200'
                                                              : 'bg-white border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`p-2 rounded-lg ${
                                                                isCurrent
                                                                    ? 'bg-primaryNew'
                                                                    : isPast
                                                                      ? 'bg-emerald-500'
                                                                      : 'bg-gray-300'
                                                            }`}
                                                        >
                                                            <CircleCheckBig className="h-4 w-4 text-white" />
                                                        </div>

                                                        <div className="flex-1 flex items-center justify-between">
                                                            <Typography
                                                                variant="small"
                                                                className={`font-medium ${
                                                                    isCurrent
                                                                        ? 'text-primaryNew'
                                                                        : isPast
                                                                          ? 'text-emerald-700'
                                                                          : 'text-gray-600'
                                                                }`}
                                                            >
                                                                {index + 1}.{' '}
                                                                {stage.stage}
                                                            </Typography>

                                                            {isCurrent && (
                                                                <Badge
                                                                    text="Current"
                                                                    variant="warning"
                                                                    size="xs"
                                                                />
                                                            )}

                                                            {isPast && (
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-500 rounded-lg">
                                            <Sparkles className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <Typography
                                                variant="label"
                                                className="text-gray-900 mb-2"
                                            >
                                                Quick Tips
                                            </Typography>
                                            <ul className="space-y-1.5 text-xs text-gray-700">
                                                <li>
                                                    • Use Quick Actions for
                                                    status changes
                                                </li>
                                                <li>
                                                    • Add notes at any stage for
                                                    tracking
                                                </li>
                                                <li>
                                                    • Monitor compliance checks
                                                    regularly
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </GlobalModal>
            )}
        </>
    )
}
