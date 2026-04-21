import { Badge } from '@components/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { PermissionType } from '@types'
import { LucideIcon } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { usePermissionCheck } from '@components/Permissions/hooks'

export interface TabConfig {
    value: string
    label: string
    icon?: LucideIcon
    component: any
    count?: string | number
    hidden?: boolean | ((props?: any) => boolean)
    permissions?: PermissionType[]
}

export const ConfigTabs = ({
    defaultValue,
    value,
    onValueChange,
    tabs,
    props,
    className,
    tabsClasses,
    tabsTriggerClasses,
}: {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    props?: any
    className?: string
    tabs: TabConfig[]
    tabsClasses?: string
    tabsTriggerClasses?: string
}) => {
    const [width, setWidth] = useState<number | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    const { checkPermission } = usePermissionCheck({})

    useLayoutEffect(() => {
        const element = ref.current
        if (!element) return

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === element) {
                    setWidth(element.offsetWidth)
                }
            }
        })

        resizeObserver.observe(element)

        // Set initial width synchronously before paint
        setWidth(element.offsetWidth)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    const visibleTabs = tabs.filter((tab) => {
        if (tab.permissions && tab.permissions.length > 0) {
            if (!checkPermission(tab.permissions)) return false
        }

        if (typeof tab.hidden === 'function') {
            return !tab.hidden(props)
        }
        return !tab.hidden
    })

    if (visibleTabs.length === 0) return null

    return (
        <div className="w-full" ref={ref}>
            <Tabs
                defaultValue={defaultValue || visibleTabs?.[0]?.value}
                value={value}
                onValueChange={onValueChange}
                className={`${className}`}
            >
                <TabsList
                    style={{
                        maxWidth: width ? `${width}px` : '100%',
                        boxSizing: 'border-box',
                    }}
                    className={`w-full overflow-x-auto border border-gray-300 shadow mb-2 bg-slate-100 p-1.5 h-auto gap-1 rounded-md py-1 flex justify-start ${tabsClasses}`}
                >
                    {visibleTabs.map((tab) => {
                        const Icon = tab?.icon
                        return (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#044866] transition-all flex flex-col md:flex-row items-center gap-1 md:gap-2 py-1.5 rounded-md ${tabsTriggerClasses}`}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                <span>{tab.label}</span>
                                {tab.count && (
                                    <Badge
                                        variant="primaryNew"
                                        text={tab.count.toString()}
                                    />
                                )}
                            </TabsTrigger>
                        )
                    })}
                </TabsList>

                {visibleTabs.map((tab) => {
                    const Component = tab.component
                    return (
                        <TabsContent
                            key={tab.value}
                            value={tab.value}
                            className="mt-0 animate-fade-in"
                        >
                            <Component {...props} />
                        </TabsContent>
                    )
                })}
            </Tabs>
        </div>
    )
}
