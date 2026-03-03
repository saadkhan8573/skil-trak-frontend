import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@components/ui/dialog'
import { Button, Typography } from '@components'
import Image from 'next/image'
import { X } from 'lucide-react'

interface NoLogbookFoundModalProps {
    isOpen: boolean
    onClose: () => void
    rto: string
    course: string
}

export function NoLogbookFoundModal({
    isOpen,
    onClose,
    rto,
    course,
}: NoLogbookFoundModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                showCloseButton={false}
                className="max-w-2xl! p-0 overflow-hidden border-none rounded-xl shadow-2xl"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>No Logbook Found</DialogTitle>
                    <DialogDescription>
                        Alert for missing logbook in current placement
                    </DialogDescription>
                </DialogHeader>

                {/* Compact Header */}
                <div className="relative py-2 bg-primaryNew flex items-center justify-center overflow-hidden">
                    <div className="w-11 h-11 rounded-md bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/30">
                        <Image
                            alt=""
                            width={24}
                            height={24}
                            src="/images/students/schedule.png"
                            className="drop-shadow-lg"
                        />
                    </div>
                </div>

                <div className="px-6 pb-4 space-y-4 bg-white">
                    <div className="text-center space-y-1">
                        <Typography
                            semibold
                            className="text-xl text-slate-900 tracking-tight"
                        >
                            No Logbook Found
                        </Typography>
                        <div className="flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100/50 w-fit mx-auto">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                                Required
                            </span>
                        </div>
                    </div>

                    <div className="relative group px-4 rounded-2xl bg-borderNew/30 border border-slate-100 transition-all hover:bg-amber-50/30 hover:border-amber-100">
                        <Typography center>
                            <span className="text-sm leading-relaxed text-slate-600">
                                Please note that no logbook has been found for{' '}
                                <span className="block mt-1 font-bold text-slate-900 capitalize italic">
                                    Course: {course}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    at {rto}
                                </span>
                                <span className="block mt-3 pt-3 border-t border-slate-200/60 text-center">
                                    Please contact your{' '}
                                    <span className="font-semibold text-slate-900 border-b-2 border-amber-200/60">
                                        Head of Department
                                    </span>{' '}
                                    to upload it.
                                </span>
                            </span>
                        </Typography>
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={onClose}
                            className="w-full h-11 bg-primaryNew hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primaryNew/10 hover:-translate-y-0.5"
                        >
                            Got It
                        </Button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-3 right-3 p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-white/80 transition-all backdrop-blur-md"
                >
                    <X className="w-4 h-4" />
                </button>
            </DialogContent>
        </Dialog>
    )
}
