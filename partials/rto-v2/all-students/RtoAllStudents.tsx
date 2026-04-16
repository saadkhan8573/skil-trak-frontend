import { useCallback, useEffect, useState } from 'react'
//Layouts
import { StudentsFilterType } from '@types'
import debounce from 'lodash/debounce'

//components
import {
    Card,
    ConfigTabs,
    Filter,
    LoadingAnimation,
    SetDetaultQueryFilteres,
    StudentFilters,
    TabConfig,
    TechnicalError,
    TextInput,
} from '@components'
import {
    ApprovedStudent,
    CompletedStudents,
    FilteredStudents,
    PendingStudent,
    PlacementStarted,
    ScheduleCompleted,
    InProgressStudent,
    RtoNoWorkplaceStudents,
    ExpiredStudent,
    BlockedStudent,
    RejectedStudent,
    QualificationIssuedStudents,
} from '@partials/rto/student'
import { RtoApi, useGetRtoStudentsQuery } from '@queries'
import { checkFilteredDataLength } from '@utils'
import classNames from 'classnames'
import { FileText, Users } from 'lucide-react'
import { useRouter } from 'next/router'
import { ActionRequiredHeader, Title } from '../components'
import { RecentActivities } from './components'

const filterKeys = [
    'name',
    'batch',
    'email',
    'phone',
    'studentId',
    'status',
    'state',
    'industryId',
    'courseId',
    'isReported',
    'currentStatus',
    'sectorId',
]

const RegistrationRequestsComponent = (props: any) => {
    const { count } = props
    const tabs: TabConfig[] = [
        {
            value: 'pending',
            label: 'Pending Accounts',
            icon: Users,
            count: count?.data?.pending,
            component: PendingStudent,
        },
        {
            value: 'rejected',
            label: 'Accounts Rejected',
            icon: Users,
            count: count?.data?.rejected,
            component: RejectedStudent,
        },
    ]
    return (
        <ConfigTabs
            tabs={tabs}
            props={props}
            defaultValue="pending"
            tabsClasses="bg-primary/20 border-none shadow-none mt-2"
        />
    )
}

const ActiveStudentsComponent = (props: any) => {
    const { count } = props
    const tabs: TabConfig[] = [
        {
            value: 'active',
            label: 'All Active Students',
            icon: Users,
            count: count?.data?.active,
            component: ApprovedStudent,
        },
        {
            value: 'no-workplace',
            label: 'No Workplace Request',
            icon: Users,
            count: count?.data?.noWorkplace,
            component: RtoNoWorkplaceStudents,
        },
        {
            value: 'in-progress',
            label: 'In Progress Students',
            icon: Users,
            count: count?.data?.inProgress,
            component: InProgressStudent,
        },
        {
            value: 'placement-started',
            label: 'Placement Started',
            icon: Users,
            count: count?.data?.placementStarted,
            component: PlacementStarted,
        },
        {
            value: 'schedule-completed',
            label: 'Schedule Completed',
            icon: Users,
            count: count?.data?.scheduleCompleted,
            component: ScheduleCompleted,
        },
    ]
    return (
        <ConfigTabs
            tabs={tabs}
            props={props}
            defaultValue="active"
            // tabsClasses="bg-slate-50 border-none shadow-none mt-2"
        />
    )
}

const ClosedStudentsComponent = (props: any) => {
    const { count } = props
    const tabs: TabConfig[] = [
        {
            value: 'completed',
            label: 'Completed Students',
            icon: Users,
            count: count?.data?.completed,
            component: CompletedStudents,
        },
        {
            value: 'qualification-issued',
            label: 'Qualification Issued',
            icon: Users,
            count: count?.data?.qualificationissued,
            component: QualificationIssuedStudents,
        },
        {
            value: 'expired',
            label: 'Expired Students',
            icon: Users,
            count: count?.data?.expired,
            component: ExpiredStudent,
        },
        {
            value: 'blocked',
            label: 'Blocked Students',
            icon: Users,
            count: count?.data?.blocked,
            component: BlockedStudent,
        },
    ]
    return (
        <ConfigTabs
            tabs={tabs}
            props={props}
            defaultValue="completed"
            tabsClasses="bg-red-100 border-none shadow-none mt-2"
        />
    )
}

