import { Users, Sparkles, ClipboardCheck, Play } from "lucide-react";

interface PlacementStatsCardsProps {
    totalRequests: number;
    needsWorkplaceCount: number;
    providedWorkplaceCount: number;
    activePlacementsCount?: number;
}

export const PlacementRequestStats = ({
    totalRequests,
    needsWorkplaceCount,
    providedWorkplaceCount,
    activePlacementsCount,
}: PlacementStatsCardsProps) => {
    const stats = [
        {
            label: "Total Requests",
            value: totalRequests,
            icon: Users,
            gradient: "from-primaryNew/15 via-primaryNew/10 to-primaryNew/5",
            iconBg: "from-primaryNew to-[#044866]",
            ringColor: "ring-primaryNew/20",
        },
        {
            label: "Need Workplace",
            value: needsWorkplaceCount,
            icon: Sparkles,
            gradient: "from-yellow-400/15 via-yellow-400/10 to-yellow-400/5",
            iconBg: "from-yellow-400 to-[#F7A619]",
            ringColor: "ring-yellow-400/20",
        },
        {
            label: "Provided Workplace",
            value: providedWorkplaceCount,
            icon: ClipboardCheck,
            gradient: "from-cyan-500/15 via-cyan-500/10 to-cyan-500/5",
            iconBg: "from-cyan-500 to-[#0D5468]",
            ringColor: "ring-cyan-500/20",
        },
        // {
        //     label: "Active Placements",
        //     value: activePlacementsCount,
        //     icon: Play,
        //     gradient: "from-emerald-500/15 via-emerald-500/10 to-emerald-500/5",
        //     iconBg: "from-emerald-500 to-emerald-600",
        //     ringColor: "ring-emerald-500/20",
        // },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="group relative border-border/50 shadow-premium hover:shadow-premium-lg transition-all duration-500 overflow-hidden backdrop-blur-sm hover:scale-[1.02] cursor-pointer rounded-xl"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Animated gradient background */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                        />

                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white to-transparent" />
                        </div>

                        <div className="relative p-4">
                            <div className="flex items-center justify-between">
                                {/* Text Section */}
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text ">
                                        {stat.value}
                                    </p>
                                </div>

                                {/* Icon Section */}
                                <div className="relative">
                                    {/* Glow effect */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${stat.iconBg} rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-150`}
                                    />

                                    {/* Icon container */}
                                    <div
                                        className={`relative h-10 w-10 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ring-4 ${stat.ringColor}`}
                                    >
                                        <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    {/* Pulse ring */}
                                    <div
                                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.iconBg} opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700`}
                                    />
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 h-1 bg-gray-200/70 dark:bg-gray-700/70 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${stat.iconBg} rounded-full transition-all duration-1000 group-hover:w-full shadow-sm`}
                                    style={{
                                        width: `${Math.min((stat.value / totalRequests) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
