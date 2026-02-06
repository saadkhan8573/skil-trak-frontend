'use client'

import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@components/ui/collapsible'
import { ChevronDown, Edit, Check } from 'lucide-react'
import { Button } from '@components/ui/button'
import {
    InputRichTextEditor,
    ShowErrorNotifications,
} from '@components'
import { RtoApi } from '@queries'
import { useNotification } from '@hooks'
import { countWords } from 'utils/functions/countWords'
import { FormProvider, useForm } from 'react-hook-form'

export const AdminPlacementRequirements = ({ course }: any) => {
    const [open, setOpen] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    const { notification } = useNotification()

    const methods = useForm({
        defaultValues: {
            requirements: course?.requirements ?? '',
        },
    })

    const { watch, handleSubmit, reset } = methods
    const requirementsContent = watch('requirements')

    const [addRequirements, addRequirementsResult] =
        RtoApi.Courses.useAddRtoCustomCourseRequirements()

    useEffect(() => {
        if (course?.requirements) {
            reset({ requirements: course.requirements })
        }
    }, [course?.requirements])

    useEffect(() => {
        if (addRequirementsResult.isSuccess) {
            notification.success({
                title: 'Updated Successfully',
                description: 'Placement requirements updated successfully',
            })
        }
    }, [addRequirementsResult.isSuccess])

    const onSubmit = (values: any) => {
        addRequirements({
            id: course?.id,
            body: {
                requirements: values.requirements,
            },
        })
        setIsEditing(false)
    }

    const wordCount = countWords(requirementsContent)

    return (
        <FormProvider {...methods}>
            <ShowErrorNotifications result={addRequirementsResult} />
            <Collapsible open={open} onOpenChange={setOpen}>
                <div className="bg-gradient-to-br from-mutedNew/30 to-mutedNew/50 rounded-xl border border-border/50 overflow-hidden">
                    <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-mutedNew/20 transition-colors">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium cursor-pointer">
                                TGA Admin Placement Requirements
                            </label>
                            <span className="text-xs text-muted-foreground px-2 py-1 bg-background/50 rounded-md">
                                {wordCount} / 5000 words
                            </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    isEditing
                                        ? handleSubmit(onSubmit)()
                                        : setIsEditing(true)
                                }}
                                className="h-8 gap-1.5"
                                disabled={addRequirementsResult.isLoading}
                            >
                                {isEditing ? (
                                    <Check className="h-3.5 w-3.5" />
                                ) : (
                                    <Edit className="h-3.5 w-3.5" />
                                )}
                                {isEditing ? 'Done' : 'Edit'}
                            </Button>

                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${open ? '' : '-rotate-90'
                                    }`}
                            />
                        </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                        <div className="px-5 pb-5 space-y-4">
                            {isEditing ? (
                                <InputRichTextEditor
                                    name="requirements"
                                    label="Editable Requirements"
                                    height="h-96"
                                />
                            ) : (
                                <div
                                    className="prose prose-sm max-w-none bg-background/30 rounded-md p-4 border border-border/40 text-xs min-h-[120px] overflow-auto resize-y"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            requirementsContent ||
                                            '<p class="text-muted-foreground">Enter TGA admin placement requirements...</p>',
                                    }}
                                />
                            )}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        </FormProvider>
    )
}
