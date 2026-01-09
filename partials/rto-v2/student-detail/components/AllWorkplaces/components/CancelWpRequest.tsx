import React from 'react'
import { UserRoles } from '@constants'
import { Button, AuthorizedUserComponent } from '@components'
import { XCircle } from 'lucide-react'

export const CancelWpRequest = ({
    onCancelWPClicked,
    onCancelWPRequestClicked,
    fullWidth = true
}: {
    onCancelWPClicked: () => void
    onCancelWPRequestClicked: () => void
    fullWidth?: boolean
}) => {
    return (
        <div className={fullWidth ? "w-full" : ""}>
            <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                <Button
                    variant="error"
                    outline
                    fullWidth={fullWidth}
                    className="h-9 text-xs font-semibold gap-2 border-red-200 hover:bg-red-50"
                    onClick={onCancelWPClicked}
                    Icon={XCircle}
                    text="Cancel Workplace"
                />
            </AuthorizedUserComponent>
            <AuthorizedUserComponent roles={[UserRoles.SUBADMIN]}>
                <Button
                    variant="error"
                    outline
                    fullWidth={fullWidth}
                    className="h-9 text-xs font-semibold gap-2 border-red-200 hover:bg-red-50"
                    onClick={onCancelWPRequestClicked}
                    Icon={XCircle}
                    text="Cancel Request"
                />
            </AuthorizedUserComponent>
        </div>
    )
}
