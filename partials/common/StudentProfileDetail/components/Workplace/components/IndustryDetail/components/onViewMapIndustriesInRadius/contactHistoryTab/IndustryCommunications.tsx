import { NoData } from '@components'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { CallItemCard, EmailItemCard } from './cards'

// Types based on your data structure
export interface User {
    id: number
    name: string
    email: string
    role: string
}

export interface Industry {
    id: number
    businessName?: string
    contactPerson?: string
    addressLine1?: string
    suburb?: string
    state?: string
    phoneNumber?: string
    user: User
    studentIndustryContact: any
}

export interface Listing {
    id: number
    businessName: string
    address: string
    email: string
    phone: string
    status: string
    studentIndustryContact: any
}

export interface Branch {
    id: number
    address: string
    contactPerson: string
    contactPersonEmail: string
    contactPersonPhone: string
    studentIndustryContact: any
    location: string
}

export interface Email {
    id: number
    subject: string
    message?: string
    body?: string
    createdAt: string
    receiver?: User
    sender?: User
    listing?: Listing
    isSeen?: boolean
}

export interface CallLog {
    id: number
    createdAt: string
    updatedAt: string
    isAnswered: boolean | null
    note?: string
    calledBy: User
    industry?: Industry
    branch?: Branch
    futureindustry?: Listing
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading communications...</span>
    </div>
)

// Main Component
const IndustryCommunications = ({ emails, callLogs, listingMails }: any) => {
    const isLoading =
        emails.isLoading || callLogs.isLoading || listingMails.isLoading
    const hasError = emails.isError || callLogs.isError || listingMails.isError
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">
                        Industry Communications
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Recent emails and call logs from industry
                    </p>
                </div>
                <LoadingSpinner />
            </div>
        )
    }

    if (hasError) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">
                        Industry Communications
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Recent emails and call logs from industry
                    </p>
                </div>
                <NoData isError text="Failed to load communications" />
            </div>
        )
    }

    // Combine all communications and sort by date
    const allCommunications = [
        ...(emails.data || []).map((email: any) => ({
            type: 'email' as const,
            data: email,
            createdAt: email.createdAt,
        })),
        ...(callLogs.data || []).map((call: any) => ({
            type: 'call' as const,
            data: call,
            createdAt: call.createdAt,
        })),
        ...(listingMails.data || []).map((email: any) => ({
            type: 'email' as const,
            data: email,
            createdAt: email.createdAt,
        })),
    ].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return (
        <div className="max-w-4xl mx-auto p-3 bg-gray-50">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                    Industry Communications
                </h1>
                <p className="text-gray-600 text-sm">
                    Recent emails and call logs from industry
                </p>
            </div>

            {allCommunications?.length === 0 ? (
                <NoData text="No communications yet" />
            ) : (
                <div className="space-y-3">
                    {allCommunications.map((item, index) => (
                        <div key={`${item.type}-${item.data.id}-${index}`}>
                            {item.type === 'email' ? (
                                <EmailItemCard email={item?.data as Email} />
                            ) : (
                                <CallItemCard call={item.data as CallLog} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default IndustryCommunications
