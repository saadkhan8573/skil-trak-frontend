import {
    Card,
    EmptyData,
    LoadingAnimation,
    StudentExpiryDaysLeft,
    StudentJobId,
    Table,
    TableAction,
    TableChildrenProps,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye } from 'react-icons/fa'

import { RtoCellInfo } from '@partials/admin/rto/components'
import { AdminApi } from '@queries'
import { Student, UserStatus } from '@types'
import { checkListLength, setLink } from '@utils'
import { Phone } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
    ProgressCell,
    SectorCell,
    StudentCellInfo,
    StudentIndustries,
} from './components'
import { AdminStudentModalType, getAdminStudentsModal } from './modals'

// hooks
import { useModal } from '@hooks'

import moment from 'moment'

export const NoWorkplaceStudents = () => {
    const router = useRouter()
    // const [modal, setModal] = useState<ReactElement | null>(null)
    const [itemPerPage, setItemPerPage] = useState(30)
    const [isRouting, setIsRouting] = useState(true)
    const [page, setPage] = useState(1)

    const { modal, openModal, closeModal } = useModal()

    const handleOpenModal = (type: AdminStudentModalType, student: any) => {
        openModal(getAdminStudentsModal(type, student, closeModal))
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

    // admin/students/reported/list
    const { isLoading, isFetching, data, isError } =
        AdminApi.Students.useListQuery(
            {
                search: `status:${UserStatus.Approved},nowp:Na,hasIssue:${false},nonContactable:${false}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            { refetchOnMountOrArgChange: 30 }
        )

    const tableActionOptions = [
        {
            text: 'View',
            onClick: (student: any) => {
                router.push(`/portals/admin/student/${student?.id}/detail`)
                setLink('student', router)
            },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (student: Student) => {
                router.push(
                    `/portals/admin/student/edit-student/${student?.id}`
                )
            },
            Icon: FaEdit,
        },
        {
            text: 'AI Voice Call',
            onClick: (student: Student) => {
                handleOpenModal(AdminStudentModalType.AI_CALL, student)
            },
            Icon: () => <Phone className="w-3 h-3" />,
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
            cell: ({ row }) => <ProgressCell step={1} />,
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
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                const length = checkListLength<Student>(data?.data as Student[])

                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={tableActionOptions}
                            rowItem={info?.row?.original}
                            lastIndex={length.includes(info?.row?.index)}
                        />
                    </div>
                )
            },
        },
    ]

    return (
        <>
            {modal && modal}
            <div className="flex flex-col gap-y-4">
                <div className="flex">
                    <PageHeading
                        title={'No Workplace Students'}
                        subtitle={'List of No Workplace Students'}
                    />
                </div>
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length ? (
                        <Table
                            columns={columns}
                            data={data.data}
                            enableRowSelection
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: TableChildrenProps) => {
                                return (
                                    <div>
                                        <div className="p-6 mb-2 flex justify-between">
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
                                            <div className="px-6 w-full">
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
