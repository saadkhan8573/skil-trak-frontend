import { useIndustryProgress } from '../../hooks'
import {
    CompanyInfo,
    StatusBanner,
    ActionButtons,
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

                        {/* Right: Action Buttons */}
                        <ActionButtons />
                    </div>
                </div>

                {/* Industry Status Buttons - Enhanced Design */}
                <StatusControls />
            </div>
        </div>
    )
}
