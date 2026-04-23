import { useNotification } from '@hooks'
import { useState } from 'react'

import { ShowErrorNotifications } from '@components'
import { CreatedStudentsList } from '@partials/common'
import { RtoV2Api } from '@queries'
import { ImportStudentsListFormWithOTP } from '../components'

export const ImportStudentsTab = ({ onCancel }: { onCancel?: () => void }) => {
    const { notification } = useNotification()

    const [importedStudentsResult, setImportedStudentsResult] =
        useState<any>(null)

    const [importStudents, importStudentsResult] =
        RtoV2Api.Students.importStudents()

    const onSubmit = async (values: any) => {
        const { list, ...payload } = values

        const res: any = await importStudents(payload)

        if (res?.data) {
            notification.success({
                title: 'Students Uploaded',
                description: 'Students Uploaded Successfully',
            })
            setImportedStudentsResult(res?.data)
            return true
        }
    }

    if (importedStudentsResult) {
        return (
            <CreatedStudentsList
                importedStudentsResult={importedStudentsResult}
                onBack={() => {
                    setImportedStudentsResult(null)
                }}
                buttonVariant={'primaryNew'}
            />
        )
    }

    return (
        <>
            <ShowErrorNotifications result={importStudentsResult} />
            <ImportStudentsListFormWithOTP
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </>
    )
}
