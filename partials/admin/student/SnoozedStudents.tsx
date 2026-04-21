import {
    Card,
    EmptyData,
    LoadingAnimation,
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
import { FaEdit, FaEye } from 'react-icons/fa'

import { useActionModal } from '@hooks'
import { RtoCellInfo } from '@partials/admin/rto/components'
import { UnSnoozeStudentModal } from '@partials/common/StudentProfileDetail/modals'
import { AdminApi } from '@queries'
import { Student } from '@types'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { RiLockPasswordFill } from 'react-icons/ri'
import { SectorCell, StudentCellInfo } from './components'

export const SnoozedStudents = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 30))
    }, [router])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const snoozedStudents = AdminApi.Students.useSnoozedStudents(
        {
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            skip: !itemPerPage || !page,
            refetchOnMountOrArgChange: 30,
        }
    )

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const UnSnoozeModal = (student: Student) => {
        setModal(
            <UnSnoozeStudentModal
                onCancel={onModalCancelClicked}
                student={student}
            />
        )
    }

    const tableActionOptions: TableActionOption<Student>[] = [
        {
            text: 'View',
            onClick: (student: any) => {
                router.push(`/portals/admin/student/${student?.id}/detail`)
            },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (row) => {
                router.push(`/portals/admin/student/edit-student/${row.id}`)
            },
            Icon: FaEdit,
        },
        {
            text: 'Un-Snooze',
            onClick: (student) => {
                UnSnoozeModal(student)
            },
            Icon: FaEdit,
        },
        {
            text: 'View Password',
            onClick: (student) => onViewPassword(student),
            Icon: RiLockPasswordFill,
        },
    ]

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
            cell: (info) => <StudentCellInfo student={info.row.original} />,
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'rto',
            header: () => <span>RTO</span>,
            cell: (info) => <RtoCellInfo rto={info.row.original.rto} short />,
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: (info) => <SectorCell student={info.row.original} />,
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: (info) => (
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
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => (
                <TableAction
                    options={tableActionOptions}
                    rowItem={info.row.original}
                />
            ),
        },
    ]

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading
                    title={'Snoozed Students'}
                    subtitle={'List of Snoozed Students'}
                />

                <Card noPadding>
                    {snoozedStudents?.isError && <TechnicalError />}
                    {snoozedStudents?.isLoading ||
                    snoozedStudents?.isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : snoozedStudents?.data?.data &&
                      snoozedStudents?.data?.data?.length &&
                      snoozedStudents?.isSuccess ? (
                        <Table
                            columns={columns}
                            data={snoozedStudents?.data?.data}
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                            }: TableChildrenProps) => (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize &&
                                            pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                snoozedStudents?.data?.data
                                                    ?.length
                                            )}
                                        <div className="flex gap-x-2">
                                            {pagination &&
                                                pagination(
                                                    snoozedStudents?.data
                                                        ?.pagination,
                                                    setPage
                                                )}
                                        </div>
                                    </div>
                                    <div
                                        className="px-6"
                                        id={'studentScrollId'}
                                    >
                                        {table}
                                    </div>
                                    {snoozedStudents?.data?.data?.length >
                                        10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    snoozedStudents?.data?.data
                                                        ?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {pagination &&
                                                    pagination(
                                                        snoozedStudents?.data
                                                            ?.pagination,
                                                        setPage
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Table>
                    ) : (
                        snoozedStudents?.isSuccess && (
                            <EmptyData
                                title={'No Snoozed Student!'}
                                description={
                                    'You have no Snoozed Student request yet'
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
