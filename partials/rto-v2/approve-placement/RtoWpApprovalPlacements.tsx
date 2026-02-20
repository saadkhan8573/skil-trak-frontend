import { Card, ConfigTabs, Filter, TabConfig, TextInput } from '@components'
import { PlacementsFilters } from '@components/Filters'
import { RtoApi } from '@queries'
import { RTOWorkplaceFormFilter } from '@types'
import { checkFilteredDataLength } from '@utils'
import debounce from 'lodash/debounce'
import { FileText, School } from 'lucide-react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { ActionRequiredHeader, Title } from '../components'
import { ApprovedPlacement } from './ApprovedPlacement'
import { FilteredPlacements } from './FilteredPlacements'
import { PendingPlacement } from './PendingPlacement'
import { RejectedPlacement } from './RejectedPlacement'

export const RtoWpApprovalPlacements = () => {
    const router = useRouter()
    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<RTOWorkplaceFormFilter>(
        {} as RTOWorkplaceFormFilter
    )

    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [studentName, setStudentName] = useState<any | null>(null)
    const [studentNameValue, setStudentNameValue] = useState<string>('')

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const count = RtoApi.Workplace.wpApprovalRequestCount()

    const filteredPlacements = RtoApi.Workplace.wpApprovalRequestByStatus(
        {
            search: `${JSON.stringify({
                ...filter,
                ...studentName,
            })
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            skip: !Object.keys({
                ...filter,
                ...(studentName?.name ? studentName : {}),
            }).length,
        }
    )

    const tabs: TabConfig[] = [
        {
            value: 'pending',
            label: 'Pending',
            count: count?.data?.pending || 0,
            component: PendingPlacement,
        },
        {
            value: 'approved',
            label: 'Approved',
            count: count?.data?.approved || 0,
            component: ApprovedPlacement,
        },
        {
            value: 'rejected',
            label: 'Rejected',
            count: count?.data?.rejected || 0,
            component: RejectedPlacement,
        },
    ]

    const delayedNameSearch = useCallback(
        debounce((value) => {
            setStudentName({ name: value })
        }, 700),
        []
    )

    const filteredDataLength = checkFilteredDataLength({
        ...filter,
        ...(studentName?.name ? studentName : {}),
    })

    return (
        <div className="space-y-4">
            <ActionRequiredHeader
                icon={School}
                title="Placement Approvals"
                description="Review student-approved placements and verify workplace eligibility"
                urgentCount={count?.data?.pending || 0}
                urgentLabel="Waiting For RTO Approval"
                warningMessage="<strong>Your Task:</strong> Students have already approved these placements. Review workplace eligibility and course requirements before sending to industry for interview arrangement."
                gradientFrom="primaryNew"
                gradientTo="primaryNew"
                iconGradient="from-primaryNew to-primaryNew"
            />

            <Card
                noPadding
                className="border border-border/50 shadow-premium-lg"
            >
                <div className="border-b p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <Title
                            Icon={FileText}
                            title="Placement Management"
                            description="View, filter, and manage all placement requests"
                        />

                        <div className="flex items-center gap-2">
                            <div className="w-60">
                                <TextInput
                                    name={'name'}
                                    placeholder={'Search by Student Name'}
                                    value={studentNameValue}
                                    onChange={(e: any) => {
                                        setStudentNameValue(e.target.value)
                                        delayedNameSearch(e.target.value)
                                    }}
                                    showError={false}
                                />
                            </div>
                            <div className="shrink-0">{filterAction}</div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-2">
                    <Filter<RTOWorkplaceFormFilter>
                        component={PlacementsFilters}
                        initialValues={filter}
                        setFilterAction={setFilterAction}
                        setFilter={setFilter}
                        filterKeys={['name', 'courseId']}
                    />
                </div>

                <div>
                    {filteredDataLength ? (
                        <FilteredPlacements
                            placements={filteredPlacements}
                            setPage={setPage}
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                        />
                    ) : (
                        <ConfigTabs tabs={tabs} defaultValue="pending" />
                    )}
                </div>
            </Card>
        </div>
    )
}
