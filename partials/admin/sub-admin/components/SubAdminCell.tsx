import { InitialAvatar, StarRating, Tooltip, TooltipPosition } from '@components'
import { MapStarRating } from '@partials/common'
import { AdminApi } from '@queries'
import { SubAdmin } from '@types'
import { QueryType, queryToUrl } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'
import { RiAdminLine } from 'react-icons/ri'
import { TbLogin } from 'react-icons/tb'

export const SubAdminCell = ({ subAdmin }: { subAdmin: SubAdmin }) => {
    const router = useRouter()
    const query = queryToUrl(router.query as QueryType)
    const { data: averageRating } =
        AdminApi.SubAdmins.useCoordinatorOverallRating(subAdmin?.user?.id, {
            skip: !subAdmin?.user?.id,
        })

    return (
        <Link legacyBehavior href={`/portals/admin/sub-admin/${subAdmin?.id}`}>
            <a
                onClick={() => {
                    sessionStorage.setItem(
                        'subadmin',
                        `${router.pathname}?${query}`
                    )
                }}
                className="flex items-center gap-x-2"
            >
                <div className="shadow-inner-image rounded-full relative">
                    {subAdmin?.user?.name && (
                        <InitialAvatar
                            name={subAdmin?.user.name}
                            imageUrl={subAdmin?.user?.avatar}
                            socketId={subAdmin?.user?.socketId}
                        />
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <p className="font-semibold">{subAdmin?.user?.name}</p>
                        {subAdmin?.canAdmin && (
                            <RiAdminLine className="text-red-500" size={18} />
                        )}
                        {!subAdmin?.user?.after_hours_access && (
                            <div className="relative group">
                                <TbLogin className="text-error" size={18} />
                                <Tooltip position={TooltipPosition.left}>
                                    Login disabled after business hours
                                </Tooltip>
                            </div>
                        )}
                    </div>

                    <div className="font-medium text-xs text-gray-500">
                        {/* <p className="flex items-center gap-x-1">
                            <span>
                                <MdEmail />
                            </span>
                            {subAdmin?.user?.email}
                        </p> */}
                        {Number(averageRating?.totalReviews) > 0 &&
                            Number(averageRating?.averageRating) > 0 && (
                                <StarRating
                                    value={averageRating?.averageRating}
                                    size={17}
                                    showValue
                                />
                            )}

                        <p className="flex items-center gap-x-1">
                            <span>
                                <MdPhoneIphone />
                            </span>
                            {subAdmin?.phone}
                        </p>
                    </div>
                </div>
            </a>
        </Link>
    )
}
