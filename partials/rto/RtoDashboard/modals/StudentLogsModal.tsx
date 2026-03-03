import {
    GlobalModal,
    LoadingAnimation,
    NoData,
    TableChildrenProps,
    TechnicalError,
    Typography,
} from '@components'
import { RtoApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { Student } from '@types'
import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import moment from 'moment'
import { useRouter } from 'next/router'
import { UserRoles } from '@constants'
import { ellipsisText, getUserCredentials } from '@utils'
import { RtoProfileTable, UserDetail } from '@partials/admin'

export const StudentLogsModal = ({ onCancel }: { onCancel: () => void }) => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const role = getUserCredentials()?.role

    const router = useRouter()

    const { isLoading, isFetching, data, isError } = RtoApi.Rto.rtoStudentLogs(
        {
            limit: itemPerPage,
            skip: itemPerPage * page - itemPerPage,
        },
        { refetchOnMountOrArgChange: true }
    )

    const columns: ColumnDef<Student>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => (
                <div className="px-3 py-1 rounded bg-[#24556D1A]">
                    <Typography variant="label">
                        {ellipsisText(info.row.original?.studentId, 8)}
                    </Typography>
                </div>
            ),
            header: () => <span>Student ID</span>,
        },
        {
            accessorKey: 'student',
            cell: (info) => (
                <UserDetail
                    profile={{
                        ...info.row.original,
                        user: {
                            ...info.row.original?.user,
                            name: `${info.row.original?.user?.name} ${info.row.original?.familyName}`,
                        },
                    }}
                    onClick={() => {
                        if (role === UserRoles.ADMIN) {
                            router.push(
                                `/portals/admin/student/${info.row.original?.id}/detail`
                            )
                        } else if (role === UserRoles.SUBADMIN) {
                            router.push(
                                `/portals/sub-admin/students/${info.row.original?.id}/detail`
                            )
                        }
                    }}
                />
            ),
            header: () => <span>Student Detail</span>,
        },
        // {
        //     accessorKey: 'createdBy',
        //     cell: (info) => <UserDetail profile={info.row.original} />,
        //     header: () => <span>Created By</span>,
        // },
        {
            accessorKey: 'createdAt',
            cell: (info) => (
                <div>
                    <Typography variant="small" semibold>
                        {moment(info.row.original?.createdAt).format(
                            'DD/MM/YYYY'
                        )}
                    </Typography>
                </div>
            ),
            header: () => <span>Created Date</span>,
        },
        {
            accessorKey: 'assignTo',
            cell: (info) =>
                info.row.original?.subadmin ? (
                    <UserDetail
                        profile={info.row.original?.subadmin}
                        onClick={() => {
                            router.push({
                                pathname: `/portals/admin/sub-admin/${info.row?.original?.subadmin?.id}`,
                                query: { tab: 'history' },
                            })
                        }}
                    />
                ) : (
                    '---'
                ),
            header: () => <span>Assign To</span>,
        },
    ]

    return (
        <GlobalModal>
            <div className="w-full lg:min-w-[650px] px-4 py-3.5 flex justify-between items-center border-b border-secondary-dark">
                <Typography variant="label" semibold>
                    New Student Logs
                </Typography>
                <FaTimes
                    onClick={onCancel}
                    className="transition-all duration-500 text-2xl cursor-pointer hover:rotate-90"
                />
            </div>
            <div className="">
                <div className="py-3">
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[30vh]" />
                    ) : data?.data && data?.data?.length ? (
                        <div>
                            <RtoProfileTable
                                columns={columns}
                                data={data?.data}
                            >
                                {({
                                    table,
                                    pagination,
                                    pageSize,
                                    quickActions,
                                }: TableChildrenProps) => {
                                    return (
                                        <div>
                                            <div className="px-6 mb-1 flex justify-between">
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
                                            <div className="h-[95vh] lg:h-[450px] custom-scrollbar overflow-auto">
                                                <div className=" w-full">
                                                    {table}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }}
                            </RtoProfileTable>
                        </div>
                    ) : (
                        !isError && (
                            <NoData text="No Not Contactable Students Found" />
                        )
                    )}
                </div>
            </div>

            {/*  */}
        </GlobalModal>
    )
}
