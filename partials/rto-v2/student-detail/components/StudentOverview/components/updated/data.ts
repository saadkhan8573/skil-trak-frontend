import { WorkplaceCurrentStatus } from '@utils'

export interface CourseData {
    id: string
    name: string
    code: string
    status: string
    streams: string[]
    overallProgress: number
    streamProgress: Array<{
        name: string
        progress: number
        color: string
        icon: string
    }>
    placementRequests: Array<{
        id: string
        workplace: string
        location: string
        distance: string
        requestDate: string
        createdDate: string
        lastActionDate: string
        assignedTo: string
        status: string
        progress: number
        workflowStage: string
        nextAction: string
        dueDate: string
        supervisor: string
        supervisorEmail: string
        supervisorPhone: string
        type: string
        hours: string
        priority: string
        description: string
        completedSteps: string[]
        pendingSteps: string[]
        actionedBy?: string
        actionedByName?: string
        actionedByAccount?: string
        actionDate?: string
        cancellationComment?: string
    }>
    workplaceBio: {
        name: string
        location: string
        description: string
        focus: string[]
        supervisor: string
        supervisorRole: string
        supervisorPhone: string
        supervisorEmail: string
    }
    currentStatus: {
        stage: string
        nextAction: string
        dueDate: string
        progress: number
        completedSteps: string[]
        pendingSteps: string[]
    }
}

