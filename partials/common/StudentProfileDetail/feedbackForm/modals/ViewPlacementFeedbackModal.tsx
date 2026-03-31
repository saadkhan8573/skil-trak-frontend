import React from 'react'
import {
    CheckCircle,
    BookOpen,
    Building2,
    Settings,
    MessageSquare,
    FileText,
    Star,
    Users,
    TrendingUp,
    Award,
    GraduationCap,
} from 'lucide-react'
import { getAnswerStyle } from '../utils/getAnswerStyle'

interface FeedbackItem {
    courseName: string
    question: string
    answer: string
    key: string
    step: string
}

interface ViewPlacementFeedbackModalProps {
    feedbackData: FeedbackItem[]
}

export const ViewPlacementFeedbackModal = ({
    feedbackData,
}: ViewPlacementFeedbackModalProps) => {
    // Group by courseName first, then by step
    const groupedByCourse = feedbackData.reduce((acc: any, item) => {
        if (!acc[item.courseName]) {
            acc[item.courseName] = {}
        }
        if (!acc[item.courseName][item.step]) {
            acc[item.courseName][item.step] = []
        }
        acc[item.courseName][item.step].push(item)
        return acc
    }, {})

    const getStepIcon = (step: string) => {
        const iconProps = { size: 20, className: 'text-white' }

        switch (step) {
            case 'Overall Placement Experience':
                return (
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <CheckCircle {...iconProps} />
                    </div>
                )
            case 'Learning & Skills Development':
                return (
                    <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                        <BookOpen {...iconProps} />
                    </div>
                )
            case 'Host Employer Feedback':
                return (
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Building2 {...iconProps} />
                    </div>
                )
            case 'Skiltrak & Placement Process':
                return (
                    <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Settings {...iconProps} />
                    </div>
                )
            case 'Final Comments':
                return (
                    <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                        <MessageSquare {...iconProps} />
                    </div>
                )
            default:
                return (
                    <div className="w-10 h-10 bg-linear-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-sm">
                        <FileText {...iconProps} />
                    </div>
                )
        }
    }

    const renderStars = (answer: string) => {
        if (answer?.includes('/') && answer?.includes('stars')) {
            const rating = parseInt(answer.split('/')[0].trim())
            return (
                <div className="flex items-center space-x-1 ml-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={14}
                            className={`${
                                star <= rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    ))}
                    <span className="text-xs text-gray-500 ml-1 font-medium">
                        ({rating}/5)
                    </span>
                </div>
            )
        }
        return null
    }

    const getStepOrder = (step: string): number => {
        const order = {
            'Overall Placement Experience': 1,
            'Learning & Skills Development': 2,
            'Host Employer Feedback': 3,
            'Skiltrak & Placement Process': 4,
            'Final Comments': 5,
        }
        return order[step as keyof typeof order] || 999
    }

    // Group sections for 2-column layout
    const groupSectionsForGrid = (stepData: any) => {
        const sortedSteps = Object.entries(stepData).sort(
            ([a], [b]) => getStepOrder(a) - getStepOrder(b)
        )

        // Group sections in pairs for 2-column grid
        const pairs = []
        for (let i = 0; i < sortedSteps.length; i += 2) {
            if (i + 1 < sortedSteps.length) {
                pairs.push([sortedSteps[i], sortedSteps[i + 1]])
            } else {
                pairs.push([sortedSteps[i]])
            }
        }
        return pairs
    }

    return (
        <div className="">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                        <Award size={32} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-3">
                        Placement Feedback Dashboard
                    </h1>
                    <p className=" text-gray-600 mb-2">
                        Comprehensive feedback analysis across{' '}
                        {Object.keys(groupedByCourse).length} courses
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                            <Users size={16} />
                            <span>{feedbackData.length} total responses</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TrendingUp size={16} />
                            <span>
                                {Object.keys(groupedByCourse).length} courses
                                analyzed
                            </span>
                        </div>
                    </div>
                    <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Course Reviews */}
                <div className="space-y-12">
                    {Object.entries(groupedByCourse).map(
                        ([courseName, stepData]: [string, any]) => (
                            <div
                                key={courseName}
                                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                            >
                                {/* Course Header */}
                                <div className="bg-linear-to-r from-gray-50 to-slate-100 px-8 py-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                <GraduationCap
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">
                                                    {courseName}
                                                </h2>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {
                                                        Object.values(
                                                            stepData
                                                        ).flat().length
                                                    }{' '}
                                                    feedback responses across{' '}
                                                    {
                                                        Object.keys(stepData)
                                                            .length
                                                    }{' '}
                                                    sections
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-indigo-600">
                                                {Object.keys(stepData).length}
                                            </div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                                                Sections
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sections in 2-Column Grid */}
                                <div className="p-8">
                                    <div className="space-y-8">
                                        {groupSectionsForGrid(stepData).map(
                                            (sectionPair, pairIndex) => (
                                                <div
                                                    key={pairIndex}
                                                    className=""
                                                >
                                                    {sectionPair.map(
                                                        ([
                                                            stepName,
                                                            questions,
                                                        ]: [string, any]) => (
                                                            <div
                                                                key={stepName}
                                                                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                                                            >
                                                                {/* Section Header */}
                                                                <div className="flex items-center space-x-4 mb-6">
                                                                    {getStepIcon(
                                                                        stepName
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <h3 className="font-bold text-gray-900">
                                                                            {
                                                                                stepName
                                                                            }
                                                                        </h3>
                                                                        <p className="text-sm text-gray-600 mt-1">
                                                                            {
                                                                                questions.length
                                                                            }{' '}
                                                                            question
                                                                            {questions.length !==
                                                                            1
                                                                                ? 's'
                                                                                : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Questions List */}
                                                                <div className="space-y-4">
                                                                    {questions.map(
                                                                        (
                                                                            item: FeedbackItem,
                                                                            index: number
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    item.key
                                                                                }
                                                                                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                                                                            >
                                                                                <div className="flex items-start space-x-3 mb-4">
                                                                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full shrink-0 mt-0.5">
                                                                                        {index +
                                                                                            1}
                                                                                    </span>
                                                                                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-relaxed">
                                                                                        {
                                                                                            item.question
                                                                                        }
                                                                                    </h4>
                                                                                </div>

                                                                                <div className="ml-9">
                                                                                    <div className="flex items-start flex-col space-y-2">
                                                                                        <span
                                                                                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${getAnswerStyle(
                                                                                                item.answer
                                                                                            )}`}
                                                                                        >
                                                                                            {
                                                                                                item.answer
                                                                                            }
                                                                                        </span>
                                                                                        {renderStars(
                                                                                            item.answer
                                                                                        )}
                                                                                    </div>

                                                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                                                                            {
                                                                                                item.key
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Summary Footer */}
                <div className="mt-12 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-3">
                            Feedback Analysis Complete
                        </h3>
                        <p className="text-blue-100 mb-6">
                            Successfully processed {feedbackData.length}{' '}
                            responses across{' '}
                            {Object.keys(groupedByCourse).length} courses
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-white">
                                    {feedbackData.length}
                                </div>
                                <div className="text-blue-100 text-sm">
                                    Total Responses
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-white">
                                    {Object.keys(groupedByCourse).length}
                                </div>
                                <div className="text-blue-100 text-sm">
                                    Courses Analyzed
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-white">
                                    {Object.values(groupedByCourse).reduce(
                                        (acc: number, course: any) =>
                                            acc + Object.keys(course).length,
                                        0
                                    )}
                                </div>
                                <div className="text-blue-100 text-sm">
                                    Total Sections
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
