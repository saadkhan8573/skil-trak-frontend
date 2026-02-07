import { ShowErrorNotifications } from '@components'
import { useNavbar, useNotification } from '@hooks'
import { AdminLayout } from '@layouts'
import { NoteTemplateForm } from '@partials'
import React, { ReactElement, useEffect } from 'react'
import { AdminApi } from '@queries'
import { useRouter } from 'next/router'

const AddNoteTemplate = () => {
    const navBar = useNavbar()

    const router = useRouter()

    const { notification } = useNotification()

    const [add, addResult] = AdminApi.NotesTemplates.addNoteTemplate()

    useEffect(() => {
        navBar.setTitle('Add Notes Templates')
    }, [])

    const onSubmit = async (values: any) => {

        const res: any = await add({
            ...values,
            // successContent,
            // failureContent,
        })

        if (res?.data) {
            notification.success({
                title: 'Note Template Added',
                description: 'Note Template Added Successfully',
            })
            router.back()
        }

        // createNewDraft(formData)
    }
    return (
        <div className="p-4">
            <ShowErrorNotifications result={addResult} />
            <NoteTemplateForm onSubmit={onSubmit} result={addResult} />
        </div>
    )
}

AddNoteTemplate.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default AddNoteTemplate
