import { IndustryApi, RtoV2Api } from '@redux'
import { useAppSelector } from '@redux/hooks'
import { Sector } from '@types'
import { useEffect, useMemo, useState } from 'react'
import {
    CategoryFilter,
    ChecklistItemsList,
    RTOAccessNotice,
} from './components'
import { GenericTabSkeleton } from '../../../skeletonLoader'

export function RTOChecklistModule() {
    const [selectedSector, setSelectedSector] = useState<number | null>(null)

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const checklist = RtoV2Api.Industries.industryRtoChecklistList(
        {
            industryId: industryDetail?.user?.id!,
            sectorId: selectedSector!,
        },
        {
            skip: !selectedSector || !industryDetail?.user?.id,
        }
    )

    // 1. Fetch Sectors
    const { data: sectorsData, isLoading: isLoadingSectors } =
        IndustryApi.Courses.useGetIndustrySectorsQuery(
            { userId: Number(industryDetail?.user?.id) },
            {
                skip: !industryDetail?.user?.id,
            }
        )

    const sectorOptions: Sector[] = useMemo(
        () =>
            sectorsData?.map((sector: any) => ({
                id: sector?.id,
                name: sector?.name,
            })) || [],
        [sectorsData]
    )

    // Select first sector by default
    useEffect(() => {
        if (sectorOptions.length > 0 && !selectedSector) {
            setSelectedSector(sectorOptions[0].id)
        }
    }, [sectorOptions, selectedSector])

    if (isLoadingSectors || (checklist.isLoading && selectedSector)) {
        return <GenericTabSkeleton />
    }

    return (
        <div className="space-y-4 px-4">
            <RTOAccessNotice />
            <CategoryFilter
                sectors={sectorOptions}
                activeSector={selectedSector}
                onSectorChange={setSelectedSector}
            />

            <ChecklistItemsList items={checklist.data || []} />
        </div>
    )
}
