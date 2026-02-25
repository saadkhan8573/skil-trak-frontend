import {
    Button,
    Card,
    Checkbox,
    InputRichTextEditor,
    Select,
    ShowErrorNotifications,
    TextArea,
    TextInput,
    Typography,
    UploadFile,
    useShowErrorNotification,
} from '@components'
import { InputErrorMessage } from '@components/inputs/components'
import { FileUpload } from '@hoc'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { AdminApi, adminApi } from '@queries'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FieldValues, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface BlogQuestion {
    question: string
    answer: string
}

interface FormValues extends FieldValues {
    featuredImage: string | FileList | File | null
    title: string
    metaData?: string
    shortDescription: string
    author: string
    isFeatured: boolean
    category: number[]
    content: string
    blogQuestions: BlogQuestion[]
}

const validationSchema = yup.object({
    title: yup
        .string()
        .default('') // Add default
        .required('Title is required')
        .matches(/^[\w\s!@#$%^&*()\-+=_{}|:"<>?,./;'[\]]{5,160}$/, {
            message:
                'Title must be between 5 and 160 characters and only contain special characters',
            excludeEmptyString: true,
        }),
    author: yup
        .string()
        .default('') // Add default
        .required('Author is required')
        .matches(/^[^\d]+$/, 'Author name cannot contain numbers')
        .matches(
            /^[a-zA-Z\s']+$/,
            'Author name cannot contain special characters'
        )
        .min(3, 'Author must be at least 3 characters')
        .max(20, 'Author cannot exceed 20 characters'),
    category: yup
        .array()
        .default([]) // Add default
        .min(1, 'Must select at least 1 category')
        .required(),
    shortDescription: yup
        .string()
        .default('') // Add default
        .required('Short description is required'),
    metaData: yup.string().default('').optional(),
    featuredImage: yup.mixed().optional(),
    content: yup.string().default('').optional(),
    isFeatured: yup.boolean().default(false),
    blogQuestions: yup
        .array()
        .of(
            yup.object({
                question: yup.string().default('').optional(),
                answer: yup.string().default('').optional(),
            })
        )
        .default([])
        .optional(),
})

interface TextEditorProps {
    tagIds?: any
}

export const imageSizeErrorMessage = (file: File) => {
    if (file && file.size && file.size > 5 * 1024 * 1024) {
        return 'Image size must be less than 5MB'
    }
    return true
}

export default function TextEditor({ tagIds }: TextEditorProps) {
    const { notification } = useNotification()

    const router = useRouter()

    const [isPublish, setIsPublish] = useState<boolean>(true)
    const [isFeatured, setIsFeatured] = useState(false)
    const [blogPost, setBlogPost] = useState<any>('')

    const blogPostEnum = {
        Save: 'save',
        SaveAndPublish: 'saveAndPublish',
    }

    const [createBlog, createBlogResult] = adminApi.useCreateBlogMutation()
    const [uploadImage, uploadImageResult] = AdminApi.Blogs.uploadImage()
    const { data, isLoading } = AdminApi.Blogs.categoriesList({
        skip: 0,
        limit: 20,
    })
    const [shortDescriptionWordCount, setShortDescriptionWordCount] =
        useState(0)

    const showErrorNotifications = useShowErrorNotification()

    const handleChecked = () => {
        setIsFeatured(!isFeatured)
    }


    const formMethods = useForm<FormValues>({
        mode: 'all',
        resolver: yupResolver(validationSchema) as any,
        defaultValues: {
            title: '',
            author: '',
            category: [],
            shortDescription: '',
            metaData: '',
            featuredImage: null,
            isFeatured: false,
            content: '',
            blogQuestions: [{ question: '', answer: '' }],
        } as FormValues,
    })
    const { append, remove, fields } = useFieldArray({
        control: formMethods.control as any,
        name: 'blogQuestions',
    })

    const onSubmit = (
        data: FormValues,
        publish: any,
        blogPostProp?: string
    ) => {
        if (uploadImageResult?.isLoading) {
            notification.warning({
                title: 'Wait till images uploading,',
                description: 'Wait for all images to upload',
            })

            return
        }

        // const content = quillRef.current.getEditor().root.innerHTML
        const featuredImage = data.featuredImage as any
        if (!featuredImage || (featuredImage instanceof FileList && !featuredImage[0])) {
            formMethods.setError('featuredImage', {
                type: 'emptyImage',
                message: 'Image must not be empty',
            })
            return
        }
        if (
            shortDescriptionWordCount < 385 ||
            shortDescriptionWordCount > 385
        ) {
            formMethods.setError('shortDescription', {
                type: 'shortDescription',
                message: 'Must provide 385 words',
            })
            return
        }
        if (imageSizeErrorMessage(featuredImage?.[0] || featuredImage) !== true) {
            formMethods.setError('featuredImage', {
                type: 'imageSizeError',
                message: 'Image size must be less than 5MB',
            })
            return
        }
        if (data?.content === '<p><br></p>' || data?.content?.trim() === '<p><br></p>') {
            formMethods.setError('content', {
                type: 'emptyContent',
                message: 'Content is required',
            })
            return
        }
        const wordCount = data?.content?.trim().split(/\s+/).length
        if (wordCount > 3000) {
            formMethods.setError('content', {
                type: 'exceedsWordLimit',
                message: 'Content should not exceed 3000 words',
            })
            return
        }

        validationSchema
            .validate(data)
            .then(() => {
                // If the validation passes, proceed with form submission
                const formData = new FormData()
                formData.append('featuredImage', (featuredImage as any)?.[0] || featuredImage)
                formData.append('title', data?.title)
                formData.append('metaData', data?.metaData || '')
                formData.append('content', data?.content)
                formData.append('isPublished', publish.toString())
                formData.append('isFeatured', data?.isFeatured.toString())
                formData.append('tags', tagIds)
                formData.append('category', data?.category as any)
                formData.append('author', data?.author)
                formData.append('shortDescription', data?.shortDescription)
                const filteredBlogQuestions = data?.blogQuestions?.filter(
                    (q: any) =>
                        q.question.trim() !== '' || q.answer.trim() !== ''
                ) || []
                formData.append(
                    'blogQuestions',
                    JSON.stringify(filteredBlogQuestions)
                )

                //POST Api Req
                createBlog(formData)
            })
            .catch(() => {
                notification.error({
                    title: 'Validation Error',
                    description: 'Category is required',
                })
            })
    }

    const options = data?.data?.map((item: any) => ({
        label: item?.title,
        value: item?.id,
    }))

    useEffect(() => {
        if (createBlogResult.isSuccess) {
            notification.success({
                title: 'Blog Published',
                description: 'Blog Published Successfully',
            })
            // router.push('/portals/admin/blogs?tab=draft&page=1&pageSize=50')
            if (blogPost === blogPostEnum.Save) {
                router.push(
                    '/portals/management/blogs?tab=draft&page=1&pageSize=50'
                )
            } else if (blogPost === blogPostEnum.SaveAndPublish) {
                router.push(
                    '/portals/management/blogs?tab=published&page=1&pageSize=50'
                )
            }
        }
    }, [createBlogResult.isSuccess])

    // dynamic fields
    const handleRemoveBlogQuestion = (index: number) => {
        remove(index)
    }

    const handleAddBlogQuestion = () => {
        append({ question: '', answer: '' })
    }

    const handleShortDescriptionChange = () => {
        const shortDescription = formMethods.getValues('shortDescription')
        const wordCount = shortDescription
            .split(/\s+/)
            .filter((word: any) => word !== '').length

        setShortDescriptionWordCount(wordCount)
    }

    return (
        <div>
            <ShowErrorNotifications result={createBlogResult} />
            <ShowErrorNotifications result={uploadImageResult} />

            {uploadImageResult?.isLoading && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
                    <div className="bg-primaryNew rounded-lg shadow-lg border border-gray-200 px-6 py-4 flex items-center gap-3">
                        {/* Loading Spinner */}
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="font-medium text-white">
                            Uploading image...
                        </span>
                    </div>
                </div>
            )}
            <FormProvider {...formMethods}>
                <form
                    onSubmit={formMethods.handleSubmit((data: any) =>
                        onSubmit(data, isPublish, blogPost)
                    ) as any}
                >
                    <FileUpload
                        required
                        label={'Featured Image'}
                        name={'featuredImage'}
                        component={UploadFile}
                        acceptTypes={['jpg', 'jpeg', 'png', 'webp']}
                    />
                    <Select
                        label="Categories"
                        name="category"
                        options={options}
                        loading={isLoading}
                        multi
                        onlyValue
                    />
                    <TextInput name="author" label="Author" />
                    <TextInput name="title" label="Title" />
                    <TextArea
                        label={'Meta Data'}
                        name={'metaData'}
                        placeholder="Add meta data...."
                    />
                    <TextArea
                        label={'Short Description'}
                        name={'shortDescription'}
                        placeholder="Write a short description of 380 words"
                        validationIcons
                        required
                        onChange={handleShortDescriptionChange}
                    />
                    <div
                        className={`${shortDescriptionWordCount > 385
                            ? 'text-red-500'
                            : ' text-slate-500'
                            } text-sm mb-5`}
                    >
                        {`${shortDescriptionWordCount} / 385 words`}
                    </div>
                    {/* <div ref={editorWrapperRef}>
                        <ReactQuill
                            theme="snow"
                            ref={quillRef}
                            modules={modules}
                        />
                    </div>
                    <InputErrorMessage name={'content'} /> */}
                    <InputRichTextEditor
                        name="content"
                        label="Content"
                        placeholder="Type something amazing..."
                    />
                    <div className="mt-4">
                        <Checkbox
                            onChange={handleChecked}
                            name={'isFeatured'}
                            label={'Featured'}
                        />
                    </div>

                    <div className="py-4 border-t">
                        <Typography variant="subtitle">
                            Add Blog Questions here
                        </Typography>
                        <Card>
                            {/* {faqList.map((faq: any, index: any) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-x-4"
                                >
                                    <div className="flex flex-col w-3/4">
                                        <TextInput
                                            name={`faq[${index}].question`}
                                            label={`FAQ ${index + 1} Question`}
                                            placeholder="Enter Question"
                                            value={faq.question}
                                            onChange={(e: any) => {
                                                const updatedFaqList = [
                                                    ...faqList,
                                                ]
                                                updatedFaqList[index].question =
                                                    e.target.value
                                                setFaqList(updatedFaqList)
                                            }}
                                        />
                                        <TextArea
                                            name={`faq[${index}].answer`}
                                            label={`FAQ ${index + 1} Answer`}
                                            placeholder="Enter Answer"
                                            value={faq.answer}
                                            onChange={(e: any) => {
                                                const updatedFaqList = [
                                                    ...faqList,
                                                ]
                                                updatedFaqList[index].answer =
                                                    e.target.value
                                                setFaqList(updatedFaqList)
                                            }}
                                        />
                                    </div>
                                    <div className="mt-7">
                                        <Button
                                            text="Remove"
                                            onClick={() =>
                                                handleRemoveFAQ(index)
                                            }
                                            variant="error"
                                        />
                                    </div>
                                </div>
                            ))} */}
                            {fields.map((item: any, index: number) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-x-4"
                                >
                                    <div className="flex flex-col w-3/4">
                                        <TextInput
                                            name={`blogQuestions.${index}.question`}
                                            label={`Blog Question ${index + 1} Question`}
                                            placeholder="Enter Question"
                                            defaultValue={item.question}
                                            required
                                        />
                                        <InputErrorMessage
                                            name={'blogQuestions'}
                                        />
                                        <TextArea
                                            name={`blogQuestions.${index}.answer`}
                                            label={`Blog Question ${index + 1} Answer`}
                                            placeholder="Enter Answer"
                                            required
                                        />

                                        <InputErrorMessage
                                            name={'blogQuestions'}
                                        />
                                    </div>
                                    <div className="mt-7">
                                        <Button
                                            text="Remove"
                                            onClick={() => {
                                                handleRemoveBlogQuestion(index)
                                            }}
                                            variant="error"
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="mb-4">
                                <Button
                                    variant="success"
                                    text="Add Blog Question"
                                    onClick={handleAddBlogQuestion}
                                />
                            </div>
                        </Card>
                    </div>

                    <div className="flex items-center gap-x-4">
                        <Button
                            text="Save & Publish"
                            loading={
                                createBlogResult?.isLoading &&
                                blogPost === blogPostEnum.SaveAndPublish
                            }
                            disabled={
                                createBlogResult?.isLoading &&
                                blogPost === blogPostEnum.SaveAndPublish
                            }
                            onClick={() => {
                                setIsPublish(true)
                                setBlogPost(blogPostEnum.SaveAndPublish)
                                onSubmit(formMethods.getValues(), true)
                            }}
                        />
                        <Button
                            text="Save"
                            loading={
                                createBlogResult?.isLoading &&
                                blogPost === blogPostEnum.Save
                            }
                            disabled={
                                createBlogResult?.isLoading &&
                                blogPost === blogPostEnum.Save
                            }
                            onClick={() => {
                                setIsPublish(false)
                                setBlogPost(blogPostEnum.Save)
                                onSubmit(formMethods.getValues(), false)
                            }}
                        />
                    </div>
                </form>
            </FormProvider>
            <InputErrorMessage name={'quill editor'} />
        </div>
    )
}