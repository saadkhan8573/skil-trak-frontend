import {
    ActionButton,
    Button,
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    NoData,
    StudentJobId,
    Table,
    TableAction,
    TableChildrenProps,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaFileExport, FaFlag } from 'react-icons/fa'

import { RtoCellInfo } from '@partials/admin/rto/components'
import { AdminApi } from '@queries'
import { Student } from '@types'
import {
    activeAndCompleted,
    checkListLength,
    filterAwaitingAgreementBeyondSevenDays,
    findCallLogsUnanswered,
    findExpiringInNext45Days,
    isBrowser,
    setLink,
} from '@utils'
import { Phone } from 'lucide-react'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { MdBlock } from 'react-icons/md'
import { SectorCell, StudentCellInfo, StudentIndustries } from './components'
import {
    AdminStudentModalType,
    BlockModal,
    BlockMultiStudentsModal,
    getAdminStudentsModal,
} from './modals'

// hooks

import Modal from '@modals/Modal'
import { SwitchOffFlagModal } from '@partials/common/StudentProfileDetail/modals'

export const FlaggedStudentsList = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactNode | null>(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const listingRef = useRef<any>(null)

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
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const { isLoading, isFetching, data, isError } =
        AdminApi.Students.useFlaggedStudents(
            {
                // search: `status:${UserStatus.Approved}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            { refetchOnMountOrArgChange: 30 }
        )

    const onModalCancelClicked = useCallback(() => {
        setModal(null)
    }, [])
    const handleOpenModal = (type: AdminStudentModalType, student: any) => {
        setModal(getAdminStudentsModal(type, student, onModalCancelClicked))
    }
    const onBlockClicked = (student: Student) => {
        setModal(<BlockModal item={student} onCancel={onModalCancelClicked} />)
    }

    const onBlockMultiStudents = (student: Student[]) => {
        setModal(
            <BlockMultiStudentsModal
                onCancel={onModalCancelClicked}
                student={student}
            />
        )
    }

    const onSwitchOffFlag = (student: Student) => {
        setModal(
            <SwitchOffFlagModal
                onCancel={onModalCancelClicked}
                studentId={student?.id}
            />
        )
    }

    const tableActionOptions = (student: Student) => {
        return [
            {
                text: 'View',
                onClick: (student: any) => {
                    router.push(`/portals/admin/student/${student?.id}/detail`)
                    setLink('student', router)
                },
                Icon: FaEye,
            },
            {
                text: 'AI Voice Call',
                onClick: (student: Student) => {
                    handleOpenModal(AdminStudentModalType.AI_CALL, student)
                },
                Icon: () => <Phone className="w-3 h-3" />,
            },
            {
                text: 'Cancel',
                onClick: (student: Student) => {
                    onSwitchOffFlag(student)
                },
                Icon: FaFlag,
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
            cell: (info) => (
                <RtoCellInfo rto={info?.row?.original?.rto} short />
            ),
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
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: (info) => <SectorCell student={info.row.original} />,
        },
        {
            accessorKey: 'statusHistory',
            header: () => <span>Flag Comment</span>,
            cell: (info) => {
                return (
                    <Modal>
                        <Modal.Open>
                            <Button variant={'info'} text="View" outline />
                        </Modal.Open>
                        <Modal.Window name="flagged-student-comment">
                            <div className="p-5 flex flex-col justify-center items-center gap-y-4">
                                <Typography variant="title">
                                    Reported Comment
                                </Typography>
                                {info.row?.original?.statusHistory &&
                                info.row?.original?.statusHistory?.length >
                                    0 ? (
                                    <div className="flex gap-x-4 w-full h-full">
                                        <div
                                            className={`flex flex-col gap-y-1 ${
                                                info.row?.original
                                                    ?.statusHistory?.[
                                                    info.row?.original
                                                        ?.statusHistory
                                                        ?.length - 1
                                                ]?.response
                                                    ? 'w-1/2'
                                                    : 'w-full'
                                            }`}
                                        >
                                            <Typography
                                                variant="label"
                                                semibold
                                            >
                                                Coordinator Comment
                                            </Typography>
                                            <Typography variant="body">
                                                {info.row?.original
                                                    ?.statusHistory?.[
                                                    info.row?.original
                                                        ?.statusHistory
                                                        ?.length - 1
                                                ]?.comment ?? 'NA'}
                                            </Typography>
                                        </div>
                                        {info.row?.original?.statusHistory?.[
                                            info.row?.original?.statusHistory
                                                ?.length - 1
                                        ]?.response && (
                                            <>
                                                <div className="w-0.5 bg-gray-200 h-auto min-h-full mx-4"></div>
                                                <div className="flex flex-col gap-y-1 w-1/2">
                                                    <Typography
                                                        variant="label"
                                                        semibold
                                                    >
                                                        RTO Comment
                                                    </Typography>
                                                    <Typography variant="body">
                                                        {info.row?.original
                                                            ?.statusHistory?.[
                                                            info.row?.original
                                                                ?.statusHistory
                                                                ?.length - 1
                                                        ]?.response ?? 'NA'}
                                                    </Typography>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <NoData text="No Data found" />
                                )}
                            </div>
                        </Modal.Window>
                    </Modal>
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
                            onBlockClicked(student)
                        }}
                    >
                        Block
                    </ActionButton>
                </div>
            )
        },
        common: (student: Student[]) => (
            <ActionButton
                onClick={() => {
                    onBlockMultiStudents(student)
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
            <div className="flex flex-col gap-y-4">
                <div className="flex">
                    <PageHeading
                        title={'Flagged Students'}
                        subtitle={'List of Flagged Students'}
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
                            }: TableChildrenProps) => (
                                <div>
                                    <div
                                        ref={listingRef}
                                        onScroll={handleScroll}
                                        className="p-6 mb-2 flex justify-between"
                                    >
                                        {pageSize
                                            ? pageSize(
                                                  itemPerPage,
                                                  setItemPerPage,
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
                                                      setItemPerPage,
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
                            )}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Flagged Student!'}
                                description={'You have not flagged student'}
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
