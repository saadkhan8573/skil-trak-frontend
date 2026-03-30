// components/FormHeader.tsx
import React from 'react'

interface FormHeaderProps {
    currentStep: number
    totalSteps: number
}

export const FormHeader: React.FC<FormHeaderProps> = ({
    currentStep,
    totalSteps,
}) => {
    const progressPercentage = Math.round(
        ((currentStep + 1) / totalSteps) * 100
    )
    const remainingTime = Math.max(1, 6 - (currentStep + 1))

    return (
        <div className="text-center space-y-6">
            <div className="relative">
                <div className="bg-linear-to-br from-primaryNew via-[#0d5468] to-[#f7a619] text-white p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
                    <h1 className="text-white! mb-3">
                        Student Placement Feedback Form
                    </h1>
                    <p className="text-white! text-lg">
                        Step {currentStep + 1} of {totalSteps}: Your feedback
                        shapes the future of student placements ✨
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <div
                            // variant="secondary"
                            className="bg-white/20 text-white border-0"
                        >
                            {progressPercentage}% Complete
                        </div>
                        <div
                            // variant="secondary"
                            className="bg-white/20 text-white border-0"
                        >
                            ~{remainingTime} min remaining
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-primaryNew">
                            Overall Progress
                        </span>
                        <span className="text-sm font-medium text-primaryNew">
                            {progressPercentage}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-3 bg-linear-to-r from-primaryNew via-[#0d5468] to-[#f7a619] transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
