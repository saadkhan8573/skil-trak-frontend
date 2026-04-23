import {
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    PageTitle,
    StudentExpiryDaysLeft,
    StudentJobId,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    UserCreatedAt,
} from '@components'
import { useContextBar } from '@hooks'
import { SubAdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { Student, SubAdminStudentsFilterType } from '@types'
import { getFilterQuery, removeEmptyValues } from '@utils'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { RTOCellInfo } from '../rto/components'
import { StudentCellInfo, SubadminStudentIndustries } from './components'

import { FaEdit, FaEye } from 'react-icons/fa'

import { MdBlock, MdPriorityHigh } from 'react-icons/md'
import {
    AddToNonContactableStudents,
    ChangeStudentStatusModal,
    HighPriorityModal,
} from './modals'

import { EditTimer } from '@components/StudentTimer/EditTimer'
import { SectorCell } from '@partials/admin/student/components'
import { setLink } from '@utils'

const filterKeys = [
    'nowp',
    'name',
    'email',
    'phone',
    'rtoId',
    'suburb',
    'status',
    'courseId',
    'studentId',
    'industryId',
    'currentStatus',
]

export const RtoSubadminStudent = () => {
    const router = useRouter()
    const { setContent } = useContextBar()

    const [modal, setModal] = useState<ReactElement | null>(null)

    const [filter, setFilter] = useState<SubAdminStudentsFilterType>(
        {} as SubAdminStudentsFilterType
    )
    const [studentId, setStudentId] = useState<any | null>(null)
    const [studentName, setStudentName] = useState<any | null>(null)
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
        const query = getFilterQuery<SubAdminStudentsFilterType>({
            router,
            filterKeys,
        })
        setFilter(query as SubAdminStudentsFilterType)
    }, [router])

    const students = SubAdminApi.Student.useGetRtoCoordinatorStudents(
        {
            search: `${JSON.stringify(
                removeEmptyValues({
                    ...filter,
                    ...studentId,
                    ...studentName,
                })
            )
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

    useEffect(() => {
        const getScrollId = sessionStorage.getItem('scrollId')
        if (getScrollId) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, scrollId: getScrollId },
            })
        }
    }, [])

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onNonContactableStudents = (student: Student) => {
        setModal(
            <AddToNonContactableStudents
                student={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onChangeStatus = (student: Student) => {
        setModal(
            <ChangeStudentStatusModal
                student={student}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onDateClick = (student: Student) => {
        setModal(
            <EditTimer
                studentId={student?.user?.id}
                date={student?.expiryDate}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onMarkAsHighPriorityClicked = (studetnt: Student) => {
        setModal(
            <HighPriorityModal
                item={studetnt}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const tableActionOptions = (
        student: Student
    ): TableActionOption<Student>[] => {
        return [
            {
                text: 'View',
                onClick: (student) => {
                    router.push(
                        `/portals/sub-admin/students/${student?.id}/detail`
                    )
                    setLink('subadmin-student', router)
                },
                Icon: FaEye,
            },
            // {
            //     text: student?.subadmin ? 'Un Assign' : 'Assign to me',
            //     onClick: (student: Student) => onAssignStudentClicked(student),
            //     Icon: MdBlock,
            // },
            {
                text: student?.nonContactable
                    ? 'Add to Contactable'
                    : 'Add to Not Contactable',
                onClick: (student) => onNonContactableStudents(student),
                Icon: MdBlock,
            },
            {
                text: 'Change Status',
                onClick: (student) => onChangeStatus(student),
                Icon: FaEdit,
            },

            {
                text: student?.isHighPriority
                    ? 'Remove Mark High Priority'
                    : 'Mark High Priority',
                onClick: (student) => onMarkAsHighPriorityClicked(student),
                Icon: MdPriorityHigh,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
            {
                text: 'Change Expiry',
                onClick: (student) => onDateClick(student),
                Icon: FaEdit,
            },
        ]
    }

    const Columns: ColumnDef<Student>[] = [
        {
            header: () => 'Job Id',
            accessorKey: 'studentMaskedId',
            cell: ({ row }) => (
                <StudentJobId studentJobId={row.original?.studentMaskedId} />
            ),
        },
        {
            header: () => 'Name',
            accessorKey: 'user',
            cell: (info) => (
                <StudentCellInfo student={info.row.original} call />
            ),
        },
        {
            header: () => 'RTO',
            accessorKey: 'rto',
            cell: ({ row }: any) => <RTOCellInfo rto={row.original?.rto} />,
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => (
                <SubadminStudentIndustries
                    workplace={info.row.original?.workplace}
                    industries={info.row.original?.industries}
                />
            ),
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: ({ row }: any) => {
                return <SectorCell student={row.original} />
            },
        },
        {
            accessorKey: 'expiry',
            header: () => <span>Expiry Countdown</span>,
            cell: (info) => (
                <StudentExpiryDaysLeft
                    expiryDate={info.row.original?.expiryDate}
                />
            ),
        },
        {
            accessorKey: 'progress',
            header: () => <span>Progress</span>,
            cell: ({ row }) => (
                <CaseOfficerAssignedStudent student={row.original} />
            ),
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: ({ row }: any) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
        {
            header: () => 'Action',
            accessorKey: 'Action',
            cell: ({ row }) => {
                const tableActionOption = tableActionOptions(row.original)
                return (
                    <TableAction
                        options={tableActionOption}
                        rowItem={row.original}
                    />
                )
            },
        },
    ]

    return (
        <div>
            <div className="flex justify-between items-end">
                {/* <PageTitle title={'Students'} backTitle={'Users'} /> */}

                <div className="flex gap-x-2">
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
                    </div>
                    <div className="flex-shrink-0">{filterAction}</div> */}
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

            {/*  */}
            {/* <div className="py-4">
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
            </div> */}

            {modal}
            {students?.isError && <TechnicalError />}
            <Card noPadding>
                {students?.isLoading || students?.isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : students?.data &&
                  students?.data?.data.length &&
                  !students?.isError ? (
                    <Table
                        columns={Columns}
                        data={students?.data.data}
                        enableRowSelection
                    >
                        {({
                            table,
                            pagination,
                            pageSize,
                            quickActions,
                        }: any) => {
                            return (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize(
                                            itemPerPage,
                                            setItemPerPage,
                                            students?.data?.data?.length
                                        )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination(
                                                students?.data?.pagination,
                                                setPage
                                            )}
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto remove-scrollbar">
                                        <div
                                            className="px-6 w-full"
                                            id={'studentScrollId'}
                                        >
                                            {table}
                                        </div>
                                    </div>
                                    {students?.data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                students?.data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    students?.data?.pagination,
                                                    setPage
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !students?.isError && (
                        <EmptyData
                            title={'No Students'}
                            description={'You have not assigned Student yet!'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}