export const RtoAllStudents = () => {
    const router = useRouter()

    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<StudentsFilterType>(
        {} as StudentsFilterType
    )

    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [studentId, setStudentId] = useState<any | null>(null)
    const [studentName, setStudentName] = useState<any | null>(null)
    const [studentNameValue, setStudentNameValue] = useState<string>('')

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const count = RtoApi.Students.useCount()

    const filteredStudents = useGetRtoStudentsQuery(
        {
            search: `${JSON.stringify({
                ...filter,
                ...studentId,
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
                ...(studentId?.studentId ? studentId : {}),
                ...(studentName?.name ? studentName : {}),
            }).length,
        }
    )

    const mainTabs: TabConfig[] = [
        {
            value: 'registration-requests',
            label: 'Registration Requests',
            icon: Users,
            count: count?.data?.pending,
            component: RegistrationRequestsComponent,
        },
        {
            value: 'active-students',
            label: 'All Active Students',
            icon: Users,
            count: count?.data?.active,
            component: ActiveStudentsComponent,
        },
        {
            value: 'closed-students',
            label: 'Closed Students',
            icon: Users,
            count:
                (count?.data?.completed || 0) +
                (count?.data?.expired || 0) +
                (count?.data?.blocked || 0) +
                (count?.data?.qualificationissued || 0),
            component: ClosedStudentsComponent,
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
        ...(studentId?.studentId ? studentId : {}),
        ...(studentName?.name ? studentName : {}),
    })

    return (
        <>
            <div className="space-y-4">
                <SetDetaultQueryFilteres
                    filterKeys={filterKeys}
                    setFilter={setFilter}
                />
                <ActionRequiredHeader
                    icon={Users}
                    title="Students Overview"
                    description="Manage all your students and placements in one place"
                    urgentCount={count?.data?.active || 0}
                    UrgentIcon={Users}
                    urgentLabel="All Active Students"
                    warningMessage="<strong>Quick Tip:</strong> Use filters to find specific students, or click on any status tab to view students by their current status. Select multiple students for bulk actions."
                    gradientFrom="primaryNew"
                    gradientTo="primaryNew"
                    iconGradient="from-primaryNew to-primaryNew"
                />

                {/*  */}
                <RecentActivities />

                <Card
                    noPadding
                    className="border border-border/50 shadow-premium-lg"
                >
                    <div className="border-b p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <Title
                                Icon={FileText}
                                title="Student Management"
                                description="View, filter, and manage all student
                                        records"
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

                    <div className={classNames('space-y-4 px-4 py-2')}>
                        {/* Advanced Filters */}
                        <Filter<StudentsFilterType>
                            component={StudentFilters}
                            initialValues={filter}
                            setFilterAction={setFilterAction}
                            setFilter={setFilter}
                            filterKeys={filterKeys}
                        />
                    </div>

                    {/*  */}
                    <div>
                        {filteredDataLength && filteredStudents.isError && (
                            <TechnicalError />
                        )}
                        {filteredDataLength ? (
                            filteredStudents.isLoading ? (
                                <LoadingAnimation />
                            ) : (
                                filteredStudents.isSuccess && (
                                    <FilteredStudents
                                        setPage={setPage}
                                        itemPerPage={itemPerPage}
                                        student={filteredStudents}
                                        setItemPerPage={setItemPerPage}
                                    />
                                )
                            )
                        ) : null}

                        {!filteredDataLength && (
                            <ConfigTabs
                                defaultValue={mainTabs[1].value}
                                tabs={mainTabs}
                                props={{ filter, count }}
                            />
                        )}
                    </div>
                </Card>
            </div>
        </>
    )
}
