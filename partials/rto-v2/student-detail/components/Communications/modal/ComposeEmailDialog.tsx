import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Button } from '@components'
import { Label } from '@components/ui/label'
import { cn } from '@utils'
import { InputRichTextEditor, Select, TextInput, AttachmentUpload } from '@components'
import { useNotification, useRewritePhrase } from '@hooks'
import { CommonApi } from '@queries'
import { AuthUtils } from '@utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loader2, Send, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { User } from '@types'

interface ComposeEmailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User
    userId?: number
    workplaceId?: number
}

interface onSubmitType {
    to?: string
    cc?: string
    subject: string
    message: string
    template: any
    attachments: File[] | null
}

export const ComposeEmailDialog = ({
    open,
    onOpenChange,
    user,
    userId,
    workplaceId,
}: ComposeEmailDialogProps) => {
    const { notification } = useNotification()
    const [mailContent, setMailContent] = useState<string>('')
    const [templateAttachment, setTemplateAttachment] = useState<File | null>(null)
    const [showCC, setShowCC] = useState(false)

    const [sendMessage, sendMessageResult] = CommonApi.Messages.useSendMessage()
    const [emailDraft, emailDraftResult] = CommonApi.Draft.useEmailDraft()
    const { onRewritePhrase, isLoading: isRewriting } = useRewritePhrase()

    const getEmailDraft = CommonApi.Draft.useGetEmailDraft(Number(userId), {
        skip: !userId,
    })
    const getTemplates = CommonApi.Messages.useAllTemplates()

    const validationSchema = yup.object({
        subject: yup.string().required('Subject is required'),
    })

    const methods = useForm<onSubmitType>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: {
            attachments: []
        }
    })

    const {
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = methods

    // Load Draft
    useEffect(() => {
        if (open && getEmailDraft.isSuccess) { // Only load when opening
            if (getEmailDraft?.data?.content) {
                setValue(
                    'message',
                    getEmailDraft?.data?.content
                )
                setMailContent(getEmailDraft?.data?.content) // Sync local state
            }
            if (getEmailDraft?.data?.title) {
                setValue('subject', getEmailDraft?.data?.title)
            }
        }
    }, [getEmailDraft.isSuccess, open])


    // Success Handler
    useEffect(() => {
        if (sendMessageResult.isSuccess) {
            reset()
            setTemplateAttachment(null)
            notification.success({
                title: 'Email Sent',
                description: 'Email has been sent successfully.',
            })
            onOpenChange(false) // Close modal
            sendMessageResult.reset()
        }
    }, [sendMessageResult.isSuccess])


    const templateOptions = getTemplates?.data?.length
        ? getTemplates?.data?.map((template: any) => ({
            label: template?.subject,
            value: template?.id,
        }))
        : []

    const onFixGrammerClick = async () => {
        const data = await onRewritePhrase(mailContent)
        if (data?.correctedText) {
            setMailContent(data?.correctedText)
            setValue(
                'message',
                data?.correctedText
            )
        }
    }

    // Auto-save draft on subject blur
    const handleSubjectBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (userId) {
            emailDraft({
                receiver: userId,
                title: e.target.value,
            })
        }
    }

    const onSubmit = (values: onSubmitType) => {
        const userCredentials = AuthUtils.getUserCredentials()
        const formData = new FormData()

        const message = values.message
        const ccEmails = values.cc
            ? values.cc
                .split(',')
                .map((email) => email.trim())
                .filter((email) => email.length > 0)
            : []

        const { attachments } = values

        const data = {
            subject: values.subject,
            message,
            type: 'email',
            sender: userCredentials?.id,
            receiver: userId,
            ccUsers: ccEmails || undefined,
            oldAttachment: templateAttachment || '',
            ...(workplaceId && { workplaceId }),
        }

        Object.entries(data)?.forEach(([key, value]: any) => {
            formData.append(key, value)
        })

        if (attachments && attachments.length > 0) {
            // Filter out the template attachment from being uploaded as 'attachments' if it's already handled by 'oldAttachment' logic
            // Although standard logic might just upload everything. The original logic filtered:
            const newAttachments = [...attachments].filter(
                (file) => !templateAttachment || file !== templateAttachment
            )
            newAttachments.forEach((attached: File) => {
                formData.append('attachments', attached)
            })
        }
        sendMessage(formData)
    }

    const findTemplates = (e: any) => {
        const template = getTemplates?.data?.find(
            (template: any) => template.id === e?.value
        )
        if (template) {
            setValue('subject', template?.subject)
            setValue(
                'message',
                template?.content
            )
            setMailContent(template?.content)

            if (template?.file) {
                setTemplateAttachment(template.file)
                // Set form value for visualization
                setValue('attachments', [template.file])
            } else {
                setTemplateAttachment(null)
                setValue('attachments', [])
            }
        }
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl! max-h-[90vh] overflow-y-auto flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Compose Email</DialogTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                        To <span className="font-medium text-foreground">{user?.name}</span> <span className="text-xs">({user?.role})</span>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="grid gap-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                                    <Button
                                        variant="action"
                                        outline
                                        mini
                                        className="h-6 text-xs text-muted-foreground border-none shadow-none hover:bg-accent/50"
                                        onClick={(e) => { e.preventDefault(); setShowCC(!showCC); }}
                                    >
                                        {showCC ? 'Hide CC' : 'Add CC'}
                                    </Button>
                                </div>
                                <TextInput
                                    name="subject"
                                    placeholder="Email subject..."
                                    onBlur={handleSubjectBlur}
                                    validationIcons
                                />
                            </div>

                            {showCC && (
                                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                                    <Label htmlFor="cc">CC</Label>
                                    <TextInput
                                        name="cc"
                                        placeholder="email@example.com, another@example.com"
                                        helpText="Separate multiple emails with commas"
                                        validationIcons
                                    />
                                </div>
                            )}

                            <div className="grid gap-2 relative z-40">
                                <Label>Template</Label>
                                <Select
                                    name={'template'}
                                    options={templateOptions}
                                    placeholder="Select a template..."
                                    onChange={findTemplates}
                                    menuPlacement="auto"
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex justify-between items-center">
                                    <Label>Message</Label>
                                    <Button
                                        variant="action"
                                        outline
                                        className="py-1.5 text-xs gap-1.5 border! border-gray-300!"
                                        onClick={(e) => { e.preventDefault(); onFixGrammerClick(); }}
                                        disabled={!mailContent?.trim() || isRewriting}
                                        loading={isRewriting}
                                    >
                                        <Sparkles className="w-3 h-3 text-amber-500" />
                                        Rewrite with AI
                                    </Button>
                                </div>
                                <div className="">
                                    <InputRichTextEditor
                                        name="message"
                                        onChange={(html: string) => {
                                            setMailContent(html)
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <AttachmentUpload
                                    name="attachments"
                                // multiple={true} // Default is true
                                />
                            </div>
                        </form>
                    </FormProvider>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-muted/10 items-center sm:justify-between gap-3">
                    <Button variant="action" outline onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primaryNew"
                        onClick={handleSubmit(onSubmit)}
                        loading={sendMessageResult.isLoading}
                        className="gap-2"
                        disabled={sendMessageResult.isLoading}
                    >
                        Send Email <Send className="w-4 h-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
