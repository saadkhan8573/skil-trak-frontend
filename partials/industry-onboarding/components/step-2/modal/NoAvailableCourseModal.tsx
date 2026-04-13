import { GlobalModal } from '@components'
import { ArrowUpCircle, X } from 'lucide-react'
import React from 'react'

export const NoAvailableCourseModal = ({
    onClose,
    currentLabel,
    nextLevel,
}: any) => {
    return (
        <GlobalModal>
            <div className="flex items-center justify-center p-2">
                <div className="w-full max-w-lg bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-5 shadow-xl relative">
                    {/* Close button */}
                    <div className="absolute top-3 right-3">
                        <button
                            onClick={onClose}
                            className="group inline-flex items-center justify-center size-8 rounded-full
                        transition-all duration-200 ease-out
                        hover:bg-gray-100 active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="Close modal"
                        >
                            <X
                                className="size-4 text-gray-500
                            group-hover:text-gray-700
                            transition-colors duration-200"
                            />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col items-center text-center space-y-4 pt-4">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                            <ArrowUpCircle className="w-6 h-6 text-white" />
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                            <div className="font-semibold text-amber-900 ">
                                No courses available at{' '}
                                <span className="text-amber-700">
                                    {currentLabel}
                                </span>{' '}
                                level
                            </div>

                            <p className="text-sm text-amber-700 leading-relaxed">
                                Contact Skilltrak coordinator — The supervisor's
                                current qualification level does not match any
                                courses in this sector.
                                {nextLevel ? (
                                    <>
                                        {' '}
                                        Consider upgrading to{' '}
                                        <span className="font-semibold">
                                            {nextLevel.label}
                                        </span>{' '}
                                        or higher to unlock available course
                                        options.
                                    </>
                                ) : (
                                    <>
                                        {' '}
                                        This is the highest qualification level
                                        — please check that this sector has
                                        courses configured.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GlobalModal>
    )
}
