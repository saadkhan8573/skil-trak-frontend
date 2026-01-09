import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { SubAdminApi } from '@queries'
import { useNotification } from '@hooks'
import {
    Button,
    LoadingAnimation,
    NoData,
    ShowErrorNotifications,
} from '@components'
import { AlertCircle, CheckCircle2, ChevronRight, FileText } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector } from '@redux'

interface AssignCourseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    industryId: number
    sectorId: number
    documentUrl: string
}

export function AssignCourseModal({
    open,
    onOpenChange,
    industryId,
    sectorId,
    documentUrl,
}: AssignCourseModalProps) {
    const { notification } = useNotification()
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null
    )
    const [showConfirmation, setShowConfirmation] = useState(false)

    const pendingCourses = useAppSelector(
        (state) => state.industry.pendingCourses
    )

    const [assignDoc, assignDocResult] =
        SubAdminApi.Industry.assignChecklistToCourseApproval()

    const onAssign = async () => {
        if (!selectedCourseId) return

        try {
            const res: any = await assignDoc({
                approvalId: selectedCourseId,
                body: { file: documentUrl },
            }).unwrap()

            if (res) {
                notification.success({
                    title: 'Document Assigned',
                    description:
                        'The document has been assigned to the course successfully',
                })
                setShowConfirmation(false)
                onOpenChange(false)
                setSelectedCourseId(null)
            }
        } catch (error) {
            // Error handled by ShowErrorNotifications
        }
    }

    const courses = pendingCourses || []
    const selectedCourse = courses.find((c: any) => c.id === selectedCourseId)

    console.log({ courses })

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (!val) {
                    setShowConfirmation(false)
                    setSelectedCourseId(null)
                }
                onOpenChange(val)
            }}
        >
            <DialogContent className="sm:max-w-[500px] overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
                <ShowErrorNotifications result={assignDocResult} />

                <AnimatePresence mode="wait">
                    {!showConfirmation ? (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col h-full"
                        >
                            <div className="bg-[#044866] p-6 text-white">
                                <DialogHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold text-white">
                                                Assign to Course
                                            </DialogTitle>
                                            <DialogDescription className="text-white/70 text-xs">
                                                Select a pending course to
                                                assign this document
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>
                            </div>

                            <div className="p-6 max-h-[400px] overflow-y-auto">
                                {courses.length === 0 ? (
                                    <div className="py-8">
                                        <NoData text="No pending courses found for this sector" />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {courses.map((approval: any) => (
                                            <button
                                                key={approval.id}
                                                onClick={() =>
                                                    setSelectedCourseId(
                                                        approval.id
                                                    )
                                                }
                                                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 group ${
                                                    selectedCourseId ===
                                                    approval.id
                                                        ? 'border-[#044866] bg-[#044866]/5 shadow-md'
                                                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span
                                                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                    selectedCourseId ===
                                                                    approval.id
                                                                        ? 'bg-[#044866] text-white'
                                                                        : 'bg-slate-100 text-slate-600'
                                                                }`}
                                                            >
                                                                {
                                                                    approval
                                                                        .course
                                                                        ?.code
                                                                }
                                                            </span>
                                                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                                Pending
                                                            </span>
                                                        </div>
                                                        <p
                                                            className={`text-sm font-bold truncate ${
                                                                selectedCourseId ===
                                                                approval.id
                                                                    ? 'text-[#044866]'
                                                                    : 'text-slate-700'
                                                            }`}
                                                        >
                                                            {
                                                                approval.course
                                                                    ?.title
                                                            }
                                                        </p>
                                                    </div>
                                                    {selectedCourseId ===
                                                        approval.id && (
                                                        <motion.div
                                                            initial={{
                                                                scale: 0,
                                                            }}
                                                            animate={{
                                                                scale: 1,
                                                            }}
                                                            className="w-6 h-6 rounded-full bg-[#044866] flex items-center justify-center shadow-lg"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                                <Button
                                    variant="secondary"
                                    onClick={() => onOpenChange(false)}
                                    className="bg-white border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primaryNew"
                                    onClick={() => setShowConfirmation(true)}
                                    disabled={!selectedCourseId}
                                    className="bg-gradient-to-r from-[#044866] to-[#0D5468] text-white font-bold shadow-lg shadow-[#044866]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    Icon={ChevronRight}
                                >
                                    Assign to Course
                                </Button>
                            </DialogFooter>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="confirmation"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white"
                        >
                            <div className="bg-amber-50 px-8 py-2 flex items-center gap-6 border-b border-amber-100">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 shadow-lg shadow-amber-200/50">
                                    <AlertCircle className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-[#1A2332]">
                                        Confirm Assignment
                                    </h3>
                                    <p className="text-amber-700/80 text-sm font-medium">
                                        Please review before proceeding
                                    </p>
                                </div>
                            </div>

                            <div className="px-8 py-3.5 space-y-6">
                                <div className="bg-slate-50 rounded-2xl px-6 py-2 border border-slate-100 space-y-4">
                                    <DialogDescription className="text-slate-600 text-sm leading-relaxed font-medium">
                                        Are you sure you want to assign the
                                        selected file to this course? This
                                        action will link the checklist to the
                                        course approval request.
                                    </DialogDescription>

                                    <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-[#044866]/5 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-[#044866]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                Selected Course
                                            </p>
                                            <p className="text-sm font-bold text-[#1A2332] leading-snug">
                                                {selectedCourse?.course?.title}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="px-8 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center gap-4 sm:justify-between">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowConfirmation(false)}
                                    className="bg-white border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex-1 sm:flex-none"
                                >
                                    Back to selection
                                </Button>
                                <Button
                                    variant="primaryNew"
                                    onClick={onAssign}
                                    loading={assignDocResult.isLoading}
                                    disabled={assignDocResult.isLoading}
                                    className="bg-gradient-to-r from-[#044866] to-[#0D5468] text-white font-extrabold shadow-xl shadow-[#044866]/20 px-8 flex-1 sm:flex-none"
                                >
                                    Yes, Assign Now
                                </Button>
                            </DialogFooter>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
