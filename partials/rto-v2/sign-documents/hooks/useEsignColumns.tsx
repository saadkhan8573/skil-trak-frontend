import { Button } from '@components'
import { UserRoles } from '@constants'
import { DownloadEsignDocument } from '@partials/eSign'
import { ellipsisText, getFilteredColumns, getUserCredentials } from '@utils'
import { ColumnDef } from '@tanstack/react-table'
import { Building2, Eye, FileText, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import moment from 'moment'

export type EsignColumnKey =
    | 'document'
    | 'student'
    | 'industryPartner'
    | 'status'
    | 'signDate'
    | 'action'

interface UseEsignColumnsOptions {
    columnKeys?: EsignColumnKey[]
    removeColumnKeys?: EsignColumnKey[]
    isSigned?: boolean
}

export const useEsignColumns = (options?: UseEsignColumnsOptions) => {
    const router = useRouter()
    const { isSigned } = options || {}

    const credentials = getUserCredentials()

    const allColumns: ColumnDef<any>[] = useMemo(
        () => [
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
                accessorKey: 'student',
                header: () => <span>Student</span>,
                cell: (info) => {
                    const student = info?.row?.original?.signers?.find(
                        (s: any) => s?.user?.role === UserRoles.STUDENT
                    )
                    return (
                        <Link
                            href={`/portals/rto/students-and-placements/all-students/${student?.user?.student?.id}/detail`}
                            className="flex items-center gap-2"
                        >
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-700">
                                    {ellipsisText(
                                        info?.row?.original?.student?.studentId,
                                        8
                                    )}
                                </span>
                                <span className="text-sm font-medium">
                                    {student?.user?.name}{' '}
                                    {student?.user?.student?.familyName || ''}
                                </span>
                            </div>
                        </Link>
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
                            <span className="text-sm font-semibold">
                                {industry?.user?.name}
                            </span>
                        </div>
                    ) : (
                        '---'
                    )
                },
            },
            {
                accessorKey: 'status',
                header: () => <span>Status</span>,
                cell: (info) => (
                    <span className="capitalize text-sm font-medium">
                        {info?.row?.original?.signers?.find(
                            (s: any) => s?.user?.id === credentials?.id
                        )?.status || '--'}
                    </span>
                ),
            },
            {
                accessorKey: 'signDate',
                header: () => <span>RTO Sign Date</span>,
                cell: (info) => {
                    const signDate = info?.row?.original?.template?.tabs?.find(
                        (s: any) => s?.role === UserRoles.RTO
                    )?.responses?.[0]?.createdAt
                    return (
                        <span className="capitalize text-sm font-medium">
                            {signDate && isSigned ? moment(signDate).format('DD/MM/YYYY hh:mm A') : '--'}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'action',
                header: () => <span>Action</span>,
                cell: (info) =>
                    isSigned || info?.row?.original?.signers?.find(
                        (s: any) => s?.user?.id === credentials?.id
                    )?.status === "signed" ? (
                        <div className="flex items-center gap-x-2">
                            <Button
                                variant="primaryNew"
                                onClick={() =>
                                    router.push(
                                        `/portals/rto/action-required/sign-documents/${info?.row?.original?.id}`
                                    )
                                }
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                View Document
                            </Button>
                            <DownloadEsignDocument
                                variant="action"
                                text="Download"
                                docId={info?.row?.original?.id}
                            />
                        </div>
                    ) : (
                        <Button
                            className="bg-linear-to-r from-red-500 to-red-600"
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
        ],
        [router, isSigned]
    )

    const columns = useMemo(
        () => getFilteredColumns(allColumns, options),
        [allColumns, options]
    )

    return {
        columns,
    }
}
