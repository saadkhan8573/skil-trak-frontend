import { Button, Select, TextInput } from '@components'
import { FileText, Shield } from 'lucide-react'

export const DocumentFilter = ({
    setSearchQuery,
    setStatusFilter,
    setSelectedView,
    selectedView,
    onSendEmail,
    sendEmailOnIndustryChecksResult,
    isAnyDocument,
}: {
    selectedView: 'industry' | 'all' | 'course'
    setSearchQuery: (e: string) => void
    setSelectedView: (e: 'industry' | 'all' | 'course') => void
    setStatusFilter: (e: string) => void
    onSendEmail?: any
    sendEmailOnIndustryChecksResult?: any
    isAnyDocument?: boolean
}) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-4">
            <div className="flex items-center justify-between">
                {/* <div className="flex-1">
                    <TextInput
                        name="searchDocs"
                        placeholder="Search documents by name..."
                        // value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        showError={false}
                    />
                </div>
                <div className="w-60">
                    <Select
                        name="statusFilter"
                        showError={false}
                        options={[
                            { label: 'All Status', value: 'all' },
                            { label: 'Approved', value: 'approved' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Rejected', value: 'rejected' },
                            { label: 'Uploaded', value: 'uploaded' },
                        ]}
                        // value={statusFilter}
                        onChange={(opt: any) =>
                            setStatusFilter(opt?.value || 'all')
                        }
                        onlyValue
                    />
                </div> */}
                <div className="flex gap-2">
                    <Button
                        variant={
                            selectedView === 'all' ? 'primaryNew' : 'action'
                        }
                        onClick={() => setSelectedView('all')}
                        className={
                            selectedView === 'all'
                                ? 'bg-[#044866] hover:bg-[#0D5468]'
                                : ''
                        }
                    >
                        All
                    </Button>
                    <Button
                        variant={
                            selectedView === 'industry'
                                ? 'primaryNew'
                                : 'action'
                        }
                        onClick={() => setSelectedView('industry')}
                        className={
                            selectedView === 'industry'
                                ? 'bg-[#044866] hover:bg-[#0D5468]'
                                : ''
                        }
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        Industry
                    </Button>
                    <Button
                        variant={
                            selectedView === 'course' ? 'primaryNew' : 'action'
                        }
                        onClick={() => setSelectedView('course')}
                        className={
                            selectedView === 'course'
                                ? 'bg-[#044866] hover:bg-[#0D5468]'
                                : ''
                        }
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Course
                    </Button>
                </div>
                {isAnyDocument && selectedView === 'all' && (
                    <div className="flex justify-end">
                        <Button
                            text="Send Email"
                            onClick={onSendEmail}
                            loading={sendEmailOnIndustryChecksResult.isLoading}
                            disabled={sendEmailOnIndustryChecksResult.isLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
