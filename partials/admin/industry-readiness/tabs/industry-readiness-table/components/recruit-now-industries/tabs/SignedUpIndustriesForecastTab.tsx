import { LoadingAnimation, NoData, PageSize, Pagination } from '@components'
import { AdminApi } from '@queries'
import React, { useState } from 'react'
import { SignedUpIndustryRowItem } from '../components/SignedUpIndustryRowItem'
import { SignedUpIndustryDetailPanelModal } from '../modal/SignedUpIndustryDetailPanelModal'
import { Filters } from '../components/Filters'

export const SignedUpIndustriesForecastTab = ({
    forecast,
    isOpen,
    setSelectedPartner,
    selectedPartner,
    setFilterInterest,
    filterInterest,
    searchTerm,
    setSearchTerm,
}: any) => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)

    const { data, isLoading, isError } =
        AdminApi.IndustryReadiness.useForecastSignedUpIndustriesList(
            {
                search: `name:${searchTerm}`,
                suburb: forecast?.suburb,
                sectorId: forecast?.sectorId,
                postcode: forecast?.postalCode,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                skip: !isOpen,
            }
        )
    return (
        <div>
            <Filters
                setFilterInterest={setFilterInterest}
                filterInterest={filterInterest}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <PageSize
                    itemPerPage={itemPerPage}
                    setItemPerPage={setItemPerPage}
                    records={data?.data?.length}
                />

                <Pagination pagination={data?.pagination} setPage={setPage} />
            </div>

            <div className="divide-y">
                {isLoading ? (
                    <LoadingAnimation />
                ) : data?.data && data?.data?.length > 0 ? (
                    data?.data?.map((industry: any, index: number) => (
                        <SignedUpIndustryRowItem
                            key={industry.id}
                            industry={industry}
                            index={index}
                            setSelectedindustry={setSelectedPartner}
                        />
                    ))
                ) : (
                    <NoData text="No future industry found" />
                )}
            </div>
            <SignedUpIndustryDetailPanelModal
                selectedPartner={selectedPartner}
                setSelectedPartner={setSelectedPartner}
            />
        </div>
    )
}
