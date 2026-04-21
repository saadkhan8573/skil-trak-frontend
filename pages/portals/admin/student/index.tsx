import debounce from 'lodash/debounce'
import { ReactElement, useCallback, useEffect, useState } from 'react'

import {
    Filter,
    LoadingAnimation,
    SetDetaultQueryFilteres,
    StudentFilters,
    TabNavigation,
    TabProps,
    TechnicalError,
    TextInput,
} from '@components'
import { useContextBar, useNavbar } from '@hooks'
import { AdminLayout } from '@layouts'
import {
    AllStudentsReport,
    ApprovedStudent,
    ArchivedStudent,
    BlockedStudent,
    CompletedStudents,
    FilteredStudents,
    FlaggedStudentsList,
    NoWorkplaceStudents,
    PendingStudent,
    PlacementStartedStudents,
    RejectedStudent,
    SnoozedStudents,
    StudentScheduleEndedList,
    UnAssignedStudent,
} from '@partials/admin/student'
import { AdminApi } from '@queries'
import { NextPageWithLayout, StudentsFilterType, UserStatus } from '@types'
import { checkFilteredDataLength } from '@utils'
import { useRouter } from 'next/router'

const filterKeys = [
    'nowp',
    'name',
    'email',
    'batch',
    'phone',
    'rtoId',
    'state',
    'depId',
    'suburb',
    'status',
    'sectorId',
    'courseId',
    'completed',
    'studentId',
    'isReported',
    'industryId',
    'subadminId',
    'currentStatus',
    'studentMaskedId'
]

const StudentList: NextPageWithLayout = () => {
    const navBar = useNavbar()
    const contextBar = useContextBar()

    const router = useRouter()

    const [filterAction, setFilterAction] = useState(null)
    const [studentId, setStudentId] = useState<any | null>(null)
    const [studentIdValue, setStudentIdValue] = useState<string>('')
    const [studentName, setStudentName] = useState<any | null>(null)
    const [studentNameValue, setStudentNameValue] = useState<string>('')
    const [filter, setFilter] = useState<StudentsFilterType>(
        {} as StudentsFilterType
    )

    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)

    const { isLoading, data } = AdminApi.Students.useCountQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })

    const filteredStudents = AdminApi.Students.useListQuery(
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
            refetchOnMountOrArgChange: 30,
        }
    )

    const [statusSuccessResult, setStatusSuccessResult] =
        useState<boolean>(false)

    useEffect(() => {
        navBar.setTitle('Students')
        contextBar.hide()

        return () => {
            navBar.setTitle('')
        }
    }, [])

    useEffect(() => {
        const getScrollId = sessionStorage.getItem('scrollId')
        if (getScrollId) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, scrollId: getScrollId },
            })
        }
    }, [])

    const tabs: TabProps[] = [
        {
            label: 'Pending',
            href: {
                pathname: 'student',
                query: { tab: UserStatus.Pending, page: 1, pageSize: 50 },
            },
            badge: {
                text: data?.pending,
                loading: isLoading,
            },
            element: <PendingStudent />,
        },
        {
            label: 'Active',
            href: {
                pathname: 'student',
                query: { tab: 'active', page: 1, pageSize: 50 },
            },
            badge: {
                text: data?.approved,
                loading: isLoading,
            },
            element: <ApprovedStudent />,
        },
        {
            label: 'No Workplace Students',
            href: {
                pathname: 'student',
                query: { tab: 'no-workplace-students', page: 1, pageSize: 50 },
            },
            element: <NoWorkplaceStudents />,
        },
        // VerifiedEmailStudent
        // {
        //     label: 'Verified Email',
        //     href: {
        //         pathname: 'student',
        //         query: { tab: 'verified-email', page: 1, pageSize: 50 },
        //     },
        //     badge: {
        //         text: data?.approved,
        //         loading: isLoading,
        //     },
        //     element: <VerifiedEmailStudent />,
        // },
        {
            label: 'Flagged Students',
            href: {
                pathname: 'student',
                query: { tab: 'flagged', page: 1, pageSize: 50 },
            },
            badge: {
                text: data?.reported,
                loading: isLoading,
            },
            element: <FlaggedStudentsList />,
        },
        {
            label: 'Rejected',
            href: {
                pathname: 'student',
                query: { tab: UserStatus.Rejected, page: 1, pageSize: 50 },
            },
            badge: {
                text: data?.rejected,
                loading: isLoading,
            },
            element: <RejectedStudent />,
        },
        {
            label: 'Blocked',
            href: {
                pathname: 'student',
                query: { tab: UserStatus.Blocked, page: 1, pageSize: 50 },
            },
            badge: {
                text: data?.blocked,
                loading: isLoading,
            },
            element: <BlockedStudent />,
        },
        {
            label: 'Archived',
            href: {
                pathname: 'student',
                query: { tab: UserStatus.Archived, page: 1, pageSize: 50 },
            },
            badge: {
                text: data?.archived,
                loading: isLoading,
            },
            element: <ArchivedStudent />,
        },
        {
            label: 'Student Schedule Ended',
            href: {
                pathname: 'student',
                query: { tab: 'student-schedule-ended', page: 1, pageSize: 50 },
            },
            badge: {
                text: data?.schedule,
                loading: isLoading,
            },
            element: <StudentScheduleEndedList />,
        },
        {
            label: 'Placement Started Students',
            href: {
                pathname: 'student',
                query: { tab: 'placementStarted', page: 1, pageSize: 50 },
            },
            badge: {
                text: data?.placementStarted,
                loading: isLoading,
            },
            element: <PlacementStartedStudents />,
        },
        {
            label: 'Completed Students',
            href: {
                pathname: 'student',
                query: { tab: 'completed-students' },
            },
            badge: {
                text: data?.completed,
                loading: isLoading,
            },
            element: <CompletedStudents />,
        },
        {
            label: 'Snoozed Students',
            href: {
                pathname: 'student',
                query: { tab: 'snoozed-students' },
            },
            badge: {
                text: data?.snoozed,
                loading: isLoading,
            },
            element: <SnoozedStudents />,
        },
        {
            label: 'UnAssigned Students',
            href: {
                pathname: 'student',
                query: { tab: 'unassigned-students' },
            },
            badge: {
                text: data?.unAssigned,
                loading: isLoading,
            },
            element: <UnAssignedStudent />,
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
        <div>
            <SetDetaultQueryFilteres<StudentsFilterType>
                filterKeys={filterKeys}
                setFilter={setFilter}
            />
            <div className="px-4">
                <div className="flex justify-end gap-x-2 mb-2">
                    <div className="w-60">
                        <TextInput
                            name={'name'}
                            placeholder={'Search by Student Name'}
                            value={studentNameValue}
                            onChange={(e: any) => {
                                setStudentNameValue(e.target.value)
                                delayedNameSearch(e.target.value)
                            }}
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
                        />
                    </div>
                    <div className="shrink-0">{filterAction}</div>
                </div>
                <Filter<StudentsFilterType>
                    setFilter={(f: StudentsFilterType) => {
                        setStudentId(null)
                        setFilter(f)
                    }}
                    initialValues={filter}
                    filterKeys={filterKeys}
                    component={StudentFilters}
                    setFilterAction={setFilterAction}
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
                            filter={filter}
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
    )
}

StudentList.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default StudentList
