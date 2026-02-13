import {
    Card,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    Table,
    TableAction,
    TechnicalError,
    TruncatedTextWithTooltip,
    Typography,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { FaEye } from 'react-icons/fa'

import { AdminApi } from '@queries'
import { Rto } from '@types'
import { checkListLength } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SectorCell } from '../rto/components'

export const InvoiceRtoList = () => {
    const router = useRouter()

    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    // hooks

    const { isLoading, isFetching, data, isError } =
        AdminApi.Invoice.invoiceRtosList(
            {
                search: ``,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: true,
            }
        )

    const tableActionOption = [
        {
            text: 'View',
            onClick: (rto: any) => {
                router.push(`/portals/admin/invoices/${rto?.id}`)
            },
            Icon: FaEye,
        },
    ]

    const columns: ColumnDef<Rto>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => (
                <Link href={`/portals/admin/invoices/${info?.row?.original?.id}`}>
                    {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                    }
                    <div className="flex items-center gap-x-2 relative z-10">
                        {info?.row?.original?.user?.name && (
                            <InitialAvatar
                                name={info?.row?.original?.user?.name}
                                imageUrl={info?.row?.original?.user?.avatar}
                            />
                        )}
                        <Typography
                            variant="label"
                            block
                            color={'cursor-pointer'}
                        >
                            {info?.row?.original?.user?.name}
                        </Typography>
                    </div>
                </Link>
            ),
            header: () => <span>Name</span>,
        },
        {
            accessorKey: 'rtoCode',
            header: () => <span>Code</span>,
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'students',
            header: () => <span>Students</span>,
            cell: (info) => info?.row?.original?.studentsCount,
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: (info) => (
                <SectorCell addCourses={false} rto={info.row.original} />
            ),
        },
        {
            accessorKey: 'suburb',
            header: () => <span>Address</span>,
            cell: (info) => (
                <TruncatedTextWithTooltip
                    text={info?.row?.original?.addressLine1}
                />
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: ({ row }: any) => (
                <div className="flex gap-x-1 items-center">
                    <TableAction
                        options={tableActionOption}
                        rowItem={row.original}
                        lastIndex={checkListLength<Rto>(
                            data?.data as Rto[]
                        )?.includes(row?.index)}
                    />
                </div>
            ),
        },
    ]

    return (
        <>
            <div className="flex flex-col gap-y-4 mb-32">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data?.length ? (
                        <Table<Rto> columns={columns} data={data?.data}>
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
                                        <div className="px-6 w-full overflow-x-scroll remove-scrollbar">
                                            {table}
                                        </div>
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Approved RTO!'}
                                description={
                                    'You have not approved any RTO request yet'
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
