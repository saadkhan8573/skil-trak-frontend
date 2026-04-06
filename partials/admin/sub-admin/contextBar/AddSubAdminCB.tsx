import { UserRoles } from '@constants'
import { useEffect } from 'react'
import { SubAdminForm } from '../form'

// query
import { useContextBar, useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { SubAdmin } from '@types'

export const AddSubAdminCB = ({
    subAdmin,
    edit,
}: {
    edit?: boolean
    subAdmin?: SubAdmin
}) => {
    const { notification } = useNotification()
    const contextBar = useContextBar()

    const [createSubAmin, createSubAminResult] =
        AdminApi.SubAdmins.createSubAmin()
    const [update, updateResult] = AdminApi.SubAdmins.useUpdate()

    useEffect(() => {
        if (createSubAminResult.isSuccess) {
            notification.success({
                title: 'SubAdmin Added',
                description: 'SubAdmin Added Successfully',
            })
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [createSubAminResult])

    useEffect(() => {
        if (updateResult.isSuccess) {
            notification.info({
                title: 'SubAdmin Updated',
                description: 'SubAdmin Updated Successfully',
            })
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [updateResult])

    const onSubmit = (values: any) => {
        if (edit) {
            update({
                id: Number(subAdmin?.id),
                userId: Number(subAdmin?.user?.id),
                body: values,
            })
        } else {
            const { sectors, ...newValues } = values
            createSubAmin({
                role: UserRoles.SUBADMIN,
                ...newValues,
                password: 'NA',
            })
        }
    }

    return (
        <div>
            <SubAdminForm
                result={edit ? updateResult : createSubAminResult}
                onSubmit={onSubmit}
                subAdmin={subAdmin}
                edit={edit}
            />
        </div>
    )
}
