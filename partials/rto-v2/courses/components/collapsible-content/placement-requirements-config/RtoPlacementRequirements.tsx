'use client'

import {
    Button,
    NoData,
    InputRichTextEditor,
    ShowErrorNotifications,
} from '@components'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@components/ui/collapsible'
import { ChevronDown, Edit, Sparkles, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { RtoFileTitle } from '../cards/DocumentsSection'
import { RtoV2Api } from '@queries'
import { useNotification } from '@hooks'
import { countWords } from 'utils/functions/countWords'
import { FormProvider, useForm } from 'react-hook-form'

export const RtoPlacementRequirements = ({ course }: any) => {
    const [open, setOpen] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [summaryId, setSummaryId] = useState<any>(undefined)

    const { notification } = useNotification()

    const methods = useForm({
        defaultValues: {
            summary: '',
        },
    })

    const { watch, handleSubmit, reset } = methods
    const summaryContent = watch('summary')

    // api call to update summary
    const [updateSummary, updateSummaryResult] =
        RtoV2Api.Courses.useUpdateCourseSummary()

    // Extract summary just once
    useEffect(() => {
        const summaryObj =
            course?.rtoCourseFiles?.find(
                (f: any) => f.title === RtoFileTitle.LOGBOOK
            )?.rtoLogbookSummary?.[0] || null

        reset({ summary: summaryObj?.summary || '' })
        setSummaryId(summaryObj?.id || null)
    }, [course])

    useEffect(() => {
        if (updateSummaryResult.isSuccess) {
            notification.success({
                title: 'Updated Successfully',
                description: 'Summary updated successfully',
            })
        }
    }, [updateSummaryResult.isSuccess])

    const onSubmit = (values: any) => {
        updateSummary({
            id: summaryId,
            body: {
                summary: values.summary,
            },
        })
        setIsEditing(false)
    }

    const wordCount = countWords(summaryContent)

    return (
        <FormProvider {...methods}>
            <ShowErrorNotifications result={updateSummaryResult} />
            <Collapsible open={open} onOpenChange={setOpen}>
                <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20 overflow-hidden">
                    {/* HEADER */}
                    <CollapsibleTrigger className="w-full p-4 flex items-start justify-between hover:bg-accent/5 transition-colors">
                        <div>
                            <label className="text-sm font-medium cursor-pointer">
                                RTO Placement Requirements
                            </label>
                            <div className="flex items-center gap-1.5 text-xs text-accent mt-1">
                                <Sparkles className="h-3 w-3" />
                                <span>Auto-populated from AI analysis</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground px-2 py-1 bg-background/50 rounded-md">
                                {wordCount} / 5000 words
                            </span>

                            <Button
                                Icon={isEditing ? Check : Edit}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    isEditing
                                        ? handleSubmit(onSubmit)()
                                        : setIsEditing(true)
                                }}
                                variant="info"
                                outline
                                text={isEditing ? 'Done' : 'Edit'}
                                loading={updateSummaryResult.isLoading}
                                disabled={updateSummaryResult.isLoading}
                            />

                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${open ? '' : '-rotate-90'
                                    }`}
                            />
                        </div>
                    </CollapsibleTrigger>

                    {/* CONTENT */}
                    <CollapsibleContent>
                        <div className="px-5 pb-5 space-y-4">
                            {isEditing ? (
                                <InputRichTextEditor
                                    name="summary"
                                    label="Editable Summary"
                                    height="h-96"
                                />
                            ) : summaryContent?.trim() ? (
                                <div
                                    className="prose prose-sm max-w-none bg-background/30 rounded-md p-4 border border-border/40 text-xs h-96 overflow-auto resize-y min-h-52"
                                    dangerouslySetInnerHTML={{
                                        __html: summaryContent,
                                    }}
                                />
                            ) : (
                                <NoData text="No placement requirements added yet." />
                            )}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        </FormProvider>
    )
}
