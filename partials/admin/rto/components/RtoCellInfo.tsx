import {
    HideRestrictedData,
    InitialAvatar,
    useAuthorizedUserComponent,
} from '@components'
import { UserRoles } from '@constants'
import { useSubadminProfile } from '@hooks'
import { Rto } from '@types'
import { QueryType, maskText, queryToUrl } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'

export const RtoCellInfo = ({ rto, short }: { rto: Rto; short?: boolean }) => {
    const router = useRouter()
    const query = queryToUrl(router.query as QueryType)

    const subadmin = useSubadminProfile()
    const isPermission = useAuthorizedUserComponent({
        roles: [UserRoles.ADMIN, UserRoles.RTO],
        isHod: subadmin?.departmentMember?.isHod,
    })
    return (
        <Link
            href={`/portals/admin/rto/${rto?.id}?tab=sectors`}
            onClick={() => {
                sessionStorage.setItem('rto', `${router.pathname}?${query}`)
            }}
            className="flex items-center gap-x-2 relative z-10">

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
                <p className={`${short ? 'font-medium' : 'font-semibold'}`}>
                    {rto?.user?.name}
                </p>
            </div>

        </Link>
    );
}
