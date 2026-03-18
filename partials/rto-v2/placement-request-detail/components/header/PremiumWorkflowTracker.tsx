import { WorkplaceProgressbar } from './WorkplaceProgressbar'

export const PremiumWorkflowTracker = ({
    workplace,
    workIndustry,
}: any) => {
    return (
        <div className="p-4 bg-linear-to-b from-white/80 via-white/70 to-white/60 backdrop-blur-xl border-b border-slate-200/80 shadow-inner">
            <div className="max-w-[1900px] mx-auto">
                {/* Workflow Progress Bar */}
                <WorkplaceProgressbar
                    workplace={workplace}
                    workIndustry={workIndustry}
                />
            </div>
        </div>
    )
}
