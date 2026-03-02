// useDepartmentCoursesRequestList
import {
    Badge,
    Button,
    Card,
    CourseApporovalReqFilter,
    EmptyData,
    Filter,
    LoadingAnimation,
    SetDetaultQueryFilteres,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { SubAdminLayout } from '@layouts'
import Modal from '@modals/Modal'
import {
    ApproveCourseModal,
    RejectCourseModal,
    ViewCourseRequestDetailsModal,
} from '@partials/sub-admin'
import { SubAdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { CourseApprovalReqTypes, NextPageWithLayout } from '@types'
import { ellipsisText } from '@utils'
import Link from 'next/link'
import { ReactElement, useState } from 'react'
import { FaRegDotCircle } from 'react-icons/fa'
import { DataResponse } from '@redux/queryTypes'

export enum Status {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

const filterKeys = ['name', 'courseId', 'sectorId', 'abn', 'phone', 'email']

const CourseRequest: NextPageWithLayout = () => {
    const [itemPerPage, setItemPerPage] = useState<number>(50)
    const [page, setPage] = useState(1)
    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<CourseApprovalReqTypes>(
        {} as CourseApprovalReqTypes
    )

    const { data, isError, isLoading, isFetching } =
        SubAdminApi.SubAdmin.useDepartmentCoursesRequestList(
            {
                search: `${JSON.stringify(filter)
                    .replaceAll('{', '')
                    .replaceAll('}', '')
                    .replaceAll('"', '')
                    .trim()}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: true,
            }
        )

    const columns: ColumnDef<DataResponse>[] = [
        {
            accessorKey: 'industry.user',
            cell: (info) => (
                <Link
                    href={`/portals/sub-admin/users/industries/${info?.row?.original?.industry?.id}`}
                >
                    <Typography variant="small" semibold>
                        {ellipsisText(
                            info?.row?.original?.industry?.user?.name,
                            15
                        )}
                    </Typography>
                </Link>
            ),
            header: () => <span>Industry</span>,
        },
        {
            accessorKey: 'addedBy',
            cell: (info) => {
                return (
                    <div>
                        <Typography variant="small">
                            {ellipsisText(
                                info?.row?.original?.addedBy?.name,
                                15
                            )}
                        </Typography>
                    </div>
                )
            },
            header: () => <span>Requested By</span>,
        },
        {
            accessorKey: 'course',
            cell: (info) => {
                return (
                    <div>
                        <Typography variant="small">
                            {info?.row.original?.course?.title ?? 'NA'} -{' '}
                            {info?.row.original?.course?.code ?? 'N/A'}
                        </Typography>
                    </div>
                )
            },
            header: () => <span>Course</span>,
        },
        {
            accessorKey: 'course.sector',
            cell: (info) => {
                return (
                    <div>
                        <Typography variant="small">
                            {info?.row.original?.course?.sector?.name ?? 'NA'} -{' '}
                            {info?.row.original?.course?.sector?.code ?? 'N/A'}
                        </Typography>
                    </div>
                )
            },
            header: () => <span>Sector</span>,
        },
        {
            accessorKey: 'description',
            cell: (info) => (
                <Badge
                    text={info?.row?.original?.file ? 'Yes' : 'No'}
                    variant={info?.row?.original?.file ? 'success' : 'error'}
                />
            ),
            header: () => <span>File Uploaded</span>,
        },
        {
            accessorKey: 'status',
            cell: (info) => {
                return (
                    <div
                        className={`px-1.5 py-0.5 rounded-md border text-[10px] font-semibold text-center ${
                            info?.row.original?.status === Status.PENDING
                                ? 'bg-yellow-100 border-yellow-400 text-yellow-400'
                                : info?.row.original?.status === Status.APPROVED
                                  ? 'bg-green-100 border-green-400 text-green-400'
                                  : 'bg-red-100 border-red-400 text-red-400'
                        }`}
                    >
                        {info?.row.original?.status === Status.PENDING
                            ? 'PENDING'
                            : info?.row.original?.status === Status.APPROVED
                              ? 'APPROVED'
                              : 'REJECTED'}
                    </div>
                )
            },
            header: () => <span>Status</span>,
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => {
                return (
                    <div className="flex gap-x-1 items-center">
                        <Modal>
                            <Modal.Open opens="approveCourseRequest">
                                <Button
                                    disabled={
                                        info?.row?.original?.status !==
                                        Status.PENDING
                                    }
                                    variant="success"
                                    text="Approve"
                                />
                            </Modal.Open>
                            <Modal.Window name="approveCourseRequest">
                                <ApproveCourseModal
                                    request={info.row?.original}
                                />
                            </Modal.Window>
                        </Modal>
                        <Modal>
                            <Modal.Open opens="rejectCourseRequest">
                                <Button
                                    disabled={
                                        info?.row?.original?.status !==
                                        Status.PENDING
                                    }
                                    variant="error"
                                    text="Reject"
                                />
                            </Modal.Open>
                            <Modal.Window name="rejectCourseRequest">
                                <RejectCourseModal
                                    request={info?.row?.original}
                                />
                            </Modal.Window>
                        </Modal>
                    </div>
                )
            },
        },
    ]
    return (
        <div className="mb-5 ">
            <SetDetaultQueryFilteres<CourseApprovalReqTypes>
                filterKeys={filterKeys}
                setFilter={setFilter}
            />
            <div className="pr-14 py-4 flex flex-col gap-y-2">
                <div className="mb-3">
                    <Typography variant="small" bold>
                        This page lists all course requests associated with your
                        department sectors. The requests may originate from two
                        scenarios:
                    </Typography>
                </div>
                <div className="flex gap-x-3">
                    <div>
                        <FaRegDotCircle className="text-red-400" />
                    </div>
                    <Typography variant="small">
                        New Industry Course Requests: These requests are from
                        courses submitted during the initial signup of a new
                        industry.
                    </Typography>
                </div>
                <div className="flex gap-x-3">
                    <div>
                        <FaRegDotCircle className="text-red-400" />
                    </div>
                    <Typography variant="small">
                        Existing Industry New Course Requests: These requests
                        are from courses recently added by a coordinator to an
                        existing industry under this sector.
                    </Typography>
                </div>
                <div className="flex gap-x-3">
                    <Typography variant="muted" color="text-red-400">
                        Note:
                    </Typography>
                    <Typography variant="muted" color="text-red-400">
                        Please review the courses carefully and approve or
                        reject them individually. Ensuring the accuracy of the
                        provided details is crucial for maintaining the quality
                        of industry partnerships.
                    </Typography>
                </div>
            </div>

            <div className="mb-2">
                <div className="flex justify-end mb-2">{filterAction}</div>
                <Filter<CourseApprovalReqTypes>
                    component={CourseApporovalReqFilter}
                    initialValues={filter}
                    setFilterAction={setFilterAction}
                    setFilter={(e: any) => {
                        setPage(Number(1))
                        setFilter(e)
                    }}
                    filterKeys={filterKeys}
                />
            </div>
            {isError && <TechnicalError />}
            <Card>
                {isLoading || isFetching ? (
                    <LoadingAnimation />
                ) : data?.data && data?.data?.length ? (
                    <Table
                        columns={columns}
                        data={data?.data}
                        // quickActions={quickActionsElements}
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
                                    <div className="px-6  overflow-auto remove-scrollbar">
                                        {table}
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
                            title="No Course Request"
                            description="No course request found yet"
                        />
                    )
                )}
            </Card>
        </div>
    )
}

CourseRequest.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'Courses Request List' }}>
            {page}
        </SubAdminLayout>
    )
}

export default CourseRequest
