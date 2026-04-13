import {
    ActionButton,
    Badge,
    Button,
    Card,
    ConfigTabs,
    EmptyData,
    LoadingAnimation,
    PageHeading,
    Table,
    TableAction,
    TableChildrenProps,
    TechnicalError,
    TruncatedTextWithTooltip,
    Typography,
} from '@components'
import { AdminApi } from '@queries'
import { PermissionFormType, PermissionType } from '@types'
import { useEffect, useMemo, useState } from 'react'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { categoryConfig, permissionMetadata } from './data'
import { DeletePermissionModal } from './modals/DeletePermissionModal'
import { PermissionModal } from './modals/PermissionModal'
import { Database } from 'lucide-react'

const PermissionTableTab = ({ data, columns }: any) => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)

    useEffect(() => {
        setPage(1)
    }, [data])

    const paginatedData = useMemo(() => {
        const start = (page - 1) * itemPerPage
        return data.slice(start, start + itemPerPage)
    }, [data, page, itemPerPage])

    const paginationData = {
        totalPage: Math.ceil(data.length / itemPerPage) || 1,
        currentPage: page,
        hasNext: page < Math.ceil(data.length / itemPerPage),
        hasPrevious: page > 1,
    }

    if (!data.length) {
        return (
            <EmptyData
                title="No Permissions Found!"
                description="There are no permissions in this section."
                height="40vh"
            />
        )
    }

    return (
        <div className="bg-white rounded-lg pt-4 border-0">
            <Table columns={columns} data={paginatedData}>
                {({ table, pagination, pageSize }: TableChildrenProps) => (
                    <div>
                        <div className="px-6 mb-2 flex justify-between">
                            {pageSize &&
                                pageSize(
                                    itemPerPage,
                                    setItemPerPage,
                                    paginatedData?.length
                                )}
                            <div className="flex gap-x-2">
                                {pagination &&
                                    pagination(paginationData as any, setPage)}
                            </div>
                        </div>
                        <div className="overflow-x-auto remove-scrollbar">
                            <div className="px-6 w-full">{table}</div>
                        </div>
                        {data.length > 10 && (
                            <div className="px-6 mb-2 flex justify-between">
                                {pageSize &&
                                    pageSize(
                                        itemPerPage,
                                        setItemPerPage,
                                        data.length
                                    )}
                                <div className="flex gap-x-2">
                                    {pagination &&
                                        pagination(
                                            paginationData as any,
                                            setPage
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Table>
        </div>
    )
}

export const PermissionList = () => {
    const [modal, setModal] = useState<React.ReactNode>(null)

    const { data, isLoading, isFetching, isError } =
        AdminApi.Permissions.useListQuery({
            skip: 0,
            limit: 2000,
        })
    const onAddPermission = () => {
        setModal(<PermissionModal onCancel={() => setModal(null)} />)
    }

    const onEditPermission = (permission: any) => {
        setModal(
            <PermissionModal
                edit
                permission={permission}
                onCancel={() => setModal(null)}
            />
        )
    }

    const onDeletePermission = (permission: any) => {
        setModal(
            <DeletePermissionModal
                permission={permission}
                onCancel={() => setModal(null)}
            />
        )
    }

    const columns: any[] = [
        {
            accessorKey: 'name',
            id: 'name',
            header: () => <span>Name</span>,
        },
        {
            accessorKey: 'code',
            id: 'code',
            header: () => <span>Code</span>,
            cell: (info: any) => (
                <div className="flex">
                    <Badge variant="primaryNew" text={info.getValue()} />
                </div>
            ),
        },
        {
            accessorKey: 'description',
            id: 'description',
            header: () => <span>Description</span>,
            cell: (info: any) => (
                <TruncatedTextWithTooltip text={info.getValue() || 'N/A'} />
            ),
        },
        {
            id: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => {
                const permission = info.row.original
                const actions = [
                    {
                        text: 'Edit',
                        Icon: FaEdit,
                        onClick: () => onEditPermission(permission),
                    },
                    {
                        text: 'Delete',
                        Icon: FaTrash,
                        color: 'text-red-500 hover:bg-red-100',
                        onClick: () => onDeletePermission(permission),
                    },
                ]
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction options={actions} rowItem={permission} />
                    </div>
                )
            },
        },
    ]

    const groupedData = useMemo(() => {
        if (!data?.data) return { all: [] }
        const groups: Record<string, any[]> = { all: data.data, other: [] }

        Object.keys(categoryConfig).forEach((k) => {
            groups[k] = []
        })

        data.data.forEach((perm: any) => {
            const meta = permissionMetadata[perm.code as PermissionType]
            if (meta && meta.category && groups[meta.category]) {
                groups[meta.category].push(perm)
            } else {
                groups.other.push(perm)
            }
        })

        return groups
    }, [data])

    const tabsConfig = useMemo(() => {
        const createTabComponent = (tabData: any[]) => {
            const TabComponent = (props: any) => (
                <PermissionTableTab {...props} data={tabData} />
            )
            TabComponent.displayName = 'TabComponent'
            return TabComponent
        }

        const tabs: any[] = [
            {
                label: 'All Permissions',
                value: 'all',
                icon: Database,
                component: createTabComponent(groupedData.all),
                count: groupedData.all.length,
            },
        ]

        Object.entries(categoryConfig).forEach(
            ([key, config]: [string, any]) => {
                if (groupedData[key] && groupedData[key].length > 0) {
                    tabs.push({
                        label: config.label,
                        value: key,
                        icon: config.icon,
                        component: createTabComponent(groupedData[key]),
                        count: groupedData[key].length,
                    })
                }
            }
        )

        if (groupedData.other && groupedData.other.length > 0) {
            tabs.push({
                label: 'Other',
                value: 'other',
                component: createTabComponent(groupedData.other),
                count: groupedData.other.length,
            })
        }

        return tabs
    }, [groupedData])

    return (
        <>
            {modal}
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading title="Permissions Management">
                    <Button
                        variant="primaryNew"
                        Icon={FaPlus}
                        onClick={onAddPermission}
                    >
                        Add Permission
                    </Button>
                </PageHeading>
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data.data?.length ? (
                        <div className="p-4">
                            <ConfigTabs tabs={tabsConfig} props={{ columns }} />
                        </div>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Permissions Found!'}
                                description={
                                    'There are no permissions created yet. Click "Add Permission" to create one.'
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
