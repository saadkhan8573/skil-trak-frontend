import { useMemo, useState } from 'react'

export const useSelectableList = <T extends { id: number }>(
    items: T[] = []
) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const allIds = useMemo(() => items.map((item) => item.id), [items])

    const isAllSelected =
        allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))

    const toggleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? allIds : [])
    }

    const toggleSelectOne = (id: number, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
        )
    }

    const clearSelection = () => setSelectedIds([])

    return {
        selectedIds,
        isAllSelected,
        toggleSelectAll,
        toggleSelectOne,
        clearSelection,
    }
}
