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
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import * as yup from 'yup'

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
}: // onSubmit,
    TextEditorProps) {
    const quillRef = useRef<any>(null)
    const autoUploadingRef = useRef<boolean>(false)
    const editorWrapperRef = useRef<HTMLDivElement | null>(null)

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

    // const initialFaqList = blogData?.blogQuestions.map(
    //     (question: any, index: any) => ({
    //         question: question.question,
    //         answer: question.answer,
    //     })
    // )
    // const [faqList, setFaqList] = useState(initialFaqList)
    // const handleSave = () => {
    //     // const editorContent = quillRef.current.getEditor().getContents()
    //     const html = quillRef.current.getEditor().root.innerHTML
    // }
    const onModalCancelClicked = () => {
        setModal(null)
    }
    const preFilledCategoriesOption = blogData?.category?.map(
        (category: any) => category?.id
    )
    const handleChecked = () => {
        setIsFeatured(!isFeatured)
    }

    // Validation
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
            .min(1, 'Must select at least 1 category')
            .required(),
        // shortDescription: yup
        //     .string()
        //     .required('Short description is required')
        //     .test(
        //         'max-words',
        //         'Short description must be at most 385 words',
        //         (value) => {
        //             if (!value) {
        //                 return true // Allow empty string (required validation will handle it)
        //             }
        //             const wordCount = value
        //                 .split(/\s+/)
        //                 .filter((word) => word !== '').length
        //             return wordCount <= 385
        //         }
        //     ),
        // content: yup.string().required('Content is required'),
        // blogQuestions: yup.object().shape({
        //     question: yup.string().required('FAQ question should not be empty'),
        //     answer: yup.string().required('FAQ answer should not be empty'),
        // }).required(),
    })
    const formMethods: any = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            featuredImage: blogData?.featuredImage || null,
            title: blogData?.title || '',
            metaData: blogData?.metaData,
            shortDescription: blogData?.shortDescription || '',
            author: blogData?.author || '',
            isFeatured: blogData?.isFeatured || false,
            category: [],
            content: blogData?.content || '',
            blogQuestions: blogData?.blogQuestions || [
                { question: '', answer: '' },
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: formMethods.control,
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

    const SERVER_IMAGE_PREFIXES = [
        'https://skiltrak-dev.s3.ap-southeast-2.amazonaws.com/',
    ]

    const isServerImageUrl = (url: string) => {
        if (!url) return false
        return SERVER_IMAGE_PREFIXES.some((prefix) => url.startsWith(prefix))
    }

    const computeImageOverlays = () => {
        const editor = quillRef.current?.getEditor()
        const wrapper = editorWrapperRef.current
        if (!editor || !wrapper) return
        const root: HTMLElement = editor.root
        const images = Array.from(
            root.querySelectorAll('img')
        ) as HTMLImageElement[]

        let overlay: any = wrapper.querySelector(
            '.ql-image-upload-overlays'
        ) as HTMLDivElement | null

        if (!overlay) {
            overlay = document.createElement('div')
            overlay.className = 'ql-image-upload-overlays'
            overlay.style.position = 'absolute'
            overlay.style.top = '0'
            overlay.style.left = '0'
            overlay.style.right = '0'
            overlay.style.bottom = '0'
            overlay.style.pointerEvents = 'none'
            wrapper.appendChild(overlay)
        }

        overlay.innerHTML = ''

        const wrapperRect = wrapper.getBoundingClientRect()

        images.forEach((img) => {
            const src = img.getAttribute('src') || ''
            if (isServerImageUrl(src)) return

            const imgRect = img.getBoundingClientRect()
            const top = imgRect.top - wrapperRect.top + 4
            const right = wrapperRect.right - imgRect.right + 4

            const button = document.createElement('button')
            button.type = 'button'
            button.textContent = 'Upload'
            button.className = 'ql-image-upload-float'
            button.style.position = 'absolute'
            button.style.top = `${Math.max(top, 0)}px`
            button.style.right = `${Math.max(right, 0)}px`
            button.style.zIndex = '20'
            button.style.background = '#111827'
            button.style.color = '#ffffff'
            button.style.borderRadius = '6px'
            button.style.padding = '4px 6px'
            button.style.fontSize = '12px'
            button.style.lineHeight = '12px'
            button.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2)'
            button.style.cursor = 'pointer'
            button.style.border = '1px solid rgba(255,255,255,0.2)'
            button.style.pointerEvents = 'auto'
            button.title = 'Upload image to server'

            button.addEventListener('click', async (e: MouseEvent) => {
                e.preventDefault()
                e.stopPropagation()

                let fileToUpload: File | null = null
                const srcNow = img.getAttribute('src') || ''
                try {
                    const response = await fetch(srcNow, { mode: 'cors' })
                    if (!response.ok) throw new Error('Fetch failed')
                    const blob = await response.blob()
                    const inferredExt = blob.type.split('/')[1] || 'png'
                    const fileNameFromUrl = (srcNow.split('/').pop() || 'image')
                        .split('?')[0]
                        .split('#')[0]
                    const safeName = fileNameFromUrl.includes('.')
                        ? fileNameFromUrl
                        : `${fileNameFromUrl}.${inferredExt}`
                    fileToUpload = new File([blob], safeName, {
                        type: blob.type || 'image/png',
                    })
                } catch (err) {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = () => {
                        const f = input.files?.[0] || null
                        if (f) {
                            fileToUpload = f
                            void proceed()
                        }
                    }
                    input.click()
                    return
                }

                await proceed()

                async function proceed() {
                    if (!fileToUpload) return
                    if (fileToUpload.size > 5 * 1024 * 1024) {
                        alert('Image size must be less than 5MB')
                        return
                    }
                    const editorInstance = quillRef.current?.getEditor()
                    editorInstance?.enable(false)
                    const uploadedUrl = await uploadImageToServer(fileToUpload!)
                    editorInstance?.enable(true)
                    if (uploadedUrl) {
                        img.setAttribute('src', uploadedUrl)
                        computeImageOverlays()
                    }
                }
            })

            overlay.appendChild(button)
        })
    }

    const autoUploadPastedImages = async () => {
        if (autoUploadingRef.current) return
        const editor = quillRef.current?.getEditor()
        if (!editor) return
        const root: HTMLElement = editor.root
        const images = Array.from(
            root.querySelectorAll('img')
        ) as HTMLImageElement[]

        const candidates = images.filter((img) => {
            const src = img.getAttribute('src') || ''
            // skip images already from server
            if (isServerImageUrl(src)) return false
            // only auto-upload once
            const attempted =
                (img as any).dataset?.autoUploadAttempted === 'true'
            return !attempted
        })

        if (candidates.length === 0) return
        autoUploadingRef.current = true
        try {
            for (const img of candidates) {
                const srcNow = img.getAttribute('src') || ''
                // mark attempted regardless of result to avoid loops
                img.setAttribute('data-auto-upload-attempted', 'true')
                try {
                    const response = await fetch(srcNow, { mode: 'cors' })
                    if (!response.ok) throw new Error('Fetch failed')
                    const blob = await response.blob()
                    // Size guard (5MB limit)
                    if (blob.size > 5 * 1024 * 1024) {
                        continue
                    }
                    const inferredExt = blob.type.split('/')[1] || 'png'
                    const fileNameFromUrl = (srcNow.split('/').pop() || 'image')
                        .split('?')[0]
                        .split('#')[0]
                    const safeName = fileNameFromUrl.includes('.')
                        ? fileNameFromUrl
                        : `${fileNameFromUrl}.${inferredExt}`
                    const file = new File([blob], safeName, {
                        type: blob.type || 'image/png',
                    })

                    editor.enable(false)
                    const uploadedUrl = await uploadImageToServer(file)
                    editor.enable(true)
                    if (uploadedUrl) {
                        img.setAttribute('src', uploadedUrl)
                    }
                } catch (err) {
                    // If fetching fails (CORS), leave for manual upload
                    continue
                }
            }
        } finally {
            autoUploadingRef.current = false
            // Refresh buttons/overlays after auto-upload pass
            ensureImageUploadButtons()
            computeImageOverlays()
        }
    }
    const ensureImageUploadButtons = () => {
        const editor = quillRef.current?.getEditor()
        if (!editor) return
        const root: HTMLElement = editor.root
        const images = Array.from(
            root.querySelectorAll('img')
        ) as HTMLImageElement[]

        images.forEach((img) => {
            const src = img.getAttribute('src') || ''
            const alreadyDecorated =
                (img as any).dataset?.uploadDecorated === 'true'

            if (isServerImageUrl(src)) {
                const parent = img.parentElement as HTMLElement | null
                const btn = parent?.querySelector('.ql-image-upload-icon')
                if (btn && parent) {
                    btn.remove()
                    parent.style.position = ''
                }
                if (alreadyDecorated) {
                    img.removeAttribute('data-upload-decorated')
                }
                return
            }

            if (alreadyDecorated) return

            const parent = img.parentElement as HTMLElement | null
            if (!parent) return

            if (!parent.style.position || parent.style.position === 'static') {
                parent.style.position = 'relative'
            }

            if (parent.querySelector('.ql-image-upload-icon')) return

            const button = document.createElement('button')
            button.type = 'button'
            button.className = 'ql-image-upload-icon'
            button.title = 'Upload image to server'
            button.style.position = 'absolute'
            button.style.top = '4px'
            button.style.right = '4px'
            button.style.zIndex = '10'
            button.style.background = '#111827'
            button.style.color = '#ffffff'
            button.style.borderRadius = '6px'
            button.style.padding = '4px 6px'
            button.style.fontSize = '12px'
            button.style.lineHeight = '12px'
            button.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2)'
            button.style.cursor = 'pointer'
            button.style.border = '1px solid rgba(255,255,255,0.2)'
            button.textContent = 'Upload'

            const onClick = async (e: MouseEvent) => {
                e.preventDefault()
                e.stopPropagation()

                let fileToUpload: File | null = null
                try {
                    const response = await fetch(src, { mode: 'cors' })
                    if (!response.ok) throw new Error('Fetch failed')
                    const blob = await response.blob()
                    const inferredExt = blob.type.split('/')[1] || 'png'
                    const fileNameFromUrl = (src.split('/').pop() || 'image')
                        .split('?')[0]
                        .split('#')[0]
                    const safeName = fileNameFromUrl.includes('.')
                        ? fileNameFromUrl
                        : `${fileNameFromUrl}.${inferredExt}`
                    fileToUpload = new File([blob], safeName, {
                        type: blob.type || 'image/png',
                    })
                } catch (err) {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = () => {
                        const f = input.files?.[0] || null
                        if (f) {
                            fileToUpload = f
                            proceed()
                        }
                    }
                    input.click()
                    return
                }

                proceed()

                async function proceed() {
                    if (!fileToUpload) return

                    if (fileToUpload.size > 5 * 1024 * 1024) {
                        alert('Image size must be less than 5MB')
                        return
                    }

                    editor.enable(false)
                    const uploadedUrl = await uploadImageToServer(fileToUpload)
                    editor.enable(true)

                    if (uploadedUrl) {
                        img.setAttribute('src', uploadedUrl)
                        button.remove()
                        if (parent) {
                            if (
                                !parent.querySelector('.ql-image-upload-icon')
                            ) {
                                parent.style.position = ''
                            }
                        }
                        img.removeAttribute('data-upload-decorated')
                    }
                }
            }

            button.addEventListener('click', onClick)
            parent.appendChild(button)
            img.setAttribute('data-upload-decorated', 'true')
        })
    }

    // Custom image handler function
    const imageHandler = () => {
        const editor = quillRef.current?.getEditor()
        if (!editor) return

        const range = editor.getSelection()
        if (!range) return

        // Create file input
        const fileInput = document.createElement('input')
        fileInput.setAttribute('type', 'file')
        fileInput.setAttribute('accept', 'image/*')
        fileInput.click()

        fileInput.onchange = async () => {
            const file = fileInput.files?.[0]
            if (!file) return

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file')
                return
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB')
                return
            }

            // Show loading state in editor (optional)
            editor.enable(false)

            // Upload image to server
            const imageUrl = await uploadImageToServer(file)

            // Re-enable editor
            editor.enable(true)

            if (imageUrl) {
                // Insert the image URL into the editor
                editor.insertEmbed(range.index, 'image', imageUrl)
                editor.setSelection(range.index + 1)
            }
        }
    }

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ font: [] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ color: [] }, { background: [] }],
                    [{ script: 'sub' }, { script: 'super' }],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
                    ['link', 'image', 'video'],
                    ['table'],
                    ['clean'],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        }),
        []
    )

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

    useEffect(() => {
        const editor = quillRef.current?.getEditor()
        if (!editor) return

        ensureImageUploadButtons()
        computeImageOverlays()
        void autoUploadPastedImages()

        const onChange = () => {
            setTimeout(() => {
                ensureImageUploadButtons()
                computeImageOverlays()
                void autoUploadPastedImages()
            }, 0)
        }

        editor.on('text-change', onChange)

        const root: HTMLElement = editor.root
        const observer = new MutationObserver(() => {
            ensureImageUploadButtons()
            computeImageOverlays()
            void autoUploadPastedImages()
        })
        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src'],
        })

        const onResize = () => computeImageOverlays()
        const onScroll = () => computeImageOverlays()
        window.addEventListener('resize', onResize)
        root.addEventListener('scroll', onScroll, true)

        return () => {
            try {
                editor.off('text-change', onChange)
            } catch { }
            observer.disconnect()
            window.removeEventListener('resize', onResize)
            root.removeEventListener('scroll', onScroll, true)
        }
    }, [])

    const options = data?.data?.map((item: any) => ({
        label: item?.title,
        value: item?.id,
    }))

    const initialFaqList = fields?.map((question: any) => ({
        question: question.question || '',
        answer: question.answer || '',
    }))
    const onSubmit: any = (data: any, publish: boolean) => {
        // const content = quillRef.current.getEditor().root.innerHTML
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

        const imageSizeError = imageSizeErrorMessage(data.featuredImage[0])
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

        let isAnyFaqInvalid = false

        data?.blogQuestions &&
            data?.blogQuestions?.forEach((faq: any, index: number) => {
                if (faq?.question === '' || faq?.answer === '') {
                    formMethods.setError(`faq.${index}.question`, {
                        type: 'FAQs',
                        message: 'FAQ question should not be empty',
                    })

                    formMethods.setError(`faq.${index}.answer`, {
                        type: 'FAQs',
                        message: 'FAQ answer should not be empty',
                    })

                    isAnyFaqInvalid = true
                }
            })

        if (isAnyFaqInvalid) {
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
            blogQuestions: JSON.stringify(data?.blogQuestions),
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
                                                    required
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
                                                    required
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