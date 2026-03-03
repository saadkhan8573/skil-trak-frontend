import {
    DepartmentStudentFilter,
    Filter,
    SetDetaultQueryFilteres,
    TabNavigation,
    TabProps,
} from '@components'
import { PageHeading } from '@components/headings'
import { FigureCard } from '@components/sections/subAdmin'
import { AdminLayout } from '@layouts'
import {
    DepartmentStudentList,
    DepartmentStudentsListProvider,
    FilterDepartmentStudents,
    FlaggedDepartmentStudents,
    NonContactableDepartmentStudents,
    SnoozedDepartmentStudents,
    useDepartmentStudentList,
} from '@partials/admin/departments'
import { NextPageWithLayout, StudentsFilterType } from '@types'
import { checkFilteredDataLength } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useMemo, useState } from 'react'
import { BiSolidAlarmSnooze } from 'react-icons/bi'
import { FaFlag, FaUserFriends } from 'react-icons/fa'
import { FiPhoneOff } from 'react-icons/fi'

const filterKeys = [
    'nowp',
    'name',
    'email',
    'phone',
    'rtoId',
    'suburb',
    'status',
    'sectorId',
    'courseId',
    'completed',
    'studentId',
    'industryId',
    'subadminId',
    'currentStatus',
]

const DepartmentStudent: NextPageWithLayout = () => {
    const [studentId, setStudentId] = useState<any | null>(null)
    const [studentIdValue, setStudentIdValue] = useState<string>('')
    const [studentName, setStudentName] = useState<any | null>(null)
    const [studentNameValue, setStudentNameValue] = useState<string>('')
    const router = useRouter()
    const { id } = router.query
    const {
        filter,
        setFilter,
        filterAction,
        setFilterAction,
        modal,
        passwordModal,
        data,
        isLoading,
    } = useDepartmentStudentList()

    // Memoized student counts calculation
    const studentCounts = useMemo((): any => {
        if (!data?.data) {
            return {
                active: 0,
                flagged: 0,
                snoozed: 0,
                nonContactable: 0,
            }
        }

        // Single pass through the data to calculate all counts
        return data?.data?.reduce(
            (counts: any, student: any) => {
                if (student.hasIssue) counts.flagged++
                else if (student.isSnoozed) counts.snoozed++
                else if (student.nonContactable) counts.nonContactable++
                else counts.active++

                return counts
            },
            {
                active: 0,
                flagged: 0,
                snoozed: 0,
                nonContactable: 0,
            }
        )
    }, [data?.data])

    const filteredDataLength = checkFilteredDataLength({
        ...filter,
        ...(studentId?.studentId ? studentId : {}),
        ...(studentName?.name ? studentName : {}),
    })

    const tabs: TabProps[] = [
        {
            label: 'Active',
            href: {
                pathname: `/portals/admin/departments/${id}/students`,
                query: { tab: 'all' },
            },
            // badge: {
            //     text: studentCount?.pending,
            //     loading: count.isLoading,
            // },
            element: <DepartmentStudentList status={{ all: true }} />,
        },
        //
        {
            label: 'Snoozed',
            href: {
                pathname: `/portals/admin/departments/${id}/students`,
                query: { tab: 'snoozed' },
            },
            // badge: {
            //     text: studentCount?.pending,
            //     loading: count.isLoading,
            // },
            element: <SnoozedDepartmentStudents status={{ snoozed: true }} />,
        },
        {
            label: 'Flagged',
            href: {
                pathname: `/portals/admin/departments/${id}/students`,
                query: { tab: 'flagged' },
            },
            // badge: {
            //     text: studentCount?.pending,
            //     loading: count.isLoading,
            // },
            element: <FlaggedDepartmentStudents status={{ flagged: true }} />,
        },
        {
            label: 'Non Contactable',
            href: {
                pathname: `/portals/admin/departments/${id}/students`,
                query: { tab: 'non-contactable' },
            },
            // badge: {
            //     text: studentCount?.pending,
            //     loading: count.isLoading,
            // },
            element: (
                <NonContactableDepartmentStudents
                    status={{ nonContactable: true }}
                />
            ),
        },
    ]

    const StudentStats = useMemo(
        () => (
            <div className="flex gap-x-4 gap-y-2 mb-5">
                <FigureCard
                    count={studentCounts?.active}
                    title="Active Students"
                    Icon={FaUserFriends}
                    iconClassName="text-green-400"
                    loading={isLoading}
                />
                <FigureCard
                    count={studentCounts?.flagged}
                    title="Flagged Students"
                    Icon={FaFlag}
                    iconClassName="text-red-500"
                    loading={isLoading}
                />
                <FigureCard
                    count={studentCounts?.snoozed}
                    title="Snoozed Students"
                    Icon={BiSolidAlarmSnooze}
                    iconClassName="text-indigo-400"
                    loading={isLoading}
                />
                <FigureCard
                    count={studentCounts?.nonContactable}
                    title="Non-Contactable Students"
                    Icon={FiPhoneOff}
                    iconClassName="text-red-400"
                    loading={isLoading}
                />
            </div>
        ),
        [studentCounts]
    )

    return (
        <>
            {passwordModal && passwordModal}
            {modal && modal}
            <div className="mx-5 my-8">
                <div>
                    <SetDetaultQueryFilteres<StudentsFilterType>
                        filterKeys={filterKeys}
                        setFilter={setFilter}
                    />
                    <div className="px-4">
                        <div className="flex justify-end gap-x-2 mb-2">
                            {/* <div className="w-60">
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
                            </div> */}
                            <div className="shrink-0">{filterAction}</div>
                        </div>
                        <Filter<StudentsFilterType>
                            setFilter={(f: StudentsFilterType) => {
                                setStudentId(null)
                                setFilter(f)
                            }}
                            initialValues={filter}
                            filterKeys={filterKeys}
                            component={DepartmentStudentFilter}
                            setFilterAction={setFilterAction}
                        />
                    </div>
                </div>
                <div className="my-4">
                    <PageHeading
                        title={'Department Students'}
                        subtitle={'List of Department Students'}
                    />
                </div>
                {/* Filter table */}
                {filteredDataLength && (
                    <>
                        {StudentStats}
                        <FilterDepartmentStudents />
                    </>
                )}

                {/* Table */}
                {!filteredDataLength && (
                    <TabNavigation tabs={tabs}>
                        {({ header, element }: any) => {
                            return (
                                <div>
                                    <div>{header}</div>
                                    <div className="py-4">{element}</div>
                                </div>
                            )
                        }}
                    </TabNavigation>
                )}
            </div>
        </>
    )
}

DepartmentStudent.getLayout = (page: ReactElement) => {
    return (
        <AdminLayout>
            <DepartmentStudentsListProvider>
                {page}
            </DepartmentStudentsListProvider>
        </AdminLayout>
    )
}

export default DepartmentStudent
