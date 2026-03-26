import { GlobalModal } from '@components'
import { FileSpreadsheet, Upload, UserPlus, X } from 'lucide-react'
import React from 'react'
import { AddIndividualStudentTab, ImportStudentsTab } from './tabs'

export const ImportStudentsModal = ({ onCancel }: any) => {
    const [activeTab, setActiveTab] = React.useState<'import' | 'add'>('import')

    const tabs = [
        {
            key: 'import',
            label: 'Import List',
            icon: FileSpreadsheet,
            color: 'from-[#044866] to-[#0C648A]',
            content: <ImportStudentsTab onCancel={onCancel} />,
        },
        {
            key: 'add',
            label: 'Add Individual',
            icon: UserPlus,
            color: 'from-[#044866] to-[#0C648A]',
            content: <AddIndividualStudentTab onCancel={onCancel} />,
        },
    ]

    const currentTab = tabs.find((tab) => tab.key === activeTab)

    return (
        <GlobalModal>
            <div className="p-4 max-w-3xl ">
                {/* Header */}
                <div className="flex justify-end">
                    <X onClick={onCancel} className="cursor-pointer" />
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-br from-[#044866] to-[#044866] rounded-xl blur opacity-30"></div>
                        <div className="relative h-10 w-10 rounded-xl bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-premium">
                            <Upload className="h-5 w-5 text-white" />
                            <div className="absolute inset-0 rounded-xl bg-linear-to-t from-white/0 to-white/20"></div>
                        </div>
                    </div>
                    <span className="text-xl font-medium">Import Students</span>
                </div>

                <p className="text-gray-400 mt-3">
                    Import students by uploading a file or add individual
                    students manually
                </p>

                {/* Tabs */}
                <div className="max-w-full custom-scrollbar overflow-auto mt-4">
                    <div className="flex justify-center gap-x-4">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.key
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() =>
                                        setActiveTab(
                                            tab.key as 'import' | 'add'
                                        )
                                    }
                                    className={`flex items-center gap-2 px-16 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? `text-white bg-linear-to-r ${tab.color} shadow-md`
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    <Icon className="size-4" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-4 h-[60vh] overflow-auto">
                    {currentTab?.content}
                </div>
            </div>
        </GlobalModal>
    )
}
