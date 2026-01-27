import React, { useState } from 'react'
import { CommonApi } from '@queries'
import { LoadingAnimation, NoData, Table } from '@components'
import { useCallColumns } from '../hooks/useCallColumns'
import { CallDetailModal, TicketModal, CompleteCallModal } from '../modal'
import { CallAudioModal } from '../modal/CallAudioModal'
import { removeEmptyValues } from '@utils'

export const AllCallList = ({ status }: { status?: 'completed' | 'pending' }) => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const { data, isLoading, isError } =
        CommonApi.CallManagement.useAllAiCallList({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
            search: `${JSON.stringify(
                removeEmptyValues({ status })
            )
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
        })

    const {
        columns,
        selectedCall,
        setSelectedCall,
        ticketModalCall,
        setTicketModalCall,
        audioModalCall,
        setAudioModalCall,
        completeModalCall,
        setCompleteModalCall
    } = useCallColumns()

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden !p-4">
            {isError && <NoData isError />}
            {isLoading ? (
                <LoadingAnimation />
            ) : data?.data && data?.data?.length > 0 ? (
                <>
                    <Table
                        columns={columns}
                        data={data?.data}
                    >
                        {({ pageSize, pagination, table }) => (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    {pageSize && pageSize(itemPerPage, setItemPerPage, data?.data?.length)}
                                    {pagination && pagination(data?.pagination, setPage)}
                                </div>
                                <div className="overflow-x-auto call-management-table">
                                    {table}
                                </div>
                            </>
                        )}
                    </Table>

                    {selectedCall && (
                        <CallDetailModal
                            call={selectedCall as any}
                            onClose={() => setSelectedCall(null)}
                        />
                    )}

                    {ticketModalCall && (
                        <TicketModal
                            call={ticketModalCall as any}
                            onClose={() => setTicketModalCall(null)}
                        />
                    )}

                    {audioModalCall && (
                        <CallAudioModal
                            call={audioModalCall}
                            onClose={() => setAudioModalCall(null)}
                        />
                    )}

                    {completeModalCall && (
                        <CompleteCallModal
                            call={completeModalCall}
                            onClose={() => setCompleteModalCall(null)}
                        />
                    )}
                </>
            ) : (
                !isError && <NoData text="No data found" />
            )}
        </div>
    )
}
