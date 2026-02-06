import { AdminLayout } from '@layouts'
import React, { ReactElement } from 'react'
import { AdminApi } from '@queries'
import { useRouter } from 'next/router'
import { NoteTemplateForm } from '@partials'
import {
    BackButton,
    Card,
    draftToHtmlText,
    LoadingAnimation,
    Popup,
    ShowErrorNotifications,
} from '@components'
import { PageHeading } from '@components/headings'
import { useNotification } from '@hooks'

const EditNoteTemplate = () => {
    const router = useRouter()

    const { notification } = useNotification()

    const detail = AdminApi.NotesTemplates.notesTemplateDetail(
        Number(router.query?.id),
        {
            skip: !router.query?.id,
        }
    )
    const [update, updateResult] = AdminApi.NotesTemplates.updateNoteTemplate()

    const onSubmit = async (values: any) => {
        const res: any = await update({
            ...values,
            id: Number(router.query?.id),
        })

        if (res?.data) {
            notification.success({
                title: 'Note Template Added',
                description: 'Note Template Added Successfully',
            })
            router.back()
        }
    }
    return (
        <div className="p-6 flex flex-col gap-y-4">
            <ShowErrorNotifications result={updateResult} />
            <BackButton text="Notes Templates" />
            <PageHeading
                title="Edit Workplace Type"
                subtitle={`You are editing a Workplace Type`}
            ></PageHeading>
            <div>
                {detail?.data && !detail?.isLoading ? (
                    updateResult.isLoading || updateResult.isSuccess ? (
                        <Popup
                            title="Updating..."
                            subtitle="You will be redirected on submission"
                            variant="info"
                        />
                    ) : (
                        <NoteTemplateForm
                            edit
                            onSubmit={onSubmit}
                            initialValues={detail?.data}
                            result={updateResult}
                        />
                    )
                ) : (
                    <LoadingAnimation />
                )}
            </div>
        </div>
    )
}

EditNoteTemplate.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default EditNoteTemplate
