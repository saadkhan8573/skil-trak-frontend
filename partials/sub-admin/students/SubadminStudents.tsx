import { SubAdminStudentsFilterType, UserStatus } from '@types'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useState } from 'react'

//components
import {
    Filter,
    LoadingAnimation,
    MyStudentQuickFilters,
    SubAdminStudentFilters,
    TabNavigation,
    TabProps,
    TechnicalError,
    TextInput,
} from '@components'
import {
    AgreementPendingStudents,
    AllStudents,
    ArchivedStudents,
    BlockedStudents,
    CompletedStudents,
    FavouriteIndustryStudents,
    FilteredStudents,
    HighPriorityStudentsList,
    MyStudents,
    NonContactableStudents,
    PendingStudents,
    PlacementStartedStudents,
    RejectedStudents,
    ScheduleCompleted,
    StudentScheduleEndedList,
    StudentWeeklyCallList,
    UnAssignedStudents,
    UpcomingAppointmentsStudents,
    UrgentStudents,
} from '@partials/sub-admin/students'

// query
import { SubAdminApi, useGetSubAdminStudentsQuery } from '@queries'

// hooks

//Layouts
import { useSubadminProfile } from '@hooks'
import { checkFilteredDataLength, getCountData, getFilterQuery } from '@utils'
import { useRouter } from 'next/router'

const filterKeys = [
    'nowp',
    'name',
    'email',
    'phone',
    'rtoId',
    'suburb',
    'status',
    'courseId',
    'completed',
    'studentId',
    'industryId',
    'currentStatus',
    'flagged',
    'snoozed',
    'nonContactable',
    'coordinator',
    'subadminId',
    'studentMaskedId',
]

