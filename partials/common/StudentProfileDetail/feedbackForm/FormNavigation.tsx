// components/FormNavigation.tsx
import React from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

interface FormNavigationProps {
    currentStep: number
    totalSteps: number
    isSaving: boolean
    onPrevious: () => void
    onNext: () => void
    onSubmit: any
    resultPlacementFeedback?: any
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
    currentStep,
    totalSteps,
    isSaving,
    onPrevious,
    onNext,
    onSubmit,
    resultPlacementFeedback,
}) => {
    const isFirstStep = currentStep === 0
    const isLastStep = currentStep >= totalSteps - 1

    return (
        <div className="flex justify-between items-center pt-8">
            <button
                type="button"
                // variant="outline"
                onClick={onPrevious}
                disabled={isFirstStep}
                className="group border-2 border-primaryNew/30 text-primaryNew hover:bg-primaryNew hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 flex items-center rounded-md"
            >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Previous
            </button>

            <div />

            {isLastStep ? (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={resultPlacementFeedback.isLoading}
                    className="group bg-linear-to-r from-[#f7a619] to-primaryNew hover:from-[#f7a619]/90 hover:to-primaryNew/90 
               text-white px-8 py-3 shadow-lg hover:shadow-2xl transition-all 
               disabled:opacity-70 disabled:cursor-not-allowed 
               flex items-center justify-center rounded-md"
                >
                    {resultPlacementFeedback.isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Submit Feedback
                        </>
                    )}
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onNext}
                    className="group bg-linear-to-r from-primaryNew to-[#0d5468] hover:from-primaryNew/90 hover:to-[#0d5468]/90 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all flex rounded-md"
                >
                    Next
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    )
}
