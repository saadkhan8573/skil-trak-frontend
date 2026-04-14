import { Badge } from '@components'
import { RtoApi, RtoV2Api } from '@queries'
import { AlertCircle, Calendar } from 'lucide-react'
import moment from 'moment'
import React from 'react'

export const WelcomeCard = () => {
    const { data: rto } = RtoApi.Rto.useProfile()
    const counts = RtoV2Api.Dashboard.rtoDashboardCounts()
    const { data: navBarCounts } = RtoV2Api.Dashboard.navBarCounts()

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primaryNew via-primaryNew to-primaryNew p-5 md:p-6 shadow-premium-xl animate-fade-in">
            {/* Animated background blobs - Optimized */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/15 rounded-full blur-3xl"></div>

            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-primaryNew/20 to-transparent pointer-events-none"></div>

            <div className="relative space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
                        <div className="p-0.5 rounded-md bg-white/10">
                            <Calendar className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs text-white font-semibold">
                            {moment().format('dddd, MMM DD, YYYY')}
                        </span>
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1.5 drop-shadow-2xl tracking-tight">
                        Welcome back, {rto?.user?.name}! 👋
                    </h1>
                </div>

                {/* Quick stats bar */}
                <div className="flex items-center gap-4 pt-0.5">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                        </div>
                        <span className="text-xs text-white/90 font-semibold">
                            {navBarCounts?.allStudents || 0} Active Students
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-white/60"></div>
                        <span className="text-xs text-white/90 font-semibold">
                            {counts?.data?.waitingForRto || 0} Pending Approvals
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
