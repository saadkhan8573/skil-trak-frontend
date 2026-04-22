import { useState } from 'react'

import { Button, Card, LoadingAnimation, NoData, Typography } from '@components'
import { ExternalLink, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { SectorSelector, SupervisorRequirements } from './components'
import { AdminApi } from '@queries'
import { useRouter } from 'next/router'
import { QuestionManager } from './components/QuestionManager'

export interface Question {
    id: string
    title: string
    question: string
    examples?: string
    type: 'default' | 'custom'
}

export interface Course {
    id: string
    name: string
}

export interface Sector {
    id: string
    name: string
    questions: Question[]
    courses: Course[]
    isUnlocked: boolean
    isOriginal?: boolean // Track if this is the original sector
    supervisorRequirements?: string
    acceptableJobTitles?: string[]
}

export const SectorClusters = () => {
    const router = useRouter()
    const id = Number(router.query?.id)
    const { data, isLoading, isError } = AdminApi.Sectors.useDetailQuery(id, {
        skip: !id,
    })
    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-4">
            <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Sector Management
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Configure sectors, prerequisites, and course
                            requirements
                        </p>
                    </div>
                </div>
            </div>
            {isError && <NoData isError />}
            {isLoading ? (
                <LoadingAnimation />
            ) : (
                <>
                    <SectorSelector data={data} />
                    <QuestionManager onUpdateQuestions={() => {}} />
                    <SupervisorRequirements />
                    <Card className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Available Courses
                            </h3>
                            <p className="text-sm text-gray-600">
                                Manage the courses available for this sector
                            </p>
                        </div>
                        <div className="space-y-2">
                            {data?.courses?.map((course: any, index: any) => (
                                <div
                                    key={course?.id}
                                    className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <GraduationCap className="w-5 h-5 text-gray-500" />
                                    <span className="font-semibold">
                                        {` ${course?.code} - ${course?.title}`}
                                    </span>
                                </div>
                            ))}
                            {data?.courses?.length === 0 && (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No courses found for this sector.
                                </div>
                            )}
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
}
