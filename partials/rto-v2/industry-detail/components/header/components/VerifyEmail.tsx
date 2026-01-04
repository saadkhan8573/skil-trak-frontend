import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Badge, Button } from '@components'
import { EmailVerificationDialog } from '../modals'
import { useAppSelector } from '@redux/hooks'
import { cn } from '@utils'

export function VerifyEmail() {
    const [showModal, setShowModal] = useState(false)

    const industry = useAppSelector((state) => state.industry.industryDetail)
    const isEmailVerified = industry?.user?.isEmailVerified
    const industryEmail = industry?.user?.email || ''
    const industryUserId = industry?.user?.id || 0
    const industryUserName = industry?.user?.name || ''

    if (isEmailVerified) {
        return null
    }

    return (
        <div id={"email-verified"}>
            <Badge
                onClick={() => setShowModal(true)}
                title={isEmailVerified ? 'Email verified' : 'Verify email'}
                Icon={Mail}
                className={cn('!bg-primary !text-white cursor-pointer transition-all active:scale-95')}
            >
                {isEmailVerified ? 'Verified' : 'Verify Email'}
            </Badge>

            <EmailVerificationDialog
                open={showModal}
                emailVerified={isEmailVerified || false}
                industryEmail={industryEmail}
                userId={industryUserId}
                userName={industryUserName}
                onOpenChange={setShowModal}
            />
        </div>
    )
}
