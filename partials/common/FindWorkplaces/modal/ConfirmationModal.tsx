import React from 'react'
import { CommonApi } from '@queries'
import { useNotification } from '@hooks'
import { MdCancel, MdCheckCircle, MdDescription } from 'react-icons/md'
import { Button, Modal, ShowErrorNotifications, Typography } from '@components'

interface ConfirmationModalProps {
    onCancel: (isFromModal?: boolean) => void
    selectedSector: number
    listingResults: {
        id: string
        name: string
    }[]
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    onCancel,
    selectedSector,
    listingResults,
}) => {
    const [submitType, setSubmitType] = React.useState<
        'unique' | 'all' | 'selective'
    >('unique')
    const [submitListing, submitListingResult] =
        CommonApi.FindWorkplace.submitAutoListing()

    const { notification } = useNotification()

    // Calculate unique results by ID
    const uniqueResults = React.useMemo(() => {
        return listingResults?.filter((l: any) => !l?.duplicated)
    }, [listingResults])

    // Initial select all logic
    const [selectedIndices, setSelectedIndices] = React.useState<Set<number>>(
        () => {
            return new Set(listingResults.map((_, i) => i))
        }
    )

    const toggleSelection = (index: number) => {
        const next = new Set(selectedIndices)
        if (next.has(index)) next.delete(index)
        else next.add(index)
        setSelectedIndices(next)
    }

    const onSubmitListing = async () => {
        let payload: string[] = [] // APIs typically expect IDs

        if (submitType === 'unique') {
            payload = uniqueResults.map((i) => i.id)
        } else if (submitType === 'all') {
            payload = listingResults.map((i) => i.id)
        } else if (submitType === 'selective') {
            payload = listingResults
                .filter((_, i) => selectedIndices.has(i))
                .map((item) => item.id)
        }

        const res: any = await submitListing({
            id: selectedSector,
            listing: payload,
        })

        if (res?.data) {
            notification.success({
                title: 'Listing Submit',
                description: `Successfully submitted ${payload.length} listings`,
            })
            onCancel(true)
        }
    }

    let currentCount = 0
    if (submitType === 'unique') currentCount = uniqueResults.length
    else if (submitType === 'all') currentCount = listingResults.length
    else currentCount = selectedIndices.size

    return (
        <>
            <ShowErrorNotifications result={submitListingResult} />
            <Modal
                title="Ready to Submit!"
                subtitle={`You have selected ${currentCount} companies to be submitted. Please confirm to proceed.`}
                onCancelClick={onCancel}
                showActions={false}
            >
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <div className="mb-6 space-y-3">
                        <label
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${submitType === 'unique' ? 'border-[#044866] bg-[#044866]/5' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="submitType"
                                    value="unique"
                                    checked={submitType === 'unique'}
                                    onChange={() => setSubmitType('unique')}
                                    className="w-4 h-4 text-[#044866]"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Submit Unique
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Remove duplicates before submitting
                                    </p>
                                </div>
                            </div>
                            <span className="font-bold text-[#044866] bg-[#044866]/10 px-2 py-1 rounded text-sm">
                                {uniqueResults.length}
                            </span>
                        </label>

                        <label
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${submitType === 'all' ? 'border-[#044866] bg-[#044866]/5' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="submitType"
                                    value="all"
                                    checked={submitType === 'all'}
                                    onChange={() => setSubmitType('all')}
                                    className="w-4 h-4 text-[#044866]"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Submit All
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Submit including duplicates
                                    </p>
                                </div>
                            </div>
                            <span className="font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm">
                                {listingResults.length}
                            </span>
                        </label>

                        <label
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${submitType === 'selective' ? 'border-[#044866] bg-[#044866]/5' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="submitType"
                                    value="selective"
                                    checked={submitType === 'selective'}
                                    onChange={() => setSubmitType('selective')}
                                    className="w-4 h-4 text-[#044866]"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Selective
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Manually select companies to submit
                                    </p>
                                </div>
                            </div>
                            <span className="font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded text-sm">
                                {selectedIndices.size}
                            </span>
                        </label>

                        {/* Checklist for Selective Mode */}
                        {submitType === 'selective' && (
                            <div className="mt-4 border rounded-lg overflow-hidden">
                                <div className="bg-gray-50 p-2 border-b flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-2">
                                        Company Name
                                    </span>
                                    <button
                                        onClick={() => {
                                            if (
                                                selectedIndices.size ===
                                                listingResults.length
                                            )
                                                setSelectedIndices(new Set())
                                            else
                                                setSelectedIndices(
                                                    new Set(
                                                        listingResults.map(
                                                            (_, i) => i
                                                        )
                                                    )
                                                )
                                        }}
                                        className="text-xs text-[#044866] hover:underline mr-2"
                                    >
                                        {selectedIndices.size ===
                                        listingResults.length
                                            ? 'Deselect All'
                                            : 'Select All'}
                                    </button>
                                </div>
                                <div className="max-h-60 overflow-y-auto divide-y">
                                    {listingResults.map(
                                        (company: any, idx: number) => {
                                            const isDup = company?.duplicated
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${selectedIndices.has(idx) ? 'bg-[#044866]/5' : ''}`}
                                                    onClick={() =>
                                                        toggleSelection(idx)
                                                    }
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIndices.has(
                                                            idx
                                                        )}
                                                        onChange={() => {}} // Handled by div click
                                                        className="w-4 h-4 text-[#044866] rounded border-gray-300 mr-3"
                                                    />
                                                    <div className="flex-1 min-w-0 flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-900 truncate">
                                                            {company.name}
                                                        </span>
                                                        {isDup && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                                                Duplicate
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            variant="primaryNew"
                            onClick={onSubmitListing}
                            text={`Submit ${currentCount} Listings`}
                            loading={submitListingResult?.isLoading}
                            disabled={submitListingResult?.isLoading}
                            Icon={MdDescription}
                        />

                        <Button
                            outline
                            onClick={() => onCancel(false)}
                            Icon={MdCancel}
                            text="Cancel"
                        />
                    </div>

                    <div
                        className="mt-4 p-3 rounded-lg border"
                        style={{
                            backgroundColor: 'rgba(4, 72, 102, 0.05)',
                            borderColor: 'rgba(4, 72, 102, 0.2)',
                        }}
                    >
                        <div
                            className="flex items-center gap-2 text-sm"
                            style={{ color: '#044866' }}
                        >
                            <MdCheckCircle className="w-4 h-4" />
                            <Typography variant="small" color="#044866">
                                {currentCount} companies are ready to be added
                                to our industry listing database.
                            </Typography>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
