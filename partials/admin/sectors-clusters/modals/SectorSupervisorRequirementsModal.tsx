import { useEffect, useState } from 'react'
import {
    Badge,
    Button,
    ShowErrorNotifications,
    TextArea,
    Typography,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Label,
} from '@components/ui'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { AdminApi } from '@redux'
import { useRouter } from 'next/router'
import { useNotification } from '@hooks'

interface SupervisorRequirementsProps {
    requirements: string
    jobTitles: string[]
}
type FormValues = {
    requirements: string
    jobTitles: { value: string }[]
}

export function SectorSupervisorRequirementsModal({
    requirements,
    jobTitles,
}: SupervisorRequirementsProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [newJobTitle, setNewJobTitle] = useState('')
    const { notification } = useNotification()
    const router = useRouter()
    const sectorId = router.query.id
    const [supervisorReq, supervisorReqResult] =
        AdminApi.SectorClusters.useUpdateRequirements()
    const methods = useForm<FormValues>({
        defaultValues: {
            requirements: '',
            jobTitles: [],
        },
    })

    const { control, handleSubmit, reset, watch } = methods

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'jobTitles',
    })
    const isFirstTime =
        (requirements?.length ?? 0) === 0 && (jobTitles?.length ?? 0) === 0
    const actionWord = isFirstTime ? 'added' : 'updated'
    const actionWordCapitalized = isFirstTime ? 'Added' : 'Updated'
    useEffect(() => {
        if (supervisorReqResult.isSuccess) {
            notification.success({
                title: `Supervisor requirements ${actionWord}`,
                description: `Supervisor requirements have been ${actionWord} successfully.`,
            })
            setIsEditDialogOpen(false)
        }
    }, [supervisorReqResult.isSuccess])
    // ✅ Reset form when modal opens
    useEffect(() => {
        if (isEditDialogOpen) {
            reset({
                requirements,
                jobTitles: jobTitles?.map((title) => ({ value: title })),
            })
        }
    }, [isEditDialogOpen, requirements, jobTitles])

    const handleSave = (data: FormValues) => {
        const formattedTitles = data.jobTitles.map((t) => t.value)

        const formattedRequirements = data.requirements
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)

        const payload = {
            supervisorRequirements: formattedRequirements,
            acceptableJobTitles: formattedTitles,
        }
        supervisorReq({
            id: sectorId,
            body: payload,
        })
    }

    const addJobTitle = () => {
        if (newJobTitle.trim()) {
            append({ value: newJobTitle.trim() })
            setNewJobTitle('')
        }
    }

    return (
        <>
            <ShowErrorNotifications result={supervisorReqResult} />
            <div className="space-y-4">
                <div className="flex items-center justify-end mb-3">
                    <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="secondary"
                                outline
                                onClick={() => setIsEditDialogOpen(true)}
                                Icon={isFirstTime ? Plus : Edit2}
                                text={
                                    isFirstTime
                                        ? 'Add Requirements'
                                        : 'Edit Requirements'
                                }
                            />
                        </DialogTrigger>

                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    Edit Supervisor Requirements
                                </DialogTitle>
                                <DialogDescription>
                                    Update minimum supervisor requirements and
                                    acceptable job titles
                                </DialogDescription>
                            </DialogHeader>

                            <FormProvider {...methods}>
                                <form
                                    onSubmit={handleSubmit(handleSave)}
                                    className="space-y-4 py-4"
                                >
                                    {/* Requirements */}
                                    <div>
                                        <Label>
                                            Minimum Supervisor Requirement
                                        </Label>
                                        <TextArea
                                            name="requirements"
                                            placeholder="Enter requirements..."
                                            rows={6}
                                            className="font-mono text-sm"
                                        />
                                    </div>

                                    {/* Job Titles */}
                                    <div>
                                        <Label>Acceptable Job Titles</Label>

                                        <div className="mt-2 flex gap-2">
                                            <input
                                                value={newJobTitle}
                                                onChange={(e) =>
                                                    setNewJobTitle(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault()
                                                        addJobTitle()
                                                    }
                                                }}
                                                placeholder="Enter job title"
                                                className="border px-2 py-1 rounded w-full"
                                            />
                                            <Button
                                                variant="secondary"
                                                outline
                                                onClick={addJobTitle}
                                                Icon={Plus}
                                            />
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {fields.map((field, index) => (
                                                <Badge
                                                    key={field.id}
                                                    variant="secondary"
                                                    className="pr-1"
                                                >
                                                    {watch(
                                                        `jobTitles.${index}.value`
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                        className="ml-2 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                setIsEditDialogOpen(false)
                                            }
                                            outline
                                            text="Cancel"
                                        />
                                        <Button
                                            submit
                                            variant="dark"
                                            text="Save Changes"
                                            loading={
                                                supervisorReqResult.isLoading
                                            }
                                            disabled={
                                                supervisorReqResult.isLoading
                                            }
                                        />
                                    </DialogFooter>
                                </form>
                            </FormProvider>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Preview Section (unchanged) */}
            </div>
        </>
    )
}
