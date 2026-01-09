import { NoData } from '@components'
import {
    AddCustomSectorFolderModal,
    UpdateCustomSectorFolderModal,
} from '@partials/common/IndustryProfileDetail/components/IndustrySectorRequiredDocs/modals'
import { IndustryApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { Sector } from '@types'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import {
    DocumentCard,
    DocumentsModuleHeader,
    DocumentsStats,
    SectorTabs,
} from './components'
import { DocumentsTabSkeleton } from '../../../skeletonLoader'

export function DocumentsModule() {
    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )
    const industryUserId = industryDetail?.user?.id

    const [selectedSector, setSelectedSector] = useState<number | null>(null)
    const [modal, setModal] = useState<ReactElement | null>(null)

    // 1. Fetch Sectors
    const { data: sectorsData, isLoading: isLoadingSectors } =
        IndustryApi.Courses.useGetIndustrySectorsQuery(
            { userId: Number(industryUserId) },
            {
                skip: !industryUserId,
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

    // 2. Fetch Docs for Selected Sector
    const docsQuery = IndustryApi.Folders.getIndustryRequiredDocs(
        {
            sectorId: Number(selectedSector),
            industryId: Number(industryDetail?.id),
        },
        {
            skip: !selectedSector || !industryDetail?.id,
        }
    )

    const documents = useMemo(() => {
        return docsQuery?.data || []
    }, [docsQuery?.data])

    // 3. Stats
    const enabledCount = documents.filter((doc: any) => doc.isRequired).length
    const mandatoryCount = documents.filter(
        (doc: any) => doc?.isMandatory
    ).length
    const totalCount = documents.length
    const activeSectorName = sectorOptions.find(
        (s) => s.id === selectedSector
    )?.name

    // 4. Actions
    const onCancelModal = () => setModal(null)

    const handleAddClick = () => {
        setModal(
            <AddCustomSectorFolderModal
                onCancel={onCancelModal}
                industryId={Number(industryDetail?.id)}
                selectedSector={selectedSector}
            />
        )
    }

    const handleEditClick = (doc: any) => {
        setModal(
            <UpdateCustomSectorFolderModal
                doc={doc}
                industryId={Number(industryDetail?.id)}
                onCancel={onCancelModal}
            />
        )
    }

    if (isLoadingSectors || docsQuery.isLoading) {
        return <DocumentsTabSkeleton />
    }

    return (
        <div className="space-y-2 px-4 relative">
            {modal}

            <DocumentsModuleHeader onAddClick={handleAddClick} />

            <SectorTabs
                sectors={sectorOptions}
                activeSector={selectedSector}
                onSectorChange={setSelectedSector}
            />

            <DocumentsStats
                enabledCount={enabledCount}
                totalCount={totalCount}
                mandatoryCount={mandatoryCount}
                activeSector={activeSectorName}
            />

            <div className="grid gap-3">
                {documents.length > 0 ? (
                    documents.map((doc: any) => (
                        <DocumentCard
                            key={doc.id}
                            industryId={Number(industryDetail?.id)}
                            industryUserId={Number(industryUserId)}
                            doc={doc}
                        />
                    ))
                ) : (
                    <div className="py-4">
                        <NoData text="No documents found for this sector" />
                    </div>
                )}
            </div>
        </div>
    )
}
