import { Badge, Button } from '@components'
import { ComposeEmailModal } from '@partials/rto-v2/student-detail/components'
import { useAppSelector } from '@redux'
import { Student } from '@types'
import { Mail } from 'lucide-react'
import { ReactElement, useState } from 'react'

export const SendIndustryMail = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const onCancelClicked = () => setModal(null)

    const industry = useAppSelector((state) => state.industry.industryDetail)

    const onComposeMailClicked = () => {
        setModal(
            <ComposeEmailModal
                user={industry?.user!}
                onCancel={onCancelClicked}
            />
        )
    }

    return (
        <div className="flex items-center gap-2">
            {modal}
            <Badge
                variant="primaryNew"
                text="Message"
                Icon={Mail}
                onClick={onComposeMailClicked}
            />
        </div>
    )
}
