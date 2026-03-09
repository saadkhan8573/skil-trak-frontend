import { motion } from 'framer-motion'

import {
    Badge,
    Button,
    GlobalModal,
    InitialAvatar,
    Typography,
} from '@components'
import { Student } from '@types'
import {
    Building2,
    CheckCircle2,
    Copy,
    FileText,
    Mail,
    Star,
    Timer,
    User,
} from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ellipsisText, getUserCredentials } from '@utils'
import { searchAiUrls } from '../urls'
import moment from 'moment'

interface EnhancedStudentProfileProps {
    student: Student
}

export function EnhancedStudentProfile({
    student,
}: EnhancedStudentProfileProps) {
    const router = useRouter()

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(student?.user?.email)
    }

    const handleCopyStudentId = () => {
        navigator.clipboard.writeText(student.studentId)
    }

    const daysRemaining = moment(student?.expiryDate).diff(moment(), 'days')

    const stats = [
        // {
        //     icon: Target,
        //     id: 'progress',
        //     label: 'Progress',
        //     value: '48/120 hrs',
        // },
        // {
        //     id: 'shifts',
        //     icon: Calendar,
        //     label: 'Shifts',
        //     value: `${upcomingShifts} upcoming`,
        // },
        {
            id: 'timeLeft',
            icon: Timer,
            label: 'Time Left',
            value: `${daysRemaining < 0 ? 'Expired' : `${daysRemaining} days`}`,
            variant: daysRemaining < 0 ? 'error' : 'primaryNew',
        },
    ]

    return (
        <>
            <div className="space-y-6">
                {/* Hero Card - Student Header */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative overflow-hidden rounded-md border-2 border-border bg-linear-to-br from-card via-card to-primaryNew/5 shadow-xl"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--primaryNew)_0%,transparent_50%)] opacity-5" />

                    <div className="relative px-6 py-4 space-y-4">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-x-3">
                                <motion.div
                                    whileHover={{
                                        scale: 1.05,
                                        rotate: 5,
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                    }}
                                >
                                    <div className="relative">
                                        <InitialAvatar
                                            imageUrl={student?.user?.avatar}
                                            name={student?.user?.name || 'S'}
                                            large
                                        />
                                        {/* Status Indicator */}
                                        <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1 ring-4 ring-background">
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/*  */}
                                <div>
                                    <Typography variant="title">
                                        {student?.user?.name}{' '}
                                        {student?.familyName}
                                    </Typography>

                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="gap-1"
                                            Icon={User}
                                            text={student?.studentStatus}
                                        />

                                        {student?.isHighPriority && (
                                            <Badge
                                                variant="secondary"
                                                outline
                                                className="gap-1"
                                                text="High Priority"
                                                Icon={() => (
                                                    <Star className="h-3 w-3 fill-blue-400 text-blue-400" />
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  */}
                        <div className="flex w-full justify-between ">
                            {/* Details */}
                            <div className="space-y-3">
                                {/* Quick Info */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            <span className="break-all">
                                                {student?.user?.email}
                                            </span>
                                        </div>
                                        <Copy
                                            onClick={handleCopyEmail}
                                            className="h-3 w-3 text-gray-600"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span>
                                                {ellipsisText(
                                                    student?.studentId,
                                                    8
                                                )}
                                            </span>
                                        </div>

                                        <Copy
                                            onClick={handleCopyStudentId}
                                            className="h-3 w-3 text-gray-600"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="h-4 w-4 shrink-0" />
                                        <div className="flex flex-wrap gap-2">
                                            {student?.courses?.map((course) => (
                                                <Badge
                                                    text={course?.title}
                                                    variant="primaryNew"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*  */}
                            {/* Quick Stats Bar */}
                            <div
                                className={`grid grid-cols-1 gap-3 md:grid-cols-${stats?.length} md:gap-4`}
                            >
                                {stats.map((stat) => {
                                    const Icon = stat.icon
                                    return (
                                        <motion.div
                                            key={stat.id}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            className="rounded-lg bg-white border border-gray-300 px-3 shadow-lg backdrop-blur-sm md:px-4 py-3 h-fit"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`rounded-lg bg-primaryNew/10 p-2`}
                                                >
                                                    <Icon
                                                        className={`h-4 w-4 text-primaryNew`}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {stat.label}
                                                    </p>

                                                    {/*  */}
                                                    <Badge
                                                        text={stat.value}
                                                        variant={
                                                            (stat?.variant ||
                                                                'primaryNew') as any
                                                        }
                                                        outline
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}
