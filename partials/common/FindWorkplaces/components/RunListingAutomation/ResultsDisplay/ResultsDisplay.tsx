import React, { ReactElement, useCallback, useMemo, useState } from 'react'

import {
    MdArrowBack,
    MdCheckCircle,
    MdExpandLess,
    MdExpandMore,
    MdLocationOn,
} from 'react-icons/md'

import { Alert, Badge, Button, Typography } from '@components'
import { ConfirmationModal } from '@partials/common/FindWorkplaces/modal'
import { MapView } from '../MapView'
import { KeywordMatch } from '../utils/keywordMatcher'
import { type SkilTrakMatch } from '../utils/skilTrakDatabase'
import { ResultDisplayCard } from './ResultDisplayCard'

interface ResultsDisplayProps {
    onBack: () => void
    onClose?: () => void
    selectedSector?: number
    listingResults?: any
}

interface CompanyAnalysis {
    keywordMatches: KeywordMatch[]
    skilTrakMatch: SkilTrakMatch | null
    addressCode: string
    regionInfo: { region: string; postcode: string }
    hasKeywordMatch: boolean
    hasSkilTrakMatch: boolean
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
    onBack,
    onClose,
    selectedSector,
    listingResults,
}) => {
    const [duplicates, setDuplicates] = useState<Set<string>>(new Set())
    const [removedItems, setRemovedItems] = useState<Set<string>>(new Set())

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [selectedLocationId, setSelectedLocationId] = useState<string>('')
    const [isMapExpanded, setIsMapExpanded] = useState(false)
    const [companyAnalyses, setCompanyAnalyses] = useState<
        Map<string, CompanyAnalysis>
    >(new Map())

    const duplicateCount = Object.values(listingResults)
        ?.flat()
        ?.filter((a: any) => a?.duplicated)?.length

    const filteredCompanies = (companies: any) =>
        companies?.filter((company: any) => !removedItems.has(company?.placeId))

    const onCancel = useCallback(() => setModal(null), [])

    const toggleMapExpanded = useCallback(() => {
        setIsMapExpanded((prev) => !prev)
    }, [])

    const total = useMemo(
        () => filteredCompanies(Object.values(listingResults)?.flat())?.length,
        [filteredCompanies, removedItems]
    )
    const activeItems = total - removedItems.size

    const handleSubmit = () => {
        setModal(
            <ConfirmationModal
                onCancel={(isFromModal?: boolean) => {
                    onCancel()
                    if (isFromModal) {
                        onClose && onClose()
                    }
                }}
                selectedSector={Number(selectedSector)}
                listingResults={filteredCompanies(
                    Object.values(listingResults)?.flat()
                )
                    // ?.filter((l: any) => !l?.duplicated)
                    ?.map((l: any) => ({
                        id: l?.placeId,
                        name: l?.name,
                    }))}
            />
        )
    }

    return (
        <div className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 px-3 pb-10">
            {modal}

            <style>{`
        @keyframes slide-down-fade {
            from {
                opacity: 0;
                transform: translateY(-10px);
                }
                to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up-fade {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-down-fade {
          animation: slide-down-fade 0.5s ease-out;
        }
        .animate-slide-up-fade {
          animation: slide-up-fade 0.3s ease-out;
        }
      `}</style>
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    outline
                    onClick={onBack}
                    variant="primaryNew"
                    Icon={MdArrowBack}
                    text="Back to Filters"
                />

                <div className="text-right">
                    <Typography variant="small" color="text-gray-500">
                        Discovery Complete
                    </Typography>
                    <div
                        className="bg-clip-text text-transparent"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, #044866, #0D5468)',
                        }}
                    >
                        <Typography
                            variant="title"
                            color="bg-clip-text text-transparent"
                        >
                            {total} companies found
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Map Toggle Button */}
            <div className="flex items-center justify-between">
                <Button
                    outline
                    variant="primaryNew"
                    onClick={toggleMapExpanded}
                >
                    <div className="flex items-center gap-x-1">
                        <MdLocationOn className="w-4 h-4" />
                        <span>Workplace Locations</span>
                        {isMapExpanded ? (
                            <MdExpandLess className="w-4 h-4" />
                        ) : (
                            <MdExpandMore className="w-4 h-4" />
                        )}
                    </div>
                </Button>
            </div>

            {/* Map View - Expandable */}
            {isMapExpanded && (
                <MapView
                    listingResults={Object.values(listingResults)?.flat()}
                />
            )}

            {/* Duplicate Warning Banner */}
            {duplicateCount > 0 && (
                <Alert
                    variant="warning"
                    autoDismiss={false}
                    description="Review before submitting."
                    title={`${duplicateCount} possible duplicates found.`}
                />
            )}

            {/* Summary Stats */}
            <div
                className="grid grid-cols-3 gap-4 p-3 rounded-lg"
                style={{
                    background:
                        'linear-gradient(to right, rgba(4, 72, 102, 0.1), rgba(247, 166, 25, 0.1))',
                }}
            >
                <div className="text-center">
                    <div
                        className="text-xl bg-clip-text text-transparent"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, #044866, #0D5468)',
                        }}
                    >
                        {total}
                    </div>
                    <Typography variant="small" color="text-gray-600">
                        Total Found
                    </Typography>
                </div>
                <div className="text-center">
                    <div
                        className="text-xl bg-clip-text text-transparent"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, #F7A619, #044866)',
                        }}
                    >
                        {total - duplicateCount}
                    </div>
                    <Typography variant="small" color="text-gray-600">
                        Ready to Add
                    </Typography>
                </div>
                <div className="text-center">
                    <div
                        className="text-xl bg-clip-text text-transparent"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, #F7A619, #0D5468)',
                        }}
                    >
                        {duplicateCount}
                    </div>
                    <Typography variant="small" color="text-gray-600">
                        Possible Duplicates
                    </Typography>
                </div>
            </div>

            {/* Results by Distance */}
            <div className="space-y-4">
                {Object.entries(listingResults)?.map(
                    ([key, companies]: any, groupIndex: number) => {
                        return (
                            filteredCompanies(companies) &&
                            filteredCompanies(companies)?.length > 0 && (
                                <div
                                    key={key}
                                    className="space-y-2 animate-slide-down-fade"
                                    style={{
                                        animationDelay: `${groupIndex * 0.1}s`,
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <MdLocationOn
                                            className="w-5 h-5"
                                            style={{ color: '#044866' }}
                                        />
                                        <Typography variant="title">
                                            {key} KM
                                        </Typography>
                                        <div className="ml-auto">
                                            <Badge
                                                variant="secondary"
                                                text={`${filteredCompanies(companies)
                                                        ?.length
                                                    } companies`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pl-6">
                                        {filteredCompanies(companies)?.map(
                                            (
                                                company: any,
                                                companyIndex: any
                                            ) => (
                                                <ResultDisplayCard
                                                    key={company?.placeId}
                                                    setRemovedItems={
                                                        setRemovedItems
                                                    }
                                                    removedItems={removedItems}
                                                    company={company}
                                                    companyAnalyses={
                                                        companyAnalyses
                                                    }
                                                    companyIndex={companyIndex}
                                                    groupIndex={groupIndex}
                                                    selectedLocationId={
                                                        selectedLocationId
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )
                        )
                    }
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-6 border-t">
                <div className="flex items-center gap-4">
                    <Typography variant="small" color="text-gray-600">
                        {total - duplicateCount} items ready to submit
                    </Typography>
                    <button
                        onClick={handleSubmit}
                        disabled={total - duplicateCount === 0 || isSubmitting}
                        className="text-white px-8 py-3 flex items-center gap-x-1 rounded-md text-sm"
                        style={{
                            background:
                                'linear-gradient(to right, #F7A619, #044866)',
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <MdCheckCircle className="w-4 h-4 mr-2" />
                                Submit to Industry Listing
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
