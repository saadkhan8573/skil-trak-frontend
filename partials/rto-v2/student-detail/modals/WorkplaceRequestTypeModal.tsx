import { Button, GlobalModal, ShowErrorNotifications } from '@components'
import { Label } from '@components/ui'
import { useNotification } from '@hooks'
import { CommonApi } from '@redux'
import { Briefcase, Building2, CheckCircle, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type WorkplaceOption = 'preferred' | 'provided' | 'requested'

export const WorkplaceRequestTypeModal = ({ onClose, studentId }: any) => {
    const [workplaceOption, setWorkplaceOption] =
        useState<WorkplaceOption>('requested')
    console.log('Selected Workplace Option:', workplaceOption)
    const [updateWorkplaceType, updateWorkplaceTypeResult] =
        CommonApi.Rtos.useUpdateStudentWorkplaceType()
    const { notification } = useNotification()
    useEffect(() => {
        if (updateWorkplaceTypeResult.isSuccess) {
            notification.success({
                title: 'Success',
                description: 'Workplace Type Updated Successfully',
            })
            onClose()
        }
    }, [updateWorkplaceTypeResult.isSuccess])

    const handleSubmit = () => {
        updateWorkplaceType({
            studentId: studentId,
            params: {
                workplaceType: workplaceOption,
            },
        })
    }

    return (
        <>
            <ShowErrorNotifications result={updateWorkplaceTypeResult} />
            <GlobalModal>
                <div className="relative border-primary/20 bg-linear-to-br from-primaryNew/5 to-transparent rounded-lg">
                    {/* ✅ Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 p-1 rounded-md transition-colors hover:bg-gray-100"
                    >
                        <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </button>

                    <div className="p-4">
                        <div className="space-y-3">
                            {/* Header */}
                            <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-2">
                                    <Briefcase className="h-4 w-4 text-primary" />
                                    <h3 className="font-semibold text-base">
                                        Add Your Workplace (Optional)
                                    </h3>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Choose the option that best describes your
                                    situation
                                </p>
                            </div>

                            {/* Step Indicator */}
                            {/* <div className="flex items-center justify-center gap-1.5 py-2">
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primaryNew/10 border-2 border-primary">
                                    <span className="text-xs font-semibold text-primaryNew">
                                        1
                                    </span>
                                </div>
                                <span className="text-[10px] font-medium">
                                    Select Option
                                </span>
                            </div>
                            <div className="h-px w-6 bg-border" />
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted border-2 border-border">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        2
                                    </span>
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    Fill Details
                                </span>
                            </div>
                            <div className="h-px w-6 bg-border" />
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted border-2 border-border">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        3
                                    </span>
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    Submit
                                </span>
                            </div>
                        </div> */}

                            {/* Options */}
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary/30 transition-all cursor-pointer">
                                    <input
                                        type="radio"
                                        name="workplaceOption"
                                        value="preferred"
                                        checked={
                                            workplaceOption === 'preferred'
                                        }
                                        onChange={(e) =>
                                            setWorkplaceOption(
                                                e.target
                                                    .value as WorkplaceOption
                                            )
                                        }
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                        <Building2 className="h-4 w-4 text-primary" />
                                        <div>
                                            <p className="font-semibold text-sm">
                                                Preferred Workplace
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                I have a confirmed workplace and
                                                will provide the details
                                            </p>
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-accent/30 transition-all cursor-pointer">
                                    <input
                                        type="radio"
                                        name="workplaceOption"
                                        value="request"
                                        checked={
                                            workplaceOption === 'requested'
                                        }
                                        onChange={(e) =>
                                            setWorkplaceOption(
                                                e.target
                                                    .value as WorkplaceOption
                                            )
                                        }
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                        <Briefcase className="h-4 w-4 text-accent" />
                                        <div>
                                            <p className="font-semibold text-sm">
                                                Need a workplace
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                I need assistance finding a
                                                workplace
                                            </p>
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-secondary/30 transition-all cursor-pointer">
                                    <input
                                        type="radio"
                                        name="workplaceOption"
                                        value="requested"
                                        checked={workplaceOption === 'provided'}
                                        onChange={(e) =>
                                            setWorkplaceOption(
                                                e.target
                                                    .value as WorkplaceOption
                                            )
                                        }
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                        <CheckCircle className="h-4 w-4 text-secondary" />
                                        <div>
                                            <p className="font-semibold text-sm">
                                                Already Employed
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                I'm already employed or have my
                                                own arrangement
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Debug */}

                            <div className="text-xs text-muted-foreground pt-2">
                                {/* Selected: <b>{workplaceOption || 'none'}</b> */}
                                <Button
                                    text={'Update'}
                                    loading={
                                        updateWorkplaceTypeResult.isLoading
                                    }
                                    disabled={
                                        updateWorkplaceTypeResult.isLoading
                                    }
                                    onClick={handleSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </GlobalModal>
        </>
    )
}
