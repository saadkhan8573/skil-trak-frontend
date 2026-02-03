import {
    Button,
    Filter,
    FindWorkplaceFilters,
    LoadingAnimation,
    SetDetaultQueryFilteres,
    TabNavigation,
    TabProps,
    TechnicalError,
} from '@components'
import { FigureCard } from '@components/sections/subAdmin'
import { useContextBar } from '@hooks'
import { AdminLayout } from '@layouts'
import {
    ActiveIndustries,
    AddIndustry,
    BlockedIndustries,
    RunListingAutomation,
    WithoutEmailListing,
} from '@partials/common'
import { FilteredSearchIndustries } from '@partials/common/FindWorkplaces/FilteredSearchIndustries'
import { ImportIndustriesList } from '@partials/common/FindWorkplaces/contextBar'
import { CommonApi } from '@queries'
import { FindWorkplaceFilter, NextPageWithLayout } from '@types'
import { checkFilteredDataLength } from '@utils'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { MdAddBusiness } from 'react-icons/md'

type Props = {}
const filterKeys = [
    'businessName',
    'address',
    'sector',
    'email',
    'phone',
    'status',
]
const FutureIndustryListing: NextPageWithLayout = (props: Props) => {
    const [filterAction, setFilterAction] = useState(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const contextBar = useContextBar()
    const [filter, setFilter] = useState<FindWorkplaceFilter>(
        {} as FindWorkplaceFilter
    )
    const [industryData, setIndustryData] = useState<any>(null)

    const filteredIndustries = CommonApi.FindWorkplace.useGetAllFindWorkplaces({
        search: `${JSON.stringify(filter)
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })
    const count = CommonApi.FindWorkplace.useGetFindWorkplacesCount()

    const onSetIndustryData = useCallback((data: any) => {
        setIndustryData(data)
    }, [])

    const tabs: TabProps[] = [
        {
            label: 'All',
            href: {
                pathname: 'future-industries',
                query: { tab: 'all', page: 1, pageSize: 50 },
            },
            badge: {
                text: count?.data?.all,
                loading: count?.isLoading,
            },
            element: (
                <ActiveIndustries
                    onSetIndustryData={(data: any) => {
                        onSetIndustryData(data)
                    }}
                />
            ),
        },
        {
            label: 'Partial Listing',
            href: {
                pathname: 'future-industries',
                query: { tab: 'partial-listing', page: 1, pageSize: 50 },
            },
            badge: {
                text: count?.data?.noEmail,
                loading: count?.isLoading,
            },
            element: (
                <WithoutEmailListing onSetIndustryData={onSetIndustryData} />
            ),
        },
        {
            label: 'Blocked Listing',
            href: {
                pathname: 'future-industries',
                query: { tab: 'blocked-listing', page: 1, pageSize: 50 },
            },
            badge: {
                text: count?.data?.blocked,
                loading: count?.isLoading,
            },
            element: (
                <BlockedIndustries onSetIndustryData={onSetIndustryData} />
            ),
        },
    ]
    const filteredDataLength = checkFilteredDataLength(filter)

    useEffect(() => {
        return () => {
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [industryData])

    const onAddIndustry = () => {
        contextBar.setContent(
            <AddIndustry
                industryData={industryData}
                onSetIndustryData={() => {
                    onSetIndustryData(null)
                }}
            />
        )
        contextBar.show(false)
        contextBar.setTitle('Add Future Industry')
    }

    const onUploadIndustries = () => {
        contextBar.setContent(<ImportIndustriesList />)
        contextBar.show(false)
        contextBar.setTitle('Upload Industries')
    }

    return (
        <div>
            <SetDetaultQueryFilteres<FindWorkplaceFilter>
                filterKeys={filterKeys}
                setFilter={setFilter}
            />
            <div className="flex justify-end gap-x-2 mt-4 mr-6">
                {filterAction}
                <RunListingAutomation />
                <Button
                    text={'Upload Industries'}
                    variant="dark"
                    Icon={MdAddBusiness}
                    onClick={() => {
                        onUploadIndustries()
                    }}
                />
                <Button
                    text={'Add Industry'}
                    Icon={MdAddBusiness}
                    onClick={() => {
                        onAddIndustry()
                    }}
                />
            </div>
            <Filter<FindWorkplaceFilter>
                component={FindWorkplaceFilters}
                initialValues={filter}
                setFilterAction={setFilterAction}
                setFilter={setFilter}
                filterKeys={filterKeys}
            />
            {filteredDataLength && filteredIndustries.isError && (
                <TechnicalError />
            )}
            {filteredDataLength ? (
                filteredIndustries.isLoading ? (
                    <LoadingAnimation />
                ) : (
                    filteredIndustries.isSuccess && (
                        <FilteredSearchIndustries
                            setPage={setPage}
                            itemPerPage={itemPerPage}
                            industries={filteredIndustries}
                            setItemPerPage={setItemPerPage}
                            onSetIndustryData={(data: any) => {
                                onSetIndustryData(data)
                            }}
                        />
                    )
                )
            ) : null}
            {!filteredDataLength && (
                <TabNavigation tabs={tabs}>
                    {({ header, element }: any) => {
                        return (
                            <div>
                                <div className="flex items-end justify-between">
                                    <div className="grow">{header}</div>
                                </div>
                                <div className="flex items-center gap-x-2 mt-3">
                                    <FigureCard
                                        count={count?.data?.all}
                                        loading={count?.isLoading}
                                        title={'All Industries'}
                                        imageUrl={
                                            '/images/icons/allIndustry.png'
                                        }
                                        onClick={() => {
                                            // setTarget('call made to  student')
                                        }}
                                    />
                                    <FigureCard
                                        count={count?.data?.newlyCreated}
                                        loading={count?.isLoading}
                                        title={'Today Added Industries'}
                                        imageUrl={
                                            '/images/icons/newlyAdded.png'
                                        }
                                        onClick={() => {
                                            // setTarget('call made to  student')
                                        }}
                                    />
                                    <FigureCard
                                        count={count?.data?.signedUp}
                                        loading={count?.isLoading}
                                        title={'Signed Up Industries'}
                                        imageUrl={
                                            '/images/icons/signedUpIndustry.png'
                                        }
                                        onClick={() => {
                                            // setTarget('call made to  student')
                                        }}
                                    />
                                    <FigureCard
                                        count={count?.data?.favourite}
                                        loading={count?.isLoading}
                                        title={'Favourite Industries'}
                                        imageUrl={'/images/icons/favorite.png'}
                                        onClick={() => {
                                            // setTarget('call made to  student')
                                        }}
                                    />

                                    <FigureCard
                                        count={count?.data?.doNotDisturb}
                                        loading={count?.isLoading}
                                        title={'Do Not Disturb'}
                                        imageUrl={
                                            '/images/icons/doNotDisturb.jpg'
                                        }
                                        onClick={() => {
                                            // setTarget('call made to  student')
                                        }}
                                    />
                                </div>
                                <div className="p-4">{element}</div>
                            </div>
                        )
                    }}
                </TabNavigation>
            )}
        </div>
    )
}
FutureIndustryListing.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default FutureIndustryListing
