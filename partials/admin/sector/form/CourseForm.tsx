import {
    Button,
    InputRichTextEditor,
    Select,
    TextInput,
    Typography
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { AdminApi } from '@queries'
import { Course, OptionType } from '@types'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { ConfirmCourseUpdateModal } from './components/ConfirmCourseUpdateModal'
import { HighlightedTasksField } from './components/HighlightedTasksField'

interface CourseFormProps {
    result: any
    onSubmit: (values: any) => void
    edit?: boolean
    initialValues?: Course

}

export const CourseForm = ({
    edit,
    onSubmit,
    result,
    initialValues,

}: CourseFormProps) => {
    const { data, isLoading } = AdminApi.Sectors.useListQuery({
        limit: 100,
        skip: 0,
        search: '',
    })

    const [level, setLevel] = useState<number | null>(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [pendingData, setPendingData] = useState<any>(null)

    useEffect(() => {
        if (initialValues) {
            if (!level) {
                setLevel(initialValues?.level)
            }
            methods.reset({
                ...initialValues,
                requirements: initialValues?.requirements,
                sector: initialValues?.sector?.id,
                highlightedTasks:
                    initialValues?.highlightedTasks &&
                        initialValues.highlightedTasks.length > 0
                        ? initialValues.highlightedTasks?.map((task: any) => ({
                            id: task.id,
                            statement: task.statement,
                            taskId: task.id,
                        }))
                        : [{ statement: '' }],
            })
        }
    }, [initialValues])

    const validationSchema = yup.object({
        title: yup.string().required('Title is required'),
        code: yup.string().required('Code is Required'),
        hours: yup.number().required('Hours are required'),
        level: yup.number().required('Level is required'),
        sector: yup.number().required('Sector are required'),
        highlightedTasks: yup.array().of(
            yup.object({
                statement: yup.string().required('Task statement is required'),
            })
        ),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            ...initialValues,
            requirements: initialValues?.requirements,
            sector: initialValues?.sector?.id,
            highlightedTasks: initialValues?.highlightedTasks || [
                { statement: '' },
            ],
        },
        mode: 'all',
    })

    const handleFormSubmit = (values: any) => {
        if (!edit) {
            onSubmit(values)
            return
        }

        // Detect if highlighted tasks have changed
        const initialTasks = initialValues?.highlightedTasks || []
        const currentTasks = values.highlightedTasks || []

        // Extract IDs of existing tasks that were modified
        const changedHighlightedTaskIds = currentTasks
            .filter((task: any) => {
                const initial = initialTasks.find(
                    (it: any) => (it.id || it.taskId) === (task.id || task.taskId)
                )
                // Mark as changed if: statement differs from initial
                return initial && task.statement !== initial.statement
            })
            .map((task: any) => task.id || task.taskId)
            .filter(Boolean)

        // Determine if any changes occurred (statement, add, or remove)
        const hasStatementChange = changedHighlightedTaskIds.length > 0
        const hasNewTasks = currentTasks.some((t: any) => !(t.id || t.taskId))
        const hasRemovedTasks = currentTasks.length < initialTasks.length

        const hasChanges = hasStatementChange || hasNewTasks || hasRemovedTasks

        if (hasChanges) {
            setPendingData({
                ...values,
                changedHighlightedTaskIds,
            })
            setShowConfirmModal(true)
        } else {
            onSubmit({
                ...values,
                changedHighlightedTaskIds: [],
            })
        }
    }

    const handleConfirmUpdate = () => {
        if (pendingData) {
            onSubmit(pendingData)
            setShowConfirmModal(false)
        }
    }

    const LevelsOptions = [
        {
            label: 'Level 1',
            value: 1,
        },
        {
            label: 'Level 2',
            value: 2,
        },
        {
            label: 'Level 3',
            value: 3,
        },
        {
            label: 'Level 4',
            value: 4,
        },
        {
            label: 'Level 5',
            value: 5,
        },
        {
            label: 'Level 6',
            value: 6,
        },
        {
            label: 'Level 7',
            value: 7,
        },
        {
            label: 'Level 8',
            value: 8,
        },
        {
            label: 'Level 9',
            value: 9,
        },
        {
            label: 'Level 10',
            value: 10,
        },
    ]

    return (
        <FormProvider {...methods}>
            <form
                className="mt-2 w-full"
                onSubmit={methods.handleSubmit(handleFormSubmit)}
            >
                <div className="">
                    <div className="mb-4">
                        <div className="mb-2">
                            <Typography
                                variant={'muted'}
                                color={'text-gray-400'}
                            >
                                Sector Selection
                            </Typography>
                        </div>

                        {edit ? (
                            <>
                                <Typography
                                    variant={'small'}
                                    color={'text-gray-400'}
                                >
                                    Sector
                                </Typography>
                                <Typography
                                    variant={'label'}
                                    color={'text-gray-600'}
                                >
                                    {initialValues?.sector?.name}
                                </Typography>
                            </>
                        ) : (
                            <div>
                                <Select
                                    name="sector"
                                    label={'Course Sector'}
                                    options={data?.data.map((sector) => ({
                                        label: sector.name,
                                        value: sector.id,
                                    }))}
                                    loading={isLoading}
                                    onlyValue
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-2">
                        <Typography variant={'muted'} color={'text-gray-400'}>
                            Course Info
                        </Typography>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8">
                        <TextInput
                            label={'Code'}
                            name={'code'}
                            placeholder={'Course Code...'}
                            required
                            validationIcons
                        />

                        <TextInput
                            label={'Title'}
                            name={'title'}
                            placeholder={'Course Title...'}
                            required
                            validationIcons
                        />

                        <TextInput
                            label={'Hours'}
                            name={'hours'}
                            placeholder={'Course Hours...'}
                            required
                            validationIcons
                        />

                        <div className="relative z-30">
                            <Select
                                name="level"
                                label={'Course Level'}
                                options={LevelsOptions}
                                onlyValue
                                onChange={(e: number) => {
                                    setLevel(e)
                                }}
                                value={LevelsOptions?.find(
                                    (l: OptionType) => l.value === Number(level)
                                )}
                            // menuPlacement="top"
                            />
                        </div>
                    </div>

                    <div>
                        <InputRichTextEditor
                            label="Requirement"
                            name="requirements"
                        />
                    </div>

                    <HighlightedTasksField />

                    <div>
                        <Button
                            submit
                            disabled={result.isLoading}
                            loading={result.isLoading}
                        >
                            {edit ? 'Update Course' : 'Add Course'}
                        </Button>
                    </div>
                </div>
            </form>
            {showConfirmModal && (
                <ConfirmCourseUpdateModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={handleConfirmUpdate}
                    loading={result.isLoading}
                />
            )}
        </FormProvider>
    )
}