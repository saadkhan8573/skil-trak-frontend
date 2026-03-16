import { Building2, Clock, Users2, X } from 'lucide-react'
import { useState } from 'react'

import { RunListingAutomation } from '@partials/common'
import { AdminApi } from '@redux'
import { PageSize, Pagination } from '@components'

import { Filters } from './components/Filters'
import { FutureIndustryRowItem } from './components/FutureIndustryRowItem'
import { SignedUpIndustryRowItem } from './components/SignedUpIndustryRowItem'
import { FutureIndustryDetailPanelModal } from './modal/FutureIndustryDetailPanelModal'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { SignedUpIndustriesForecastTab } from './tabs/SignedUpIndustriesForecastTab'
import { FutureListingForecastTab } from './tabs/FutureListingForecastTab'
import { SignedUpIndustryDetailPanelModal } from './modal/SignedUpIndustryDetailPanelModal'

interface RecruitmentProps {
    isOpen: boolean
    onClose: () => void
    data: any
}

export const FutureIndustriesRecruitment = ({
    isOpen,
    onClose,
    data,
}: RecruitmentProps) => {
    const [selectedPartner, setSelectedPartner] = useState<any>(null)

    const [filterInterest, setFilterInterest] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-7xl max-h-[90vh] overflow-auto rounded-2xl bg-slate-50 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-5 p-6">
                    {/* HEADER */}

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">
                                Industry Partner Recruitment
                            </h1>
                            <p className="text-slate-600">
                                Manage industry partners and track recruitment
                                progress
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#044866] shadow-xl">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>

                            <button
                                onClick={onClose}
                                className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-100"
                            >
                                <X className="h-5 w-5 text-slate-600" />
                            </button>
                        </div>
                    </div>

                    {/* MAIN TABS */}

                    <Tabs defaultValue="industries" className="w-full">
                        <div className="flex items-center justify-between border-b bg-white rounded-xl shadow-lg px-6">
                            <TabsList className="bg-transparent p-0">
                                <TabsTrigger
                                    value="industries"
                                    className="gap-2"
                                >
                                    <Building2 className="w-4 h-4" />
                                    Industries
                                </TabsTrigger>

                                <TabsTrigger
                                    value="contact-history"
                                    className="gap-2"
                                >
                                    <Clock className="w-4 h-4" />
                                    Contact History
                                </TabsTrigger>

                                <TabsTrigger
                                    value="student-interview"
                                    className="gap-2"
                                >
                                    <Users2 className="w-4 h-4" />
                                    Student Interview
                                </TabsTrigger>
                            </TabsList>

                            <RunListingAutomation
                                studentAddress={`${data?.suburb}, ${data?.postalCode}`}
                                sectorId={data?.sectorId}
                            />
                        </div>

                        {/* INDUSTRIES TAB */}

                        <TabsContent value="industries">
                            <Tabs
                                defaultValue="future-listing"
                                className="bg-white border rounded-xl mt-4"
                            >
                                <TabsList className="border-b w-full justify-start rounded-none">
                                    <TabsTrigger value="future-listing">
                                        Future / Listing
                                    </TabsTrigger>

                                    <TabsTrigger value="signed-up">
                                        Signed Up
                                    </TabsTrigger>
                                </TabsList>
                                {/* <Filters
                                    setFilterInterest={setFilterInterest}
                                    filterInterest={filterInterest}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                /> */}
                                {/* FUTURE INDUSTRIES */}

                                <TabsContent value="future-listing">
                                    <FutureListingForecastTab
                                        forecast={data}
                                        isOpen={isOpen}
                                        setSelectedPartner={setSelectedPartner}
                                        selectedPartner={selectedPartner}
                                        setFilterInterest={setFilterInterest}
                                        filterInterest={filterInterest}
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                    />
                                </TabsContent>

                                {/* SIGNED UP INDUSTRIES */}

                                <TabsContent value="signed-up">
                                    <SignedUpIndustriesForecastTab
                                        forecast={data}
                                        isOpen={isOpen}
                                        setSelectedPartner={setSelectedPartner}
                                        selectedPartner={selectedPartner}
                                        setFilterInterest={setFilterInterest}
                                        filterInterest={filterInterest}
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                    />
                                </TabsContent>
                            </Tabs>
                        </TabsContent>

                        <TabsContent value="contact-history">
                            <div className="py-12 text-center text-slate-500">
                                Contact history feature coming soon
                            </div>
                        </TabsContent>

                        <TabsContent value="student-interview">
                            <div className="py-12 text-center text-slate-500">
                                No data found
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
