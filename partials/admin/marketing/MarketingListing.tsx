import {
    Card,
    EmptyData,
    InitialAvatar,
    Table,
    TableAction,
    TableChildrenProps,
    TableSkeleton,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AdminApi } from '@queries'
import { User, UserStatus } from '@types'
import { RiLockPasswordFill } from 'react-icons/ri'
import { useActionModal } from '@hooks'

export const MarketingListing = () => {
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [isRouting, setIsRouting] = useState(true)

    const { passwordModal, onViewPassword } = useActionModal()

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
        AdminApi.Marketing.useMarketingUsers(
            {
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: true,
            }
        )

    const tableActionOptions = [{
        text: 'View Password',
        onClick: (marketing: any) => {
            onViewPassword({ user: marketing })
        },
        Icon: RiLockPasswordFill,
    }]

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'name',
            cell: (info) => (
                <div className='flex items-center gap-x-2'>
                    <InitialAvatar name={info?.row?.original?.name} />
                    <Typography variant='label' semibold>{info?.row?.original?.name}</Typography>
                </div>
            ),
            header: () => <span>Name</span>,
        },
        {
            accessorKey: 'email',
            header: () => <span>Email</span>,
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            cell: (info) => (
                <Typography variant="small" uppercase>
                    <span className={`font-semibold ${info.getValue() === UserStatus.Approved ? 'text-success' : 'text-warning'
                        }`}>
                        {info.getValue() as string}
                    </span>
                </Typography>
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={tableActionOptions}
                            rowItem={info?.row?.original}
                        />
                    </div>
                )
            },
        },
    ]

    return (
        <div className="flex flex-col gap-y-4 mb-32 p-6">
            {passwordModal}
            <PageHeading title="Marketing Users" subtitle='List of All Marketing Users' />
            <Card noPadding>
                {isError && <TechnicalError />}
                {isLoading || isFetching ? (
                    <TableSkeleton arrayLength={itemPerPage} />
                ) : data?.data && data?.data?.length ? (
                    <Table
                        columns={columns as any}
                        data={data?.data}
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
                                    <div className="overflow-x-auto remove-scrollbar">
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
                            )
                        }}
                    </Table>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Marketing Users Found!'}
                            description={'There are no marketing users to display.'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}
