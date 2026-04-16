import {
    Button,
    Filter,
    LoadingAnimation,
    Permissions,
    RtoListingFilter,
    SetDetaultQueryFilteres,
    TabNavigation,
    TabProps,
    TechnicalError,
    Typography,
} from '@components'
import { UserRoles } from '@constants'
import { useContextBar } from '@hooks'
import { SubAdminLayout } from '@layouts'
import {
    ActiveRtosList,
    AddRtoListing,
    FilteredRtoListing,
    ImportRtosListWithOTP,
} from '@partials/sub-admin'
import { SubAdminApi } from '@queries'
import {
    NextPageWithLayout,
    PermissionType,
    RtoListingFilterTypes,
} from '@types'
import { checkFilteredDataLength, getUserCredentials } from '@utils'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { FaSchool } from 'react-icons/fa'
import { IoWarning } from 'react-icons/io5'
import { RiSchoolFill } from 'react-icons/ri'

type Props = {}
const filterKeys = [
    'email',
    'phone',
    'sector',
    'rtoCode',
    'address',
    'businessName',
]
export const RtoListing = () => {
    const [filterAction, setFilterAction] = useState(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const contextBar = useContextBar()
    const [filter, setFilter] = useState<RtoListingFilterTypes>(
        {} as RtoListingFilterTypes
    )
    const [industryData, setIndustryData] = useState<any>(null)

    const role = getUserCredentials()?.role

    // const { isLoading, data, isError } = commonApi.useFindIndustriesCountQuery()
    const filteredRtos = SubAdminApi.SubAdmin.useAllRtosList({
        search: `${JSON.stringify(filter)
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })
    const profile = SubAdminApi.SubAdmin.useProfile()
    const onSetIndustryData = useCallback((data: any) => {
        setIndustryData(data)
    }, [])

    const tabs: TabProps[] = [
        {
            label: 'All',
            href: {
                pathname: 'rto-listing',
                query: { tab: 'all', page: 1, pageSize: 50 },
            },
            element: <ActiveRtosList onSetIndustryData={onSetIndustryData} />,
        },
    ]
    const filteredDataLength = checkFilteredDataLength(filter)

    useEffect(() => {
        return () => {
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [])

    const onAddIndustry = () => {
        contextBar.setContent(
            <AddRtoListing
                industryData={industryData}
                onSetIndustryData={() => {
                    onSetIndustryData(null)
                }}
            />
        )
        contextBar.show(false)
        contextBar.setTitle('Add RTO')
    }

    const onUploadIndustries = () => {
        contextBar.setContent(<ImportRtosListWithOTP />)
        contextBar.show(false)
        contextBar.setTitle('Upload RTOs')
    }
    return (
        <>
            {(profile?.data && profile?.data?.allowRtoListing) ||
            role === UserRoles.ADMIN ? (
                <div>
                    <SetDetaultQueryFilteres<RtoListingFilterTypes>
                        filterKeys={filterKeys}
                        setFilter={setFilter}
                    />
                    <div className="flex justify-end gap-x-2 mt-4 mr-6">
                        {filterAction}{' '}
                        <Permissions
                            permission={[PermissionType.CAN_IMPORT_RTO_LISTING]}
                        >
                            <Button
                                text={'Upload RTOs'}
                                variant="dark"
                                Icon={FaSchool}
                                onClick={() => {
                                    onUploadIndustries()
                                }}
                            />
                        </Permissions>
                        <Button
                            text={'Add RTO'}
                            variant="dark"
                            Icon={RiSchoolFill}
                            onClick={() => {
                                onAddIndustry()
                            }}
                        />
                    </div>
                    <Filter<RtoListingFilterTypes>
                        component={RtoListingFilter}
                        initialValues={filter}
                        setFilterAction={setFilterAction}
                        setFilter={setFilter}
                        filterKeys={filterKeys}
                    />
                    {filteredDataLength && filteredRtos.isError && (
                        <TechnicalError />
                    )}
                    {filteredDataLength ? (
                        filteredRtos.isLoading ? (
                            <LoadingAnimation />
                        ) : (
                            filteredRtos.isSuccess && (
                                <FilteredRtoListing
                                    setPage={setPage}
                                    itemPerPage={itemPerPage}
                                    industries={filteredRtos}
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
                                            <div className="px-6">
                                                {/* <Button
                                            text={'Add Sub Admin'}
                                            variant={'primary'}
                                            onClick={onAddSubAdmin}
                                        /> */}
                                            </div>
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
                            The creation of RTO Listings requires prior approval
                            from an administrator. To expedite processing,
                            please submit your request to{' '}
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
