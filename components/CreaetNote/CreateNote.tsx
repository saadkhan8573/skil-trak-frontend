import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

// components
import {
    ActionButton,
    Button,
    Card,
    Checkbox,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
    ShowErrorNotifications,
    TextInput,
    Typography
} from '@components'

// query
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification, useRewritePhrase } from '@hooks'
import { CommonApi } from '@queries'
import { HtmlToPlainText } from '@utils'
import ClickAwayListener from 'react-click-away-listener'
import { RiShining2Fill } from 'react-icons/ri'

interface onSubmitType {
    title: string
    body: string
    isPinned: boolean
}
export const CreateNote = ({
    action,
    receiverId,
    sender,
    editValues,
    setEditValues,
    onCancel,
}: any) => {
    const { notification } = useNotification()
    const [noteContent, setNoteContent] = useState<any>(null)

    const ref = useRef<HTMLDivElement>(null)

    const [isSendDraft, setIsSendDraft] = useState<boolean>(true)

    // query
    const [createNote, createNoteResult] = CommonApi.Notes.useCreate()
    const [setNoteDraft, setNoteDraftResult] = CommonApi.Draft.useSetNoteDarft()
    const getNoteDraft = CommonApi.Draft.getNoteDarft(receiverId, {
        skip: !receiverId,
        refetchOnMountOrArgChange: true,
    })

    const [editing, setEditing] = useState(false)
    const { onRewritePhrase, isLoading } = useRewritePhrase()

    useEffect(() => {
        if (editValues) {
            setEditing(true)
        }
    }, [editValues])

    useEffect(() => {
        if (createNoteResult.isSuccess) {
            setEditing(false)
            if (setEditValues) {
                setEditValues(null)
            }
            notification.success({
                title: 'Note Attached',
                description: 'Note attached successfully',
            })
            setNoteContent(null)
            methods.reset()
            getNoteDraft.refetch()
            if (onCancel) {
                onCancel()
            }
        }
    }, [createNoteResult.isSuccess])

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        body: Yup.string()
            .ensure()
            .test('Message', 'Must Provide Message', inputRichTextEditorErrorMessage),
        isPinned: Yup.boolean().default(false),
    })

    const methods = useForm<onSubmitType>({
        mode: 'all',
        resolver: yupResolver(validationSchema as any),
        defaultValues: { ...editValues },
    })

    useEffect(() => {
        if (getNoteDraft.isSuccess) {
            if (getNoteDraft?.data?.content) {
                methods.setValue('body', getNoteDraft?.data?.content)
            }
            if (getNoteDraft?.data?.title) {
                methods.setValue('title', getNoteDraft?.data?.title)
            }
        }
    }, [getNoteDraft.isSuccess])

    const noteBodyWordsCount = HtmlToPlainText(
        methods?.watch()?.body
    )
        ?.trim()
        ?.replace(/\s+/g, ' ')
        ?.split(' ')?.length


    const isBodyGreaterThen30 = noteBodyWordsCount > 30

    const onFixGrammerClick = async () => {
        const data = await onRewritePhrase(noteContent)

        if (data?.correctedText) {
            setNoteContent(data?.correctedText)
            methods.setValue('body', data?.correctedText)
        }
    }

    const onSubmit = (values: onSubmitType) => {
        setIsSendDraft(false)
        if (editing) {
            // updateNote({ ...values, postedFor: receiverId, id: editValues?.id })
        } else {
            if (values?.body) {
                // const body = draftToHtml(
                //     convertToRaw(values?.body.getCurrentContent())
                // )
                // const body = draftToHtmlText(values?.body)
                createNote({
                    ...values,
                    // body,
                    isPinned: isBodyGreaterThen30 ? false : values?.isPinned,
                    postedFor: receiverId,
                })
            } else {
                notification.error({
                    title: 'Message is Required',
                    description: 'Message is Required',
                })
            }
        }
    }

    return (
        <>
            <ShowErrorNotifications result={createNoteResult} />

            <div className={`sticky -4 -top-48`}>
                <Card>
                    <FormProvider {...methods}>
                        <form
                            className="w-full"
                            onSubmit={methods.handleSubmit(onSubmit)}
                        >
                            <div>
                                <TextInput
                                    label={'Title'}
                                    name={'title'}
                                    placeholder={'Note Title...'}
                                    validationIcons
                                    onBlur={(e: any) => {
                                        if (
                                            !ref.current?.contains(
                                                e.relatedTarget
                                            )
                                        ) {
                                            setNoteDraft({
                                                receiver: receiverId,
                                                title: e.target.value,
                                            })
                                        }
                                    }}
                                />

                                <div className="flex justify-between items-center">
                                    <Typography variant="label">
                                        Message
                                    </Typography>
                                    <ActionButton
                                        variant="info"
                                        Icon={RiShining2Fill}
                                        text="Rewrite with AI"
                                        onClick={() => {
                                            onFixGrammerClick()
                                        }}
                                        disabled={!noteContent?.trim()}
                                        loading={isLoading}
                                    />
                                </div>
                                <ClickAwayListener
                                    onClickAway={(e: any) => {
                                        if (
                                            noteContent &&
                                            !ref.current?.contains(e.target)
                                        ) {
                                            setNoteDraft({
                                                receiver: receiverId,
                                                content: noteContent,
                                            })
                                        }
                                    }}
                                >
                                    <div className="mb-3">
                                        <InputRichTextEditor
                                            name={'body'}
                                            onChange={(e: any) => {
                                                setNoteContent(e)
                                            }}
                                        />
                                    </div>
                                </ClickAwayListener>

                                {/* <Select
                                    name={'templates'}
                                    options={templates}
                                    onChange={(e: OptionType) => {
                                        setTemplate(e?.value)
                                    }}
                                /> */}

                                <div className="mt-2 mb-4">
                                    <Checkbox
                                        name={'isPinned'}
                                        label={'Pinned'}
                                        disabled={isBodyGreaterThen30}
                                        showError={false}
                                    />
                                </div>

                                <div ref={ref} id={'submitButton'}>
                                    <Button
                                        submit
                                        fullWidth
                                        text={`${editing ? 'Update' : 'Add'
                                            } Note`}
                                        loading={createNoteResult?.isLoading}
                                        disabled={createNoteResult?.isLoading}
                                        variant={
                                            editing ? 'secondary' : 'primary'
                                        }
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </Card>
            </div>
        </>
    )
}
