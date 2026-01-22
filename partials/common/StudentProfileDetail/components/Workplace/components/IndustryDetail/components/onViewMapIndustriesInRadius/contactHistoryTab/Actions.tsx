import { FaCheck } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { PuffLoader } from 'react-spinners'
import { CommonApi } from '@queries'
import { useNotification } from '@hooks'
import { ShowErrorNotifications } from '@components'
import { StatusBadge } from './StatusBadge'
import { X } from 'lucide-react'

export const Actions = ({ contactId, alreadyContacted, int }: any) => {
    const { notification } = useNotification()
    const [interested, interestedResult] =
        CommonApi.FindWorkplace.useFutureIndustryInterest()
    const onClickInterested = async (cId: any) => {
        const response: any = await interested({
            id: String(cId),
            body: {
                status: true,
            },
        })
        if (response?.data) {
            notification.success({
                title: 'Interested',
                description: 'Status interested updated successfully',
            })
            // studentDetails.refetch()
        }
    }

    const onClickNotInterested = async (cId: any) => {
        const response: any = await interested({
            id: String(cId),
            body: {
                status: false,
            },
        })
        if (response?.data) {
            notification.success({
                title: 'Not Interested',
                description: 'Status not interested updated successfully',
            })
            // contactedIndustries.refetch()
        }
    }
    return (
        <>
            <ShowErrorNotifications result={interestedResult} />
            <div className="flex items-center gap-2">
                {alreadyContacted?.length > 0 &&
                (int === null || int === undefined) ? (
                    <>
                        <button
                            onClick={() => onClickNotInterested(contactId)}
                            disabled={interestedResult.isLoading}
                            className="group relative inline-flex items-center justify-center w-5 h-5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mark as Not Interested"
                        >
                            {interestedResult.isLoading ? (
                                <PuffLoader size={12} color="#ef4444" />
                            ) : (
                                <X className="size-4 text-red-600" />
                            )}
                        </button>
                        <button
                            onClick={() => onClickInterested(contactId)}
                            disabled={interestedResult.isLoading}
                            className="group relative inline-flex items-center justify-center w-5 h-5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mark as Interested"
                        >
                            {interestedResult.isLoading ? (
                                <PuffLoader size={12} color="#22c55e" />
                            ) : (
                                <FaCheck className="w-3 h-3 text-green-600" />
                            )}
                        </button>
                    </>
                ) : (
                    <StatusBadge
                        status={int}
                        date={alreadyContacted?.[0]?.updatedAt ?? '---'}
                    />
                )}
            </div>
        </>
    )
}
