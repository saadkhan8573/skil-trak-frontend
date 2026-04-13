import {
    Card,
    PageTitle,
    ShowErrorNotifications,
    withPermission,
} from '@components'
import { useContextBar, useNotification } from '@hooks'
import { RtoLayoutV2 } from '@layouts'
import { NextPageWithLayout, PermissionType } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'

import { UserRoles } from '@constants'
import { SubAdminForm } from '@partials/admin/sub-admin/form'
import { RtoApi } from '@queries'
import { Users } from 'lucide-react'

const AddTeamPage: NextPageWithLayout = () => {
    const { notification } = useNotification()
    const router = useRouter()
    const contextBar = useContextBar()
    const [createCoordinator, createCoordinatorResult] =
        RtoApi.Coordinator.useCreate()

    const onSubmit = async (values: any) => {
        await createCoordinator({
            // id: credentials.id,
            ...values,
            role: UserRoles.SUBADMIN,
            status: 'approved',
        })
    }

    useEffect(() => {
        if (createCoordinatorResult.isSuccess) {
            notification.success({
                title: 'Coordinator created successfully',
                description: 'A new coordinator has been created and assigned',
            })

            router.back()
        }
    }, [createCoordinatorResult])

    const rto = RtoApi.Rto.useProfile()

    const rtoCoursesOptions = rto?.data?.courses?.map((course: any) => ({
        label: course?.title,
        value: course?.id,
        item: course,
    }))

    return (
        <div>
            <ShowErrorNotifications result={createCoordinatorResult} />

            <Card>
                <SubAdminForm
                    onSubmit={onSubmit}
                    result={createCoordinatorResult}
                    rtoCoursesOptions={rtoCoursesOptions}
                />
            </Card>
        </div>
    )
}

AddTeamPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                title: 'Add Team',
                description: 'Add Your Team',
                Icon: Users,
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default withPermission(AddTeamPage, {
    permissions: [PermissionType.TEAM_MANAGEMENT],
})
