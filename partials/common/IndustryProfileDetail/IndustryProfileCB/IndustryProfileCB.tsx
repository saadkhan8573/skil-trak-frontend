import {
    AuthorizedUserComponent,
    Badge,
    HideRestrictedData,
    Typography,
} from '@components'
import { UserRoles } from '@constants'
import Modal from '@modals/Modal'
import {
    VerifiedEmailHistory,
    VerifyUserEmail,
} from '@partials/common/components'
import { IndustryRequestsActions } from '@partials/sub-admin/ManagerApprovalList/enum'
import { CommonApi } from '@queries'
import { Industry } from '@types'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { IndustryInsuranceDoc, IndustryLocations } from '../components'
import {
    DisplayIndustryRating,
    IndustryRatingList,
} from '../components/IndustryReviews'
import {
    AddRplModal,
    PlacementEligibilityCriteriaModal,
    PremiumFeaturesModal,
} from '../modal'
import {
    IndustryContactPerson,
    IndustryDetail,
    IndustryEsign,
    IndustryJobHiring,
    IndustryProfileAvatar,
    IndustryServiceTypeOffered,
    IndustryStatus,
    IndustryWpType,
    MakeIndustryPartner,
    PremiumIndustrySwitch,
    ProfileLinks,
    SectorBaseCapacityModal,
    SnoozeIndustrySwitch,
} from './components'

