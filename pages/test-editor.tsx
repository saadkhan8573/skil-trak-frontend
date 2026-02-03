import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Button, Card, Typography } from '@components'
import { InputRichTextEditor } from '@components/inputs/RichTextEditor/InputRichTextEditor'

const validationSchema = yup.object({
    content: yup.string().required('Content is required'),
})

const TestEditor = () => {
    const [submittedData, setSubmittedData] = useState<any>(null)

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            content: '<h1>Hello Lexical!</h1><p>This is a test content.</p>',
        },
    })

    const onSubmit = (data: any) => {
        setSubmittedData(data)
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Typography variant={'h3'} className="mb-6">
                Lexical Editor Test Page
            </Typography>

            <Card className="p-6">
                <FormProvider {...formMethods}>
                    <form
                        onSubmit={formMethods.handleSubmit(onSubmit)}
                        className="flex flex-col gap-y-6"
                    >
                        <InputRichTextEditor
                            name="content"
                            label="Rich Text Content"
                            placeholder="Type something amazing..."
                        />

                        <div className="flex gap-x-4 items-center">
                            <Button
                                variant='primaryNew'
                                submit
                                text="Submit Form"
                            />

                            <Button
                                text="Reset Form"
                                onClick={() => formMethods.reset()}
                            />
                        </div>
                    </form>
                </FormProvider>
            </Card>

            {submittedData && (
                <Card className="mt-8 p-6 bg-gray-50">
                    <Typography variant={'h4'} className="mb-4">
                        Submitted Data (HTML Output):
                    </Typography>
                    <div className="p-4 border rounded bg-white overflow-auto max-h-96">
                        <pre className="text-xs whitespace-pre-wrap">
                            {JSON.stringify(submittedData, null, 2)}
                        </pre>
                    </div>

                    <Typography variant={'h4'} className="mt-6 mb-4">
                        Live Preview:
                    </Typography>
                    <div
                        className="p-4 border rounded bg-white prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: submittedData.content }}
                    />
                </Card>
            )}
        </div>
    )
}

export default TestEditor