import React, { useState, useMemo, useEffect } from 'react'
import { Filter, X } from 'lucide-react'
import { Button, Select, TextInput } from '@components'
import { AuthApi } from '@redux'
import debounce from 'lodash/debounce'
export type ReadinessStatus = 'all' | 'ready' | 'at_risk' | 'not_ready'

export interface ReadinessFilters {
    suburb: string
    postalCode: string
    sectorName: string | null | undefined
    status: ReadinessStatus
}

interface ReadinessFilterBarProps {
    filters: ReadinessFilters
    setFilters: React.Dispatch<React.SetStateAction<ReadinessFilters>>
}

const STATUS_OPTIONS = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Ready', value: 'ready' },
    { label: 'At Risk', value: 'at_risk' },
    { label: 'Not Ready', value: 'not_ready' },
]

const DEFAULT_FILTERS: ReadinessFilters = {
    suburb: '',
    postalCode: '',
    sectorName: null,
    status: 'all',
}

export const ReadinessFilterBar = ({
    filters,
    setFilters,
}: ReadinessFilterBarProps) => {
    const [localSuburb, setLocalSuburb] = useState(filters.suburb)
    const [localPostalCode, setLocalPostalCode] = useState(filters.postalCode)
    const [isOpen, setIsOpen] = useState(true)

    const { data: sectors = [] } = AuthApi.useSectors({})

    const sectorOptions = useMemo(
        () =>
            sectors.map((sector: { name: string }) => ({
                label: sector.name,
                value: sector.name,
            })),
        [sectors]
    )
    const debouncedUpdate = useMemo(
        () =>
            debounce((key: keyof ReadinessFilters, value: string) => {
                setFilters((prev) => ({
                    ...prev,
                    [key]: value,
                }))
            }, 500),
        [setFilters]
    )
    useEffect(() => {
        return () => {
            debouncedUpdate.cancel()
        }
    }, [debouncedUpdate])
    const handleChange = (
        key: keyof ReadinessFilters,
        value: ReadinessFilters[keyof ReadinessFilters]
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleToggleOrClear = () => {
        if (isOpen) {
            setFilters(DEFAULT_FILTERS)
            setIsOpen(false)
        } else {
            setIsOpen(true)
        }
    }

    return (
        <div className="my-5">
            <div className="flex justify-end">
                <Button
                    onClick={handleToggleOrClear}
                    variant={isOpen ? 'error' : 'primaryNew'}
                    Icon={isOpen ? X : Filter}
                    text={isOpen ? 'Clear' : 'Filter'}
                />
            </div>

            {isOpen && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-5 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <TextInput
                            name="suburb"
                            label="Suburb"
                            placeholder="Search Suburb..."
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                const value = e.target.value
                                setLocalSuburb(value)
                                debouncedUpdate('suburb', value)
                            }}
                        />

                        <TextInput
                            name="postalCode"
                            label="Postal Code"
                            placeholder="Search Postal Code..."
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                const value = e.target.value
                                setLocalPostalCode(value)
                                debouncedUpdate('postalCode', value)
                            }}
                        />

                        <Select
                            name="sectorName"
                            label="Sector"
                            options={sectorOptions}
                            placeholder="Select Sector"
                            showError={false}
                            onlyValue
                            value={filters.sectorName}
                            onChange={(value: string | null) =>
                                handleChange('sectorName', value)
                            }
                        />

                        <Select
                            name="status"
                            label="Status"
                            options={STATUS_OPTIONS}
                            placeholder="Select Status"
                            showError={false}
                            onlyValue
                            value={filters.status}
                            onChange={(value: ReadinessStatus) =>
                                handleChange('status', value)
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
