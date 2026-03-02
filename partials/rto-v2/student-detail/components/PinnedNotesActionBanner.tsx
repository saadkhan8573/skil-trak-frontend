import { Button } from '@components'
import { Pin, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { PinnedNotesModal } from '../modals'
import { CommonApi } from '@redux'

export const PinnedNotesActionBanner = ({ userId }: { userId?: number }) => {
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false)

    const notes = CommonApi.Notes.useStudentNotesCount(userId!, {
        skip: !userId,
    })

    return (
        <div className="mt-3.5 relative">
            <div className="relative overflow-hidden bg-linear-to-r from-[#F7A619]/10 via-[#F7A619]/5 to-transparent border-l-4 border-[#F7A619] rounded-2xl p-3.5 shadow-lg hover:shadow-xl transition-all">
                <div className="absolute top-0 right-0 w-36 h-36 bg-linear-to-br from-[#F7A619]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#F7A619] to-[#F7A619]/80 flex items-center justify-center shadow-xl shadow-[#F7A619]/30">
                                <Pin className="w-4.5 h-4.5 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#044866] rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                                <span className="text-white text-xs">
                                    {notes?.data}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-slate-900 text-[15px]">
                                    Pinned Notes: You have {notes?.data}{' '}
                                    important notes flagged
                                </p>
                                <Sparkles className="w-3 h-3 text-[#F7A619]" />
                            </div>
                            <p className="text-sm text-slate-600">
                                Review pinned notes to stay updated on important
                                student information
                            </p>
                        </div>
                    </div>

                    {/* View Notes Button */}
                    <Button
                        onClick={() => setIsNotesModalOpen(true)}
                        className="bg-linear-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white px-6 py-2.5 rounded-xl shadow-lg shadow-[#044866]/25 hover:shadow-xl hover:shadow-[#044866]/30 transition-all hover:scale-105"
                    >
                        <Pin className="w-4 h-4 mr-2" />
                        View Notes
                    </Button>
                </div>
            </div>

            <PinnedNotesModal
                userId={userId}
                isOpen={isNotesModalOpen}
                onClose={() => setIsNotesModalOpen(false)}
            />
        </div>
    )
}
