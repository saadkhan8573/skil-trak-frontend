import {
    Button,
    Checkbox,
    RadioGroup,
    Select,
    TextArea,
    TextInput,
    Typography,
} from '@components'
import { DialogFooter } from '@components/ui'
import { yupResolver } from '@hookform/resolvers/yup'
import { TypeOptionsEnum } from '@types'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface IndustryCheckFormProps {
    onSubmit: any
    onCancel?: () => void
    edit?: boolean
    initialValues?: any
}

const documentSchema = yup.object().shape({
    name: yup
        .string()
        .required('Folder name is required')
        .min(3, 'Folder name must be at least 3 characters')
        .max(100, 'Folder name must not exceed 100 characters'),
    description: yup
        .string()
        .test(
            'word-count',
            'Description must not exceed 200 words',
            (value) => {
                if (!value) return true
                const wordCount = value
                    .trim()
                    .split(/\s+/)
                    .filter((w) => w.length > 0).length
                return wordCount <= 200
            }
        ),
    link: yup
        .string()
        .url('Please enter a valid URL')
        .nullable()
        .transform((value) => (value === '' ? null : value)),
    type: yup.string().required('File type is required'),
})

export const AddDefaultDocumentForm = ({
    onCancel,
    onSubmit,
    edit,
    initialValues,
}: IndustryCheckFormProps) => {
    const methods = useForm({
        resolver: yupResolver(documentSchema),
        defaultValues: {
            name: initialValues?.name || '',
            capacity: initialValues?.capacity || 0,
            type: initialValues?.type || '',
            link: initialValues?.link || '',
            description: initialValues?.description || '',
            isRequired: initialValues?.isRequired || false,
        },
        mode: 'all',
    })

    const typeOptions = [
        { label: 'Documents', value: TypeOptionsEnum.Documents },
        { label: 'Images', value: TypeOptionsEnum.Images },
        { label: 'Videos', value: TypeOptionsEnum.Videos },
    ]

    const description = methods.watch('description')

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="py-4">
                    <TextInput
                        label={'Folder Name'}
                        name="name"
                        required
                        placeholder="e.g., Working with Children Check"
                    />

                    <TextArea
                        label={'Description (up to 200 words)'}
                        name="description"
                        placeholder="Provide a detailed description of this check, including what it's for, who needs it, and any important information students should know..."
                        rows={6}
                        className="resize-none"
                        helpText={`${description
                            ?.trim()
                            ?.split(/\s+/)
                            ?.filter((w: string) => w.length > 0)?.length
                            } / 200 words`}
                    />

                    <TextInput
                        label={'Capacity'}
                        name="capacity"
                        type="number"
                        placeholder="e.g., 10"
                    />

                    <TextInput
                        label={'Link to Apply'}
                        name="link"
                        type="url"
                        placeholder="https://example.com/apply"
                    />

                    <div className="space-y-2">
                        <Typography variant="label" color="text-gray-700">
                            Allowed File Types
                        </Typography>
                        <div className=" gap-4">
                            <RadioGroup
                                name="type"
                                layout="grid"
                                gridColumns="3"
                                options={typeOptions}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="action"
                        onClick={() => onCancel && onCancel()}
                    >
                        Cancel
                    </Button>
                    <Button
                        submit
                        variant="dark"
                        loading={methods.formState.isSubmitting}
                        disabled={methods.formState.isSubmitting}
                    >
                        {edit ? 'Update' : 'Create'}
                        Document
                    </Button>
                </DialogFooter>
            </form>
        </FormProvider>
    )
}
