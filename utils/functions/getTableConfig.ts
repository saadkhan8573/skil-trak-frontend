import { ColumnDef } from '@tanstack/react-table'

export interface GetTableConfigOptions<K extends string> {
    columnKeys?: K[]
    removeColumnKeys?: K[]
}

/**
 * Generic utility to filter columns for a table.
 *
 * @param allColumns - The array of all possible column definitions.
 * @param options - Options to include or exclude specific columns by their accessorKey.
 * @returns Filtered array of column definitions.
 */
export const getFilteredColumns = <T, K extends string>(
    allColumns: ColumnDef<T>[],
    options?: GetTableConfigOptions<K>
): ColumnDef<T>[] => {
    const { columnKeys, removeColumnKeys } = options || {}

    if (
        columnKeys &&
        columnKeys.length > 0 &&
        removeColumnKeys &&
        removeColumnKeys.length > 0
    ) {
        throw new Error(
            'Cannot use both columnKeys and removeColumnKeys at the same time. Use only one.'
        )
    }

    let columns = allColumns

    if (columnKeys && columnKeys.length > 0) {
        // Include only specified columns
        columns = allColumns.filter((column) => {
            const accessorKey =
                'accessorKey' in column ? (column.accessorKey as string) : null
            return accessorKey && columnKeys.includes(accessorKey as K)
        })
    } else if (removeColumnKeys && removeColumnKeys.length > 0) {
        // Remove specified columns
        columns = allColumns.filter((column) => {
            const accessorKey =
                'accessorKey' in column ? (column.accessorKey as string) : null
            return accessorKey && !removeColumnKeys.includes(accessorKey as K)
        })
    }

    return columns
}
