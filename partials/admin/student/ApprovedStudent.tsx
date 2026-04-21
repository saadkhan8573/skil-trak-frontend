import {
    ActionButton,
    Button,
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    StudentExpiryDaysLeft,
    StudentJobId,
    Table,
    TableAction,
    TableActionOption,
    TableChildrenProps,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaFileExport } from 'react-icons/fa'

import { RtoCellInfo } from '@partials/admin/rto/components'
import { AdminApi } from '@queries'
import { Student, UserStatus } from '@types'
import {
    activeAndCompleted,
    checkListLength,
    filterAwaitingAgreementBeyondSevenDays,
    findCallLogsUnanswered,
    findExpiringInNext45Days,
    isBrowser,
    setLink,
} from '@utils'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { MdBlock, MdPriorityHigh } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import { Phone } from 'lucide-react'
import { SectorCell, StudentCellInfo, StudentIndustries } from './components'
import { AdminStudentModalType, getAdminStudentsModal } from './modals'

// hooks
import { useActionModal, useModal } from '@hooks'

import moment from 'moment'

export const ApprovedStudent = () => {
    const router = useRouter()
    // const [modal, setModal] = useState<ReactElement | null>(null)
    const [itemPerPage, setItemPerPage] = useState(30)
    const [isRouting, setIsRouting] = useState(true)
    const [page, setPage] = useState(1)
    const listingRef = useRef<any>(null)

    const { modal, openModal, closeModal } = useModal()

    const handleOpenModal = (type: AdminStudentModalType, student: any) => {
        openModal(getAdminStudentsModal(type, student, closeModal))
    }

    const savedScrollPosition =
        isBrowser() && localStorage.getItem('lastScroll')
    useEffect(() => {
        if (listingRef.current && savedScrollPosition) {
            listingRef.current.scrollTop = parseInt(savedScrollPosition, 10)
        }
    }, [savedScrollPosition, listingRef])

    // Function to handle scrolling
    const handleScroll = () => {
        if (listingRef.current) {
            isBrowser() &&
                localStorage.setItem('lastScroll', listingRef.current.scrollTop)
        }
    }

    useEffect(() => {
        const newPage = Number(router.query.page)
        const newItemPerPage = Number(router.query.pageSize)
        if (router.query.page && isRouting) {
            setPage(newPage)
        }
        if (router.query.pageSize && isRouting) {
            setItemPerPage(newItemPerPage)
        }
    }, [router.query.page, router.query.pageSize, isRouting])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    // admin/students/reported/list
    const { isLoading, isFetching, data, isError } =
        AdminApi.Students.useListQuery(
            {
                search: `status:${UserStatus.Approved}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            { refetchOnMountOrArgChange: 30 }
        )

    const tableActionOptions = (
        student: Student
    ): TableActionOption<Student>[] => {
        return [
            {
                text: 'View',
                onClick: (student) => {
                    router.push(`/portals/admin/student/${student?.id}/detail`)
                    setLink('student', router)
                },
                Icon: FaEye,
            },
            // {
            //     text: 'View Old Profile',
            //     onClick: (student: Student) => {
            //         router.push(
            //             `/portals/admin/student/${student?.id}/old-profile`
            //         )
            //     },
            //     Icon: FaEye,
            // },
            {
                text: 'Edit',
                onClick: (student) => {
                    router.push(
                        `/portals/admin/student/edit-student/${student?.id}`
                    )
                },
                Icon: FaEdit,
            },
            {
                text: 'AI Voice Call',
                onClick: (student) => {
                    handleOpenModal(AdminStudentModalType.AI_CALL, student)
                },
                Icon: () => <Phone className="w-3 h-3" />,
            },
            {
                text: 'Change Status',
                onClick: (student) => {
                    // onChangeStatus(student)
                    handleOpenModal(
                        AdminStudentModalType.CHANGE_STATUS,
                        student
                    )
                },
                Icon: FaEdit,
            },
            {
                text: 'Change Expiry',
                onClick: (student: Student) => {
                    // onDateClick(student)
                    handleOpenModal(AdminStudentModalType.EDIT_TIMER, student)
                },
                Icon: FaEdit,
            },
            {
                text: 'View Password',
                onClick: (student) => onViewPassword({ user: student?.user }),
                Icon: RiLockPasswordFill,
            },
            {
                text: 'Block',
                onClick: (student) => {
                    // onBlockClicked(student)
                    handleOpenModal(AdminStudentModalType.BLOCK, student)
                },
                Icon: MdBlock,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
            {
                text: student?.isHighPriority
                    ? 'Remove Mark High Priority'
                    : 'Mark High Priority',
                onClick: (student: Student) => {
                    // onMarkAsHighPriorityClicked(student)
                    handleOpenModal(
                        AdminStudentModalType.HIGH_PRIORITY,
                        student
                    )
                },
                Icon: MdPriorityHigh,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
            {
                text: 'Archive',
                onClick: (student) => {
                    // onArchiveClicked(student)
                    handleOpenModal(AdminStudentModalType.ARCHIVE, student)
                },
                Icon: MdBlock,
                color: 'text-red-400 hover:bg-red-100 hover:border-red-200',
            },
        ]
    }

    const columns: ColumnDef<Student>[] = [
        {
            header: () => 'Job Id',
            accessorKey: 'studentMaskedId',
            cell: ({ row }) => (
                <StudentJobId studentJobId={row.original?.studentMaskedId} />
            ),
        },
        {
            accessorKey: 'user.name',
            cell: (info) => (
                <StudentCellInfo student={info?.row?.original} call />
            ),
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'rto',
            header: () => <span>RTO</span>,
            cell: (info) => {
                return info.row?.original?.rto ? (
                    <RtoCellInfo rto={info.row?.original?.rto} short />
                ) : (
                    <span>{info.row?.original?.rtoInfo}</span>
                )
            },
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => (
                <StudentIndustries
                    industries={info.row.original?.industries}
                    workplace={info.row.original?.workplace}
                />
            ),
        },
        {
            accessorKey: 'batch',
            header: () => <span>Batch</span>,
            cell: ({ row }) => (
                <Typography whiteSpacePre variant="small" medium>
                    {row?.original?.batch}
                </Typography>
            ),
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: (info) => {
                return info.row.original?.courses?.length > 0 ? (
                    <SectorCell student={info.row.original} />
                ) : (
                    <span>{info.row.original?.courseDescription ?? '—'}</span>
                )
            },
        },
        {
            accessorKey: 'lastContactedAt',
            header: () => <span>Last Contacted At</span>,
            cell: (info) => {
                const lastContactedAt = info?.row?.original?.lastContactedAt

                if (!lastContactedAt)
                    return (
                        <Typography variant="small" color={'text-red-500'}>
                            <span className="font-semibold whitespace-pre">
                                Never
                            </span>
                        </Typography>
                    )

                const now = moment()
                const last = moment(lastContactedAt)

                const diffHours = now.diff(last, 'hours')
                const diffDays = now.diff(last, 'days')

                const isOld = diffHours > 24

                return (
                    <>
                        <Typography
                            variant="small"
                            color={isOld ? 'text-red-500' : 'text-gray-600'}
                        >
                            <span className="font-semibold whitespace-pre">
                                {isOld
                                    ? `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
                                    : last.format('Do MMM YYYY')}
                            </span>
                        </Typography>

                        {!isOld && (
                            <Typography variant="small" color="text-gray-600">
                                <span className="font-semibold whitespace-pre">
                                    {last.format('hh:mm:ss a')}
                                </span>
                            </Typography>
                        )}
                    </>
                )
            },
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
            cell: (info) => {
                return (
                    <>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'Do MMM YYYY'
                                )}
                            </span>
                        </Typography>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'hh:mm:ss a'
                                )}
                            </span>
                        </Typography>
                    </>
                )
            },
        },
        {
            accessorKey: 'lastContactedAt',
            header: () => <span>Last Contacted At</span>,
            cell: (info) => {
                return info?.row?.original?.lastContactedAt ? (
                    <>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(
                                    info?.row?.original?.lastContactedAt
                                ).format('Do MMM YYYY')}
                            </span>
                        </Typography>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'hh:mm:ss a'
                                )}
                            </span>
                        </Typography>
                    </>
                ) : (
                    '---'
                )
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
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                const length = checkListLength<Student>(data?.data as Student[])
                const tableActionOption = tableActionOptions(
                    info?.row?.original
                )
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={tableActionOption}
                            rowItem={info?.row?.original}
                            lastIndex={length.includes(info?.row?.index)}
                        />
                    </div>
                )
            },
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (student: Student) => {
            return (
                <div className="flex gap-x-2">
                    <ActionButton
                        onClick={() => {
                            router.push(
                                `/portals/admin/student/${student?.id}/detail`
                            )
                        }}
                    >
                        View
                    </ActionButton>
                    <ActionButton
                        Icon={FaEdit}
                        onClick={() => {
                            router.push(
                                `/portals/admin/student/edit-student/${student?.id}`
                            )
                        }}
                    >
                        Edit
                    </ActionButton>
                    <ActionButton
                        Icon={MdBlock}
                        variant="error"
                        onClick={() => {
                            handleOpenModal(
                                AdminStudentModalType.BLOCK,
                                student
                            )
                            // onBlockClicked(student)
                        }}
                    >
                        Block
                    </ActionButton>
                    <ActionButton
                        Icon={Phone as any}
                        onClick={() => {
                            handleOpenModal(
                                AdminStudentModalType.AI_CALL,
                                student
                            )
                        }}
                    >
                        AI Call
                    </ActionButton>
                </div>
            )
        },
        common: (student: Student[]) => (
            <ActionButton
                onClick={() => {
                    handleOpenModal(AdminStudentModalType.BULK_BLOCK, student)
                    // onBlockMultiStudents(student)
                }}
                Icon={MdBlock}
                variant="error"
            >
                Block
            </ActionButton>
        ),
    }

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4">
                <div className="flex">
                    <PageHeading
                        title={'Approved Students'}
                        subtitle={'List of Approved Students'}
                    />
                    {data && data?.data.length ? (
                        <div className="">
                            <a
                                href={`${process.env.NEXT_PUBLIC_END_POINT}/admin/students/list/download
                        `}
                                target="_blank"
                                rel="noreferrer"
                                className=""
                            >
                                {' '}
                                <Button
                                    text={'Export'}
                                    variant={'action'}
                                    Icon={FaFileExport}
                                />
                            </a>
                        </div>
                    ) : null}
                </div>
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length ? (
                        <Table
                            columns={columns}
                            data={data.data}
                            quickActions={quickActionsElements}
                            enableRowSelection
                            awaitingAgreementBeyondSevenDays={filterAwaitingAgreementBeyondSevenDays(
                                data?.data
                            )}
                            findCallLogsUnanswered={findCallLogsUnanswered(
                                data?.data
                            )}
                            findExpiringInNext45Days={findExpiringInNext45Days(
                                data?.data
                            )}
                            activeAndCompleted={activeAndCompleted(data?.data)}
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: TableChildrenProps) => {
                                return (
                                    <div>
                                        <div
                                            ref={listingRef}
                                            onScroll={handleScroll}
                                            className="p-6 mb-2 flex justify-between"
                                        >
                                            {pageSize
                                                ? pageSize(
                                                      itemPerPage,
                                                      (e) => {
                                                          setItemPerPage(e)
                                                          setIsRouting(false)
                                                      },
                                                      data?.data?.length
                                                  )
                                                : null}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination
                                                    ? pagination(
                                                          data?.pagination,
                                                          setPage
                                                      )
                                                    : null}
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
                                        {data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize
                                                    ? pageSize(
                                                          itemPerPage,
                                                          (e) => {
                                                              setItemPerPage(e)
                                                              setIsRouting(
                                                                  false
                                                              )
                                                          },
                                                          data?.data?.length
                                                      )
                                                    : null}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination
                                                        ? pagination(
                                                              data?.pagination,
                                                              setPage
                                                          )
                                                        : null}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Approved Student!'}
                                description={
                                    'You have not approved any Student request yet'
                                }
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
