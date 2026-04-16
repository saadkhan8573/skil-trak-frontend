import { Plus } from 'lucide-react'
import { Button, Permissions } from '@components'
import { PermissionType } from '@types'

interface DocumentsModuleHeaderProps {
    onAddClick: () => void
}

export function DocumentsModuleHeader({
    onAddClick,
}: DocumentsModuleHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-2">
            <div>
                <h3 className="text-[#1A2332] font-bold mb-1">
                    Required Documents Per Sector
                </h3>
                <p className="text-xs text-[#64748B]">
                    Configure mandatory documents for each industry sector
                </p>
            </div>
            <Permissions
                permission={[PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS]}
            >
                <Button
                    onClick={onAddClick}
                    className="bg-gradient-to-br from-[#044866] to-[#0D5468] hover:shadow-lg text-white text-xs font-medium"
                >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add Custom Document
                </Button>
            </Permissions>
        </div>
    )
}
