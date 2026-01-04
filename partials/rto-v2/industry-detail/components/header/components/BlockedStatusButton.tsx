import { Badge } from '@components'
import { useAppSelector } from '@redux/hooks'
import { UserStatus } from '@types'
import { cn } from '@utils'
import { Ban, Unlock } from 'lucide-react'
import { useState } from 'react'
import { IndustryStatusChangeModal } from '../modals'

export function BlockedStatusButton() {
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false)
    const industry = useAppSelector((state) => state.industry.industryDetail)

    const isBlocked = industry?.user?.status === UserStatus.Blocked

    return (
        <>
            <Badge
                onClick={() => setShowStatusChangeModal(true)}
                Icon={isBlocked ? Unlock : Ban}
                className={cn(
                    '!text-white cursor-pointer transition-all active:scale-95',
                    isBlocked ? '!bg-green-500' : '!bg-red-500'
                )}
                title={isBlocked ? 'Unblock Industry' : 'Block Industry'}
            >
                {isBlocked ? 'Unblock' : 'Block'}
            </Badge>

            <IndustryStatusChangeModal
                industryId={industry?.id!}
                isBlocked={isBlocked}
                open={showStatusChangeModal}
                onOpenChange={setShowStatusChangeModal}
            />
        </>
    )
}
