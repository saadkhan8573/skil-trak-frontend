import { PermissionTableTab } from './PermissionTableTab'

export const createPermissionTab = (tabData: any[]) => {
    const TabComponent = (props: any) => (
        <PermissionTableTab {...props} data={tabData} />
    )
    TabComponent.displayName = 'PermissionTabRenderer'
    return TabComponent
}
