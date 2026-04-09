import {
    CheckCircle,
    Clock,
    MessageSquare,
    Plus,
    StickyNote,
    Tag,
    User,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { TicketNote } from '../cards/types'
import { CommonApi } from '@queries'
import { Button, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import moment from 'moment'
import { TicketHistoryCard } from './TicketHistoryCard'

export const MainContentCard = ({ ticket }: any) => {
    const [newNote, setNewNote] = useState('')
    const { notification } = useNotification()
    const [addNote, addNoteResult] = CommonApi.Teams.useAddAutoTicketNote()
    const { data, isLoading, isError } =
        CommonApi.Teams.useAutomatedTicketNotes(ticket?.id, {
            skip: !ticket?.id,
        })

    const [updateTicketStatus, updateTicketStatusResult] =
        CommonApi.Teams.useUpdateTicketStatus()
    const handleAddNote = () => {
        if (newNote.trim()) {
            addNote({ id: ticket.id, body: { note: newNote } })
            setNewNote('')
        }
    }
    useEffect(() => {
        if (updateTicketStatusResult.isSuccess) {
            notification.success({
                title: 'Status updated in-progress',
                description:
                    'Ticket status updated to in-progress successfully',
            })
        }
    }, [updateTicketStatusResult.isSuccess])
    useEffect(() => {
        if (addNoteResult.isSuccess) {
            notification.success({
                title: 'Note added',
                description: 'Note added successfully',
            })
            if (data?.length === 0) {
                updateTicketStatus(ticket?.id)
            }
        }
    }, [addNoteResult.isSuccess])

    return (
        <>
            <ShowErrorNotifications result={addNoteResult} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Description Card */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
                        <h3 className="text-[#044866] text-sm mb-3 flex items-center gap-2">
                            <MessageSquare className="size-3 text-[#F7A619]" />
                            Description
                        </h3>
                        <div className="bg-linear-to-br from-[#044866]/5 via-[#0D5468]/5 to-[#F7A619]/5 rounded-lg p-4 border border-[#044866]/10">
                            <p className="text-[#044866] leading-relaxed text-xs">
                                {ticket?.description}
                            </p>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[#044866] flex items-center gap-2">
                                <StickyNote className="w-4 h-4 text-[#F7A619]" />
                                {/* Notes ({ticket?.notes?.length}) */}
                            </h3>
                        </div>

                        {/* Add Note Form */}
                        <div className="mb-4 p-3 bg-[#F7A619]/5 rounded-lg border border-[#F7A619]/20">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a new note..."
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7A619] focus:border-transparent resize-none mb-2"
                            />
                            <Button
                                onClick={handleAddNote}
                                disabled={
                                    addNoteResult.isLoading || !newNote.trim()
                                }
                                loading={addNoteResult.isLoading}
                                className="flex items-center gap-2 px-3 py-1.5 bg-[#F7A619] text-white text-sm rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Note
                            </Button>
                        </div>

                        {/* Notes List */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {data?.length > 0 ? (
                                data?.map((note: any) => (
                                    <div
                                        key={note.id}
                                        className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-[#044866] rounded-full flex items-center justify-center">
                                                    <User className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-xs text-[#044866]">
                                                    {note?.addedBy?.name ??
                                                        '---'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-[#0D5468]/60">
                                                {new Date(
                                                    note?.createdAt
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#0D5468] leading-relaxed">
                                            {note?.note}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-[#0D5468]/50 text-sm">
                                    No notes yet. Add your first note above.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags (if any) */}
                    {ticket?.supportTeam?.tags &&
                        ticket?.supportTeam?.tags?.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
                                <h3 className="text-[#044866] mb-3 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[#F7A619]" />
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {ticket?.supportTeam?.tags?.map(
                                        (tag: any, index: number) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 bg-[#0D5468]/10 text-[#0D5468] rounded-lg text-xs border border-[#0D5468]/20"
                                            >
                                                {tag}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Resolution (if resolved) */}
                    {ticket?.resolution && (
                        <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-xl border-2 border-green-400">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="">Ticket Resolved</h3>
                                    <p className="text-white/80 text-sm">
                                        Updated{' '}
                                        {moment(ticket?.updatedAt).fromNow()}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                                <p className="text-white/95 leading-relaxed">
                                    {ticket?.resolution}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Additional Features */}
                <div className="space-y-4">
                    <TicketHistoryCard history={ticket?.history} />
                </div>
            </div>
        </>
    )
}
