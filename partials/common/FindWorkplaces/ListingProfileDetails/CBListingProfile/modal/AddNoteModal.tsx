import React, { useEffect } from 'react'
import { CommonApi } from '@queries'
import {
    Button,
    InputRichTextEditor,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useNotification } from '@hooks'
import { useRouter } from 'next/router'

export const AddNoteModal = ({ onCloseModal }: any) => {
    const router = useRouter()
    const id = router.query.id
    const { notification } = useNotification()

    const [addNote, addNoteResult] =
        CommonApi.FindWorkplace.useAddIndustryListingDetailsNote()

    useEffect(() => {
        if (addNoteResult.isSuccess) {
            notification.success({
                title: 'Note Added',
                description: 'Note Added Successfully',
            })
            onCloseModal?.()
        }
    }, [addNoteResult.isSuccess])

    const validationSchema = yup.object({
        comment: yup.string().required('Required'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: {
            comment: '',
        },
    })

    const onSubmit = async (values: any) => {
        const { comment } = values

        if (!comment || comment === '<p></p>' || comment.trim() === '') {
            methods.setError('comment', {
                type: 'manual',
                message: 'Must add note',
            })
            return
        }

        const body = { comment }
        addNote({ id, body })
    }

    return (
        <div className="space-y-6">
            <ShowErrorNotifications result={addNoteResult} />
            <Typography variant="title">Add note</Typography>
            <FormProvider {...methods}>
                <form
                    className="space-y-6"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <InputRichTextEditor
                        label="Note"
                        name="comment"
                        height="h-64"
                    />
                    <Button
                        submit
                        disabled={addNoteResult.isLoading}
                        loading={addNoteResult.isLoading}
                        text={'Add Note'}
                    />
                </form>
            </FormProvider>
        </div>
    )
}
