import { Card } from "@components"
import { DynamicPermissionsTab } from "./DynamicPermissionsTab"

export const DynamicPermissionCard = ({ userId }: { userId: number }) => {
    return (
        <div className="mt-6 transition-all duration-500">
            <Card
                className="overflow-hidden border-0 shadow-2xl rounded-xl"
                noPadding
            >
                <div className="bg-primaryNew px-4 py-2 text-white relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold tracking-tight">
                                    Permissions
                                </h3>
                                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                            </div>
                            <p className="text-white/80 text-[13px] max-w-md font-medium leading-relaxed">
                                Strategic access management and RTO-specific
                                permission controls. Customize functional
                                boundaries with precision.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50/30">
                    <DynamicPermissionsTab userId={userId} />
                </div>
            </Card>
        </div>
    )
}