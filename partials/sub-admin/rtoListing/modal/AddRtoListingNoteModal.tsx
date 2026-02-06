import { SubAdminApi } from '@queries'

import {
    Button,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
    ShowErrorNotifications,
    Typography
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

export const AddRtoListingNoteModal = ({ onCloseModal }: any) => {
    const router = useRouter()
    const id = router.query.id
    const { notification } = useNotification()

    const [addNote, addNoteResult] =
        SubAdminApi.Rto.useAddRtoListingDetailsNote()

    const validationSchema = yup.object({
        comment: yup.mixed().test('Message', 'Must Provide Message', (value: any) =>
            inputRichTextEditorErrorMessage(value)
        ),
    })

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })
    const onSubmit = async (values: any) => {
        const res: any = await addNote({ id, body: values })
        if (res?.data) {
            notification.success({
                title: 'Note Added',
                description: 'Note Added Successfully',
            })
            onCloseModal?.()
        }

    }
    return (
        <div>
            <ShowErrorNotifications result={addNoteResult} />
            <Typography variant="title">Add note</Typography>
            <FormProvider {...methods}>
                <form
                    className="mt-6 w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <InputRichTextEditor label="Note" name="comment" />
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
