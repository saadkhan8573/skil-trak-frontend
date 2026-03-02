import { useEffect } from 'react'

// components
import { Select, ShowErrorNotifications, Typography } from '@components'

// queries
import { AdminApi } from '@queries'

// utils
import { useNotification } from '@hooks'
import { OptionType, SubAdmin } from '@types'
import { ellipsisText } from '@utils'
import { IWorkplaceIndustries } from '@redux/queryTypes'

export const AssignWorkplace = ({
    workplace,
}: {
    workplace: IWorkplaceIndustries
}) => {
    const { notification } = useNotification()

    const subadmins = AdminApi.Workplace.subadminForAssignWorkplace()
    const [assignSubAdmin, assignSubAdminResult] =
        AdminApi.Workplace.useWorkplaceMutation()

    useEffect(() => {
        if (assignSubAdminResult.isSuccess) {
            notification.success({
                title: 'Subadmin Assigned',
                description: 'Subadmin Assigned Successfully',
            })
        }
    }, [assignSubAdminResult])

    const subAdminOptions = subadmins?.data?.map((subAdmin: SubAdmin) => ({
        label: subAdmin?.user?.name,
        value: subAdmin?.id,
    }))

    const onAssignSubAdmin = (e: OptionType) => {
        assignSubAdmin({
            subadmin: Number(e?.value),
            workplace: Number(workplace?.id),
        })
    }
    return (
        <div>
            <ShowErrorNotifications result={assignSubAdminResult} />
            {workplace?.assignedTo ? (
                <>
                    <Typography variant={'small'} color={'text-gray-500'}>
                        <span className="font-semibold">Assigned To:</span>
                    </Typography>
                    <Typography variant={'small'} capitalize>
                        <span
                            className="font-semibold"
                            title={workplace?.assignedTo?.user?.name}
                        >
                            {ellipsisText(
                                workplace?.assignedTo?.user?.name,
                                15
                            )}
                        </span>
                    </Typography>{' '}
                </>
            ) : (
                <Select
                    label={'Sub Admin'}
                    name={'subAdmin'}
                    placeholder={'Select Sub Admin'}
                    options={subAdminOptions}
                    loading={
                        subadmins?.isLoading || assignSubAdminResult.isLoading
                    }
                    disabled={
                        subadmins?.isLoading || assignSubAdminResult.isLoading
                    }
                    onChange={(e: OptionType) => {
                        onAssignSubAdmin(e)
                    }}
                />
            )}
        </div>
    )
}
