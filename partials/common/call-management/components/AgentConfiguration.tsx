import React, { useState } from 'react'
import { Table, Badge, Button } from '@components'
import { Plus, Power, Trash2, Search, Bot } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { AgentConfiguration as IAgentConfiguration } from './types'
import { AddAgentModal } from './modal/AddAgentModal'

export const AgentConfiguration = () => {
    const [agents, setAgents] = useState<IAgentConfiguration[]>([
        {
            id: '1',
            agentId: 'AI_Maria_1',
            name: 'Maria - Workplace Collection',
            callReason: 'Workplace Details Collection',
            actions: ['Collect Workplace Information', 'Request Missing Documents', 'Update Contact Information'],
            isActive: true,
        },
        {
            id: '2',
            agentId: 'AI_Maria_2',
            name: 'Maria - Document Follow-up',
            callReason: 'Document Verification',
            actions: ['Request Missing Documents', 'Schedule Follow-up Call', 'Update Contact Information'],
            isActive: true,
        },
    ])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const toggleAgent = (id: string) => {
        setAgents(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a))
    }

    const deleteAgent = (id: string) => {
        setAgents(prev => prev.filter(a => a.id !== id))
    }

    const handleAddAgent = (data: any) => {
        const newAgent: IAgentConfiguration = {
            id: Date.now().toString(),
            agentId: `AI_Agent_${Math.floor(Math.random() * 1000)}`,
            name: data.name,
            callReason: data.callReason,
            actions: data.actions,
            isActive: true
        }
        setAgents([newAgent, ...agents])
    }

    const filteredAgents = agents.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.callReason.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const columns: ColumnDef<IAgentConfiguration>[] = [
        {
            id: 'agent',
            header: 'Agent',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                        {row.original.name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-gray-900">{row.original.name}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-medium">ID: {row.original.agentId}</div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'callReason',
            header: 'Call Reason',
            cell: ({ row }) => (
                <Badge variant="accent" outline className="lowercase first-letter:uppercase">
                    {row.original.callReason}
                </Badge>
            )
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1 max-w-[300px]">
                    {row.original.actions.map((action, i) => (
                        <Badge key={i} variant="success" outline className="text-[10px] normal-case py-0 h-5">
                            {action}
                        </Badge>
                    ))}
                </div>
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
                        onClick={() => toggleAgent(row.original.id)}
                        title={row.original.isActive ? 'Deactivate' : 'Activate'}
                        className={`p-2 rounded-lg transition-all ${row.original.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                    >
                        <Power className={`w-4 h-4 ${row.original.isActive ? 'fill-green-600' : ''}`} />
                    </button>
                    <button
                        onClick={() => deleteAgent(row.original.id)}
                        title="Delete Agent"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
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
                        onClick={() => setIsModalOpen(true)}
                        text="Add Agent"
                        Icon={Plus}
                        className="bg-primaryNew text-white hover:opacity-90 shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <Table columns={columns} data={filteredAgents} pagination={false} pageSize={false}>
                    {({ table }) => (
                        <div className="overflow-x-auto">
                            {table}
                        </div>
                    )}
                </Table>

                {filteredAgents.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <Bot className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm">No agents found matching your search</p>
                    </div>
                )}
            </div>

            <AddAgentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddAgent}
            />
        </div>
    )
}
