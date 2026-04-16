import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'

// Link
// image
//Layouts
import { SubAdminLayout } from '@layouts'
import {
    NextPageWithLayout,
    PermissionType,
    Rto,
    SubAdminRtoFilterType,
} from '@types'

import { FaEye } from 'react-icons/fa'

//components
import {
    Card,
    EmptyData,
    Filter,
    LoadingAnimation,
    PageTitle,
    SubAdminRtoFilter,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    Typography,
    withPermission,
} from '@components'
// queries
import { useGetSubAdminRtosQuery } from '@queries'
// icons

import { getFilterQuery, setLink } from '@utils'
import { ColumnDef } from '@tanstack/react-table'
import { RTOCellInfo, SectorCell } from '@partials/sub-admin/rto/components'

const RTOs: NextPageWithLayout = () => {
    const router = useRouter()

    //filters
    const filterKeys = ['name', 'email', 'phone', 'code', 'courseId']
    const [filterAction, setFilterAction] = useState(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState<SubAdminRtoFilterType>(
        {} as SubAdminRtoFilterType
    )

    //filters
    useEffect(() => {
        const query = getFilterQuery<SubAdminRtoFilterType>({
            router,
            filterKeys: [],
        })
        setFilter(query as SubAdminRtoFilterType)
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const { isLoading, data, isError, isFetching } = useGetSubAdminRtosQuery({
        search: `${JSON.stringify(filter)
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const tableActionOptions: TableActionOption<RTOStudents>[] = [
        {
            text: 'View',
            onClick: (rto) => {
                router.push(
                    `/portals/sub-admin/users/rtos/${rto?.id}?tab=overview`
                )
                setLink('subadmin-rtos', router)
            },
            Icon: FaEye,
        },
    ]

    type RTOStudents = Rto & {
        students: number
    }

    const Columns: ColumnDef<RTOStudents>[] = [
        {
            header: () => 'Name',
            accessorKey: 'user',
            cell: ({ row }) => <RTOCellInfo rto={row.original} />,
        },
        {
            header: () => 'Package',
            accessorKey: 'package',
            cell: ({ row }) => {
                // const {package}:any = row.original
                return (
                    <div className="flex justify-center">
                        <Typography variant={'muted'} color={'gray'}>
                            {row?.original?.package?.name}
                        </Typography>
                    </div>
                )
            },
        },
        {
            header: () => 'Code',
            accessorKey: 'code',
            cell: ({ row }) => {
                const { rtoCode } = row.original
                return (
                    <div className="flex justify-center">
                        <Typography variant={'muted'} color={'gray'}>
                            {rtoCode}
                        </Typography>
                    </div>
                )
            },
        },
        {
            header: () => 'Students',
            accessorKey: 'students',
            cell: ({ row }) => (
                <Typography variant={'muted'} color={'gray'}>
                    {row.original?.students || 0}
                </Typography>
            ),
        },
        {
            header: () => 'Courses',
            accessorKey: 'courses',
            cell: (info) => <SectorCell rto={info.row.original} />,
        },
        {
            header: () => 'Address',
            accessorKey: 'address',
            cell: ({ row }) => (
                <Typography color={'black'}>
                    {row.original?.addressLine1}
                </Typography>
            ),
        },
        {
            header: () => 'Action',
            accessorKey: 'Action',
            cell: ({ row }) => {
                return (
                    <TableAction
                        options={tableActionOptions}
                        rowItem={row.original}
                    />
                )
            },
        },
    ]

    return (
        <>
            <div className="mb-6">
                <div className="px-4 mb-12">
                    <div className="flex justify-between items-center">
                        <PageTitle title={'RTOs'} backTitle={'Users'} />
                        <div className="flex justify-end mb-2">
                            {filterAction}
                        </div>
                    </div>
                    <Filter<SubAdminRtoFilterType>
                        component={SubAdminRtoFilter}
                        initialValues={filter}
                        setFilterAction={setFilterAction}
                        setFilter={setFilter}
                        filterKeys={filterKeys}
                    />
                </div>
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length ? (
                        <Table
                            columns={Columns}
                            data={data.data}
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
                                        <div className="px-6">{table}</div>
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No RTO were found!'}
                                description={'You have not any rto yet'}
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
RTOs.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(RTOs, {
    permissions: [PermissionType.MANAGE_RTOS],
})
