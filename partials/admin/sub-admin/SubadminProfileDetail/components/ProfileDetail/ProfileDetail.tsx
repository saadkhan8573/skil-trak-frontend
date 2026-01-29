import { AuthorizedUserComponent, Card, StarRating, Typography } from '@components'
import { SubAdmin } from '@types'
import { BsPatchCheckFill } from 'react-icons/bs'
import { ProfileCard } from './ProfileCard'
import { ProfileActions } from './ProfileActions'
import { UserRoles } from '@constants'
import { ProfileLinks } from './ProfileLinks'
import { CoordinatorReviewsListModal } from '@partials/admin/sub-admin/modals'
import Modal from '@modals/Modal'
import { AdminApi } from '@queries'
import { MapStarRating } from '@partials/common'

export const ProfileDetail = ({ subadmin }: { subadmin: SubAdmin }) => {
    const { data: averageRating } =
        AdminApi.SubAdmins.useCoordinatorOverallRating(subadmin?.user?.id, {
            skip: !subadmin?.user?.id,
        })
    return (
        <Card shadowType="profile" fullHeight>
            <div className="relative">
                <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                    <div className="absolute right-0">
                        <ProfileLinks subadmin={subadmin} />
                    </div>
                </AuthorizedUserComponent>

                {/*  */}
                <div className="w-full flex flex-col items-center gap-x-2 px-4 py-2">
                    <img
                        className="w-24 h-24  p-1"
                        src={subadmin?.user.avatar || '/images/avatar.png'}
                        alt="RTO Logo"
                    />
                    <div>
                        <Typography variant={'title'} center>
                            {subadmin?.user?.name}
                        </Typography>
                        <div className="flex items-center gap-x-2">
                            <Typography
                                center
                                variant={'label'}
                                color={'text-gray-500'}
                            >
                                {subadmin?.user?.email}
                            </Typography>
                            <BsPatchCheckFill className="text-link" />
                        </div>
                        {/* useCoordinatorOverallRating */}
                        <div className="flex flex-col justify-center items-center gap-x-2 mt-2">
                            <div className="flex items-center gap-x-2">
                                {/* <MapStarRating
                                    rating={averageRating?.averageRating}
                                /> */}
                                <StarRating
                                    value={averageRating?.averageRating}
                                    size={17}
                                    showValue
                                />
                                <span className="text-sm text-gray-500">
                                    ({averageRating?.totalReviews ?? 0} reviews)
                                </span>
                            </div>
                            <Modal>
                                <Modal.Open opens={'coordinator-reviews-list'}>
                                    <button className="text-link text-sm">
                                        Reviews
                                    </button>
                                </Modal.Open>
                                <Modal.Window name="coordinator-reviews-list">
                                    <CoordinatorReviewsListModal
                                        user={subadmin?.user}
                                    />
                                </Modal.Window>
                            </Modal>
                        </div>
                    </div>
                </div>

                {/*  */}
                <div className="flex flex-col gap-y-2 mt-2">
                    <ProfileCard
                        title="Sub-Admin Id"
                        detail={subadmin?.coordinatorId}
                    />
                    <ProfileCard title="Phone" detail={subadmin?.phone} />
                    <ProfileCard
                        title="Address"
                        detail={subadmin?.addressLine1}
                    />
                </div>

                {/*  */}
                <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                    <div className="mt-3">
                        <ProfileActions subadmin={subadmin} />
                    </div>
                </AuthorizedUserComponent>
            </div>
        </Card>
    )
}
