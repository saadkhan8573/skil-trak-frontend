import {
    Button,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
} from '@components'
import React from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'

export const ReplyEmailForm = ({
    result,
    onSubmit,
}: {
    onSubmit: (values: any) => void
    result: any
}) => {
    const validationSchema = Yup.object().shape({
        reply: Yup.string()
            .ensure()
            .test('Message', 'Must Provide Reply', inputRichTextEditorErrorMessage),
    })

    const methods = useForm<any>({
        resolver: yupResolver(validationSchema as any),
        mode: 'all',
    })
    return (
        <div>
            <FormProvider {...methods}>
                <form
                    className="mt-2 w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <InputRichTextEditor name={'reply'} label={'Reply'} />

                    <div className="mt-4 flex items-center justify-between">
                        <Button
                            submit
                            loading={result.isLoading}
                            disabled={result.isLoading}
                        >
                            Reply
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
