import { Building2 } from 'lucide-react'

export const IndustryHeader = () => {
    return (
        <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-primaryNew p-6 shadow-premium-lg">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                        <div className="flex-1 min-w-[300px]">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-premium border border-white/30">
                                    <Building2 className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-1.5 focus:outline-none">
                                        Industry Partners
                                    </h1>
                                    <p className="text-white/90">
                                        Manage partnerships and expand your placement network
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
