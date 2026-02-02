import {
    X,
    Phone,
    Calendar,
    Clock,
    User,
    Building2,
    FileText,
    Tag,
    Headphones,
    Play,
    Sparkles,
    Briefcase,
} from 'lucide-react'
import { useState } from 'react'
import { Call, StatusBadge } from '../components'
import { formatDate, formatTime } from '../utils'
import { CallAudioModal } from './CallAudioModal'
import { PlacementCall } from '@types'

interface CallDetailModalProps {
    call: PlacementCall
    onClose: () => void
}

export function CallDetailModal({ call, onClose }: CallDetailModalProps) {
    const [activeForm, setActiveForm] = useState<'find' | 'own' | null>(null)
    const [audioModalOpen, setAudioModalOpen] = useState(false)
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-start justify-between z-10 rounded-t-2xl">
                        <div className="flex-1">
                            <h2 className="text-gray-900 mb-0.5">
                                Call Details
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Complete information about this call
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                        {/* Student Information */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center flex-shrink-0">
                                    <span className="text-white">
                                        {(call?.student?.user?.name &&
                                            call?.student?.user?.name
                                                .split(' ')
                                                .map((n: any) => n[0])
                                                .join('')) ??
                                            'NA'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-gray-900 mb-0.5">
                                        {call?.student?.user?.name ?? '---'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Phone className="w-3.5 h-3.5" />
                                        {call?.student?.phone ?? '---'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call Status - Prominent Display */}
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs text-gray-600 mb-2">
                                        Call Status (Set by Agent)
                                    </p>
                                    <StatusBadge
                                        status={call?.status ?? 'pending'}
                                        size="lg"
                                    />
                                </div>
                                {call.priority && (
                                    <div
                                        className={`px-2.5 py-1 rounded-full text-xs ${call?.priority === 'high'
                                            ? 'bg-red-100 text-red-700'
                                            : call.priority === 'medium'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}
                                    >
                                        {call?.priority
                                            ?.charAt(0)
                                            .toUpperCase() +
                                            call?.priority?.slice(1)}{' '}
                                        Priority
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Call Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            <div className="bg-gray-50 rounded-lg p-2.5">
                                <div className="flex items-center gap-2 text-gray-600 mb-0.5">
                                    <Calendar className="w-3 h-3" />
                                    <span className="text-xs">Date</span>
                                </div>
                                <p className="text-sm text-gray-900">
                                    {formatDate(call?.createdAt as any)}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-2.5">
                                <div className="flex items-center gap-2 text-gray-600 mb-0.5">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-xs">
                                        Time & Duration
                                    </span>
                                </div>
                                <p className="text-sm text-gray-900">
                                    {formatTime(call?.createdAt as any)} (
                                    {call?.callDuration ?? '---'})
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-2.5">
                                <div className="flex items-center gap-2 text-gray-600 mb-0.5">
                                    <User className="w-3 h-3" />
                                    <span className="text-xs">Agent</span>
                                </div>
                                <p className="text-sm text-gray-900">
                                    {'AI'}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-2.5">
                                <div className="flex items-center gap-2 text-gray-600 mb-0.5">
                                    <Building2 className="w-3 h-3" />
                                    <span className="text-xs">Industry</span>
                                </div>
                                {/* <p className="text-sm text-gray-900">
                                    {call?.industry?.user?.name ||
                                        'Not specified'}
                                </p> */}
                            </div>
                        </div>

                        {/* Placement Company */}
                        {call?.placementCompany && (
                            <div className="bg-[#E6F2F7] rounded-lg p-2.5 border border-[#B3D9E8]">
                                <div className="flex items-center gap-2 text-[#044866] mb-0.5">
                                    <Building2 className="w-3 h-3" />
                                    <span className="text-xs">
                                        Placement Company
                                    </span>
                                </div>
                                <p className="text-sm text-[#044866]">
                                    {call?.placementCompany}
                                </p>
                            </div>
                        )}

                        {/* Call Recording */}
                        {call?.callId && (
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-200">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-purple-900 mb-1">
                                            <Headphones className="w-3.5 h-3.5" />
                                            <span className="text-xs">
                                                Call Recording
                                            </span>
                                        </div>
                                        <p className="text-xs text-purple-700 mb-2">
                                            Listen to the full call recording
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setAudioModalOpen(true)}
                                        className="px-3 py-2 bg-[#044866] text-white rounded-lg hover:bg-[#095a7d] transition-colors text-xs flex items-center gap-1.5 whitespace-nowrap"
                                    >
                                        <Headphones className="w-3.5 h-3.5" />
                                        Listen
                                    </button>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="flex items-center gap-2 text-gray-700 mb-3">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">Call Summary</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {call?.summary}
                                </p>
                            </div>
                        </div>

                        {/* Workplace Options - NEW SECTION */}
                        <div className="space-y-2">
                            <h3 className="text-xs text-gray-600 mb-2">
                                Placement Options
                            </h3>

                            {activeForm === null ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Option 1: Need a Workplace */}
                                    <button
                                        onClick={() => setActiveForm('find')}
                                        className="text-left bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg p-3 border border-[#044866] hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <Sparkles className="w-4 h-4 text-white flex-shrink-0" />
                                            <span className="text-sm text-white">
                                                Need a Workplace?
                                            </span>
                                        </div>
                                        <p className="text-xs text-blue-100 mb-2">
                                            AI-powered matching with verified
                                            workplaces
                                        </p>
                                        <div className="text-xs text-white group-hover:underline">
                                            Find Placement →
                                        </div>
                                    </button>

                                    {/* Option 2: Have Your Own Workplace */}
                                    <button
                                        onClick={() => setActiveForm('own')}
                                        className="text-left bg-gradient-to-br from-[#F7A619] to-[#E09515] rounded-lg p-3 border border-[#F7A619] hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <Briefcase className="w-4 h-4 text-white flex-shrink-0" />
                                            <span className="text-sm text-white">
                                                Have Your Own?
                                            </span>
                                        </div>
                                        <p className="text-xs text-orange-100 mb-2">
                                            Submit workplace for fast approval
                                        </p>
                                        <div className="text-xs text-white group-hover:underline">
                                            Add Workplace →
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm text-gray-900">
                                            {activeForm === 'find'
                                                ? 'Find Workplace with SkilTrak'
                                                : 'Add Own Workplace Details'}
                                        </h4>
                                        <button
                                            onClick={() => setActiveForm(null)}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault()
                                            setActiveForm(null)
                                        }}
                                        className="space-y-3"
                                    >
                                        {activeForm === 'find' ? (
                                            <>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Student Name"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Course/Program"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Preferred Location"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                                                />
                                                <select
                                                    required
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                                                >
                                                    <option value="">
                                                        Select Industry
                                                    </option>
                                                    <option value="healthcare">
                                                        Healthcare
                                                    </option>
                                                    <option value="technology">
                                                        Technology
                                                    </option>
                                                    <option value="education">
                                                        Education
                                                    </option>
                                                    <option value="finance">
                                                        Finance
                                                    </option>
                                                    <option value="engineering">
                                                        Engineering
                                                    </option>
                                                    <option value="hospitality">
                                                        Hospitality
                                                    </option>
                                                </select>
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Company/Workplace Name"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Workplace Address"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Supervisor Name"
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                                                    />
                                                    <input
                                                        type="tel"
                                                        required
                                                        placeholder="Supervisor Phone"
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                                                    />
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="Supervisor Email"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                                                />
                                            </>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveForm(null)
                                                }
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 px-3 py-2 text-sm bg-[#044866] text-white rounded-lg hover:bg-[#0D5468] transition-colors"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Call Notes */}

                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-2xl">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-[#044866] text-white rounded-lg hover:bg-[#0D5468] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Audio Modal */}
            {audioModalOpen && (
                <CallAudioModal
                    call={call as any}
                    onClose={() => setAudioModalOpen(false)}
                />
            )}
        </div>
    )
}
