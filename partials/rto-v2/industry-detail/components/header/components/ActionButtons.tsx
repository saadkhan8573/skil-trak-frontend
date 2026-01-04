import { AuthorizedUserComponent } from '@components'
import { AddNoteButton } from './AddNoteButton'
import { BlockedStatusButton } from './BlockedStatusButton'
import { BranchLocationsButton } from './BranchLocationsButton'
import { ContactBioButton } from './ContactBioButton'
import { EditProfileButton } from './EditProfileButton'
import { MoreMenuButton } from './MoreMenuButton'
import { SendIndustryMail } from './SendIndustryMail'
import { VerifyEmail } from './VerifyEmail'
import { PhoneCallButton } from './PhoneCallButton'
import { UserRoles } from '@constants'

export function ActionButtons() {
    return (
        <div className="flex items-center gap-1.5 ml-auto flex-wrap justify-end shrink-0">
            <VerifyEmail />
            <SendIndustryMail />
            <PhoneCallButton />
            <EditProfileButton />
            <ContactBioButton />
            <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                <BranchLocationsButton />
                <BlockedStatusButton />
            </AuthorizedUserComponent>
            <AddNoteButton />
            <MoreMenuButton />
        </div>
    )
}
