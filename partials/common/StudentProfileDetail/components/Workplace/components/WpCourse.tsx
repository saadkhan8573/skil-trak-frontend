import { ActionButton, AuthorizedUserComponent, Typography } from '@components'
import { UserRoles } from '@constants'
import { Course } from '@types'
import React from 'react'
import { RiPencilFill } from 'react-icons/ri'

export const WpCourse = ({
    onClick,
    wpCourse,
}: {
    wpCourse: Course
    onClick: () => void
}) => {
    return (
        <div className="flex items-end gap-x-2">
            <Typography variant="xs" semibold>
                Course :{' '}
            </Typography>
            <div className="flex items-center gap-x-1">
                <div>
                    <Typography variant="xs">{wpCourse?.code}</Typography>
                    <Typography variant="xs" semibold>
                        {wpCourse?.title}
                    </Typography>
                </div>
                <AuthorizedUserComponent
                    roles={[UserRoles.ADMIN]}
                    customUserIds={[20365]}
                >
                    <ActionButton
                        Icon={RiPencilFill}
                        mini
                        rounded
                        variant="info"
                        onClick={() => onClick()}
                    />
                </AuthorizedUserComponent>
            </div>
        </div>
    )
}
