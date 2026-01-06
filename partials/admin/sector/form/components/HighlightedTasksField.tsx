import { Button, ShowErrorNotifications, TextInput, Typography } from '@components'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { MdAdd, MdDelete } from 'react-icons/md'

export const HighlightedTasksField = () => {
    const { control, formState: { errors } } = useFormContext()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'highlightedTasks',
    })

    const [deleteHighlightedTask, deleteHighlightedTaskResult] =
        AdminApi.Courses.useDeleteHighlightedTask()
    const { notification } = useNotification()

    const handleRemove = async (index: number, item: any) => {
        // Check if item.id is a number (database ID) vs string (react-hook-form's auto-generated ID)

        if (item?.taskId) {
            try {
                await deleteHighlightedTask(item?.taskId).unwrap()
                notification.success({
                    title: 'Success',
                    description: 'Task deleted successfully',
                })
                remove(index)
            } catch (error) {
                // Error already handled by ShowErrorNotifications
            }
        } else {
            // Just remove from the form array (not in database yet)
            remove(index)
        }
    }

    return (
        <div className="mt-6 mb-4">
            <ShowErrorNotifications result={deleteHighlightedTaskResult} />
            <Typography variant={'muted'} color={'text-gray-400'}>
                Course Highlighted Tasks
            </Typography>
            <div className="space-y-3 mt-2">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex items-start gap-3 w-full"
                    >
                        <div className="flex-1">
                            <TextInput
                                label={`Task ${index + 1}`}
                                name={`highlightedTasks.${index}.statement`}
                                placeholder="Enter task description"
                                required
                                validationIcons={false}
                                showError={false}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-8">
                            <Button
                                className="p-2 h-10 w-10 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600 rounded-lg transition-all shadow-sm"
                                onClick={() => append({ statement: '' })}
                                title="Add Task"
                                Icon={MdAdd} mini
                            />
                            {fields.length > 1 && (
                                <Button
                                    variant="secondary"
                                    className="p-2 h-10 w-10 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-500 rounded-lg transition-all shadow-sm group"
                                    onClick={() => handleRemove(index, field)}
                                    title="Remove Task"
                                    disabled={deleteHighlightedTaskResult.isLoading}
                                    loading={deleteHighlightedTaskResult.isLoading} mini Icon={MdDelete}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {fields.length === 0 && (
                <Button
                    variant="secondary"
                    className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => append({ statement: '' })}
                >
                    <MdAdd className="mr-2" />
                    Add Task
                </Button>
            )}
        </div>
    )
}
