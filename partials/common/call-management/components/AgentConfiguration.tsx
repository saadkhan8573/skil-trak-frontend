import { Badge, Button, DeleteConfirmationModal, EmptyData, LoadingAnimation, Table, TableChildrenProps, TechnicalError } from '@components'
import { CommonApi } from '@queries/common/common.query'
import { ColumnDef } from '@tanstack/react-table'
import { Bot, Edit, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { AddAgentModal } from './modal'
import { AgentConfigurationTypes } from '@types'

export const AgentConfiguration = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [agentToDeleteId, setAgentToDeleteId] = useState<number | null>(null)
    const [selectedAgent, setSelectedAgent] = useState<AgentConfigurationTypes | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const agents = CommonApi.CallManagement.useGetAgentsListQuery({
        search: `name:${searchTerm}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    },
        {
            refetchOnMountOrArgChange: true,
        })


    const columns: ColumnDef<AgentConfigurationTypes>[] = [
        {
            id: 'agent',
            header: 'Agent',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                        {row.original.name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-medium">ID: {row.original.vapiAgentId}</div>
                        <div className="text-sm font-semibold text-gray-900">{row.original.name}</div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'responsibility',
            header: 'Responsibility',
            cell: ({ row }) => (
                <Badge variant="accent" outline className="lowercase first-letter:uppercase">
                    {row.original.responsibility}
                </Badge>
            )
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${row.original.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                    <span className={`text-xs font-medium ${row.original.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                        {row.original.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            )
        },
        {
            id: 'rowOptions',
            header: () => <div className="text-right">Options</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => {
                            setSelectedAgent(row.original)
                            setIsModalOpen(true)
                        }}
                        title="Edit Agent"
                        className="p-2 text-gray-400 hover:text-primaryNew hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    {/* <button
                        onClick={() => {
                            setAgentToDeleteId(row.original.id)
                            setIsDeleteModalOpen(true)
                        }}
                        title="Delete Agent"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button> */}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Bot className="w-5 h-5 text-primaryNew" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 leading-none mb-1">Agent Configurations</h2>
                        <p className="text-xs text-gray-500">Manage AI voice agents and their specific interaction tasks</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryNew/20 focus:border-primaryNew w-full md:w-64 transition-all"
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setSelectedAgent(null)
                            setIsModalOpen(true)
                        }}
                        text="Add Agent"
                        Icon={Plus}
                        className="bg-primaryNew text-white hover:opacity-90 shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {agents?.isError && <TechnicalError />}
                {agents?.isLoading || agents?.isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : agents?.data?.data && agents?.data?.data?.length ? (
                    <Table
                        columns={columns}
                        data={agents?.data?.data}
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
                                                agents?.data?.data?.length
                                            )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination &&
                                                pagination(
                                                    agents?.data?.pagination!,
                                                    setPage
                                                )}
                                        </div>
                                    </div>
                                    <div className="px-6 overflow-auto custom-scrollbar">
                                        {table}
                                    </div>
                                    {agents?.data?.data && agents?.data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    agents?.data?.data?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination &&
                                                    pagination(
                                                        agents?.data?.pagination,
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
                    !agents?.isError && (
                        <EmptyData
                            title={'No Approved Student!'}
                            description={
                                'You have not approved any Student request yet'
                            }
                            height={'50vh'}
                        />
                    )
                )}

            </div>

            <AddAgentModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedAgent(null)
                }}
                agent={selectedAgent}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setAgentToDeleteId(null)
                }}
                id={agentToDeleteId}
            />
        </div>
    )
}
