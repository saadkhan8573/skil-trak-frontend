import {
    ActionButton,
    Button,
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    NoData,
    Table,
    TableAction,
    TableActionOption,
    TableChildrenProps,
    TechnicalError,
    Typography,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { FaComment, FaEdit, FaEye } from 'react-icons/fa'

import Modal from '@modals/Modal'
import { RtoApi, RtoV2Api } from '@queries'
import { Student } from '@types'
import { getUserCredentials, studentsListWorkplace } from '@utils'
import { saveAs } from 'file-saver'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { MdBlock, MdChangeCircle } from 'react-icons/md'
import { SectorCell, StudentCellInfo } from './components'
import { IndustryCell } from './components/IndustryCell'
import {
    AssignCoordinatorModal,
    BlockModal,
    DownloadListModal,
    ReportedStudentModal,
} from './modals'
import { AssignMultipleCoordinatorModal } from './modals/AssignMultipleCoordinatorModal'
import { Download } from 'lucide-react'
export const ReportedStudentsList = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [isExcelDownload, setIsExcelDownload] = useState<boolean>(false)
    const userId = getUserCredentials()?.id

    const exportList = RtoApi.Students.useExportStudentList(
        {
            status: `active`,
            userId,
        },
        { skip: !isExcelDownload }
    )

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const { isLoading, data, isError, refetch } =
        RtoApi.Students.useRtoReportedStudentsList({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    // Download excel
    useEffect(() => {
        if (exportList?.data?.file?.data && exportList?.isSuccess) {
            const buffer = Buffer.from(exportList.data.file.data)
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            saveAs(blob)
            setIsExcelDownload(false)
        }
    }, [exportList?.data, exportList?.isSuccess])

    useEffect(() => {
        if (exportList?.isError) {
            setIsExcelDownload(false)
        }
    }, [exportList?.isError])

    const onModalCancelClicked = () => setModal(null)

    const onBlockClicked = (student: Student) => {
        setModal(
            <BlockModal
                item={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onAssignCoordinatorClicked = (student: Student) => {
        setModal(
            <AssignCoordinatorModal
                studentId={student?.id}
                studentUser={student?.user}
                rtoCoordinatorId={student?.rtoCoordinator?.id}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onAddMultiStudentsCoordinatorClicked = (ids: number[]) => {
        setModal(
            <AssignMultipleCoordinatorModal
                ids={ids}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onAddOrEditComment = (student: Student) => {
        setModal(
            <ReportedStudentModal
                student={student}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const tableActionOptions = (
        student: Student
    ): TableActionOption<Student>[] => [
        {
            text: 'View',
            // onClick: (student) => {
            //     router.push(
            //         `/portals/rto/students-and-placements/all-students/${student.id}/detail`
            //     )
            // },
            onClick: (student: Student) => {
                router.push(`/portals/rto/students/${student.id}`)
            },
            Icon: FaEye,
        },

        {
            text: student.statusHistory?.[0]?.response
                ? 'Edit Comment'
                : 'Add Comment',
            onClick: (student) => onAddOrEditComment(student),
            Icon: FaComment,
        },
    ]

    const columns: ColumnDef<Student>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => (
                <StudentCellInfo
                    // link={`/portals/rto/students-and-placements/all-students/${info.row.original.id}/detail`}
                    student={info.row.original}
                    call
                />
            ),
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => {
                const industry = info.row.original?.industries

                const appliedIndustry = studentsListWorkplace(
                    info.row.original?.workplace
                )

                return industry && industry?.length > 0 ? (
                    <IndustryCell industry={industry[0]} />
                ) : info.row.original?.workplace &&
                  info.row.original?.workplace?.length > 0 &&
                  appliedIndustry ? (
                    <IndustryCell industry={appliedIndustry} />
                ) : (
                    <Typography center>N/A</Typography>
                )
            },
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: (info) => <SectorCell student={info.row.original} />,
        },
        {
            accessorKey: 'statusHistory',
            header: () => <span>Reported Comment</span>,
            cell: (info) => (
                <Modal>
                    <Modal.Open>
                        <Button variant={'info'} text="View" outline />
                    </Modal.Open>
                    <Modal.Window name="reportedComment">
                        <div className="p-5 flex flex-col justify-center items-center gap-y-4">
                            <Typography variant="title">
                                Reported Comment
                            </Typography>
                            {info.row?.original?.statusHistory &&
                            info.row?.original?.statusHistory?.length > 0 ? (
                                <div className="flex gap-x-4 w-full h-full">
                                    <div
                                        className={`flex flex-col gap-y-1 ${
                                            info.row?.original?.statusHistory?.[
                                                info.row?.original
                                                    ?.statusHistory?.length - 1
                                            ]?.response
                                                ? 'w-1/2'
                                                : 'w-full'
                                        }`}
                                    >
                                        <Typography variant="label" semibold>
                                            Coordinator Comment
                                        </Typography>
                                        <Typography variant="body">
                                            {info.row?.original
                                                ?.statusHistory?.[0]?.comment ??
                                                'NA'}
                                        </Typography>
                                    </div>
                                    {info.row?.original?.statusHistory?.[
                                        info.row?.original?.statusHistory
                                            ?.length - 1
                                    ]?.response && (
                                        <>
                                            <div className="w-[2px] bg-gray-200 h-auto min-h-full mx-4"></div>
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
            accessorKey: 'assigned',
            header: () => <span>Assigned Coordinator</span>,
            cell: ({ row }) =>
                row.original?.rtoCoordinator ? (
                    <div>
                        <Typography variant="label">
                            {row.original?.rtoCoordinator?.user?.name}
                        </Typography>
                        <Typography variant="small" color={'text-gray-400'}>
                            {row.original?.rtoCoordinator?.user?.email}
                        </Typography>
                        <Typography variant="small" color={'text-gray-400'}>
                            {row.original?.rtoCoordinator?.phone}
                        </Typography>
                    </div>
                ) : (
                    '----'
                ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                const tableActionOption = tableActionOptions(info.row.original)
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={tableActionOption}
                            rowItem={info.row.original}
                        />
                    </div>
                )
            },
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (student: Student) => (
            <div className="flex gap-x-2">
                <ActionButton
                    Icon={FaEdit}
                    onClick={() => {
                        router.push(
                            `portals/rto/students/${student?.id}/edit-student`
                        )
                    }}
                >
                    Edit
                </ActionButton>
                <ActionButton
                    Icon={MdBlock}
                    onClick={() => {
                        onBlockClicked(student)
                    }}
                    variant="error"
                >
                    Block
                </ActionButton>
                <ActionButton
                    Icon={MdChangeCircle}
                    variant="info"
                    onClick={() => {
                        onAssignCoordinatorClicked(student)
                    }}
                >
                    {student?.rtoCoordinator
                        ? 'Change Coordinator'
                        : 'Assign Coordinator'}
                </ActionButton>
            </div>
        ),
        common: (ids: Student[]) => (
            <ActionButton
                Icon={MdChangeCircle}
                variant="info"
                onClick={() => {
                    onAddMultiStudentsCoordinatorClicked(
                        ids?.map((stu: Student) => stu?.id)
                    )
                }}
            >
                Add Coordinator
            </ActionButton>
        ),
    }

    return (
        <>
            {modal}
            <div className="flex flex-col gap-y-3 mb-32">
                {/* <PageHeading
                    title={'Reported Students'}
                    subtitle={'List of Reported Students'}
                >
                    {data?.data && data?.data.length ? (
                        <Button
                            text={'Export'}
                            variant={'action'}
                            Icon={FaFileExport}
                            onClick={() => {
                                if (isBrowser()) {
                                    window.open(
                                        `${process.env.NEXT_PUBLIC_END_POINT}/rtos/students-list/download/${userId}?status=active`
                                    )
                                }
                            }}
                        />
                    ) : null}
                </PageHeading> */}

                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length ? (
                        <Table
                            columns={columns}
                            data={data.data}
                            quickActions={quickActionsElements}
                            enableRowSelection
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: TableChildrenProps) => (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize &&
                                            pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                data?.data?.length
                                            )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination &&
                                                pagination(
                                                    data?.pagination,
                                                    setPage
                                                )}
                                        </div>
                                    </div>
                                    <div className="px-6 overflow-auto custom-scrollbar">
                                        {table}
                                    </div>
                                    {data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    data?.data?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination &&
                                                    pagination(
                                                        data?.pagination,
                                                        setPage
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Reported Student!'}
                                description={'You have no reported student yet'}
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
