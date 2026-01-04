import {
    ActionButton,
    Badge,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableAction,
    TableActionOption,
    TableChildrenProps,
    TechnicalError,
    UserCreatedAt,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaTimes } from 'react-icons/fa'

import { AdminApi } from '@queries'
import { Industry, UserStatus } from '@types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MdBlock } from 'react-icons/md'
import { SectorCell } from './components'

// hooks
import { UserRoles } from '@constants'
import { useActionModal } from '@hooks'
import { ellipsisText, getUserCredentials } from '@utils'
import { RiLockPasswordFill } from 'react-icons/ri'
import { ProgressIndustryCell } from './components'
import { useActionModals } from './hooks'
import { FaCheck } from 'react-icons/fa6'

export const PartnerIndustries = () => {
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)
    const [isRouting, setIsRouting] = useState(true)

    const role = getUserCredentials()?.role
    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { modal, onArchiveClicked, onBlockClicked, onMultiBlockClicked } =
        useActionModals()

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
        AdminApi.Industries.useListQuery({
            search: `isPartner:${true},status:${UserStatus.Approved}`,
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

    const tableActionOptions: TableActionOption<Industry>[] = [
        {
            text: 'View',
            onClick: (industry: any) => {
                router.push(`/portals/admin/industry/${industry?.id}`)
            },
            Icon: FaEye,
        },
        {
            text: 'View Old Profile',
            onClick: (industry: any) =>
                router.push(
                    `/portals/admin/industry/${industry?.id}/old-detail`
                ),
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (row: any) => {
                router.push(`/portals/admin/industry/edit-industry/${row?.id}`)
            },
            Icon: FaEdit,
        },
        {
            ...(role === UserRoles.ADMIN
                ? {
                      text: 'View Password',
                      onClick: (industry: Industry) => onViewPassword(industry),
                      Icon: RiLockPasswordFill,
                  }
                : {}),
        },
        {
            text: 'Archive',
            onClick: (industry: Industry) => onArchiveClicked(industry),
            Icon: MdBlock,
            color: 'text-primary',
        },
        {
            text: 'Block',
            onClick: (industry: Industry) => onBlockClicked(industry),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

    const columns: ColumnDef<Industry>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => (
                <ProgressIndustryCell industry={info?.row?.original} />
            ),
            header: () => <span>Business Name</span>,
        },
        {
            accessorKey: 'abn',
            header: () => <span>ABN Number</span>,
        },
        {
            accessorKey: 'studentCount',
            header: () => <span>Students</span>,
        },
        {
            accessorKey: 'contactPerson',
            header: () => <span>Contact Person</span>,
            cell: (info) => {
                return (
                    <div>
                        <p>
                            {ellipsisText(
                                info?.row?.original?.contactPerson,
                                15
                            )}
                        </p>
                        <p className="text-xs text-gray-500">
                            {info?.row?.original?.contactPersonNumber}
                        </p>
                    </div>
                )
            },
        },
        {
            id: 'profileCompletionPercentage',
            accessorKey: 'profileCompletionPercentage',
            header: () => <span>Placement Status</span>,
            cell: ({ row }) => (
                <>
                    {Number(row?.original?.profileCompletionPercentage) ===
                    100 ? (
                        <Badge
                            variant={'primaryNew'}
                            text={'Placement Ready'}
                            Icon={FaCheck}
                        />
                    ) : (
                        <Badge
                            outline
                            Icon={FaTimes}
                            variant={'primaryNew'}
                            text={'Placement Not Ready'}
                            className="!whitespace-pre"
                        />
                    )}
                </>
            ),
        },
        {
            accessorKey: 'favouriteBy',
            header: () => <span>Favorite By</span>,
            cell: (info) => {
                const userName = info?.row?.original?.favoriteBy?.user?.name

                return (
                    <div className="flex items-center">
                        {userName ? (
                            <div className="relative px-3 py-1 bg-orange-100 text-orange-600  rounded-tl-lg rounded-br-lg clip-path-bookmark">
                                {userName}
                            </div>
                        ) : (
                            <span className="text-gray-400">—</span>
                        )}
                    </div>
                )
            },
        },
        // {
        //     accessorKey: 'sectors',
        //     header: () => <span>Sectors</span>,
        //     cell: (info) => <SectorCell industry={info?.row?.original} />,
        // },
        {
            accessorKey: 'channel',
            header: () => <span>Created By</span>,
            cell: (info) => (
                <div>
                    {info?.row?.original?.createdBy !== null ? (
                        <div className="bg-emerald-100 text-emerald-600 rounded-md px-2 py-0.5 flex items-center gap-x-1">
                            <p
                                title={info?.row?.original?.createdBy?.name}
                                className="text-xs whitespace-nowrap"
                            >
                                {ellipsisText(
                                    info?.row?.original?.createdBy?.name,
                                    14
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-x-1 bg-blue-100 text-blue-600 rounded-md px-2 py-0.5">
                            <p className="text-xs">
                                {info?.row?.original?.channel}
                            </p>
                        </div>
                    )}
                    <UserCreatedAt createdAt={info?.row?.original?.createdAt} />
                </div>
            ),
        },

        {
            accessorKey: 'action',
            header: () => <span>Manage</span>,
            cell: (info: any) => {
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={tableActionOptions}
                            rowItem={info.row.original}
                        />
                    </div>
                )
            },
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (id: Industry) => (
            <div className="flex gap-x-2">
                <ActionButton Icon={FaEdit}>Edit</ActionButton>
                <ActionButton Icon={MdBlock} variant="error">
                    Block
                </ActionButton>
            </div>
        ),
        common: (industries: Industry[]) => (
            <>
                {/* <ActionButton
                    onClick={() => {
                        const arrayOfIds = industries.map(
                            (id: any) => id?.user.id
                        )
                        bulkAction({
                            ids: arrayOfIds,
                            status: UserStatus.Pending,
                        })
                    }}
                    Icon={MdBlock}
                    variant="success"
                >
                    Pending
                </ActionButton> */}
                <ActionButton
                    onClick={() => {
                        onMultiBlockClicked(industries)
                    }}
                    Icon={MdBlock}
                    variant="error"
                >
                    Block
                </ActionButton>
            </>
        ),
    }

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={data.data}
                            quickActions={quickActionsElements}
                            hasCourseApproved={hasCourseApproved}
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
