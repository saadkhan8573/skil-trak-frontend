import { Badge, Card, LoadingAnimation, NoData, Table } from '@components'
import { SubAdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { CallLog } from '@types'
import moment from 'moment'
import { useState } from 'react'
import { CallActions } from './CallActions'

export const CallLogTab = ({ studentId }: { studentId: number }) => {
    const [loadingRowId, setLoadingRowId] = useState<number | null>(null)
    const callLogs = SubAdminApi.Student.useGetStudentCallLog(studentId, {
        skip: !studentId,
    })

    const callHistoryColumns: ColumnDef<CallLog>[] = [
        {
            accessorKey: 'date',
            header: 'Date',
            cell: (info) => (
                <span className="whitespace-pre">
                    {moment(info.row?.original?.createdAt).format(
                        'Do MMM YYYY'
                    )}
                </span>
            ),
        },
        {
            accessorKey: 'time',
            header: 'Time',
            cell: (info) => (
                <span className="whitespace-pre">
                    {moment(info.row?.original?.createdAt).format('hh:mm:ss a')}
                </span>
            ),
        },
        {
            accessorKey: 'with',
            header: 'Contact',
            cell: (info) => (
                <span className="text-slate-900">
                    {info.row?.original?.calledBy?.name}
                </span>
            ),
        },

        {
            accessorKey: 'type',
            header: 'Type',
            cell: () => <Badge variant={'info'} text={'Outgoing'} outline />,
        },
        {
            accessorKey: 'Action',
            header: 'Action',
            cell: (info) => {
                const rowId = info.row?.original?.id
                return (
                    <CallActions
                        rowId={rowId}
                        loadingRowId={loadingRowId}
                        setLoadingRowId={setLoadingRowId}
                        callLog={info.row?.original}
                    />
                )
            },
        },
    ]
    return (
        <>
            <Card border>
                {callLogs?.isError ? (
                    <NoData isError text="There is some technical error!" />
                ) : null}

                {callLogs?.isLoading ? (
                    <div className="flex justify-center py-10">
                        <LoadingAnimation />
                    </div>
                ) : callLogs?.isSuccess &&
                  callLogs?.data &&
                  callLogs?.data?.length > 0 ? (
                    <Table
                        columns={callHistoryColumns}
                        data={callLogs.data || []}
                    >
                        {({ table }) => <div>{table}</div>}
                    </Table>
                ) : (
                    callLogs?.isSuccess && <NoData text="No Call Logs Found!" />
                )}
            </Card>
        </>
    )
}
