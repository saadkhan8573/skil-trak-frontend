import {
    BookOpen,
    CheckCircle,
    ClipboardCheck,
    Clock,
    FileText,
    HelpCircle,
    Mail,
    Shield,
    Target,
    UserCheck,
    Users,
} from 'lucide-react'
import { SubAdminApi } from '@queries'
import { useAppSelector } from '@redux/hooks'

// For RTO industries, we only validate these specific items to be "placement ready"
export const rtoRequiredItems = [
    'Workplace Type',
    'Courses Configured',
    'Capacity',
]

export const getChecklistItems = (data: any) => {
    const getStatus = (dataKey: boolean): 'done' | 'pending' => {
        return dataKey ? 'done' : 'pending'
    }

    return [
        {
            title: 'Basic Information',
            description: 'ABN, address, contact details verified',
            status: getStatus(data?.ProfileUpdated),
            icon: FileText,
            color: '#044866',
            targetSection: 'basic-details',
        },
        {
            title: 'Trading Hours Set',
            description: 'Schedule and slots configured',
            status: getStatus(data?.trading_hours_and_shifts),
            icon: Clock,
            color: '#8B5CF6',
            targetTab: 'hours',
        },
        {
            title: 'Courses Configured',
            description: 'Programs and activities defined',
            status: getStatus(data?.hasCourseApproved),
            icon: BookOpen,
            color: '#EC4899',
            targetTab: 'courses',
        },
        {
            title: 'Capacity',
            description: 'Partner capacity configured',
            status: getStatus(data?.CapacityUpdated),
            icon: Users,
            color: '#0D5468',
            targetTab: 'courses',
            targetSection: 'capacity',
        },
        {
            title: 'Interview Availability',
            description: 'Interview schedule and availability set',
            status: getStatus(data?.interviewAvailabilities),
            icon: ClipboardCheck,
            color: '#F59E0B',
            targetSection: 'interview-availability',
        },
        {
            title: 'Primary Contact',
            description: 'Primary contact person assigned',
            status: getStatus(data?.contactPerson),
            icon: UserCheck,
            color: '#10B981',
            targetSection: 'contact-details',
        },
        {
            title: 'Workplace Type',
            description: 'Industry sector and workplace type defined',
            status: getStatus(data?.hasWorkplaceType),
            icon: Shield,
            color: '#14B8A6',
            targetTab: 'courses',
        },
        {
            title: 'Email Verified',
            description: 'Email verified',
            status: getStatus(data?.hasEmailVerified),
            icon: Mail,
            color: '#F59E0B',
            targetSection: 'email-verified',
        },
    ]
}

export const useIndustryProgress = () => {
    const { industryDetail } = useAppSelector((state) => state.industry)
    const isRtoAssociated = !!industryDetail?.isRtoAssociated

    SubAdminApi.Industry.industryProgress(industryDetail?.id!, {
        skip: !industryDetail?.id,
    })
    const { data: progressData, isLoading } =
        SubAdminApi.Industry.industryProgress(industryDetail?.id!, {
            skip: !industryDetail?.id,
        })

    const checklistItems = getChecklistItems(progressData || {})

    // Progress bar always shows actual progress across all items
    const completedItems = checklistItems.filter(
        (item) => item.status === 'done'
    ).length
    const totalItems = checklistItems.length

    const progressPercentage =
        Number(((Number(completedItems) * 100) / totalItems).toFixed(0)) || 0

    // Placement readiness check (determines if the modal appears)
    const isPlacementReady = isRtoAssociated
        ? // For RTO associated, only these 3 are required to be functionally ready
          checklistItems
              .filter((item) => rtoRequiredItems.includes(item.title))
              .every((item) => item.status === 'done')
        : // For others, everything must be done (100%)
          progressPercentage === 100

    return {
        progressPercentage,
        completedItems,
        totalItems,
        checklistItems,
        isPlacementReady,
        isLoading,
    }
}
