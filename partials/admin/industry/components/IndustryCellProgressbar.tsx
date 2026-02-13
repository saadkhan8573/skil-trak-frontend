import { InitialAvatar } from '@components'
import {
    IndustryProfileChecklist,
    ProfileCompletionProgress,
} from '@partials/common'
import { CopyData } from '@partials/common/FindWorkplaces/components'
import { QueryType, ellipsisText, queryToUrl } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaHandshake } from 'react-icons/fa'
import { HiBriefcase } from 'react-icons/hi2'
import { MdSnooze } from 'react-icons/md'

export const IndustryCellProgressbar = ({ industry }: any) => {
    const router = useRouter()
    const query = queryToUrl(router.query as QueryType)

    const {
        courseAdded,
        CapacityUpdated,
        ProfileUpdated,
        trading_hours_and_shifts,
        hasIndustryChecks,
        hasBookmarked,
        hasCourseApproved,
        hasEmailVerified,
        hasSupervisor,
        hasWorkplaceType,
    } = industry
    const completedCount = [
        courseAdded,
        CapacityUpdated,
        ProfileUpdated,
        trading_hours_and_shifts,
        hasIndustryChecks,
        hasBookmarked,
        hasCourseApproved,
        hasEmailVerified,
        hasSupervisor,
        hasWorkplaceType,
    ].filter(Boolean).length

    const profileFields = [
        { key: 'courseAdded', label: 'Courses' },
        { key: 'CapacityUpdated', label: 'Capacity' },
        { key: 'ProfileUpdated', label: 'Profile' },
        { key: 'trading_hours_and_shifts', label: 'Trading Hours & Shifts' },
        { key: 'hasIndustryChecks', label: 'Industry Checks' },
        { key: 'hasBookmarked', label: 'Favorite' },
        { key: 'hasCourseApproved', label: 'Course Approved' },
        { key: 'hasEmailVerified', label: 'Email Verified' },
        { key: 'hasSupervisor', label: 'Supervisor' },
        { key: 'hasWorkplaceType', label: 'Workplace Type' },
    ]

    // Find the missing items
    const incompleteItems = profileFields
        .filter((field) => !industry[field.key as keyof typeof industry])
        .map((field) => field.label)

    return (
        <Link href={`/portals/admin/industry/${industry?.id}`} onClick={() => {
            sessionStorage.setItem(
                'industry',
                `${router.pathname}?${query}`
            )
        }}>

            <div className="flex items-center gap-x-2">
                <div className="shadow-inner-image rounded-full relative z-40">
                    {industry?.user?.name && (
                        <InitialAvatar
                            name={industry?.user?.name}
                            imageUrl={industry?.user?.avatar}
                            socketId={industry?.user?.socketId}
                        />
                    )}
                    {industry?.isPartner ? (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center bg-green-500 rounded-full text-white">
                            <FaHandshake size={14} />
                        </div>
                    ) : null}
                </div>
                <div>
                    {industry?.snoozedDate &&
                    industry?.snoozedDate !== null ? (
                        <MdSnooze size={14} className="text-red-500" />
                    ) : null}
                    <div className="flex gap-x-2">
                        <div className="flex flex-col gap-y-1">
                            <div className="group flex items-center gap-x-1 relative z-40">
                                <p
                                    className="font-semibold"
                                    title={industry?.user?.name}
                                >
                                    {ellipsisText(industry?.user?.name, 20)}
                                </p>
                                <CopyData
                                    text={industry?.user?.name}
                                    type={'Industry Name'}
                                />
                            </div>
                            <div className="relative group">
                                <ProfileCompletionProgress
                                    completedItems={completedCount}
                                    totalItems={10}
                                />
                                <div className="absolute !z-50 top-4 left-0 group-hover:block hidden w-full">
                                    <IndustryProfileChecklist
                                        profileFields={profileFields}
                                        industry={industry}
                                    />
                                </div>
                            </div>
                        </div>

                        {industry?.isHiring ? (
                            <div>
                                <HiBriefcase
                                    size={20}
                                    className="text-blue-500"
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                    {/* snoozedDate */}
                </div>
            </div>

        </Link>
    );
}