export const coursesData: Record<string, CourseData> = {
    CHC33021: {
        id: 'CHC33021',
        name: 'Certificate III Individual Support',
        code: 'CHC33021',
        status: 'Active',
        streams: [
            'Ageing Support',
            'Disability Support',
            'Home & Community Care',
        ],
        overallProgress: 60,
        streamProgress: [
            {
                name: 'Ageing Support',
                progress: 100,
                color: '#044866',
                icon: '✓',
            },
            {
                name: 'Disability Support',
                progress: 56,
                color: '#0D5468',
                icon: '⚡',
            },
            {
                name: 'Home & Community Care',
                progress: 15,
                color: '#F7A619',
                icon: '🏠',
            },
        ],
        placementRequests: [
            {
                id: 'PR-2025-089',
                workplace: 'Hale Foundation',
                location: 'Marangaroo, WA',
                distance: '2 km',
                requestDate: 'Nov 4, 2025',
                createdDate: 'Oct 28, 2025, 10:00 AM',
                lastActionDate: 'Nov 4, 2025, 02:30 PM',
                assignedTo: 'Sarah Mitchell',
                status: 'placement-started',
                progress: 75,
                workflowStage: 'Placement Started',
                nextAction: 'Complete workplace orientation',
                dueDate: 'Nov 25, 2025',
                supervisor: 'Sarah Mitchell',
                supervisorEmail: 's.mitchell@halefoundation.org.au',
                supervisorPhone: '+61 3 9876 5444',
                type: 'Primary Placement',
                hours: '240 hours',
                priority: 'high',
                description:
                    'Primary placement for Certificate III Individual Support focusing on aged care and disability support services.',
                completedSteps: [
                    'Student Added',
                    'Request Generated',
                    'RTO Approval',
                    'Workplace Confirmed',
                    'Agreement Signed',
                    'Orientation Scheduled',
                ],
                pendingSteps: ['Complete Orientation', 'Begin Placement Hours'],
            },
            {
                id: 'PR-2025-126',
                workplace: 'Silver Care Community',
                location: 'Joondalup, WA',
                distance: '5.2 km',
                requestDate: 'Nov 20, 2025',
                createdDate: 'Nov 15, 2025, 09:15 AM',
                lastActionDate: 'Nov 20, 2025, 11:45 AM',
                assignedTo: 'Mark Johnson',
                status: 'in-progress',
                progress: 45,
                workflowStage: 'Waiting for RTO',
                nextAction: 'RTO approval pending',
                dueDate: 'Dec 8, 2025',
                supervisor: 'Mark Johnson',
                supervisorEmail: 'm.johnson@silvercare.org.au',
                supervisorPhone: '+61 8 9400 2233',
                type: 'Secondary Placement',
                hours: '120 hours',
                priority: 'medium',
                description:
                    'Additional placement to complete remaining hours for Certificate III Individual Support.',
                completedSteps: [
                    'Student Added',
                    'Request Generated',
                    'Initial Review',
                ],
                pendingSteps: [
                    'RTO Approval',
                    'Workplace Confirmation',
                    'Agreement Signing',
                    'Orientation',
                ],
            },
            {
                id: 'PR-2024-087',
                workplace: 'Greenwood Aged Care',
                location: 'Greenwood, WA',
                distance: '8.5 km',
                requestDate: 'Sep 15, 2024',
                createdDate: 'Sep 10, 2024, 09:15 AM',
                lastActionDate: 'Oct 30, 2024, 03:45 PM',
                assignedTo: 'Sarah Mitchell',
                status: 'completed',
                progress: 100,
                workflowStage: 'Placement Complete',
                nextAction: 'Assessment Review Complete',
                dueDate: 'Oct 30, 2024',
                supervisor: 'Emma Roberts',
                supervisorEmail: 'e.roberts@greenwoodcare.org.au',
                supervisorPhone: '+61 8 9447 3322',
                type: 'Primary Placement',
                hours: '120 hours',
                priority: 'high',
                description:
                    'Completed placement focusing on aged care support services.',
                completedSteps: [
                    'Student Added',
                    'Request Generated',
                    'RTO Approval',
                    'Workplace Confirmed',
                    'Agreement Signed',
                    'Orientation Complete',
                    'Placement Hours Complete',
                    'Assessment Passed',
                ],
                pendingSteps: [],
            },
            {
                id: 'PR-2024-052',
                workplace: 'Northside Community Center',
                location: 'Stirling, WA',
                distance: '12.3 km',
                requestDate: 'Aug 10, 2024',
                createdDate: 'Aug 5, 2024, 02:20 PM',
                lastActionDate: 'Aug 18, 2024, 10:22 AM',
                assignedTo: 'David Chen',
                status: 'cancelled',
                progress: 20,
                workflowStage: 'Cancelled',
                nextAction: 'Request Cancelled',
                dueDate: 'N/A',
                supervisor: 'TBD',
                supervisorEmail: 'N/A',
                supervisorPhone: 'N/A',
                type: 'Secondary Placement',
                hours: '80 hours',
                priority: 'medium',
                description:
                    'Placement request cancelled due to workplace capacity constraints.',
                completedSteps: ['Student Added', 'Request Generated'],
                pendingSteps: [],
                actionedBy: 'Workplace Manager',
                actionedByName: 'Jennifer Thompson',
                actionedByAccount: 'Northside Community Center',
                actionDate: 'Aug 18, 2024',
                cancellationComment:
                    'We are currently at full capacity for student placements and cannot accommodate additional students this semester. Please reapply next quarter when we expect to have more supervisory resources available.',
            },
            {
                id: 'PR-2024-033',
                workplace: 'Sunrise Disability Services',
                location: 'Balcatta, WA',
                distance: '15.7 km',
                requestDate: 'Jul 22, 2024',
                createdDate: 'Jul 18, 2024, 11:45 AM',
                lastActionDate: 'Jul 28, 2024, 04:15 PM',
                assignedTo: 'Emma Wilson',
                status: WorkplaceCurrentStatus.RejectedByStudent,
                progress: 15,
                workflowStage: 'Rejected by Student',
                nextAction: 'Request Rejected',
                dueDate: 'N/A',
                supervisor: 'TBD',
                supervisorEmail: 'N/A',
                supervisorPhone: 'N/A',
                type: 'Primary Placement',
                hours: '120 hours',
                priority: 'medium',
                description:
                    'Placement rejected by student due to travel distance and schedule conflicts.',
                completedSteps: [
                    'Student Added',
                    'Request Generated',
                    'Initial Review',
                ],
                pendingSteps: [],
                actionedBy: 'Student',
                actionedByName: 'Hema Maya Monger',
                actionedByAccount: 'Student Account',
                actionDate: 'Jul 28, 2024',
                cancellationComment:
                    'The daily commute of 15.7 km each way is not feasible with my current transportation situation. Additionally, the required placement hours conflict with my part-time work schedule which I need to maintain for financial reasons. I would prefer a placement closer to home with more flexible hours.',
            },
            {
                id: 'PR-2024-019',
                workplace: 'Coastal Care Partners',
                location: 'Scarborough, WA',
                distance: '18.2 km',
                requestDate: 'Jun 5, 2024',
                createdDate: 'Jun 1, 2024, 03:30 PM',
                lastActionDate: 'Jun 15, 2024, 02:50 PM',
                assignedTo: 'Michael Torres',
                status: WorkplaceCurrentStatus.RejectedByIndustry,
                progress: 25,
                workflowStage: 'Rejected by Industry',
                nextAction: 'Request Rejected',
                dueDate: 'N/A',
                supervisor: 'TBD',
                supervisorEmail: 'N/A',
                supervisorPhone: 'N/A',
                type: 'Secondary Placement',
                hours: '100 hours',
                priority: 'low',
                description:
                    'Placement rejected by workplace due to insufficient staffing resources to supervise students.',
                completedSteps: [
                    'Student Added',
                    'Request Generated',
                    'RTO Approval',
                    'Workplace Review',
                ],
                pendingSteps: [],
                actionedBy: 'Industry Partner',
                actionedByName: 'Michael Chen',
                actionedByAccount: 'Coastal Care Partners',
                actionDate: 'Jun 15, 2024',
                cancellationComment:
                    'Unfortunately, we are currently experiencing significant staffing shortages and do not have the supervisory capacity to take on student placements at this time. Our current staff-to-resident ratio makes it challenging to provide adequate mentorship and supervision required for quality student learning experiences. We encourage the student to reapply in 6 months when we anticipate improved staffing levels.',
            },
        ],
        workplaceBio: {
            name: 'Hale Foundation',
            location: 'Marangaroo, WA',
            description:
                'The Hale Foundation is a leading aged care facility providing comprehensive support services for elderly residents. Our mission is to deliver compassionate, person-centered care in a warm and supportive environment. Established in 1992, we have been serving the Western Australian community for over three decades, continuously adapting our services to meet the evolving needs of our residents. Our state-of-the-art facility features modern amenities including specialized dementia care units, physiotherapy rooms, and beautiful outdoor gardens. We pride ourselves on maintaining the highest standards of care, with a dedicated team of healthcare professionals who are committed to enhancing the quality of life for every resident. Our approach emphasizes dignity, respect, and individual choice, ensuring that each person receives tailored support that honors their unique preferences and lifestyle.',
            focus: ['Aged Care', 'Dementia Care', 'Palliative Care'],
            supervisor: 'Sarah Mitchell',
            supervisorRole: 'Clinical Supervisor',
            supervisorPhone: '+61 3 9876 5444',
            supervisorEmail: 's.mitchell@halefoundation.org.au',
        },
        currentStatus: {
            stage: 'Placement Started',
            nextAction: 'Complete workplace orientation',
            dueDate: 'Nov 25, 2025',
            progress: 75,
            completedSteps: [
                'Student Added',
                'Request Generated',
                'RTO Approval',
                'Workplace Confirmed',
                'Agreement Signed',
                'Orientation Scheduled',
            ],
            pendingSteps: ['Complete Orientation', 'Begin Placement Hours'],
        },
    },
    CHC52021: {
        id: 'CHC52021',
        name: 'Diploma of Community Services',
        code: 'CHC52021',
        status: 'Active',
        streams: [
            'Case Management',
            'Client Services',
            'Community Development',
        ],
        overallProgress: 35,
        streamProgress: [
            {
                name: 'Case Management',
                progress: 65,
                color: '#044866',
                icon: '📋',
            },
            {
                name: 'Client Services',
                progress: 28,
                color: '#0D5468',
                icon: '👥',
            },
            {
                name: 'Community Development',
                progress: 12,
                color: '#F7A619',
                icon: '🌐',
            },
        ],
        placementRequests: [
            {
                id: 'PR-2025-145',
                workplace: 'Community Outreach Center',
                location: 'Fremantle, WA',
                distance: '3.5 km',
                requestDate: 'Nov 18, 2025',
                createdDate: 'Nov 10, 2025, 02:30 PM',
                lastActionDate: 'Nov 18, 2025, 04:20 PM',
                assignedTo: 'James Wong',
                status: 'pending',
                progress: 40,
                workflowStage: 'Waiting for RTO',
                nextAction: 'Awaiting RTO approval',
                dueDate: 'Dec 5, 2025',
                supervisor: 'James Wong',
                supervisorEmail: 'j.wong@outreachcenter.org.au',
                supervisorPhone: '+61 8 9335 1234',
                type: 'Secondary Placement',
                hours: '180 hours',
                priority: 'medium',
                description:
                    'Community services placement focusing on case management and client support services in a community outreach setting.',
                completedSteps: [
                    'Student Added',
                    'Request Generated',
                    'RTO Approval Requested',
                ],
                pendingSteps: [
                    'RTO Approval',
                    'Workplace Confirmation',
                    'Agreement Signing',
                    'Orientation',
                ],
            },
        ],
        workplaceBio: {
            name: 'Community Outreach Center',
            location: 'Fremantle, WA',
            description:
                'Community Outreach Center provides essential support services to vulnerable community members including case management, crisis intervention, and community development programs.',
            focus: ['Case Management', 'Crisis Support', 'Youth Services'],
            supervisor: 'James Wong',
            supervisorRole: 'Program Coordinator',
            supervisorPhone: '+61 8 9335 1234',
            supervisorEmail: 'j.wong@outreachcenter.org.au',
        },
        currentStatus: {
            stage: 'Waiting for RTO',
            nextAction: 'Awaiting RTO approval',
            dueDate: 'Dec 5, 2025',
            progress: 40,
            completedSteps: [
                'Student Added',
                'Request Generated',
                'RTO Approval Requested',
            ],
            pendingSteps: [
                'RTO Approval',
                'Workplace Confirmation',
                'Agreement Signing',
                'Orientation',
            ],
        },
    },
    CHC43015: {
        id: 'CHC43015',
        name: 'Certificate IV in Ageing Support',
        code: 'CHC43015',
        status: 'Active',
        streams: [
            'Person-Centered Care',
            'Complex Health Needs',
            'Support Services',
        ],
        overallProgress: 82,
        streamProgress: [
            {
                name: 'Person-Centered Care',
                progress: 95,
                color: '#044866',
                icon: '❤️',
            },
            {
                name: 'Complex Health Needs',
                progress: 78,
                color: '#0D5468',
                icon: '🏥',
            },
            {
                name: 'Support Services',
                progress: 73,
                color: '#F7A619',
                icon: '🤝',
            },
        ],
        placementRequests: [
            {
                id: 'PR-2025-067',
                workplace: 'Sunset Aged Care',
                location: 'Perth CBD, WA',
                distance: '1.2 km',
                requestDate: 'Oct 15, 2025',
                createdDate: 'Oct 1, 2025, 08:45 AM',
                lastActionDate: 'Oct 15, 2025, 05:10 PM',
                assignedTo: 'Linda Thompson',
                status: 'completed',
                progress: 100,
                workflowStage: 'Placement Complete',
                nextAction: 'Assessment Review',
                dueDate: 'Nov 28, 2025',
                supervisor: 'Linda Thompson',
                supervisorEmail: 'l.thompson@sunsetcare.org.au',
                supervisorPhone: '+61 8 9221 5678',
                type: 'Primary Placement',
                hours: '200 hours',
                priority: 'high',
                description:
                    'Advanced ageing support placement focusing on person-centered care and managing complex health needs in aged care environment.',
                completedSteps: [
                    'Student Added',
                    'Request Generated',
                    'RTO Approval',
                    'Workplace Confirmed',
                    'Agreement Signed',
                    'Orientation Completed',
                    'Placement Hours Completed',
                    'Final Assessment',
                ],
                pendingSteps: ['Assessment Review'],
            },
        ],
        workplaceBio: {
            name: 'Sunset Aged Care',
            location: 'Perth CBD, WA',
            description:
                'Sunset Aged Care is a premium facility specializing in high-level aged care with a focus on managing complex health needs and providing person-centered support to residents.',
            focus: [
                'High-Level Care',
                'Dementia Specialist',
                'Palliative Care',
            ],
            supervisor: 'Linda Thompson',
            supervisorRole: 'Senior Care Manager',
            supervisorPhone: '+61 8 9221 5678',
            supervisorEmail: 'l.thompson@sunsetcare.org.au',
        },
        currentStatus: {
            stage: 'Placement Complete',
            nextAction: 'Assessment Review',
            dueDate: 'Nov 28, 2025',
            progress: 100,
            completedSteps: [
                'Student Added',
                'Request Generated',
                'RTO Approval',
                'Workplace Confirmed',
                'Agreement Signed',
                'Orientation Completed',
                'Placement Hours Completed',
                'Final Assessment',
            ],
            pendingSteps: ['Assessment Review'],
        },
    },
}

// Get all courses as array
export const getAllCourses = () => Object.values(coursesData)

// Get course by ID
export const getCourseById = (courseId: string): CourseData | undefined => {
    return coursesData[courseId]
}
