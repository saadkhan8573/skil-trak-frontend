import { ReactElement, useCallback, useEffect, useState } from 'react'
//Layouts
import { RtoLayout } from '@layouts'
import { NextPageWithLayout, StudentsFilterType, UserStatus } from '@types'
import debounce from 'lodash/debounce'

//components
import {
    Button,
    Filter,
    LoadingAnimation,
    PageTitle,
    SetDetaultQueryFilteres,
    StudentFilters,
    TabNavigation,
    TabProps,
    TechnicalError,
    TextInput,
} from '@components'
import { useContextBar, useJoyRide } from '@hooks'
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
    SkiltrakFlaggedStudents,
} from '@partials/rto/student'
import { RtoApi, useGetRtoStudentsQuery } from '@queries'
import { checkFilteredDataLength } from '@utils'
import { useRouter } from 'next/router'
import { FaChevronDown, FaFileImport, FaUserGraduate } from 'react-icons/fa'

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
]

type Props = {}

interface CountType {
    pending: number
    approved: number
    rejected: number
    blocked: number
    archived: number
}

const RtoStudents: NextPageWithLayout = (props: Props) => {
    const router = useRouter()
    const contextBar = useContextBar()

    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<StudentsFilterType>(
        {} as StudentsFilterType
    )
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [showDropDown, setShowDropDown] = useState(false)
    const [studentId, setStudentId] = useState<any | null>(null)
    const [studentName, setStudentName] = useState<any | null>(null)
    const [studentIdValue, setStudentIdValue] = useState<string>('')
    const [studentNameValue, setStudentNameValue] = useState<string>('')
    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const count = RtoApi.Students.useCount()
    const { data: rto, isLoading } = RtoApi.Rto.useProfile()
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

    // ADD STUDENT JOY RIDE - START
    const joyride = useJoyRide()
    useEffect(() => {
        if (joyride.state.tourActive) {
            setTimeout(() => {
                joyride.setState({ ...joyride.state, run: true, stepIndex: 1 })
            }, 1200)
        }
    }, [])
    // ADD STUDENT JOY RIDE - END

    const tabs: TabProps[] = [
        {
            label: 'Pending Students',
            href: { pathname: 'students', query: { tab: UserStatus.Pending } },
            badge: {
                text: count?.data?.pending,
                loading: count.isLoading,
            },
            element: <PendingStudent />,
        },
        {
            label: 'All Active Students',
            badge: {
                text: count?.data?.active,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: 'active' } },
            element: <ApprovedStudent />,
        },
        {
            label: 'In Progress Students',
            badge: {
                text: count?.data?.inProgress,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: 'in-progress' } },
            element: <InProgressStudent />,
        },
        {
            label: 'No Workplace Request',
            badge: {
                text: count?.data?.noWorkplace,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: 'no-workplace' } },
            element: <RtoNoWorkplaceStudents />,
        },
        {
            label: 'Skiltrak Flagged',
            badge: {
                text: count?.data?.skiltrakFlagged,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: 'skiltrak-flagged' } },
            element: <SkiltrakFlaggedStudents />,
        },
        {
            label: 'Placement Started',
            badge: {
                text: count?.data?.placementStarted,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: 'placement-started' } },
            element: <PlacementStarted />,
        },
        {
            label: 'Schedule Completed',
            badge: {
                text: count?.data?.scheduleCompleted,
                loading: count.isLoading,
            },
            href: {
                pathname: 'students',
                query: { tab: 'schedule-completed' },
            },
            element: <ScheduleCompleted />,
        },
        {
            label: 'Completed Students',
            badge: {
                text: count?.data?.completed,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: 'completed' } },
            element: <CompletedStudents />,
        },
        {
            label: 'Expired Students',
            badge: {
                text: count?.data?.expired,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: 'expired' } },
            element: <ExpiredStudent />,
        },

        {
            label: 'Blocked Students',
            badge: {
                text: count?.data?.blocked,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: UserStatus.Blocked } },
            element: <BlockedStudent />,
        },
        {
            label: 'Accounts Rejected',
            badge: {
                text: count?.data?.rejected,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: UserStatus.Rejected } },
            element: <RejectedStudent />,
        },
    ]

    const delayedSearch = useCallback(
        debounce((value) => {
            setStudentId({ studentId: value })
        }, 700),
        []
    )

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
            <div>
                <SetDetaultQueryFilteres
                    filterKeys={filterKeys}
                    setFilter={setFilter}
                />
                <div className="flex items-center justify-between">
                    <PageTitle title="Students" backTitle="Users" />

                    <div className="flex items-center gap-x-3">
                        <div
                            className="relative"
                            onMouseEnter={() => setShowDropDown(true)}
                            onMouseLeave={() => setShowDropDown(false)}
                        >
                            <Button>
                                <span
                                    id="add-students"
                                    className="flex items-center gap-x-2"
                                >
                                    <span>Add Students</span>
                                    <FaChevronDown />
                                </span>
                            </Button>

                            {showDropDown ? (
                                <ul className="bg-white shadow-xl rounded-xl overflow-hidden absolute z-10">
                                    <li>
                                        <button
                                            onClick={() => {
                                                router.push(
                                                    'students/import-students'
                                                )
                                            }}
                                            className="w-full flex items-center gap-x-2 text-sm px-2 py-2 hover:bg-gray-200"
                                        >
                                            <span className="text-gray-500">
                                                <FaFileImport />
                                            </span>
                                            <span className="whitespace-nowrap">
                                                {' '}
                                                Import Students
                                            </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                router.push(
                                                    'students/add-individual-student'
                                                )
                                            }}
                                            className="w-full flex items-center gap-x-2 text-sm px-2 py-2 hover:bg-gray-200"
                                        >
                                            <span className="text-gray-500">
                                                <FaUserGraduate />
                                            </span>
                                            <span> Add Individual</span>
                                        </button>
                                    </li>
                                </ul>
                            ) : null}
                        </div>
                        {/* <Button
                            onClick={() => {
                                router.push('students/import-students')
                            }}
                        >
                            Import Students
                        </Button>
                        <Button
                            text="Add Individual Student"
                            onClick={() => {
                                router.push('students/add-individual-student')
                            }}
                        /> */}
                    </div>
                </div>

                <div>
                    <div className="px-4">
                        <div className="flex justify-end gap-x-2">
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
                            <div>
                                <TextInput
                                    name={'studentId'}
                                    placeholder={'Search by Student Id'}
                                    value={studentIdValue}
                                    onChange={(e: any) => {
                                        setStudentIdValue(e.target.value)
                                        delayedSearch(e.target.value)
                                    }}
                                    showError={false}
                                />
                            </div>
                            <div className="shrink-0">{filterAction}</div>
                        </div>
                        <Filter<StudentsFilterType>
                            component={StudentFilters}
                            initialValues={filter}
                            setFilterAction={setFilterAction}
                            setFilter={setFilter}
                            filterKeys={filterKeys}
                        />
                    </div>

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
                        <TabNavigation tabs={tabs}>
                            {({ header, element }: any) => {
                                return (
                                    <div>
                                        <div>{header}</div>
                                        <div className="p-4">{element}</div>
                                    </div>
                                )
                            }}
                        </TabNavigation>
                    )}
                </div>
            </div>
        </>
    )
}
RtoStudents.getLayout = (page: ReactElement) => {
    return <RtoLayout>{page}</RtoLayout>
}

export default RtoStudents
