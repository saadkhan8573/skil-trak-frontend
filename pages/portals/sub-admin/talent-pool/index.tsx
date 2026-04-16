import { ReactElement, useEffect, useState } from 'react'

import { Typography, withPermission } from '@components'
import { useNavbar } from '@hooks'
import { SubAdminLayout } from '@layouts'
// import {
//     FilteredTalentPoolRequests,
//     HiredStudents,
//     RejectedRequests,
//     TalentPoolApprovedRequests,
//     TalentPoolDropdown,
//     TalentPoolPendingRequests,
//     TerminatedRequests,
// } from '@partials/admin/talent-pool'
import { TalentPoolDropdown } from '@partials'
import { TalentPoolList } from '@partials/sub-admin'
import { AuthApi, SubAdminApi } from '@queries'
import { NextPageWithLayout, OptionType, PermissionType } from '@types'
import { TalentPoolProfileStatus } from '@utils'
import { useRouter } from 'next/router'

// const tabs: TabProps[] = [
//     {
//         label: 'Pending',
//         href: {
//             pathname: 'talent-pool',
//             query: { tab: 'pending', page: 1, pageSize: 50 },
//         },
//         element: <TalentPoolPendingRequests />,
//     },
//     {
//         label: 'All Requests',
//         href: {
//             pathname: 'talent-pool',
//             query: { tab: 'all', page: 1, pageSize: 50 },
//         },
//         element: <TalentPoolApprovedRequests />,
//     },
//     {
//         label: 'Rejected',
//         href: {
//             pathname: 'talent-pool',
//             query: { tab: 'rejected', page: 1, pageSize: 50 },
//         },
//         element: <RejectedRequests />,
//     },
//     {
//         label: 'Hired',
//         href: {
//             pathname: 'talent-pool',
//             query: { tab: 'hired', page: 1, pageSize: 50 },
//         },
//         element: <HiredStudents />,
//     },
//     {
//         label: 'Terminated',
//         href: {
//             pathname: 'talent-pool',
//             query: { tab: 'terminated', page: 1, pageSize: 50 },
//         },
//         element: <TerminatedRequests />,
//     },
// ]

const TalentPoolListSubAdmin: NextPageWithLayout = () => {
    const navBar = useNavbar()
    const router = useRouter()
    const [selectedSector, setSelectedSector] = useState<OptionType | null>(
        null
    )
    const [selectedTalentPool, setSelectedTalentPool] =
        useState<TalentPoolProfileStatus>(TalentPoolProfileStatus.All)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    // const [readTalentPoolCount, readTalentPoolCountResult] =
    //     AdminApi.TalentPool.useReadTalentPoolProfilesCount()

    const talentPool = SubAdminApi.TalentPool.useTalentPoolList(
        {
            search: `${JSON.stringify({
                status:
                    selectedTalentPool !== TalentPoolProfileStatus.All
                        ? selectedTalentPool
                        : null,
                sectorId: selectedSector?.value,
            })
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    // useEffect(() => {
    //     readTalentPoolCount()
    // }, [])

    useEffect(() => {
        setPage(Number(router.query?.page || 1))
        setItemPerPage(Number(router.query?.pageSize || 50))
    }, [router])

    const getSectors = AuthApi.useSectors({})

    useEffect(() => {
        navBar.setTitle('Talent Pool')

        return () => {
            navBar.setTitle('')
        }
    }, [])

    const sectorOptions = getSectors.data?.map((sector: any) => ({
        label: `${sector?.code} - ${sector?.name}`,
        value: sector.id,
    }))

    return (
        <div>
            <div className="p-6">
                <div className="shadow-[0px_4px_16px_0px_rgba(0,0,0,0.05)] rounded-md">
                    <div className="flex items-center justify-between border-b border-secondary-dark p-3.5">
                        <Typography variant="subtitle">
                            Talent Pool List
                        </Typography>
                        <div className="flex items-center gap-x-5">
                            <TalentPoolDropdown
                                title="Sector"
                                selected={
                                    selectedSector?.label ||
                                    'Search by sector...'
                                }
                                onClear={(e: any) => {
                                    e.stopPropagation()
                                    setSelectedSector(null)
                                }}
                                dropDown={() => (
                                    <div>
                                        {sectorOptions?.map(
                                            (sector: OptionType) => (
                                                <div
                                                    key={Number(sector.value)}
                                                    onClick={() => {
                                                        setSelectedSector(
                                                            sector
                                                        )
                                                    }}
                                                    className="hover:bg-gray-200 py-2 border-b border-secondary-dark px-2 cursor-pointer"
                                                >
                                                    <Typography variant="small">
                                                        {sector?.label}
                                                    </Typography>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            />
                            <TalentPoolDropdown
                                title="Showing Results"
                                selected={selectedTalentPool?.toLocaleUpperCase()}
                                dropDown={() => {
                                    return (
                                        <div>
                                            {Object.entries(
                                                TalentPoolProfileStatus
                                            )?.map(([key, value]: any) => (
                                                <div
                                                    key={key}
                                                    onClick={() => {
                                                        setSelectedTalentPool(
                                                            value
                                                        )
                                                    }}
                                                    className={`${
                                                        key ===
                                                        selectedTalentPool
                                                            ? 'bg-gray-200'
                                                            : ''
                                                    } hover:bg-gray-200 py-2 border-b border-secondary-dark px-2 cursor-pointer`}
                                                >
                                                    <Typography variant="small">
                                                        {key}
                                                    </Typography>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <TalentPoolList
                        setPage={setPage}
                        itemPerPage={itemPerPage}
                        talentPoolData={talentPool}
                        setItemPerPage={setItemPerPage}
                    />
                </div>
            </div>
        </div>
    )
}

TalentPoolListSubAdmin.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(TalentPoolListSubAdmin, {
    permissions: [PermissionType.TALENT_POOL_ACCESS],
})
