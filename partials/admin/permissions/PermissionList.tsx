import {
    Button,
    Card,
    ConfigTabs,
    EmptyData,
    LoadingAnimation,
    PageHeading,
    TechnicalError,
} from '@components'
import { AdminApi } from '@queries'
import { PermissionType } from '@types'
import { useMemo, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { categoryConfig, permissionMetadata } from './data'
import { Database } from 'lucide-react'
import { createPermissionTab } from './components'


import { PermissionProvider, usePermissionActions } from './hooks'

const PermissionListContent = () => {
    const { onAdd, modal } = usePermissionActions()

    const { data, isLoading, isFetching, isError } =
        AdminApi.Permissions.useListQuery({
            skip: 0,
            limit: 2000,
        })

    const groupedData = useMemo(() => {
        if (!data?.data) return { all: [] }
        const groups: Record<string, any[]> = { all: data.data, other: [] }

        Object.keys(categoryConfig).forEach((k) => {
            groups[k] = []
        })

        data.data.forEach((perm: any) => {
            const meta = permissionMetadata[perm.code as PermissionType]
            if (meta && meta.category && groups[meta.category]) {
                groups[meta.category].push(perm)
            } else {
                groups.other.push(perm)
            }
        })

        return groups
    }, [data])

    const tabsConfig = useMemo(() => {
        const tabs: any[] = [
            {
                label: 'All Permissions',
                value: 'all',
                icon: Database,
                component: createPermissionTab(groupedData.all),
                count: groupedData.all.length,
            },
        ]

        Object.entries(categoryConfig).forEach(
            ([key, config]: [string, any]) => {
                if (groupedData[key] && groupedData[key].length > 0) {
                    tabs.push({
                        label: config.label,
                        value: key,
                        icon: config.icon,
                        component: createPermissionTab(groupedData[key]),
                        count: groupedData[key].length,
                    })
                }
            }
        )

        if (groupedData.other && groupedData.other.length > 0) {
            tabs.push({
                label: 'Other',
                value: 'other',
                component: createPermissionTab(groupedData.other),
                count: groupedData.other.length,
            })
        }

        return tabs
    }, [groupedData])

    return (
        <div className="flex flex-col gap-y-4 mb-32">
            <PageHeading title="Permissions Management">
                <Button
                    variant="primaryNew"
                    Icon={FaPlus}
                    onClick={onAdd}
                >
                    Add Permission
                </Button>
            </PageHeading>
            <Card noPadding>
                {isError && <TechnicalError />}
                {isLoading || isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data.data?.length ? (
                    <div className="p-4">
                        <ConfigTabs
                            tabs={tabsConfig}
                        />
                    </div>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Permissions Found!'}
                            description={
                                'There are no permissions created yet. Click "Add Permission" to create one.'
                            }
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}

export const PermissionList = () => {
    return (
        <PermissionProvider>
            <PermissionListContent />
        </PermissionProvider>
    )
}
