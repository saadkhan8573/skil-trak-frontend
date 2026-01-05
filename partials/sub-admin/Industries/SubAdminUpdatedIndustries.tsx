import {
    ConfigTabs,
    Filter,
    SubAdminIndustryFilter,
    TabConfig,
} from '@components'
import {
    Archive,
    Building2,
    CalendarClock,
    History,
    Moon,
    ShieldAlert,
    UserMinus,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { IndustryCounts, IndustryHeader } from './components'
import {
    ArchivedIndustries,
    BlockedIndustries,
    FilteredIndustries,
    MonthlyCallsIndustries,
    NonPartnerIndustries,
    PendingIndustries,
    RejectedIndustries,
    SnoozedIndustries,
    StateWiseIndustries,
    YourPartnerIndustries,
} from './tabs'
//Layouts
import { SubadminIndustryFilter } from '@types'
import { getUserCredentials, removeEmptyValues } from '@utils'
import { SubAdminApi } from '@redux'
import { PedingCourseApprovalIndustries } from '@partials/common'

const filterKeys = [
    'name',
    'email',
    'phone',
    'address',
    'suburb',
    'state',
    'abn',
    'courseId',
    'isHiring',
    'isPartner',
    'subAdminId',
    'feature',
    'placementReady',
]

export const SubAdminUpdatedIndustries = () => {
    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<SubadminIndustryFilter>(
        {} as SubadminIndustryFilter
    )

    const user = getUserCredentials()

    const count = SubAdminApi.Industry.getAllSubAdminIndustriesCount()

    const baseFilter = useMemo(() => ({
        ...filter,
    }), [filter])

    const isFiltering = Object.keys(removeEmptyValues(filter)).length > 0

    const tabs: TabConfig[] = [
        {
            value: 'state-wise-industries',
            label: 'State Wise Industries',
            icon: Building2,
            // count: count.data?.partnerIndustries,
            component: StateWiseIndustries,
        },
        // {
        //     value: 'partner-industries',
        //     label: 'Partners',
        //     icon: Building2,
        //     count: count.data?.partnerIndustries,
        //     component: YourPartnerIndustries,
        // },
        // {
        //     value: 'non-partner-industries',
        //     label: 'Non-Partners',
        //     icon: Building2,
        //     count: count.data?.nonPartnerIndustries,
        //     component: NonPartnerIndustries,
        // },
        {
            value: 'pending-course-approval',
            label: 'Pending Course Approval',
            icon: Building2,
            count: count.data?.pendingCourseApprovals,
            component: PedingCourseApprovalIndustries,
            hidden: () => {
                const isLocal = process.env.NEXT_PUBLIC_NODE_ENV === 'local'
                const isAllowedUser = [4453, 78, 5714].includes(user?.id)
                return !(isLocal || isAllowedUser)
            },
        },
    ]

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="bg-white rounded-2xl border border-border/50 shadow-premium-sm overflow-hidden">
                <div className="bg-slate-50/50 px-6 py-4 border-b border-border/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            Industry Directory
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {isFiltering
                                ? 'Showing search results for active filters'
                                : 'Browse and manage your industry partnerships'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {filterAction}
                    </div>
                </div>

                <div className="px-4">
                    <Filter<SubadminIndustryFilter>
                        component={SubAdminIndustryFilter}
                        initialValues={filter}
                        setFilterAction={setFilterAction}
                        setFilter={setFilter}
                        filterKeys={filterKeys}
                    />
                </div>

                <div className="px-6 pb-6">
                    {isFiltering ? (
                        <div className="mt-4">
                            <FilteredIndustries baseFilter={baseFilter} />
                        </div>
                    ) : (
                        <div className="mt-4">
                            <ConfigTabs
                                tabs={tabs}
                                props={{ baseFilter }}
                                tabsTriggerClasses="!py-1.5"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
