"use client"

import { FormProvider, useForm } from 'react-hook-form'
import { InputRichTextEditor, inputRichTextEditorErrorMessage } from '@components/inputs/RichTextEditor'
import { Button } from '@components'
import { useState } from 'react'

interface TestEditorFormData {
    content: string
    description?: string
}

export default function TestEditorPage() {
    const [submittedData, setSubmittedData] = useState<TestEditorFormData | null>(null)

    const methods = useForm<TestEditorFormData>({
        defaultValues: {
            content: '',
            description: '',
        },
    })

    const onSubmit = (data: TestEditorFormData) => {
        console.log('Form Data:', data)
        setSubmittedData(data)
    }

    const handleReset = () => {
        methods.reset({
            content: '',
            description: '',
        })
        setSubmittedData(null)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Rich Text Editor Test Page
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Test the InputRichTextEditor component with React Hook Form integration
                    </p>

                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Main Content Editor */}
                            <div>
                                <InputRichTextEditor
                                    name="content"
                                    label="Main Content"
                                    placeholder="Write your main content here... Try adding images, formatting text, and more!"
                                    rules={{
                                        validate: {
                                            required: (value: string) =>
                                                inputRichTextEditorErrorMessage(value) || 'Content is required',
                                        },
                                    }}
                                />
                            </div>

                            {/* Optional Description Editor */}
                            <div>
                                <InputRichTextEditor
                                    name="description"
                                    label="Description (Optional)"
                                    placeholder="Add an optional description..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-4 border-t">
                                <Button
                                    submit
                                    text="Submit"
                                    variant="primary"
                                    className="px-6"
                                />
                                <Button
                                    text="Reset"
                                    variant="secondary"
                                    onClick={handleReset}
                                    className="px-6"
                                />
                            </div>
                        </form>
                    </FormProvider>

                    {/* Display Submitted Data */}
                    {submittedData && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Submitted Data
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Content (HTML):
                                    </h3>
                                    <pre className="bg-white p-4 rounded border text-xs overflow-x-auto">
                                        {submittedData.content}
                                    </pre>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Content (Rendered):
                                    </h3>
                                    <div
                                        className="bg-white p-4 rounded border prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: submittedData.content }}
                                    />
                                </div>

                                {submittedData.description && (
                                    <>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                                Description (HTML):
                                            </h3>
                                            <pre className="bg-white p-4 rounded border text-xs overflow-x-auto">
                                                {submittedData.description}
                                            </pre>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                                Description (Rendered):
                                            </h3>
                                            <div
                                                className="bg-white p-4 rounded border prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: submittedData.description }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Features & Instructions */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <h2 className="text-lg font-semibold text-blue-900 mb-3">
                            ✨ Features to Test
                        </h2>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span><strong>Text Formatting:</strong> Bold, Italic, Underline, Strikethrough</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span><strong>Headings:</strong> Use the dropdown to select different heading levels</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span><strong>Lists:</strong> Create bullet points and numbered lists</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span><strong>Alignment:</strong> Left, Center, Right, Justify</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span><strong>Images:</strong> Upload images or paste them directly</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span><strong>Links:</strong> Add hyperlinks to your text</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span><strong>Code Blocks:</strong> Insert code snippets</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span><strong>Blockquotes:</strong> Add quoted text</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span><strong>Validation:</strong> Try submitting with empty content to test validation</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
