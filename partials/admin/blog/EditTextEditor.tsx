import {
    Button,
    Card,
    Checkbox,
    Select,
    TextArea,
    TextInput,
    Typography,
    UploadFile,
    useShowErrorNotification,
    ShowErrorNotifications,
    InputRichTextEditor,
} from '@components'
import { FileUpload } from '@hoc'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { adminApi, AdminApi } from '@queries'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { FieldValues, FormProvider, useFieldArray, useForm, SubmitHandler } from 'react-hook-form'
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
        .required('Title is required')
        .matches(/^[\w\s!@#$%^&*()\-+=_{}|:"<>?,./;'[\]]{5,160}$/, {
            message:
                'Title must be between 5 and 160 characters and only contain special characters',
            excludeEmptyString: true,
        }),

    author: yup
        .string()
        .required('Author is required')
        .matches(/^[^\d]+$/, 'Author name cannot contain numbers')
        .min(3, 'Author must be at least 3 characters')
        .max(20, 'Author cannot exceed 20 characters'),
    category: yup
        .array()
        .of(yup.number().required())
        .min(1, 'Must select at least 1 category')
        .required(),
    featuredImage: yup.mixed().nullable().optional(),
    metaData: yup.string().optional(),
    shortDescription: yup.string().required('Short description is required'),
    isFeatured: yup.boolean().required(),
    content: yup.string().required('Content is required'),
    blogQuestions: yup
        .array()
        .of(
            yup.object({
                question: yup.string().default('').optional(),
                answer: yup.string().default('').optional(),
            })
        )
        .required(),
}) as any // Bridge for complex schema inference if necessary, but FormValues is the primary type

import { InputErrorMessage } from '@components/inputs/components'
import { FaqDeleteModal } from './components'

const imageSizeErrorMessage = (file: File) => {
    if (file && file.size && file.size > 2 * 1024 * 1024) {
        return 'Image size must be less than 2MB'
    }
    return true
}

interface TextEditorProps {
    tagIds?: any
    blogData: any
    // onSubmit: (values: any) => void
}

