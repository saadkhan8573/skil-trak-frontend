import {
    ProfileDetail,
    SubadminReports,
    SubadminTodoList,
    SubadminProgress,
    SubadminProfileCounts,
    SubadminCalendarViewDetail,
} from './components'
import { useAlert } from '@hooks'
import { useEffect } from 'react'
import { AdminApi } from '@queries'
import { Notes } from '@partials/common'
import { SubAdmin, UserStatus } from '@types'
import { SubadminHistory } from './components/SubadminHistory'
import { MailsCommunication } from '@partials/common/StudentProfileDetail/components'
import { AuthorizedUserComponent } from '@components'
import { UserRoles } from '@constants'

export const SubadminProfileDetail = ({ subadmin }: { subadmin: SubAdmin }) => {
    const subAdminProfileCount = AdminApi.SubAdmins.useProfileCount(
        Number(subadmin?.user?.id),
        {
            skip: !subadmin,
        }
    )

    const { alert, setAlerts } = useAlert()

    useEffect(() => {
        const showAlert = () => {
            switch (subadmin?.user?.status) {
                case UserStatus.Pending:
                    alert.warning({
                        title: 'Subadmin is Pending',
                        description: 'Subadmin is Pending',
                        autoDismiss: false,
                    })
                    break
                case UserStatus.Archived:
                    alert.warning({
                        title: 'Subadmin is Archived',
                        description: 'Subadmin is Archived',
                        autoDismiss: false,
                    })
                    break
                case UserStatus.Rejected:
                    alert.error({
                        title: 'Subadmin is Rejected',
                        description: 'Subadmin is Rejected',
                        autoDismiss: false,
                    })
                    break
                case UserStatus.Blocked:
                    alert.error({
                        title: 'Subadmin is Blocked',
                        description: 'Subadmin is Blocked',
                        autoDismiss: false,
                    })
                    break

                default:
                    break
            }
        }
        showAlert()

        return () => {
            setAlerts([])
        }
    }, [])

    return (
        <div className="flex flex-col gap-y-6">
            <div className="grid grid-cols-3 gap-x-5">
                <div className="flex flex-col">
                    <div className="grow">
                        <div className="h-full">
                            <ProfileDetail subadmin={subadmin} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col col-span-2 h-full">
                    <div className="grow h-full">
                        <div className="h-full">
                            <SubadminProfileCounts
                                subAdminProfileCount={subAdminProfileCount}
                                subadminUserId={subadmin?.user?.id}
                                profileDetail={subadmin}
                                subadminId={subadmin?.id}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/*  */}
            <SubadminProgress subAdminProfileCount={subAdminProfileCount} />

            {/*  */}
            <div className=" grid grid-cols-3 gap-x-4.5 h-145">
                <div className="col-span-2 h-full">
                    <div className="w-full">
                        <SubadminCalendarViewDetail
                            subadminUserId={subadmin?.user?.id}
                        />
                    </div>
                </div>
                <div className="h-full overflow-hidden">
                    <Notes userId={subadmin?.user?.id} />
                </div>
            </div>

            {/*  */}
            <AuthorizedUserComponent
                roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
            >
                <SubadminTodoList />
            </AuthorizedUserComponent>

            {/*  */}
            <div>
                <SubadminHistory subadminUserId={subadmin?.user?.id} />
            </div>

            <div>
                <SubadminReports
                    subadmin={subadmin}
                    subadminUserId={subadmin?.user?.id}
                />
            </div>

            {/*  */}
            <div className="h-160 px-2  grid grid-cols-2 gap-x-3">
                <div className={`h-[99%]! col-span-2`}>
                    <MailsCommunication user={subadmin} />
                </div>
            </div>
        </div>
    )
}
