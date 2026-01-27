import React, { useState } from 'react'
import { CommonApi } from '@queries'
import { LoadingAnimation, NoData, Table, TextInput } from '@components'
import { useAiVoiceCallsColumns } from './hooks/useAiVoiceCallsColumns'
import { Search } from 'lucide-react'
import { InitiateCallModal } from './modals'

export const AiVoiceCalls = () => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    const { data, isLoading, isError } =
        CommonApi.CallManagement.useGetStudentsToCallListQuery({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
            search,
        })

    const { columns, selectedStudent, setSelectedStudent } = useAiVoiceCallsColumns()

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">AI Voice Calls</h1>
                    <p className="text-sm text-gray-500">Manage and initiate AI voice calls to students.</p>
                </div>

                <div className="w-full md:w-96">
                    <TextInput
                        name={"filter"}
                        placeholder="Search students..."
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                    />
                </div>
            </div>

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
                                    <div className="overflow-x-auto">
                                        {table}
                                    </div>
                                </>
                            )}
                        </Table>
                    </>
                ) : (
                    !isError && <NoData text="No students found to call." />
                )}
            </div>

            <InitiateCallModal
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
            />
        </div>
    )
}