export default function EditTextEditor({
    blogData,
    tagIds,
}: TextEditorProps) {
    const router = useRouter()

    const [isPublish, setIsPublish] = useState<boolean>(true)
    const [coverUrl, setCoverUrl] = useState(null)
    const [isFeatured, setIsFeatured] = useState(blogData?.isFeatured || false)
    const { notification } = useNotification()
    const [selectedCategories, setSelectedCategories] = useState<any>([])
    const [blogPost, setBlogPost] = useState<any>('')
    const [removeFaq, removeFaqResult] = adminApi.useRemoveFaqMutation()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [shortDescriptionWordCount, setShortDescriptionWordCount] =
        useState(0)

    const blogPostEnum = {
        Save: 'save',
        SaveAndPublish: 'saveAndPublish',
    }

    const showErrorNotifications = useShowErrorNotification()

    const [updateBlog, updateBlogResult] = adminApi.useUpdateBlogMutation()
    const [uploadImage, uploadImageResult] = AdminApi.Blogs.uploadImage()
    const { data, isLoading } = AdminApi.Blogs.categoriesList({
        skip: 0,
        limit: 20,
    })

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const preFilledCategoriesOption = blogData?.category?.map(
        (category: any) => category?.id
    )
    const handleChecked = () => {
        setIsFeatured(!isFeatured)
    }


    const formMethods = useForm<FormValues>({
        mode: 'all',
        resolver: yupResolver(validationSchema) as any,
        defaultValues: {
            featuredImage: blogData?.featuredImage || null,
            title: blogData?.title || '',
            metaData: blogData?.metaData || '',
            shortDescription: blogData?.shortDescription || '',
            author: blogData?.author || '',
            isFeatured: blogData?.isFeatured || false,
            category: [],
            content: blogData?.content || '',
            blogQuestions: blogData?.blogQuestions && blogData?.blogQuestions?.length > 0 ? blogData?.blogQuestions : [
                { question: '', answer: '' },
            ],
        } as FormValues,
    })

    const { fields, append, remove } = useFieldArray({
        control: formMethods.control as any,
        name: 'blogQuestions',
    })

    // useEffect(() => {
    //     formMethods.reset({
    //         ...formMethods.defaultValues,
    //         blogQuestions: blogData?.blogQuestions || [
    //             { question: '', answer: '' },
    //         ],
    //     })
    // }, [blogData])

    const handleAddFAQ = () => {
        append({ question: '', answer: '' })
    }

    const handleRemoveFAQ = (index: number) => {
        const isExist = blogData?.blogQuestions[index]
        if (isExist) {
            // remove(index)
            // removeFaq(isExist?.id)
            setModal(
                <FaqDeleteModal
                    onCancel={onModalCancelClicked}
                    faq={isExist}
                    removeField={remove}
                    index={index}
                />
            )
        }
    }
    const uploadImageToServer = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        const res: any = await uploadImage(formData)

        if (!res?.data?.url) {
            showErrorNotifications({
                isError: true,
                error: {
                    data: {
                        error: 'Image Failed to upload',
                        message: 'Image Failed to upload',
                    },
                },
            })

            return null
        }

        if (res?.data) {
            notification.success({
                title: 'Image Uplaoded',
                description: 'Image Uploaded Successfully',
            })
            return res?.data?.url
        }

        return null
    }

    const onFileUpload = ({
        name,
        dragging,
        file,
        handleRemove,
        fileObject,
    }: any) => {
        const onRemove = () => {
            handleRemove()
        }

        if (file) {
            setCoverUrl(null)
        }

        return (
            <UploadFile
                name={name}
                dragging={dragging}
                file={coverUrl || file}
                handleRemove={onRemove}
                fileObject={
                    coverUrl
                        ? {
                            type: 'image',
                        }
                        : fileObject
                }
            />
        )
    }

    // Quill Editor
    useEffect(() => {
        if (blogData && !coverUrl) {
            // quillRef.current.getEditor().root.innerHTML = blogData.content || ''
            setCoverUrl(blogData?.featuredImage)
        }
    }, [blogData])

    // category
    useEffect(() => {
        const category = formMethods.getValues('category')
        // if (!category){
        if (blogData && blogData?.category && blogData?.category.length > 0) {
            setSelectedCategories(
                blogData?.category?.map((category: any) => category?.id)
            )
            formMethods.setValue(
                'category',
                blogData?.category?.map((category: any) => category?.id)
            )
            // }
        }
    }, [blogData])

    // FAQ's
    useEffect(() => {
        if (blogData?.blogQuestions) {
            blogData.blogQuestions.forEach((faq: any, index: any) => {
                formMethods.setValue(
                    `blogQuestions[${index}].question`,
                    faq.question
                )
                formMethods.setValue(
                    `blogQuestions[${index}].answer`,
                    faq.answer
                )
            })
        }
    }, [blogData])

    const options = data?.data?.map((item: any) => ({
        label: item?.title,
        value: item?.id,
    }))

    const onSubmit = (data: any, publish: boolean) => {
        if (
            !data.featuredImage ||
            (typeof data.featuredImage === 'string' &&
                data.featuredImage.trim() === '')
        ) {
            formMethods.setError('featuredImage', {
                type: 'emptyImage',
                message: 'Image must not be empty',
            })
            return
        }

        const imageSizeError = imageSizeErrorMessage(data?.featuredImage?.[0])
        if (imageSizeError !== true) {
            formMethods.setError('featuredImage', {
                type: 'imageSizeError',
                message: imageSizeError,
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

        if (data?.content === '<p><br></p>' || data?.content?.trim() === '<p><br></p>') {
            formMethods.setError('content', {
                type: 'emptyContent',
                message: 'Content is required',
            })
            return
        }

        const values = {
            featuredImage: Array.isArray(data?.featuredImage)
                ? data?.featuredImage?.[0]
                : blogData?.featuredImage,
            title: data?.title,
            author: data?.author,
            metaData: data?.metaData,
            content: data?.content,
            isPublished: publish.toString(),
            isFeatured: isFeatured.toString(),
            category: data?.category,
            shortDescription: data?.shortDescription,
            blogQuestions: JSON.stringify(
                data?.blogQuestions?.filter(
                    (q: any) =>
                        q.question.trim() !== '' || q.answer.trim() !== ''
                ) || []
            ),
        }

        if (tagIds) {
            ; (values as any)['tags'] = tagIds
        }

        const formData = new FormData()

        Object.entries(values).forEach(([key, value]: any) => {
            formData.append(key, value)
        })

        updateBlog({ id: blogData?.id, body: formData })
            .then((res: any) => {
                notification.success({
                    title: 'Blog Updated',
                    description: 'Blog Updated Successfully',
                })
                // router.push('/portals/admin/blogs?tab=draft&page=1&pageSize=50')
                if (blogPost === blogPostEnum.Save) {
                    router.push(
                        '/portals/admin/blogs?tab=draft&page=1&pageSize=50'
                    )
                } else if (blogPost === blogPostEnum.SaveAndPublish) {
                    router.push(
                        '/portals/admin/blogs?tab=published&page=1&pageSize=50'
                    )
                }
            })
            .catch((err: any) => {
                notification.error({
                    title: 'Blog Update Failed',
                    description: 'There was an error updating the blog.',
                })
            })
    }
    const handleShortDescriptionChange = () => {
        const shortDescription = formMethods.getValues('shortDescription')
        const wordCount = shortDescription
            .split(/\s+/)
            .filter((word: any) => word !== '').length

        setShortDescriptionWordCount(wordCount)
    }

    return (
        <>
            <ShowErrorNotifications result={updateBlogResult} />
            <ShowErrorNotifications result={uploadImageResult} />
            {modal && modal}
            <div>
                <FormProvider {...formMethods}>
                    <form
                        onSubmit={formMethods.handleSubmit((data: any) =>
                            onSubmit(data, isPublish)
                        )}
                    >
                        <FileUpload
                            required
                            label={'Featured Image'}
                            name={'featuredImage'}
                            component={onFileUpload}
                            acceptTypes={['jpg', 'jpeg', 'png', 'webp']}
                        />
                        <Select
                            label="Categories"
                            name="category"
                            options={options}
                            value={options?.filter((cate: any) =>
                                selectedCategories.includes(cate?.value)
                            )}
                            onChange={(e: any) => {
                                setSelectedCategories(e)
                            }}
                            // loading={isLoading}
                            multi
                            onlyValue
                        />
                        <TextInput name="author" label="Author" />
                        <TextInput name="title" label="Title" />
                        <TextArea
                            label={'Meta Daata'}
                            name={'metaData'}
                            placeholder="Add meta tags...."
                        />
                        <TextArea
                            label={'Short Description'}
                            name={'shortDescription'}
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
                        {/* <div
                            ref={editorWrapperRef}
                            style={{ position: 'relative' }}
                        >
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
                                value={isFeatured}
                                defaultChecked={isFeatured}
                            />
                        </div>
                        {/* FAQ's */}

                        <div className="py-4 border-t">
                            <Typography variant="subtitle">
                                Add FAQ's here
                            </Typography>
                            <Card>
                                {fields.map((faq: any, index: any) => {
                                    return (
                                        <div
                                            key={faq.id}
                                            className="flex items-start gap-x-4"
                                        >
                                            <div className="flex flex-col w-3/4">
                                                <TextInput
                                                    name={`blogQuestions.${index}.question`}
                                                    label={`FAQ ${index + 1
                                                        } Question`}
                                                    placeholder="Enter Question"
                                                    defaultValue={faq.question}
                                                />
                                                <InputErrorMessage
                                                    name={'blogQuestions'}
                                                />
                                                <TextArea
                                                    name={`blogQuestions.${index}.answer`}
                                                    label={`FAQ ${index + 1
                                                        } Answer`}
                                                    placeholder="Enter Answer"
                                                // defaultValue={faq.answer}
                                                />
                                                <InputErrorMessage
                                                    name={'blogQuestions'}
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
                                    )
                                })}
                                <div className="mb-4">
                                    <Button
                                        variant="success"
                                        text="Add FAQ"
                                        onClick={handleAddFAQ}
                                    />
                                </div>
                            </Card>
                        </div>
                        <div className="flex items-center gap-x-4 mt-5">
                            <Button
                                text="Update & Publish"
                                loading={
                                    updateBlogResult?.isLoading &&
                                    blogPost === blogPostEnum.SaveAndPublish
                                }
                                disabled={
                                    updateBlogResult?.isLoading &&
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
                                onClick={() => {
                                    setIsPublish(false)
                                    setBlogPost(blogPostEnum.Save)
                                    onSubmit(formMethods.getValues(), false)
                                }}
                                loading={
                                    updateBlogResult?.isLoading &&
                                    blogPost === blogPostEnum.Save
                                }
                                disabled={
                                    updateBlogResult?.isLoading &&
                                    blogPost === blogPostEnum.Save
                                }
                            />
                        </div>
                    </form>
                </FormProvider>
            </div>
        </>
    )
}