export const SubadminStudents = () => {
    const router = useRouter()

    const subadmin = useSubadminProfile()

    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<SubAdminStudentsFilterType>(
        {} as SubAdminStudentsFilterType
    )
    const [studentId, setStudentId] = useState<any | null>(null)
    const [studentIdValue, setStudentIdValue] = useState<string>('')
    const [studentName, setStudentName] = useState<any | null>(null)
    const [studentNameValue, setStudentNameValue] = useState<string>('')

    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [snoozed, setSnoozed] = useState<boolean>(false)
    const [flagged, setFlagged] = useState<boolean>(false)
    const [nonContactable, setNonContactable] = useState<boolean>(false)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
        const query = getFilterQuery<SubAdminStudentsFilterType>({
            router,
            filterKeys,
        })
        setFilter(query as SubAdminStudentsFilterType)
    }, [router])

    const count = SubAdminApi.Student.useCount()

    const isHod = subadmin?.departmentMember?.isHod
    const isManager = subadmin?.isManager
    const isAssociatedWithRto = subadmin?.isAssociatedWithRto
    const filteredStudents = useGetSubAdminStudentsQuery(
        {
            search: `${JSON.stringify({
                ...filter,
                ...studentId,
                ...studentName,
                ...(flagged === true && { flagged }),
                ...(snoozed === true && { snoozed }),
                ...(nonContactable === true && { nonContactable }),
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
                ...(flagged === true && { flagged }),
                ...(snoozed === true && { snoozed }),
                ...(nonContactable === true && { nonContactable }),
            }).length,
            refetchOnMountOrArgChange: 30,
        }
    )

    const studentCount = getCountData<{ [key: string]: number }>(count?.data)

    useEffect(() => {
        const getScrollId = sessionStorage.getItem('scrollId')
        if (getScrollId) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, scrollId: getScrollId },
            })
        }
    }, [])

    interface SubadminTabProps extends TabProps {
        isAssociatedWithRto?: boolean
    }

    const tabs: SubadminTabProps[] = [
        ...(isHod ||
        isManager ||
        (subadmin?.isAssociatedWithRto && subadmin?.hasAllStudentAccess)
            ? [
                  {
                      label: 'Pending',
                      href: {
                          pathname: 'students',
                          query: { tab: UserStatus.Pending },
                      },
                      badge: {
                          text: studentCount?.pending,
                          loading: count.isLoading,
                      },
                      element: <PendingStudents />,
                      isAssociatedWithRto: true,
                  },
              ]
            : []),

        // isHod
        ...(isHod || isManager || subadmin?.canViewAllStudents
            ? [
                  {
                      label: 'Active',
                      href: { pathname: 'students', query: { tab: 'all' } },
                      badge: {
                          text: studentCount?.approved,
                          loading: count.isLoading,
                      },
                      element: <AllStudents />,
                      isAssociatedWithRto: true,
                  },
              ]
            : []),
        ...(isHod
            ? [
                  {
                      label: 'UnAssigned',
                      href: {
                          pathname: 'students',
                          query: { tab: 'un-assigned' },
                      },
                      badge: {
                          text: studentCount?.unAssignedStudent,
                          loading: count.isLoading,
                      },
                      element: <UnAssignedStudents />,
                  },
              ]
            : []),

        {
            label: 'My Students',
            badge: {
                text: studentCount?.myStudents,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: 'my-students' } },
            element: <MyStudents />,
            isAssociatedWithRto: true,
        },
        {
            label: 'Favourite Industry Students',
            badge: {
                text: studentCount?.favouriteIndustryStudents,
                loading: count.isLoading,
            },
            href: {
                pathname: 'students',
                query: { tab: 'favourite-industry-students' },
            },
            element: <FavouriteIndustryStudents />,
            isAssociatedWithRto: true,
        },
        {
            label: 'Weekly Student Calls List',
            badge: {
                text: studentCount?.removeOnCallLog,
                loading: count.isLoading,
            },
            href: {
                pathname: 'students',
                query: { tab: 'weekly-students-calls' },
            },
            element: <StudentWeeklyCallList />,
        },
        {
            label: 'Non Contactable Students',
            badge: {
                text: studentCount?.contContactable,
                loading: count.isLoading,
            },
            href: {
                pathname: 'students',
                query: { tab: 'non-contactable-students' },
            },
            element: <NonContactableStudents />,
            isAssociatedWithRto: true,
        },
        {
            label: 'Placement Started Students',
            badge: {
                text: studentCount?.placementStarted,
                loading: count.isLoading,
            },
            href: {
                pathname: 'students',
                query: { tab: 'placement-started-students' },
            },
            element: <PlacementStartedStudents />,
        },
        {
            label: 'Student Schedule Ended',
            badge: {
                text: studentCount?.schedule,
                loading: count.isLoading,
            },
            href: {
                pathname: 'students',
                query: { tab: 'student-schedule-ended' },
            },
            element: <StudentScheduleEndedList />,
        },
        {
            label: 'Urgent Students',
            badge: {
                text: studentCount?.urgentStudents,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: 'urgent-students' } },
            element: <UrgentStudents />,
        },
        {
            label: 'Agreement Pending',
            badge: {
                text: studentCount?.awaitingAgreementSigned,
                loading: count.isLoading,
            },
            href: { pathname: 'students', query: { tab: 'agreement-pending' } },
            element: <AgreementPendingStudents />,
        },
        {
            label: 'Upcoming Appointment Students',
            badge: {
                text: studentCount?.upComingAppointment,
                loading: count.isLoading,
            },
            href: {
                pathname: 'students',
                query: { tab: 'up-coming-appointments-students' },
            },
            element: <UpcomingAppointmentsStudents />,
        },
        {
            label: 'High Priority Students',
            badge: {
                text: studentCount?.highPriority,
                loading: count.isLoading,
            },
            href: {
                pathname: 'students',
                query: { tab: 'high-priority-students' },
            },
            element: <HighPriorityStudentsList />,
        },
        {
            label: 'Schedule Completed Students',
            href: {
                pathname: 'students',
                query: { tab: 'schedule-students' },
            },
            badge: {
                text: studentCount?.completed,
                loading: count.isLoading,
            },
            element: <ScheduleCompleted />,
            isAssociatedWithRto: true,
        },
        {
            label: 'Rejected',
            href: { pathname: 'students', query: { tab: UserStatus.Rejected } },
            badge: {
                text: studentCount?.rejected,
                loading: count.isLoading,
            },
            element: <RejectedStudents />,
            isAssociatedWithRto: true,
        },
        {
            label: 'Blocked',
            href: { pathname: 'students', query: { tab: UserStatus.Blocked } },
            badge: {
                text: studentCount?.blocked,
                loading: count.isLoading,
            },
            element: <BlockedStudents />,
            isAssociatedWithRto: true,
        },
        {
            label: 'Archived',
            href: { pathname: 'students', query: { tab: UserStatus.Archived } },
            badge: {
                text: studentCount?.archived,
                loading: count.isLoading,
            },
            element: <ArchivedStudents />,
            isAssociatedWithRto: true,
        },
        {
            label: 'Completed Students',
            href: {
                pathname: 'students',
                query: { tab: 'completed-students' },
            },
            badge: {
                text: studentCount?.countCompleted,
                loading: count.isLoading,
            },
            element: <CompletedStudents />,
            isAssociatedWithRto: true,
        },
    ]

    const isAssociatedStudentTabs = tabs?.filter(
        (tab) => tab?.isAssociatedWithRto
    )

    const delayedNameSearch = useCallback(
        debounce((value) => {
            setStudentName({ name: value })
        }, 700),
        []
    )

    const delayedSearch = useCallback(
        debounce((value) => {
            setStudentId({ studentId: value })
        }, 700),
        []
    )

    const filteredDataLength = checkFilteredDataLength({
        ...filter,
        ...(studentId?.studentId ? studentId : {}),
        ...(studentName?.name ? studentName : {}),
        ...(flagged === true && { flagged }),
        ...(snoozed === true && { snoozed }),
        ...(nonContactable === true && { nonContactable }),
    })

    return (
        <>
            <div className="flex justify-end items-end">
                {/* <PageTitle title={'Students'} backTitle={'Users'} /> */}

                <div className="flex items-center gap-x-2">
                    <MyStudentQuickFilters
                        setNonContactable={setNonContactable}
                        setSnoozed={setSnoozed}
                        setFlagged={setFlagged}
                        snoozed={snoozed}
                        flagged={flagged}
                        nonContactable={nonContactable}
                    />
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
                    {/* <div>
                        <a
                            href={`${
                                process.env.NEXT_PUBLIC_END_POINT
                            }/subadmin/students/download/csv/${
                                getUserCredentials()?.id
                            }`}
                            target="_blank"
                        >
                            <Button
                                text={'Export as CSV'}
                                variant={'action'}
                                // onClick={() => downloadCSV()}
                            />
                        </a>
                    </div> */}
                </div>
            </div>

            <div className="py-4">
                <Filter<SubAdminStudentsFilterType>
                    setFilter={(f: SubAdminStudentsFilterType) => {
                        setStudentId(null)
                        setFilter(f)
                    }}
                    initialValues={filter}
                    filterKeys={filterKeys}
                    setFilterAction={setFilterAction}
                    component={SubAdminStudentFilters}
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
                <TabNavigation
                    tabs={isAssociatedWithRto ? isAssociatedStudentTabs : tabs}
                >
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

            {/* <div>
                {filteredStudents.isError && <TechnicalError />}
                {filteredStudents.isLoading ? (
                    <div className="px-4 mt-4">
                        <Card>
                            <LoadingAnimation />
                        </Card>
                    </div>
                ) : Object.keys(filter).length && filteredStudents.isSuccess ? (
                    <FilteredStudents
                        setPage={setPage}
                        itemPerPage={itemPerPage}
                        student={filteredStudents}
                        setItemPerPage={setItemPerPage}
                    />
                ) : (
                    !filteredStudents.isError && (
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
                    )
                )} */}
            {/* </div> */}
        </>
    )
}
