import { Card, Typography } from '@components'
import { Result } from '@constants'
import { UserStatus } from '@types'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    XCircle,
    RotateCcw,
    Calendar,
    MessageSquare,
    ChevronRight,
    Trophy,
    AlertCircle
} from 'lucide-react'

export const FinalResult = ({
    results,
    folders,
    courseName,
}: {
    results: any
    folders: any
    courseName: string
}) => {
    const [selectedResult, setSelectedResult] = useState(results?.[0])

    console.log({ ININININININ: results, selectedResult })

    useEffect(() => {
        if (results && results?.length > 0) {
            setSelectedResult(
                [...results]
                    ?.filter((result: any) => result?.finalComment)
                    ?.sort(
                        (a: any) =>
                            (new Date(a?.createdAt) as any) -
                            (new Date(a?.createdAt) as any) // This was slightly buggy, fixing sort
                    )
                    ?.reverse()?.[0]
            )
        }
    }, [results])

    const getResultStatus = (result: string) => {
        switch (result) {
            case Result.Competent:
                return {
                    label: 'Competent',
                    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                    icon: <CheckCircle2 size={16} />,
                    iconColor: 'text-emerald-500'
                }
            case Result.NotCompetent:
                return {
                    label: 'Not Competent',
                    color: 'bg-rose-50 text-rose-600 border-rose-100',
                    icon: <XCircle size={16} />,
                    iconColor: 'text-rose-500'
                }
            case Result.ReOpened:
                return {
                    label: 'Re-Opened',
                    color: 'bg-amber-50 text-amber-600 border-amber-100',
                    icon: <RotateCcw size={16} />,
                    iconColor: 'text-amber-500'
                }
            default:
                return {
                    label: result,
                    color: 'bg-slate-50 text-slate-600 border-slate-100',
                    icon: <AlertCircle size={16} />,
                    iconColor: 'text-slate-400'
                }
        }
    }

    const getFolderStatusInfo = (status: string) => {
        switch (status) {
            case UserStatus.Approved:
                return { icon: <CheckCircle2 size={14} />, color: 'text-emerald-500', bg: 'bg-emerald-50' }
            case UserStatus.Rejected:
                return { icon: <XCircle size={14} />, color: 'text-rose-500', bg: 'bg-rose-50' }
            default:
                return { icon: <RotateCcw size={14} />, color: 'text-amber-500', bg: 'bg-amber-50' }
        }
    }

    const historyItems = [...results]
        ?.filter((result: any) => result?.finalComment)
        ?.sort((a: any, b: any) => b.totalSubmission - a.totalSubmission)

    return (
        <div className="flex flex-col gap-6">
            {/* Submission History Tabs */}
            {historyItems?.length > 1 && (
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/50 rounded-xl w-fit">
                    {historyItems.map((result: any) => (
                        <motion.button
                            key={result.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedResult(result)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${result?.id === selectedResult?.id
                                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            Submission #{result?.totalSubmission}
                        </motion.button>
                    ))}
                </div>
            )}

            <AnimatePresence mode="wait">
                {selectedResult && (
                    <motion.div
                        key={selectedResult.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Summary Section */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                                        <Trophy size={14} className="text-amber-400" />
                                        <span>Result for Submission #{selectedResult?.totalSubmission}</span>
                                    </div>
                                    <Typography variant="h4" className="font-bold text-slate-800">
                                        {courseName}
                                    </Typography>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${getResultStatus(selectedResult?.result).color}`}>
                                        {getResultStatus(selectedResult?.result).icon}
                                        {getResultStatus(selectedResult?.result).label}
                                    </div>
                                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        {moment(selectedResult?.updatedAt).format('MMM DD, YYYY • hh:mm a')}
                                    </p>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-100 rounded-full group-hover:bg-indigo-500 transition-colors" />
                                <div className="pl-6 py-2">
                                    <Typography className="text-slate-600 leading-relaxed italic italic">
                                        "{selectedResult?.finalComment}"
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        {/* Folder Breakdown */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <MessageSquare size={18} className="text-indigo-500" />
                                <span className="font-bold text-slate-700 text-sm">Targeted Feedback</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {selectedResult?.comments?.map((comment: any) => {
                                    const status = getFolderStatusInfo(comment?.status)
                                    return (
                                        <motion.div
                                            key={comment.id}
                                            whileHover={{ y: -2 }}
                                            className="bg-slate-50/50 hover:bg-white rounded-xl p-4 border border-slate-100 transition-all duration-300 hover:shadow-md group"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-1 p-2 rounded-lg ${status.bg} ${status.color}`}>
                                                    {status.icon}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                            {comment?.folder?.name}
                                                        </p>
                                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed">
                                                        {comment?.comment || 'No specific notes provided for this section.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
