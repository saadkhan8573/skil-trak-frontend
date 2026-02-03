import { Button } from '@components'
import { Card } from '@components/cards'
import { QueryType, removeEmptyValues } from '@utils'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { MdCancel } from 'react-icons/md'

interface FilterProps<FormFilterTypes> {
    component: ({
        onFilterChange,
        filter,
        removeFilterKeysToUrl,
    }: {
        onFilterChange: (values: FormFilterTypes) => void
        filter: FormFilterTypes
        removeFilterKeysToUrl?: any
    }) => ReactElement
    initialValues: FormFilterTypes
    setFilterAction: Function
    setFilter: (values: FormFilterTypes) => void
    filterKeys?: string[] | undefined
    removeFilterKeysToUrl?: string[] | undefined
}
export const Filter = <FormFilterTypes,>({
    component,
    initialValues,
    setFilterAction,
    setFilter,
    filterKeys,
    removeFilterKeysToUrl,
}: FilterProps<FormFilterTypes>) => {
    const router = useRouter()

    const [expanded, setExpanded] = useState(false)
    const [filters, setFilters] = useState<FormFilterTypes>(
        initialValues as FormFilterTypes
    )

    // on Clear Filter
    const query = { ...router.query, page: 1, pageSize: 50 }
    const queryKeys = Object.keys(router.query)
    const filteredData = queryKeys.filter((key) => filterKeys?.includes(key))
    filteredData.forEach((q) => {
        delete query[q as keyof typeof query]
    })
    const clearFilterUrl = Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

    const Component = component

    useEffect(() => {
        if (initialValues && Object.values(initialValues)?.length > 0) {
            setExpanded(true)
            setFilters(initialValues)
        }
    }, [initialValues])

    useEffect(() => {
        setFilterAction(
            <Button
                variant={'action'}
                Icon={expanded ? IoClose : FaFilter}
                onClick={() => {
                    onFilterButtonClick()
                }}
            >
                {expanded ? 'Clear' : 'Filter'}
            </Button>
        )
    }, [expanded, filters, setFilterAction])

    const delayedSearch = useCallback(
        debounce((values) => setFilter(removeEmptyValues(values)), 700),
        []
    )

    const onFilterChange = (filter: FormFilterTypes) => {
        setFilters(filter)
        delayedSearch(filter)
    }

    const onFilterClear = () => {
        setFilters({} as FormFilterTypes)
        setFilter({} as FormFilterTypes)
    }

    const onRemoveFilter = (key: string) => {
        setFilters({ ...filters, [key]: '' })
    }

    const onFilterButtonClick = () => {
        if (expanded) {
            onFilterClear()
            setExpanded(false)
            router.push(`${router.pathname}?${clearFilterUrl}`)
        } else {
            setExpanded(true)
        }
    }

    return expanded ? (
        <Card className="rounded-xl border-2 border-primaryNew/20 bg-linear-to-br from-primaryNew/5 to-transparent space-y-4">
            <div>
                <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium flex items-center gap-x-2 text-gray-400">
                        <FaFilter />
                        Filter
                    </p>
                    <button
                        className="text-xl text-gray-500 hover:text-gray-700"
                        title="Close Filter"
                        onClick={onFilterButtonClick}
                    >
                        <IoClose />
                    </button>
                </div>
                <div>
                    <Component
                        onFilterChange={onFilterChange}
                        filter={filters}
                        removeFilterKeysToUrl={removeFilterKeysToUrl}
                    />
                </div>
                <div className="flex flex-wrap gap-x-2 mt-2">
                    {Object.entries(filters as unknown as QueryType).map(
                        ([key, value]) =>
                            (value as string) && (
                                <div
                                    key={key}
                                    className="flex items-center justify-between border text-xs shadow rounded"
                                >
                                    <div className="mr-2">
                                        <span className="px-1 bg-gray-100 text-[11px] capitalize h-full py-0.5 inline-block">
                                            {key}:
                                        </span>{' '}
                                        <span className="font-medium">
                                            {value as string}
                                        </span>
                                    </div>
                                    <span
                                        onClick={() => onRemoveFilter(key)}
                                        className="cursor-pointer text-sm text-gray-300 hover:text-gray-400"
                                    >
                                        <MdCancel />
                                    </span>
                                </div>
                            )
                    )}
                </div>
            </div>
        </Card>
    ) : null
}
