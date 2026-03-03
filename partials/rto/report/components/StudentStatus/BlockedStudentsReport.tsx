import {
    ActionButton,
    AuthorizedUserComponent,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    NoData,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { UserRoles } from '@constants'
import { RtoApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { ReportOptionsEnum } from '@types'
import { ellipsisText } from '@utils'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Waypoint } from 'react-waypoint'
export const BlockedStudentsReport = ({ user }: { user?: number }) => {
    const [renderComponent, setRenderComponent] = useState(false)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const router = useRouter()
    const { data, isLoading, isError } =
        RtoApi.Students.useBlockedStudentsReport(
            {
                user,
                limit: itemPerPage,
                skip: itemPerPage * page - itemPerPage,
            },
            { skip: !renderComponent }
        )
    const columns: ColumnDef<any>[] = [
        {
            header: () => <span>Name</span>,
            accessorKey: 'user',
            cell: (info: any) => {
                return (
                    <a className="flex items-center gap-x-2">
                        {info?.row?.original?.user?.name && (
                            <InitialAvatar
                                name={info?.row?.original?.user?.name}
                                imageUrl={info?.row?.original?.user?.avatar}
                            />
                        )}
                        <div className="flex flex-col">
                            <span>
                                {ellipsisText(
                                    info?.row?.original?.studentId,
                                    8
                                )}
                            </span>
                            <span>{info?.row?.original?.user?.name}</span>
                        </div>
                    </a>
                )
            },
        },
        {
            accessorKey: 'email',
            header: () => <span>Email</span>,
            cell: (info) => {
                return <span>{info?.row?.original?.user?.email}</span>
            },
        },
        {
            accessorKey: 'phone',
            header: () => <span>Phone</span>,
        },
        {
            accessorKey: 'courses',
            header: () => <span>Courses</span>,
            cell: (info) => {
                // return info?.row?.original?.courses?.map((c: Course) => (
                //     <CourseDot key={c?.id} course={c} />
                // ))
                return (
                    <span>
                        {info?.row?.original?.courses[0]?.title || 'N/A'}
                    </span>
                )
            },
        },
    ]
    const count = data?.pagination?.totalResult
    const handleEnter = () => {
        setRenderComponent(true)
    }
    const handleLeave = () => {
        setRenderComponent(false)
    }
    return (
        <Waypoint onLeave={handleLeave} onEnter={handleEnter}>
            <div>
                <div className="flex justify-between items-center">
                    <div className="">
                        <Typography variant="title" color="text-gray-400">
                            Blocked Students
                        </Typography>
                        <Typography variant="h3">{count || 0}</Typography>
                    </div>

                    <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                        <ActionButton
                            onClick={() => {
                                router.push(
                                    `/portals/admin/rto/${router.query?.id}/${ReportOptionsEnum.BLOCKED_STUDENTS}`
                                )
                            }}
                        >
                            View Full List
                        </ActionButton>
                    </AuthorizedUserComponent>
                    <AuthorizedUserComponent roles={[UserRoles.SUBADMIN]}>
                        <ActionButton
                            onClick={() => {
                                router.push(
                                    `/portals/sub-admin/users/rtos/${router.query?.id}/${ReportOptionsEnum.BLOCKED_STUDENTS}`
                                )
                            }}
                        >
                            View Full List
                        </ActionButton>
                    </AuthorizedUserComponent>
                    <AuthorizedUserComponent roles={[UserRoles.RTO]}>
                        <ActionButton
                            onClick={() => {
                                router.push(
                                    `/portals/rto/report/${ReportOptionsEnum.BLOCKED_STUDENTS}`
                                )
                            }}
                        >
                            View Full List
                        </ActionButton>
                    </AuthorizedUserComponent>
                </div>
                {isError && <TechnicalError />}
                {isLoading ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data?.data && data?.data?.length ? (
                    <Table columns={columns} data={data?.data}>
                        {({
                            table,
                            pagination,
                            pageSize,
                            quickActions,
                        }: any) => {
                            return (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize(itemPerPage, setItemPerPage)}
                                        <div className="flex gap-x-2">
                                            {/* {quickActions} */}
                                            {pagination(
                                                data?.pagination,
                                                setPage
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6">{table}</div>
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !isError && <NoData text="No Blocked Students Found" />
                )}
            </div>
        </Waypoint>
    )
}
