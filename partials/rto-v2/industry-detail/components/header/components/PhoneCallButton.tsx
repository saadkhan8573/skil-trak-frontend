import { Badge } from '@components'
import { useAppSelector } from '@redux/hooks'
import { cn } from '@utils'
import { Phone } from 'lucide-react'
import { useState } from 'react'
import { CallLogModal } from '../modals'

export function PhoneCallButton() {
    const [showModal, setShowModal] = useState(false)
    const industry = useAppSelector((state) => state.industry.industryDetail)

    const industryId = industry?.id
    const phoneNumber = industry?.phoneNumber
    const isSnoozed = industry?.isSnoozed
    const industryName = industry?.user?.name

    if (!industryId) return null

    return (
        <div>
            <Badge
                onClick={() => setShowModal(true)}
                title="Call Logs"
                Icon={Phone}
                className={cn(
                    '!bg-blue-600 !text-white cursor-pointer transition-all active:scale-95'
                )}
            >
                Call
            </Badge>

            <CallLogModal
                open={showModal}
                onOpenChange={setShowModal}
                industryId={industryId}
                phoneNumber={phoneNumber}
                isSnoozed={isSnoozed}
                industryName={industryName}
            />
        </div>
    )
}
