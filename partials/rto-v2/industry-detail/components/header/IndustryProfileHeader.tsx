import { Permissions } from '@components'
import { PermissionType } from '@types'
import { useIndustryProgress } from '../../hooks'
import {
    ActionButtons,
    CompanyInfo,
    StatusBanner,
    StatusControls,
} from './components'

export function IndustryProfileHeader() {
    const { progressPercentage, isPlacementReady } = useIndustryProgress()

    return (
        <div className="relative">
            {/* Clean Card Design */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                {/* Premium Status Banner */}
                <StatusBanner
                    isProfileComplete={isPlacementReady}
                    profileCompletion={progressPercentage}
                />

                {/* Main Header Content */}
                <div className="px-4 py-2.5">
                    <div className="flex items-start justify-between gap-4">
                        {/* Left: Company Info */}
                        <CompanyInfo />

                        <Permissions
                            permission={
                                PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS
                            }
                        >
                            {/* Right: Action Buttons */}
                            <ActionButtons />
                        </Permissions>
                    </div>
                </div>

                {/* Industry Status Buttons - Enhanced Design */}
                <StatusControls />

                
            </div>
        </div>
    )
}
