import {
    Button,
    Filter,
    FindWorkplaceFilters,
    LoadingAnimation,
    SetDetaultQueryFilteres,
    TabNavigation,
    TabProps,
    TechnicalError,
    Typography,
} from '@components'
import { FigureCard } from '@components/sections/subAdmin'
import { useContextBar, useSubadminProfile } from '@hooks'
import { SubAdminLayout } from '@layouts'
import {
    ActiveIndustries,
    ActiveIndustriesByState,
    AddIndustry,
    DepartmentFutureIndustries,
    RunListingAutomation,
    WithoutEmailListing,
} from '@partials/common'
import { FilteredSearchIndustries } from '@partials/common/FindWorkplaces/FilteredSearchIndustries'
import { ImportIndustriesListWithOTP } from '@partials/common/FindWorkplaces/contextBar'
import { CommonApi, commonApi, SubAdminApi } from '@queries'
import { FindWorkplaceFilter, NextPageWithLayout } from '@types'
import { checkFilteredDataLength, getUserCredentials } from '@utils'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { FaIndustry } from 'react-icons/fa'
import { IoWarning } from 'react-icons/io5'
import { MdAddBusiness } from 'react-icons/md'
type Props = {}
const filterKeys = [
    'id',
    'phone',
    'email',
    'status',
    'sector',
    'address',
    'myListing',
    'department',
    'businessName',
]
const IndustryListing: NextPageWithLayout = (props: Props) => {
    const [filterAction, setFilterAction] = useState(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const role = useMemo(() => getUserCredentials()?.role, [])
    const contextBar = useContextBar()
    const [filter, setFilter] = useState<FindWorkplaceFilter>(
        {} as FindWorkplaceFilter
    )
    const [industryData, setIndustryData] = useState<any>(null)

    const subadmin = useSubadminProfile()

    const isHod = useMemo(() => subadmin?.departmentMember?.isHod, [subadmin])
    const searchString = useMemo(() => {
        return JSON.stringify(filter)
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()
    }, [filter])

    const filteredIndustries = CommonApi.FindWorkplace.listingByState(
        {
            search: searchString,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: false,
            refetchOnReconnect: false,
        }
    )

    const count = CommonApi.FindWorkplace.findWpCountsByStates()

    const onSetIndustryData = useCallback((data: any) => {
        setIndustryData(data)
    }, [])

    const tabs: TabProps[] = useMemo(() => {
        const baseTabs = [
            {
                label: 'All',
                href: {
                    pathname: 'industry-listing',
                    query: { tab: 'all', page: 1, pageSize: 50 },
                },
                badge: {
                    text: count?.data?.all,
                    loading: count?.isLoading,
                },
                element: (
                    <ActiveIndustriesByState
                        onSetIndustryData={onSetIndustryData}
                    />
                ),
            },
            {
                label: 'Partial Listing',
                href: {
                    pathname: 'industry-listing',
                    query: { tab: 'partial-listing', page: 1, pageSize: 50 },
                },
                badge: {
                    text: count?.data?.noEmail,
                    loading: count?.isLoading,
                },
                element: (
                    <WithoutEmailListing
                        onSetIndustryData={onSetIndustryData}
                    />
                ),
            },
        ]

        // if (isHod) {
        //     baseTabs.splice(1, 0, {
        //         label: 'Department',
        //         href: {
        //             pathname: 'industry-listing',
        //             query: { tab: 'department', page: 1, pageSize: 50 },
        //         },
        //         badge: {
        //             text: count?.data?.department,
        //             loading: count?.isLoading,
        //         },
        //         element: (
        //             <DepartmentFutureIndustries
        //                 onSetIndustryData={onSetIndustryData}
        //             />
        //             // PendingIndustries
        //         ),
        //     })
        //     // baseTabs.push({
        //     //     label: 'Pending Industries',
        //     //     href: {
        //     //         pathname: 'industry-listing',
        //     //         query: { tab: 'pending', page: 1, pageSize: 50 },
        //     //     },
        //     //     badge: {
        //     //         text: count?.data?.pending,
        //     //         loading: count?.isLoading,
        //     //     },
        //     //     element: (
        //     //         <PendingIndustries  />
        //     //     ),
        //     // })
        // }

        return baseTabs
    }, [count, onSetIndustryData, isHod])

    const filteredDataLength = checkFilteredDataLength(filter)

    useEffect(() => {
        return () => {
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [])

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
        contextBar.setContent(<ImportIndustriesListWithOTP />)
        contextBar.show(false)
        contextBar.setTitle('Upload Industries')
    }
    return (
        <>
            {subadmin && subadmin?.allowIndustryListing ? (
                <div>
                    <SetDetaultQueryFilteres<FindWorkplaceFilter>
                        filterKeys={filterKeys}
                        setFilter={setFilter}
                    />
                    <div className="flex justify-end gap-x-2 mt-4 mr-6">
                        {filterAction}
                        {subadmin?.canImportIndustryListing && (
                            <RunListingAutomation />
                        )}
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
                            variant="dark"
                            Icon={FaIndustry}
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
                        filteredIndustries.isLoading ||
                        filteredIndustries.isFetching ? (
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
                                            <div className="flex-grow">
                                                {header}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-x-2 mt-3">
                                            <FigureCard
                                                count={count?.data?.all!}
                                                loading={count?.isLoading}
                                                title={'All Industries'}
                                                imageUrl={
                                                    '/images/icons/allIndustry.png'
                                                }
                                            />
                                            <FigureCard
                                                count={
                                                    count?.data
                                                        ?.myAddedIndustries!
                                                }
                                                loading={count?.isLoading}
                                                title={'My Added Industries'}
                                                imageUrl={
                                                    '/images/icons/allIndustry.png'
                                                }
                                                link="/portals/sub-admin/tasks/industry-listing?tab=all&myListing=true"
                                            />
                                            <FigureCard
                                                count={count?.data?.signedUp!}
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
                                                count={
                                                    count?.data?.newlyCreated!
                                                }
                                                loading={count?.isLoading}
                                                title={'Today Added Industries'}
                                                imageUrl={
                                                    '/images/icons/newlyAdded.png'
                                                }
                                            />
                                            <FigureCard
                                                count={count?.data?.favourite!}
                                                loading={count?.isLoading}
                                                title={'Favourite Industries'}
                                                imageUrl={
                                                    '/images/icons/favorite.png'
                                                }
                                            />

                                            <FigureCard
                                                count={
                                                    count?.data?.doNotDisturb!
                                                }
                                                loading={count?.isLoading}
                                                title={'Do Not Disturb'}
                                                imageUrl={
                                                    '/images/icons/doNotDisturb.jpg'
                                                }
                                            />
                                        </div>
                                        <div className="p-4">{element}</div>
                                    </div>
                                )
                            }}
                        </TabNavigation>
                    )}
                    {/* <SearchLocation /> */}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center gap-y-4 p-14 bg-white border-2 border-dashed rounded-lg">
                    <div>
                        <IoWarning className="text-yellow-500" size={70} />
                    </div>
                    <div className="px-48 text-center">
                        <Typography
                            variant="body"
                            semibold
                            color="text-gray-400"
                            center
                        >
                            The creation of Industry Listings requires prior
                            approval from an administrator. To expedite
                            processing, please submit your request to{' '}
                            <a
                                href={`mailto:admin@skiltrak.com.au`}
                                className="italic font-thin text-blue-400"
                            >
                                admin@skiltrak.com.au
                            </a>
                        </Typography>
                    </div>
                </div>
            )}
        </>
    )
}
IndustryListing.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}
export default IndustryListing
