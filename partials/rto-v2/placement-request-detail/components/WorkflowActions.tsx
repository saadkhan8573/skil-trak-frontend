import { motion } from 'framer-motion'
import {
    User,
    FileText,
    Clock,
    ThumbsUp,
    ThumbsDown,
    Send,
    UserCheck,
    CalendarCheck,
    FileSignature,
    Play,
    CheckSquare,
    Award,
    Download,
    Sparkles,
    MapPinned,
} from 'lucide-react'
import { Button } from '@components'
import { StatusCard } from './InfoCard'
import { needsWorkplaceStagesEnum } from './workplaceStages'

interface WorkflowActionsProps {
    currentStatus: string
    selectedIndustry: string
    onStatusChange: (status: string) => void
    onAppointment: () => void
    onAgreement: () => void
    onSchedule: () => void
    onRejection: () => void
    onRunAutomation: () => void
    onFindManually: () => void
}

export function WorkflowActions({
    currentStatus,
    selectedIndustry,
    onStatusChange,
    onAppointment,
    onAgreement,
    onSchedule,
    onRejection,
    onRunAutomation,
    onFindManually,
}: WorkflowActionsProps) {
    const renderActions = () => {
        switch (currentStatus) {
            case needsWorkplaceStagesEnum.STUDENT_ADDED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={User}
                            title="Student Profile Created"
                            description="Generate a workplace request to begin the placement process."
                        />
                        <Button
                            variant="primaryNew"
                            fullWidth
                            onClick={() =>
                                onStatusChange(
                                    needsWorkplaceStagesEnum.REQUEST_GENERATED
                                )
                            }
                            Icon={FileText}
                            text="Generate Workplace Request"
                            className="shadow-lg"
                        />
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.REQUEST_GENERATED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={FileText}
                            title="Workplace Request Created"
                            description="Choose how to find a suitable industry placement."
                            variant="info"
                        />
                        <Button
                            variant="primaryNew"
                            fullWidth
                            onClick={onRunAutomation}
                            Icon={Sparkles}
                            text="Re-Run Automation"
                            className="shadow-lg"
                        />
                        <Button
                            variant="primaryNew"
                            outline
                            fullWidth
                            onClick={onFindManually}
                            Icon={MapPinned}
                            text="Find Workplace Manually"
                        />
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.WAITING_FOR_RTO:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={Clock}
                            title="Awaiting RTO Approval"
                            description={`Industry: ${selectedIndustry}\nRequest pending review`}
                            variant="warning"
                        />
                        <Button
                            variant="success"
                            fullWidth
                            onClick={() =>
                                onStatusChange(
                                    needsWorkplaceStagesEnum.WAITING_FOR_STUDENT
                                )
                            }
                            Icon={ThumbsUp}
                            text="RTO Approve"
                            className="shadow-lg"
                        />
                        <Button
                            variant="error"
                            outline
                            fullWidth
                            onClick={() =>
                                onStatusChange(
                                    needsWorkplaceStagesEnum.REQUEST_GENERATED
                                )
                            }
                            Icon={ThumbsDown}
                            text="RTO Reject"
                            className="border-red-400 text-red-400 hover:bg-red-50"
                        />
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.WAITING_FOR_STUDENT:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={User}
                            title="Awaiting Student Confirmation"
                            description="Student reviewing placement details"
                            variant="info"
                        />
                        <Button
                            variant="success"
                            fullWidth
                            onClick={() =>
                                onStatusChange(
                                    needsWorkplaceStagesEnum.WAITING_FOR_INDUSTRY
                                )
                            }
                            Icon={ThumbsUp}
                            text="Student Accept"
                            className="shadow-lg"
                        />
                        <Button
                            variant="error"
                            outline
                            fullWidth
                            onClick={onRejection}
                            Icon={ThumbsDown}
                            text="Student Reject"
                            className="border-red-400 text-red-400 hover:bg-red-50"
                        />
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.WAITING_FOR_INDUSTRY:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={Send}
                            title="Awaiting Industry Response"
                            description="Request sent to industry partner"
                            variant="info"
                        />
                        <Button
                            variant="success"
                            fullWidth
                            onClick={onAppointment}
                            Icon={ThumbsUp}
                            text="Industry Approve"
                            className="shadow-lg"
                        />
                        <Button
                            variant="error"
                            outline
                            fullWidth
                            onClick={() =>
                                onStatusChange(
                                    needsWorkplaceStagesEnum.REQUEST_GENERATED
                                )
                            }
                            Icon={ThumbsDown}
                            text="Industry Reject"
                            className="border-red-400 text-red-400 hover:bg-red-50"
                        />
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.APPOINTMENT:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={CalendarCheck}
                            title="Appointment Scheduled"
                            description="Meeting confirmed between parties"
                            variant="success"
                        />
                        <Button
                            variant="primaryNew"
                            fullWidth
                            onClick={() =>
                                onStatusChange(
                                    needsWorkplaceStagesEnum.AGREEMENT_PENDING
                                )
                            }
                            Icon={UserCheck}
                            text="Confirm Appointment Successful"
                            className="shadow-lg"
                        />
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.AGREEMENT_PENDING:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={FileText}
                            title="Agreement Pending Signatures"
                            description="Waiting for all parties to sign"
                            variant="warning"
                        />
                        <Button
                            variant="primaryNew"
                            fullWidth
                            onClick={onAgreement}
                            Icon={FileSignature}
                            text="Generate Agreement"
                            className="shadow-lg"
                        />
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.AGREEMENT_SIGNED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={FileSignature}
                            title="Agreement Fully Signed"
                            description="Ready to schedule placement dates"
                            variant="success"
                        />
                        <Button
                            variant="primaryNew"
                            fullWidth
                            onClick={onSchedule}
                            Icon={CalendarCheck}
                            text="Confirm Placement Schedule"
                            className="shadow-lg"
                        />
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.PLACEMENT_STARTED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={Play}
                            title="Placement In Progress"
                            description="Student actively completing placement hours"
                            variant="success"
                        />
                        <Button
                            variant="primaryNew"
                            fullWidth
                            onClick={() =>
                                onStatusChange(
                                    needsWorkplaceStagesEnum.SCHEDULE_COMPLETED
                                )
                            }
                            Icon={CheckSquare}
                            text="Mark Schedule as Complete"
                            className="shadow-lg"
                        />
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.SCHEDULE_COMPLETED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={CheckSquare}
                            title="Schedule Completed"
                            description="Collect documents and feedback"
                            variant="success"
                        />
                        <Button
                            variant="primaryNew"
                            fullWidth
                            onClick={() =>
                                onStatusChange(
                                    needsWorkplaceStagesEnum.COMPLETED
                                )
                            }
                            Icon={Award}
                            text="Mark as Completed"
                            className="shadow-lg"
                        />
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.COMPLETED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <StatusCard
                            icon={Award}
                            title="Placement Completed!"
                            description="All requirements successfully met"
                            variant="success"
                        />
                        <Button
                            variant="secondary"
                            outline
                            fullWidth
                            Icon={Download}
                            text="Download Certificate"
                        />
                    </motion.div>
                )

            default:
                return null
        }
    }

    return <>{renderActions()}</>
}
