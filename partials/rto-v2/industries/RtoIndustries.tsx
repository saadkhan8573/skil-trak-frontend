import { useEffect, useState } from 'react'
// Layouts
import { RTOWorkplaceFormFilter } from '@types'
//components
import {
    Card,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    PageTitle,
    SetDetaultQueryFilteres,
    Table,
    TableAction,
    TechnicalError,
} from '@components'
// Links
import Link from 'next/link'
// Queries
import { useGetRTOWorkplacesQuery } from '@queries'
// Next Image
import { ColumnDef } from '@tanstack/react-table'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { ActionRequiredHeader } from '../components'
import { Building2 } from 'lucide-react'

const filterKeys = [
    'studentId',
    'name',
    'email',
    'location',
    'subAdminId',
    'industryId',
    'courseId',
]

export const RtoIndustries = () => {
    const router = useRouter()
    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<RTOWorkplaceFormFilter>(
        {} as RTOWorkplaceFormFilter
    )
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const userId = getUserCredentials()?.id

    const { isLoading, data, isError } = useGetRTOWorkplacesQuery({
        search: `${JSON.stringify(filter)
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const columns: ColumnDef<any>[] = [
        {
            header: () => 'Industry Name',
            accessorKey: 'name',
            cell: ({ row }: any) => {
                const {
                    phoneNumber,
                    user: { name, email, avatar },
                } = row.original

                return (
                    <Link
                        href={`/portals/rto/industries/workplaces/${row?.original?.id}`}
                        className="flex items-center gap-x-2"
                    >

                        <div className="shadow-inner-image rounded-full relative">
                            <InitialAvatar name={name} imageUrl={avatar} />
                        </div>
                        <div>
                            <p className="font-semibold">{name}</p>
                        </div>

                    </Link>
                );
            },
        },
        {
            header: () => 'Abn',
            accessorKey: 'abn',
        },

        {
            header: () => 'Address',
            accessorKey: 'address',
            cell: ({ row }) => {
                const { addressLine1, addressLine2 } = row.original
                return `${addressLine1} ${addressLine2}`
            },
        },
        {
            header: () => 'Action',
            accessorKey: 'Action',
            cell: ({ row }: any) => {
                return (
                    <TableAction
                        rowItem={row.original}
                        options={[
                            {
                                text: 'View',
                                onClick: () => {
                                    router.push(
                                        `/portals/rto/industries/workplaces/${row.original.id}`
                                    )
                                },
                                Icon: '',
                            },
                        ]}
                    />
                )
            },
        },
    ]

    return (
        <>
            <SetDetaultQueryFilteres
                filterKeys={filterKeys}
                setFilter={setFilter}
            />

            <ActionRequiredHeader
                urgentCount={11}
                icon={Building2}
                gradientTo="primaryNew"
                gradientFrom="primaryNew"
                title="Industry Partners"
                urgentLabel="Total Students"
                iconGradient="from-primaryNew to-primaryNew"
                description="Manage workplace partners and placement opportunities"
            />

            <Card noPadding>
                {isError && <TechnicalError />}
                {isLoading ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data?.data?.length ? (
                    <Table<any> columns={columns} data={data?.data}>
                        {({
                            table,
                            pagination,
                            pageSize,
                            quickActions,
                        }: any) => {
                            return (
                                <div>
                                    <div className="mb-2 flex justify-between">
                                        {pageSize(itemPerPage, setItemPerPage)}
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
                            title={'No Workplaces!'}
                            description={
                                'it seems that there is no workplace request'
                            }
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </>
    )
}
