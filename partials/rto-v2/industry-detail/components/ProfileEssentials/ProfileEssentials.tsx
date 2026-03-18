import { Building } from 'lucide-react'
import {
    BasicDetails,
    InterviewAvailability,
    AssignedAgent,
    PremiumFeatures,
    PlacementFormUrl,
    BusinessVerfication,
} from './components'
import { AuthorizedUserComponent } from '@components'
import { UserRoles } from '@constants'

export function ProfileEssentials() {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] -hidden">
            <div className="rounded-t-2xl bg-linear-to-r from-[#044866] to-[#0D5468] px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-xl">
                        <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold">
                            Profile Essentials
                        </h2>
                        <p className="text-white/80 text-xs">
                            Core information and settings
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-4 py-4">
                <AuthorizedUserComponent
                    roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                >
                    {/* Left Column */}
                    <div className="space-y-3 flex flex-col h-full">
                        <InterviewAvailability checkRuntime />
                        <PlacementFormUrl />
                        <BusinessVerfication />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3 flex flex-col h-full">
                        <AssignedAgent />
                        <PremiumFeatures />
                    </div>
                </AuthorizedUserComponent>
                <AuthorizedUserComponent roles={[UserRoles.RTO]}>
                    {/* Left Column */}
                    <div className="space-y-3 flex flex-col h-full">
                        <AssignedAgent />
                        <PlacementFormUrl />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3 flex flex-col h-full">
                        {/* <QuickNotes /> */}
                        <InterviewAvailability checkRuntime />
                        <BusinessVerfication />
                    </div>
                </AuthorizedUserComponent>
            </div>
        </div>
    )
}
