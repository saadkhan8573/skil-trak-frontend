import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Pin, AlertCircle, Calendar, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@utils'
import { CommonApi } from '@queries'
import moment from 'moment'
import {
    LoadingAnimation,
    Typography,
    useWorldwideStudentDataRestriction,
} from '@components'
import { Skeleton } from '@components/ui/skeleton'
import { useNotification } from '@hooks'
import { PuffLoader } from 'react-spinners'
import { UserRoles } from '@constants'
import { useAppSelector } from '@redux'

interface PinnedNotesModalProps {
    isOpen: boolean
    onClose: () => void
    userId?: number
}

export const PinnedNotesModal = ({
    isOpen,
    onClose,
    userId,
}: PinnedNotesModalProps) => {
    const { notification } = useNotification()
    const notes = CommonApi.Notes.useStudentNotesList(userId!, {
        skip: !userId || !isOpen,
    })

    const [statusChange, statusChangeResult] = CommonApi.Notes.useStatusChange()

    const rtoUserId = useAppSelector((state) => state.rto.rtoDetail?.user?.id)

    const { hasPermission } = useWorldwideStudentDataRestriction({
        userId: rtoUserId,
    })

    const handleTogglePin = async (noteId: number) => {
        const res: any = await statusChange(noteId)
        if (res?.data) {
            notification.success({
                title: `Note ${res?.data?.isPinned ? 'Pinned' : 'Un-Pinned'}`,
                description: `Note ${
                    res?.data?.isPinned ? 'Pinned' : 'Un-Pinned'
                } Successfully`,
                position: 'topright',
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl! p-0 overflow-hidden border-none bg-white rounded-2xl shadow-2xl **:data-[slot=dialog-close]:text-white **:data-[slot=dialog-close]:opacity-100 **:data-[slot=dialog-close]:hover:opacity-80">
                <DialogHeader className="bg-linear-to-r from-[#044866] to-[#0D5468] px-5 py-4 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Pin className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-white font-semibold text-lg">
                                Pinned Notes
                            </DialogTitle>
                            <p className="text-white/80 text-xs">
                                Important student information
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content area */}
                <div className="max-h-[75vh] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {notes.isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="relative overflow-hidden rounded-xl border-l-4 border-slate-100 bg-slate-50/50 p-4"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1 space-y-2.5">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-5 w-48 rounded-md" />
                                                <Skeleton className="h-4 w-16 rounded-full" />
                                            </div>
                                            <div className="flex gap-4">
                                                <Skeleton className="h-3 w-32 rounded-sm" />
                                                <Skeleton className="h-3 w-24 rounded-sm" />
                                            </div>
                                        </div>
                                        <Skeleton className="w-7 h-7 rounded-lg" />
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <Skeleton className="h-4 w-full rounded-sm" />
                                        <Skeleton className="h-4 w-[90%] rounded-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notes.isError ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
                            <Typography variant="label">
                                Failed to load notes. Please try again.
                            </Typography>
                        </div>
                    ) : notes.data && notes.data.length > 0 ? (
                        notes.data.map((note: any, index: number) => {
                            const authorName =
                                [
                                    note.author?.role,
                                    note.assignedTo?.role,
                                ].includes(UserRoles.STUDENT) && !hasPermission
                                    ? 'Student'
                                    : (note.author?.name ??
                                      note.assignedTo?.name)
                            return (
                                <motion.div
                                    key={note.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        'relative overflow-hidden rounded-xl border-l-4 p-4 shadow-sm hover:shadow-md transition-all',
                                        'border-[#F7A619] bg-linear-to-r from-[#F7A619]/5 to-transparent'
                                    )}
                                >
                                    {/* Note Header */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <h4 className="text-slate-900 font-semibold text-sm">
                                                    {note.title ?? note.subject}
                                                </h4>
                                                <div className="flex items-center gap-1 bg-[#F7A619]/20 text-[#F7A619] px-1.5 py-0.5 rounded-full">
                                                    <AlertCircle className="w-2.5 h-2.5" />
                                                    <span className="text-[10px] font-medium">
                                                        Pinned
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>
                                                        {moment(
                                                            note.isEnabled ||
                                                                note.createdAt
                                                        )
                                                            .tz(
                                                                'Australia/Melbourne'
                                                            )
                                                            .format(
                                                                'ddd DD, MMM, yyyy [at] hh:mm A'
                                                            )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{authorName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            disabled={
                                                statusChangeResult.isLoading
                                            }
                                            onClick={() =>
                                                handleTogglePin(note.id)
                                            }
                                            className="w-7 cursor-pointer h-7 rounded-lg bg-[#044866] hover:bg-[#044866]/90 flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {statusChangeResult.isLoading &&
                                            statusChangeResult?.originalArgs ===
                                                note.id ? (
                                                <PuffLoader
                                                    size={16}
                                                    color="white"
                                                />
                                            ) : (
                                                <Pin className="w-3.5 h-3.5 text-white" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Note Content */}
                                    <div
                                        className="text-slate-700 text-sm leading-relaxed remove-text-bg customTailwingStyles"
                                        dangerouslySetInnerHTML={{
                                            __html: note.body ?? note.message,
                                        }}
                                    />

                                    {/* Background Decoration */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-white/50 to-transparent rounded-full blur-2xl -z-10"></div>
                                </motion.div>
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                            <Pin className="w-12 h-12 mb-2 opacity-20" />
                            <Typography variant="label">
                                No pinned notes found
                            </Typography>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
