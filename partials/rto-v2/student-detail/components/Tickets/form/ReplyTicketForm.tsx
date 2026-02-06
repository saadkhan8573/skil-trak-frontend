import {
    Button,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

export const ReplyTicketForm = ({
    onSubmit,
}: {
    onSubmit: (values: any) => void
}) => {
    const validationSchema = yup.object({
        message: yup
            .mixed()
            .test('Message', 'Must Provide Message', (value) =>
                inputRichTextEditorErrorMessage(value)
            ),
    })

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    return (
        <FormProvider {...methods}>
            <form
                className="mt-2 w-full"
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <InputRichTextEditor
                    name={'message'}
                    label={'Message'}
                    height={'h-36'}
                />
                <div className="mt-1">
                    <Button
                        submit
                        text={'Reply'}
                        variant={'primaryNew'}
                        loading={methods?.formState?.isSubmitting}
                        disabled={methods?.formState?.isSubmitting}
                    />
                </div>
            </form>
        </FormProvider>
    )
}