export const IndustryProfileCB = ({
    isHod,
    industry,
}: {
    isHod?: boolean
    industry: Industry
}) => {
    const [modal, setModal] = useState<ReactNode | null>(null)
    const [itemPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const router = useRouter()
    const id = Number(router.query.id)

    const isEmailVerified = industry?.user?.isEmailVerified
    const { data, isLoading, isFetching, isError } =
        CommonApi.Feedback.useIndustryFeedbackListFromStudent(
            {
                params: {
                    userId: industry?.user?.id,
                    skip: itemPerPage * page - itemPerPage,
                    limit: itemPerPage,
                },
            },
            { skip: !industry?.user?.id }
        )
    const overAllRating =
        CommonApi.Feedback.useOverAllIndustryRatingsFromStudent(
            { id },
            { skip: !id }
        )

    const onCancelModal = () => {
        setModal(null)
    }
    const onClickIndPreferences = () => {
        setModal(
            <PlacementEligibilityCriteriaModal
                industry={industry}
                onCancel={onCancelModal}
            />
        )
    }
    const onClickPremiumFeatures = () => {
        setModal(
            <>
                <PremiumFeaturesModal
                    // industry={industry}
                    indId={industry?.id}
                    userId={industry?.user?.id}
                    onCancel={onCancelModal}
                />
            </>
        )
    }
    const onClickViewAllReviews = () => {
        setModal(
            <IndustryRatingList
                industry={industry}
                onClose={onCancelModal}
                setPage={setPage}
                isFetching={isFetching}
                isLoading={isLoading}
                data={data}
                isError={isError}
            />
        )
    }

    const onAddRpl = () =>
        setModal(<AddRplModal industry={industry} onCancel={onCancelModal} />)

    return (
        <>
            {modal}
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <IndustryProfileAvatar
                            avatar={industry?.user?.avatar as string}
                        />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <AuthorizedUserComponent
                            roles={[UserRoles.SUBADMIN, UserRoles.ADMIN]}
                        >
                            <ProfileLinks isHod={isHod} industry={industry} />
                        </AuthorizedUserComponent>
                        {industry?.createdBy ? (
                            <div className="flex flex-col gap-y-0">
                                <Typography
                                    variant="xxs"
                                    color="text-[#6B7280]"
                                >
                                    Created By
                                </Typography>
                                <Typography medium capitalize variant="label">
                                    {industry?.createdBy?.name}
                                </Typography>
                            </div>
                        ) : null}
                        {industry?.favoriteBy ? (
                            <div className="flex flex-col gap-y-0">
                                <Typography
                                    variant="xxs"
                                    color="text-[#6B7280]"
                                >
                                    Favourite By
                                </Typography>
                                <Typography medium capitalize variant="label">
                                    {industry?.favoriteBy?.user?.name}
                                </Typography>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/*  */}
                <div className="w-full flex justify-between items-center gap-x-3">
                    <div className="mt-2 w-full">
                        <div className="flex items-center gap-x-2">
                            <Typography semibold>
                                <span className="text-[15px]">
                                    {industry?.user?.name}
                                </span>
                            </Typography>

                            <AuthorizedUserComponent
                                roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                            >
                                <VerifyUserEmail
                                    isEmailVerified={isEmailVerified}
                                    userId={industry?.user?.id}
                                    userName={industry?.user?.name}
                                />
                                <VerifiedEmailHistory
                                    userId={industry?.user?.id}
                                    isEmailVerified={isEmailVerified}
                                />
                            </AuthorizedUserComponent>
                        </div>

                        <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                            <HideRestrictedData type={UserRoles.INDUSTRY}>
                                <Typography variant="xs" color="text-[#6B7280]">
                                    {industry?.isSnoozed
                                        ? '---'
                                        : industry?.user?.email}
                                </Typography>
                            </HideRestrictedData>
                        </AuthorizedUserComponent>

                        {/* Reviews from students */}
                        <AuthorizedUserComponent
                            roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                            isAssociatedWithRto={false}
                        >
                            {data?.data && data?.data?.length > 0 && (
                                <div className="flex items-center gap-x-3 border-y my-2 py-4">
                                    <div className="">
                                        <DisplayIndustryRating
                                            rating={
                                                overAllRating?.data
                                                    ?.averageRating ?? 0
                                            }
                                        />
                                    </div>
                                    <Badge
                                        text="View All Reviews"
                                        onClick={onClickViewAllReviews}
                                        variant="info"
                                    />
                                </div>
                            )}
                            <div className="flex justify-between items-center w-full">
                                <button onClick={onClickIndPreferences}>
                                    <Typography variant="xs" color="text-link">
                                        Placement Preferences
                                    </Typography>
                                </button>
                                <IndustryEsign
                                    industryId={industry?.id}
                                    industryUserId={industry?.user?.id}
                                />
                            </div>
                        </AuthorizedUserComponent>
                    </div>
                </div>

                {/*  */}
                <div className="flex items-center justify-between border-b border-secondary-dark">
                    <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                        <IndustryStatus industry={industry} />
                    </AuthorizedUserComponent>
                    <div className="w-full">
                        <AuthorizedUserComponent
                            roles={[UserRoles.SUBADMIN, UserRoles.ADMIN]}
                        >
                            {industry?.isPartner && (
                                <div>
                                    <Modal>
                                        <Modal.Open opens="viewCapacity">
                                            <div className="cursor-pointer text-[11px] py-2 px-1 text-info hover:bg-gray-200">
                                                Capacity
                                            </div>
                                        </Modal.Open>
                                        <Modal.Window name="viewCapacity">
                                            <SectorBaseCapacityModal
                                                id={id}
                                                prevIndCapacity={
                                                    industry?.studentCapacity
                                                }
                                                industry={industry}
                                            />
                                        </Modal.Window>
                                    </Modal>
                                </div>
                            )}
                        </AuthorizedUserComponent>

                        {/*  */}
                        <AuthorizedUserComponent excludeRoles={[UserRoles.RTO]}>
                            <div className="flex justify-end flex-col ml-auto">
                                <div className="ml-auto">
                                    <Badge text="Add Rpl" onClick={onAddRpl} />
                                </div>
                                {(process.env.NEXT_PUBLIC_NODE_ENV ===
                                    'local' ||
                                    industry?.courses
                                        ?.map((course) => course?.sector?.id)
                                        ?.includes(1)) && (
                                    <IndustryServiceTypeOffered
                                        industryId={industry?.id}
                                        serviceOffered={
                                            industry?.serviceOffered
                                        }
                                    />
                                )}
                            </div>
                        </AuthorizedUserComponent>
                    </div>
                </div>

                <div>
                    <IndustryWpType industryUserId={industry?.user?.id} />
                </div>

                <AuthorizedUserComponent
                    roles={[UserRoles.SUBADMIN, UserRoles.ADMIN]}
                >
                    <PremiumIndustrySwitch
                        isPremium={industry?.isPremium}
                        industryId={industry?.id}
                        industryUserId={industry?.user?.id}
                    />
                </AuthorizedUserComponent>

                <AuthorizedUserComponent
                    roles={[UserRoles.SUBADMIN, UserRoles.ADMIN]}
                    isAssociatedWithRto={false}
                >
                    <SnoozeIndustrySwitch
                        industry={industry}
                        partnerRemovalRequests={industry?.partnerRemovalRequests?.find(
                            (r) => r?.action === IndustryRequestsActions.Snoozed
                        )}
                    />

                    <MakeIndustryPartner
                        industryId={industry?.id}
                        isPartner={industry?.isPartner}
                        PartneredBy={industry?.PartneredBy}
                        partnerRemovalRequests={industry?.partnerRemovalRequests?.find(
                            (r) => r?.action === IndustryRequestsActions.Partner
                        )}
                    />
                    {/*  */}
                    <IndustryJobHiring
                        industryUserId={industry?.user?.id}
                        isHiringIndustry={industry?.isHiring}
                    />
                </AuthorizedUserComponent>

                {/*  */}

                <IndustryDetail industry={industry} />
                <IndustryContactPerson industry={industry} />

                <IndustryInsuranceDoc industry={industry} />
                {/* Add Supervisor  */}
                {/* <IndustrySupervisor industry={industry} /> */}
                <AuthorizedUserComponent
                    roles={[
                        UserRoles.SUBADMIN,
                        UserRoles.ADMIN,
                        UserRoles.INDUSTRY,
                    ]}
                    isAssociatedWithRto={false}
                >
                    <IndustryLocations industry={industry} />
                </AuthorizedUserComponent>

                {/*  */}
                {/* <IndustrySectors courses={industry?.courses} /> */}
            </div>
        </>
    )
}
