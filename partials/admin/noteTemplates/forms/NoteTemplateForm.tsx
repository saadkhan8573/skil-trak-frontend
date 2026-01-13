import {
    Button,
    Card,
    htmlToDraftText,
    InputContentEditor,
    inputEditorErrorMessage,
    Select,
    TextInput,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { NotesTemplateType } from '../enum'
import { NotesTemplateTrigger } from '@types'
import { useEffect, useState } from 'react'
import { OptionType } from '@types'
type Props = {
    onSubmit: (values: any) => void
    edit?: boolean
    initialValues?: any
    result: any
}

export const NoteTemplateForm = ({
    onSubmit,
    edit,
    result,
    initialValues,
}: Props) => {
    const [selectedType, setSelectedType] = useState<string | null>(null)

    const validationSchema = yup.object().shape({
        type: yup.string().required('Type is required'),
        trigger: yup.string().required('Trigger is required'),
        subject: yup.string().required('Subject is required'),
        successContent: yup
            .mixed()
            .test('Message', 'Must Provide Success Message', (value) =>
                inputEditorErrorMessage(value)
            ),
        failureContent: yup
            .mixed()
            .test('Message', 'Must Provide Failure Message', (value) =>
                inputEditorErrorMessage(value)
            ),
    })

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            subject: initialValues?.subject,
            type: initialValues?.type,
            trigger: initialValues?.trigger,
            successContent: htmlToDraftText(initialValues?.successContent),
            failureContent: htmlToDraftText(initialValues?.failureContent),
        },
    })

    useEffect(() => {
        if (initialValues) {
            setSelectedType(initialValues?.type)
        }
    }, [initialValues])

    const typeOptions = Object.entries(NotesTemplateType).map(
        ([label, value]) => ({ label, value })
    )

    const triggerOptions = Object.entries(NotesTemplateTrigger).map(
        ([label, value]) => ({
            label: label
                .replace(/_/g, ' ')
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            value,
        })
    )

    return (
        <>
            <Card>
                <div className="px-2 py-4">
                    <Typography variant="h4">Create Note Template</Typography>
                </div>

                <FormProvider {...formMethods}>
                    <form
                        className="flex flex-col"
                        onSubmit={formMethods.handleSubmit(onSubmit)}
                    >
                        <div className='relative z-30'>
                            <Select
                                name="type"
                                options={typeOptions}
                                label={'Select Type'}
                                placeholder="Select Type"
                                onlyValue
                                value={typeOptions?.find(
                                    (type: OptionType) =>
                                        type?.value === selectedType
                                )}
                                onChange={(e: string) => {
                                    setSelectedType(e)
                                }}
                            // menuPlacement='top'
                            />
                        </div>
                        <div className='relative z-20'>
                            <Select
                                name="trigger"
                                options={triggerOptions}
                                label={'Select Trigger'}
                                placeholder="Select Trigger"
                                onlyValue
                            />
                        </div>
                        <TextInput
                            label={'Subject'}
                            name={'subject'}
                            placeholder="Subject"
                        />
                        <InputContentEditor
                            name="successContent"
                            label="Successfull"
                        />
                        <InputContentEditor
                            name="failureContent"
                            label="Unsuccessfull"
                        />

                        <Button
                            disabled={result?.isLoading}
                            loading={result?.isLoading}
                            submit
                            text={edit ? 'Update' : 'Create'}
                        />
                    </form>
                </FormProvider>
            </Card>
        </>
    )
}
