import Link from 'next/link'
import { Typography } from '@components/Typography'
import { useRouter } from 'next/router'
import { Md10Mp } from 'react-icons/md'
import { MessageItem } from './MessageItem'
import { PulseLoader } from 'react-spinners'
import { NoData } from '@components/ActionAnimations'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'

interface MessagesDropDown {
    expanded: boolean
    data: any
    resultSeenMessage: any
    seenMessage: any
}
export const MessageDropDown = ({
    expanded,
    data,
    resultSeenMessage,
    seenMessage,
}: MessagesDropDown) => {
    const onMessageClick = () => {}
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
        <div
            className={`absolute top-10 overflow-scroll -right-5 z-40 bg-white w-80 transition-all rounded-lg remove-scrollbar ${
                !expanded ? 'max-h-0' : 'max-h-96 shadow-md border'
            } `}
        >
            <div className="py-2 px-4 border-b flex justify-between items-center">
                <Typography variant="label">Your Messages</Typography>
                <Link
                    href={
                        getRole?.role === 'admin'
                            ? `/portals/admin/e-mails?tab=all-mails`
                            : getRole?.role === 'student'
                            ? '/portals/student/mails?tab=notification'
                            : `/portals/${role(
                                  getRole?.role
                              )}/notifications/e-mails?tab=all-mails`
                    }
                    className="text-sm text-primary font-semibold cursor-pointer"
                >
                    
                        View All
                    
                </Link>
            </div>
            {data.isLoading ? (
                <PulseLoader color={'white'} size={10} />
            ) : data?.data?.length > 0 ? (
                data?.data?.map((message: any) => (
                    <MessageItem
                        key={message?.id}
                        title={message?.sender?.name}
                        description={message?.message}
                        timestamp={message?.createdAt}
                        onClick={() => {
                            router.push(
                                getRole?.role === 'admin'
                                    ? `/portals/admin/e-mails?tab=all-mails`
                                    : `/portals/${role(
                                          getRole?.role
                                      )}/notifications/e-mails?tab=all-mails`
                            )
                            seenMessage(message?.id)
                        }}
                        resultSeenMessage={resultSeenMessage}
                        isSeen={message?.isSeen}
                    />
                ))
            ) : (
                <NoData text="No New Emails were Found" />
            )}
        </div>
    );
}
