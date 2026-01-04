import { Badge } from '@components'
import { UserCircle } from 'lucide-react'
import { useState } from 'react'
import { ContactBiographyModal } from '../../ContactBiographyModal'

export function ContactBioButton() {
    const [showContactBioModal, setShowContactBioModal] = useState(false)

    return (
        <>
            <Badge
                onClick={() => setShowContactBioModal(true)}
                Icon={UserCircle}
                className="!bg-[#10B981] !text-white cursor-pointer hover:shadow-lg transition-all active:scale-95"
                title="Contact & Bio"
            >
                Bio
            </Badge>

            <ContactBiographyModal
                isOpen={showContactBioModal}
                onClose={() => setShowContactBioModal(false)}
            />
        </>
    )
}
