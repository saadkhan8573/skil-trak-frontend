import {
    ActionButton,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableChildrenProps,
    TechnicalError,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'

import { UserRoles } from '@constants'
import { CommonApi } from '@queries'
import { Student } from '@types'
import { Building2, Eye, FileText, User } from 'lucide-react'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'

export const PendingEsignDocuments = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router?.query?.page || 1))
        setItemPerPage(Number(router?.query?.pageSize || 50))
    }, [router])

    const pendingDocuments = CommonApi.ESign.usePendingDocumentsList(
        {
            status: 'pending',
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'document',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-destructive/10">
                        <FileText className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                        <p className="font-semibold">
                            {info?.row?.original?.template?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {info?.row?.original?.template?.folder?.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {info?.row?.original?.template?.course?.title}
                        </p>
                    </div>
                </div>
            ),
            header: () => <span>Document</span>,
        },
        {
            accessorKey: 'phone',
            header: () => <span>Student</span>,
            cell: (info) => {
                const student = info?.row?.original?.signers?.find(
                    (s: any) => s?.user?.role === UserRoles.STUDENT
                )
                return (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            {student?.user?.name}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: 'industryPartner',
            header: () => <span>Industry Partner</span>,
            cell: (info) => {
                const industry = info?.row?.original?.signers?.find(
                    (s: any) => s?.user?.role === UserRoles.INDUSTRY
                )
                return industry ? (
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{industry?.user?.name}</span>
                    </div>
                ) : (
                    '---'
                )
            },
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => (
                <Button
                    className="bg-gradient-to-r from-red-500 to-red-600"
                    onClick={() =>
                        router.push(
                            `/portals/rto/action-required/sign-documents/${info?.row?.original?.id}`
                        )
                    }
                >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview & Sign
                </Button>
            ),
        },
    ]

    return (
        <>
            {modal && modal}
            <div className="flex flex-col gap-y-4 mb-32">
                <Card noPadding>
                    {pendingDocuments?.isError && <TechnicalError />}
                    {pendingDocuments?.isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : pendingDocuments?.data &&
                      pendingDocuments?.data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={pendingDocuments?.data.data}
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
                                                    setItemPerPage,
                                                    pendingDocuments?.data?.data
                                                        ?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination &&
                                                    pagination(
                                                        pendingDocuments?.data
                                                            ?.pagination,
                                                        setPage
                                                    )}
                                            </div>
                                        </div>
                                        <div className="px-6">{table}</div>
                                        {pendingDocuments?.data?.data?.length >
                                            10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize &&
                                                    pageSize(
                                                        itemPerPage,
                                                        setItemPerPage,
                                                        pendingDocuments?.data
                                                            ?.data?.length
                                                    )}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination &&
                                                        pagination(
                                                            pendingDocuments
                                                                ?.data
                                                                ?.pagination,
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
                        <EmptyData
                            title={'No Pending Documents!'}
                            description={
                                'You have no pending e-sgn documents request yet'
                            }
                            height={'50vh'}
                        />
                    )}
                </Card>
            </div>
        </>
    )
}
