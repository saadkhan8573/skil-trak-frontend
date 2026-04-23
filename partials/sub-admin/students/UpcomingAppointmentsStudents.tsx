import { useRouter } from 'next/router'

import {
    Card,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    StudentJobId,
    Table,
} from '@components'

import { TechnicalError } from '@components/ActionAnimations/TechnicalError'
import { SubAdminApi } from '@queries'
import { useEffect, useState } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { Student } from '@types'
import {
    filterAwaitingAgreementBeyondSevenDays,
    findCallLogsUnanswered,
    findExpiringInNext45Days,
} from '@utils'
import { StudentCallLogDetail } from './components'
import { useColumns } from './hooks'

export const UpcomingAppointmentsStudents = () => {
    const router = useRouter()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const { isLoading, isFetching, data, isError } =
        SubAdminApi.Student.getUpcomingAppointmentsStudents(
            {
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: 30,
            }
        )

    const { modal } = useColumns()
    const columns: ColumnDef<Student>[] = [
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
            cell: ({ row }: any) => (
                <StudentCallLogDetail
                    student={{
                        ...row.original?.appointmentFor?.student,
                        user: row.original?.appointmentFor,
                    }}
                    call
                />
            ),
        },
        {
            header: () => 'RTO',
            accessorKey: 'rto',
            cell({ row }: any) {
                const { rto } = row.original?.appointmentFor?.student

                return (
                    <div className="flex gap-x-2 items-center">
                        {rto?.user?.name && (
                            <InitialAvatar name={rto?.user?.name} small />
                        )}
                        {rto?.user?.name}
                    </div>
                )
            },
        },
        // {
        //     accessorKey: 'industry',
        //     header: () => <span>Industry</span>,
        //     cell: (info) => (
        //         <SubadminStudentIndustries
        //             workplace={info.row.original?.workplace}
        //             industries={info.row.original?.industries}
        //         />
        //     ),
        // },
        // {
        //     accessorKey: 'sectors',
        //     header: () => <span>Sectors</span>,
        //     cell: ({ row }: any) => <SectorCell student={row.original} />,
        // },
        // {
        //     accessorKey: 'expiry',
        //     header: () => <span>Expiry Countdown</span>,
        //     cell: (info) => (
        //         <StudentExpiryDaysLeft
        //             expiryDate={info.row.original?.expiryDate}
        //         />
        //     ),
        // },
        // {
        //     header: () => 'Progress',
        //     accessorKey: 'progress',
        //     cell: ({ row }) => (
        //         <CaseOfficerAssignedStudent student={row.original} />
        //     ),
        // },
        // {
        //     accessorKey: 'createdAt',
        //     header: () => <span>Created At</span>,
        //     cell: ({ row }: any) => (
        //         <UserCreatedAt createdAt={row.original?.createdAt} />
        //     ),
        // },
    ]
    // columns.splice(0, 1, {
    //     header: () => 'Name',
    //     accessorKey: 'user?.name',
    //     // cell: ({ row }) => (
    //     //     <Link
    //     //         className="flex items-center gap-x-2"
    //     //         href={{
    //     //             pathname: `/portals/sub-admin/students/${row?.original?.id}/detail`,
    //     //             query: {
    //     //                 sectionId: 'appointments',
    //     //             },
    //     //         }}
    //     //     >
    //     //         {/* <InitialAvatar
    //     //             name={row?.original?.user?.name}
    //     //             imageUrl={row?.original?.user?.avatar}
    //     //         /> */}
    //     //         {/* <Typography variant="label" cursorPointer>
    //     //             {row?.original?.user?.name}
    //     //         </Typography> */}
    //     //     </Link>
    //     // ),
    // })

    return (
        <div>
            {modal}
            <Card noPadding>
                {isError && <TechnicalError />}

                {isLoading || isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data?.data?.length ? (
                    <Table
                        columns={columns}
                        data={data?.data}
                        // quickActions={quickActionsElements}
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
                                            data?.data?.length
                                        )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination(
                                                data?.pagination,
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
                                    {data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    data?.pagination,
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
                    !isError && (
                        <EmptyData
                            title={'No Students'}
                            description={'You have not added any Student'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}
