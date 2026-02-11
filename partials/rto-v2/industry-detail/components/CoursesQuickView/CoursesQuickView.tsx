import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { RtoV2Api, SubAdminApi } from '@redux';
import { useAppSelector } from '@redux/hooks';
import { cn, removeEmptyValues } from '@utils';
import { NoData, TechnicalError } from '@components';
import { CoursesTabSkeleton } from '../../skeletonLoader';
import { useCoursesData } from '../courses/hooks';
import { IndustryCourseApproval } from '@types';
import { QuickViewCourseList } from './components/QuickViewCourseList';

// Helper to get sector icon
const getSectorIcon = (name: string) => {
    const iconMap: Record<string, string> = {
        'Health': '🏥',
        'Community': '🤝',
        'Hospitality': '👨‍�',
        'Tourism': '✈️',
        'Technology': '💻',
        'Business': '💼',
        'Construction': '🏗️',
        'Education': '📚',
    };

    const key = Object.keys(iconMap).find(k => name.includes(k));
    return key ? iconMap[key] : '📋';
};

// Helper to get sector gradient
const gradients = [
    'from-[#044866] to-[#0D5468]', // Primary Dark
    'from-[#F7A619] to-[#EA580C]', // Pending Orange
    'from-[#8B5CF6] to-[#7C3AED]', // Purple
    'from-[#10B981] to-[#059669]', // Green
    'from-[#F43F5E] to-[#E11D48]', // Rose
];

export const CoursesQuickView = () => {
    const { industryDetail: industry } = useAppSelector((state) => state.industry);
    const { groupBySector } = useCoursesData();

    // Fetch capacity data
    const { data: sectorCapacityData, isLoading: isCapacityLoading } =
        SubAdminApi.Industry.useSectorBasedCapacity(industry?.id || 0, {
            skip: !industry?.id,
        });

    // Fetch course details
    const coursesDetails = RtoV2Api.Industries.industryCoursesDetails(
        removeEmptyValues({
            userId: industry?.user?.id,
            isDeleted: false,
        }),
        {
            skip: !industry?.user?.id,
        }
    );

    const isLoading = isCapacityLoading || coursesDetails.isLoading;

    // Group courses by sector
    const sectors = coursesDetails?.data ? groupBySector(coursesDetails.data) : [];

    if (isLoading) {
        return (
            <div className="lg:col-span-1 h-full min-h-[400px]">
                <CoursesTabSkeleton />
            </div>
        );
    }

    if (coursesDetails.isError) {
        return (
            <div className="lg:col-span-1 h-full min-h-[400px]">
                <NoData isError text='There is some technical issue!' />
            </div>
        );
    }

    if (sectors.length === 0) {
        return (
            <div className="lg:col-span-1 h-full min-h-[400px] flex items-center justify-center">
                <NoData text="No active sectors or courses found for this industry." />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
        >
            <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden h-full">
                <div className="bg-linear-to-r from-[#044866] to-[#0D5468] px-3 py-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-bold text-[13px]">Sector Breakdown</h3>
                            <p className="text-white/80 text-[11px]">Course approvals and capacity</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded">
                            <span className="text-white text-[11px] font-semibold">{sectors.length} Sectors</span>
                        </div>
                    </div>
                </div>

                <div className="p-1.5 space-y-1 max-h-56 overflow-auto custom-scrollbar">
                    {sectors.map((group, index) => {
                        const sector = group.sector;
                        const sectorCapacity = sectorCapacityData?.find(
                            (s: any) => s.sector.id === sector.id
                        );

                        const totalCourses = group.approvalCourses.length;
                        const approvedCourses = group.approvalCourses.filter(
                            (a: IndustryCourseApproval) => a.status === 'approved'
                        ).length;
                        const pendingCourses = group.approvalCourses.filter(
                            (a: IndustryCourseApproval) => a.status === 'pending'
                        ).length;

                        const bookedSpots = Number(sectorCapacity?.enrolled || 0);
                        const availableSpots = Number(sectorCapacity?.capacity || 0);
                        const capacityPercentage = availableSpots > 0
                            ? Math.round((bookedSpots / availableSpots) * 100)
                            : 0;

                        const gradient = gradients[index % gradients.length];
                        const icon = getSectorIcon(sector.name);
                        const industryApproval = sector?.industryApproval?.[0]

                        return (
                            <motion.div
                                key={sector.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-linear-to-br from-[#F8FAFB] to-white rounded-lg border border-[#E2E8F0] p-1.5 hover:shadow-md transition-all"
                            >
                                {/* Sector Header */}
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <div className={`shrink-0 w-6 h-6 bg-linear-to-br ${gradient} rounded-md flex items-center justify-center text-sm shadow-md`}>
                                        {icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1 mb-0.5">
                                            <h4 className="text-[12px] font-bold text-[#1A2332] truncate leading-tight">{sector.name}</h4>
                                            {/* Sector Status Badge */}
                                            {industryApproval?.status === 'approved' ? (
                                                <div className="flex items-center gap-0.5 bg-[#D1FAE5] px-1 py-0.5 rounded shrink-0">
                                                    <CheckCircle2 className="w-2 h-2 text-[#10B981]" />
                                                    <span className="text-[10px] font-bold text-[#065F46]">Approved</span>
                                                </div>
                                            ) : industryApproval?.status === 'pending' && (
                                                <div className="flex items-center gap-0.5 bg-[#FEF3C7] px-1 py-0.5 rounded shrink-0">
                                                    <AlertCircle className="w-2 h-2 text-[#F7A619]" />
                                                    <span className="text-[10px] font-bold text-[#92400E]">Pending</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-[#64748B] leading-tight">{totalCourses} course{totalCourses !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>

                                {/* Course Status - Compact */}
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="flex items-center gap-0.5">
                                        <div className="w-1 h-1 rounded-full bg-[#10B981]"></div>
                                        <span className="text-[11px] text-[#64748B]">Approved</span>
                                        <span className="text-[11px] font-bold text-[#10B981]">{approvedCourses}</span>
                                    </div>
                                    {pendingCourses > 0 && (
                                        <div className="flex items-center gap-0.5">
                                            <div className="w-1 h-1 rounded-full bg-[#F7A619]"></div>
                                            <span className="text-[11px] text-[#64748B]">Pending</span>
                                            <span className="text-[11px] font-bold text-[#F7A619]">{pendingCourses}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Simplified Course List */}
                                <QuickViewCourseList approvalCourses={group.approvalCourses} />

                                {/* Capacity Section */}
                                <div className="border-t border-[#E2E8F0] pt-1.5">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="text-[11px] font-semibold text-[#1A2332]">Capacity</span>
                                        <span className="text-[11px] font-bold text-[#044866]">
                                            {bookedSpots}/{availableSpots}
                                        </span>
                                    </div>

                                    {/* Capacity Bar */}
                                    <div className="relative h-0.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${capacityPercentage}%` }}
                                            transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                                            className={`absolute inset-y-0 left-0 bg-linear-to-r ${gradient} rounded-full`}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between mt-0.5">
                                        <span className="text-[10px] text-[#64748B]">
                                            {availableSpots - bookedSpots > 0 ? availableSpots - bookedSpots : 0} available
                                        </span>
                                        <span className="text-[10px] font-semibold text-[#044866]">
                                            {capacityPercentage}%
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    )
}
