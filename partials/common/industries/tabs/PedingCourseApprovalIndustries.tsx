import {
    Badge,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableChildrenProps,
    TechnicalError,
    Tooltip,
    UserCreatedAt,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'

import { RtoV2Api } from '@queries'
import { Industry, UserStatus } from '@types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

// hooks
import { UserRoles } from '@constants'
import { useActionModal } from '@hooks'
import { ellipsisText, getUserCredentials } from '@utils'
import {
    ApproveRejectConfirmationModal,
    UploadFacilityChecklistDialog,
    ViewDocumentModal,
} from '../modal'

export const PedingCourseApprovalIndustries = () => {
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)
    const [isRouting, setIsRouting] = useState(true)

    const user = getUserCredentials()
    const isLocal = process.env.NEXT_PUBLIC_NODE_ENV === 'local'
    const isAllowedUser = [4453, 78].includes(user?.id)
    const showActionButtons = isLocal || isAllowedUser

    const [actionModal, setActionModal] = useState<{
        isOpen: boolean
        action: 'approved' | 'rejected'
        id: number | null
    }>({
        isOpen: false,
        action: 'approved',
        id: null,
    })

    const [viewFileModal, setViewFileModal] = useState<{
        isOpen: boolean
        fileUrl: string
    }>({
        isOpen: false,
        fileUrl: '',
    })

    const [uploadModal, setUploadModal] = useState<{
        isOpen: boolean
        approval: any | null
    }>({
        isOpen: false,
        approval: null,
    })

    const onActionClick = (id: number, action: 'approved' | 'rejected') => {
        setActionModal({ isOpen: true, action, id })
    }

    const onViewFile = (fileUrl: string) => {
        setViewFileModal({ isOpen: true, fileUrl })
    }

    useEffect(() => {
        if (!isRouting) return
        const newPage = Number(router.query.page)
        const newItemPerPage = Number(router.query.pageSize)
        if (router.query.page) {
            setPage(newPage)
        }
        if (router.query.pageSize) {
            setItemPerPage(newItemPerPage)
        }
    }, [router])

    const { isLoading, isFetching, data, isError } =
        RtoV2Api.Industries.getPedingCourseApprovalIndustry({
            search: `status:${UserStatus.Approved}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const hasCourseApproved =
        data?.data &&
        data?.data?.length > 0 &&
        data?.data?.filter(
            (item: any) =>
                item.hasOwnProperty(item?.hasCourseApproved) &&
                !item?.hasCourseApproved
        )

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'industry.user.name',
            header: () => <span>Industry</span>,
            cell: (info) => {
                const industryId = info.row.original.industry?.id
                const role = getUserCredentials()?.role

                const handleNavigate = () => {
                    if (!industryId) return
                    if (role === UserRoles.ADMIN) {
                        router.push(`/portals/admin/industry/${industryId}`)
                    } else if (role === UserRoles.SUBADMIN) {
                        router.push(
                            `/portals/sub-admin/users/industries/${industryId}/detail`
                        )
                    }
                }

                return (
                    <div className="flex flex-col">
                        <span
                            className="font-bold cursor-pointer hover:text-primary transition-colors hover:underline"
                            onClick={handleNavigate}
                        >
                            {info.row.original.industry?.user?.name || 'N/A'}
                        </span>
                        <span className="text-xs text-gray-400">
                            {info.row.original.industry?.user?.email}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: 'course',
            header: () => <span>Course</span>,
            cell: (info) => (
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                        {info.row.original.course?.code}
                    </span>
                    <span className="text-sm font-medium">
                        {ellipsisText(info.row.original.course?.title, 25)}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'sector',
            header: () => <span>Sector</span>,
            cell: (info) => (
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                        {info.row.original.course?.sector?.code}
                    </span>
                    <span className="text-sm font-medium">
                        {ellipsisText(
                            info.row.original.course?.sector?.name,
                            25
                        )}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            cell: (info) => (
                <Badge
                    text={info.getValue() as string}
                    variant={
                        info.getValue() === 'pending'
                            ? 'warning'
                            : info.getValue() === 'approved'
                            ? 'success'
                            : 'error'
                    }
                    size="xs"
                    shape="pill"
                />
            ),
        },
        {
            accessorKey: 'file',
            header: () => <span>File</span>,
            cell: (info) => (
                <div className="group relative w-fit">
                    <Tooltip position={'center' as any}>
                        {info.getValue() ? 'View File' : 'No File Found'}
                    </Tooltip>
                    <Button
                        variant="primaryNew"
                        mini
                        Icon={Eye}
                        onClick={() => onViewFile(info.getValue() as string)}
                        disabled={!info.getValue()}
                    />
                </div>
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => (
                <div className="flex bg-white gap-x-2 w-fit">
                    {info.row.original.file && showActionButtons ? (
                        <>
                            <Button
                                variant="success"
                                className="!px-3 !py-1 text-[10px] 2xl:text-xs min-w-[60px]"
                                onClick={() =>
                                    onActionClick(
                                        info.row.original.id,
                                        'approved'
                                    )
                                }
                            >
                                Approve
                            </Button>
                            <Button
                                variant="error"
                                className="!px-3 !py-1 text-[10px] 2xl:text-xs min-w-[60px]"
                                onClick={() =>
                                    onActionClick(
                                        info.row.original.id,
                                        'rejected'
                                    )
                                }
                            >
                                Reject
                            </Button>
                        </>
                    ) : (
                        showActionButtons && (
                            <Button
                                variant="primaryNew"
                                className="!px-3 !py-1 text-[10px] 2xl:text-xs min-w-[120px]"
                                onClick={() =>
                                    setUploadModal({
                                        isOpen: true,
                                        approval: info.row.original,
                                    })
                                }
                            >
                                Manual E-sign Upload
                            </Button>
                        )
                    )}
                </div>
            ),
        },
    ]

    return (
        <>
            {actionModal.isOpen && actionModal.id && (
                <ApproveRejectConfirmationModal
                    open={actionModal.isOpen}
                    onOpenChange={(open) =>
                        setActionModal((prev) => ({ ...prev, isOpen: open }))
                    }
                    action={actionModal.action}
                    id={actionModal.id}
                />
            )}
            {uploadModal.isOpen && uploadModal.approval && (
                <UploadFacilityChecklistDialog
                    open={uploadModal.isOpen}
                    approval={uploadModal.approval}
                    onOpenChange={(open) =>
                        setUploadModal((prev) => ({ ...prev, isOpen: open }))
                    }
                />
            )}
            {viewFileModal.isOpen && (
                <ViewDocumentModal
                    open={viewFileModal.isOpen}
                    fileUrl={viewFileModal.fileUrl}
                    onOpenChange={(open) =>
                        setViewFileModal((prev) => ({ ...prev, isOpen: open }))
                    }
                />
            )}
            <div className="flex flex-col gap-y-4 mb-32">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data?.length ? (
                        <Table columns={columns} data={data.data}>
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
                                                (e) => {
                                                    setItemPerPage(e)
                                                    setIsRouting(false)
                                                },
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
                                    <div className=" overflow-x-scroll remove-scrollbar">
                                        <div className="px-6 w-full">
                                            {table}
                                        </div>
                                    </div>
                                    {data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    (e) => {
                                                        setItemPerPage(e)
                                                        setIsRouting(false)
                                                    },
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
                                title={'No Approved Industry!'}
                                description={
                                    'You have not approved any Industry request yet'
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
