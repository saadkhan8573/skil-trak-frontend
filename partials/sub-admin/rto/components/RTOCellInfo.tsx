import { useIsRestricted, useRestrictedData } from '@components'
import { InitialAvatar } from '@components/InitialAvatar'
import { Rto } from '@types'
import { maskText, setLink } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'

export const RTOCellInfo = ({
    rto,
    onlyName = true,
}: {
    onlyName?: boolean
    rto: Rto
}) => {
    const router = useRouter()
    const canAccessRtoProfile = useIsRestricted('canAccessRtoProfile', false)

    return (
        <Link
            href={
                canAccessRtoProfile
                    ? `/portals/sub-admin/users/rtos/${rto?.id}?tab=overview`
                    : '#'
            }
            className="flex items-center gap-x-2 relative z-10"
            onClick={() => {
                setLink('subadmin-rtos', router)
            }}>

            <div className="shadow-inner-image rounded-full">
                {rto?.user?.name && (
                    <InitialAvatar
                        name={rto?.user?.name}
                        imageUrl={rto?.user?.avatar}
                        socketId={rto?.user?.socketId}
                    />
                )}
            </div>
            <div>
                <p className={'font-semibold'}>{rto?.user?.name}</p>
                {onlyName && (
                    <div className="font-medium text-xs text-gray-500">
                        <p className="flex items-center gap-x-1">
                            <span>
                                <MdEmail />
                            </span>
                            {maskText(rto?.user?.email, 3)}
                        </p>
                        <p className="flex items-center gap-x-1">
                            <span>
                                <MdPhoneIphone />
                            </span>
                            {maskText(rto?.phone, 2)}
                        </p>
                    </div>
                )}
            </div>

        </Link>
    );
}
