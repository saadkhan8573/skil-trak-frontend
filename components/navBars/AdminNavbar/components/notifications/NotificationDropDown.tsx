import { NoData, Typography } from '@components'
import { getUserCredentials } from '@utils'
import { Bell } from 'lucide-react'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import { NotificationItem } from './NotificationItem'

interface NotificationDropDown {
    expanded: boolean
    showArrow?: boolean
    data: any
    isReadNotification: any
    resultIsReadNotification: any
    setNotificationsExpanded: (value: boolean) => void
}
export const NotificationDropDown = ({
    expanded,
    data,
    isReadNotification,
    showArrow = true,
    resultIsReadNotification,
    setNotificationsExpanded,
}: NotificationDropDown) => {
    // const { data, error, isLoading } = CommonApi.Notifications.useNotifications()
    // const [isReadNotification, resultIsReadNotification] = CommonApi.Notifications.useIsReadNotification()
    const router = useRouter()
    const getRole = getUserCredentials()
    const role = (userRole: any) => {
        switch (userRole) {
            case 'subadmin':
                return 'sub-admin'
            case 'admin':
                return 'admin'
            case 'rto':
                return 'rto'
            case 'industry':
                return 'industry'
            case 'student':
                return 'student'
        }
        return userRole
    }

    return (
        <>
            <div
                className={`absolute top-10 -right-5 z-40 bg-white w-80 transition-all rounded-lg ${!expanded ? 'max-h-0 hidden' : 'max-h-96 shadow-md border'
                    } `}
            >
                <div className="relative">
                    {showArrow && (
                        <div className="absolute -top-5 right-20 z-50!">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="27"
                                height="22"
                                viewBox="0 0 27 22"
                                fill="none"
                            >
                                <path
                                    d="M13.5 0L26.0574 21.75H0.942632L13.5 0Z"
                                    fill="#FD7A7C"
                                />
                            </svg>
                        </div>
                    )}
                    <div className="py-2 bg-red-400 px-4 rounded-t-lg border-b flex gap-x-2 items-center">
                        <div>
                            {' '}
                            <Bell className="text-white" />
                        </div>
                        <Typography variant="label" color="text-white">
                            Notifications
                        </Typography>
                    </div>
                    <div className="overflow-auto max-h-80 remove-scrollbar">
                        {data?.isLoading ? (
                            <PulseLoader color={'white'} size={10} />
                        ) : data?.data?.length > 0 || true ? (
                            <div className="relative p-1.5 flex flex-col gap-y-1.5">
                                {data?.data?.map((notification: any) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onClick={() => {
                                            setNotificationsExpanded(false)
                                            isReadNotification(notification?.id)
                                            if (notification?.link) {
                                                router.push(notification?.link)
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <NoData text="No New Notifications were Found" />
                        )}
                    </div>
                    <div className="flex justify-center bg-white border-t border-[#D0D0D0] shadow-lg py-2 px-4 rounded-b-lg">
                        <div
                            onClick={() => {
                                router.push(
                                    getRole?.role === 'admin'
                                        ? `/portals/admin/all-notifications`
                                        : `/portals/${role(
                                            getRole?.role
                                        )}/notifications/all-notifications`
                                )
                                setNotificationsExpanded(false)
                            }}
                        >
                            <Typography
                                color="text-red-400"
                                cursorPointer
                                variant="label"
                                medium
                            >
                                View All
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
