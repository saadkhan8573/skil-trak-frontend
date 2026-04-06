export interface IndustryCheck {
    id: string
    name: string
    icon?: string
    description?: string
    required: boolean
    showToStudents: boolean
}

export interface Sector {
    id: string
    name: string
    workplaceTypes: string
    supervisorName: string
    supervisorLevel: string
    qualificationTitle: string
    industryChecks: IndustryCheck[]
    capacity: number
    capacityPeriod: string
    eligibilityChecks?: {
        directSupport: boolean
        supervision: boolean
        equipmentResources: boolean
    }
    questionChecks?: Record<number, boolean>
    coursePrerequisites?: {
        [courseId: string]: {
            directSupport: boolean
            supervision: boolean
            equipmentResources: boolean
        }
    }
    confirmed?: boolean
}

export interface Step2Data {
    sectors: Sector[]
    selectedCourses: string[]
    sectorEligibility?: {
        communityServices: boolean
        healthCare: boolean
        education: boolean
        hospitality: boolean
        construction: boolean
        informationTechnology: boolean
    }
}

export interface Course {
    id: string
    name: string
    sector: string
    requirements: string
    hodNote: string
    tasks: string[]
    equipmentAvailable: string
}
// Updated with brand colors only
export const availableSectors = [
    {
        name: 'Community Services',
        icon: '🏠',
        color: '#044866',
        bgColor: 'rgba(4, 72, 102, 0.05)',
    },
    {
        name: 'Disability',
        icon: '♿',
        color: '#0D5468',
        bgColor: 'rgba(13, 84, 104, 0.05)',
    },
    {
        name: 'Mental Health',
        icon: '🧠',
        color: '#044866',
        bgColor: 'rgba(4, 72, 102, 0.05)',
    },
    {
        name: 'Health Care',
        icon: '⚕️',
        color: '#0D5468',
        bgColor: 'rgba(13, 84, 104, 0.05)',
    },
    {
        name: 'Individual Support',
        icon: '🤝',
        color: '#044866',
        bgColor: 'rgba(4, 72, 102, 0.05)',
    },
]

export const qualificationLevels = [
    { value: 'Cert III', label: 'Certificate III', icon: '🥉' },
    { value: 'Cert IV', label: 'Certificate IV', icon: '🥈' },
    { value: 'Diploma', label: 'Diploma', icon: '🥇' },
    { value: 'Bachelor', label: 'Bachelor Degree', icon: '🏆' },
    { value: 'Other', label: 'Other', icon: '📜' },
]

export const industryChecks = [
    {
        id: 'wwcc',
        name: 'WWCC',
        icon: '👥',
        description: 'Working with Children Check',
        details:
            'A Working with Children Check is mandatory for anyone working with children. It involves a national criminal background check and review of findings of workplace misconduct.',
        processing: '2-4 weeks',
        cost: '$80 (valid for 5 years)',
        requirements: [
            'Application form',
            'Identity documents',
            'Proof of residence',
        ],
    },
    {
        id: 'police',
        name: 'Police Check',
        icon: '🛡️',
        description: 'National Police Check',
        details:
            "A National Police Check provides a summary of an individual's disclosable court outcomes and pending charges from all Australian police jurisdictions.",
        processing: '2-15 business days',
        cost: '$42-$99 depending on provider',
        requirements: ['100 points of identity', 'Consent form', 'Payment'],
    },
    {
        id: 'ndis',
        name: 'NDIS',
        icon: '♿',
        description: 'NDIS Worker Screening',
        details:
            'NDIS Worker Screening Check is required for all workers providing supports or services to people with disability. It includes criminal history and misconduct checks.',
        processing: '2-4 weeks',
        cost: '$80 (valid for 5 years)',
        requirements: [
            'Application form',
            'Identity verification',
            'Character references',
        ],
    },
    {
        id: 'other',
        name: 'Other',
        icon: '📋',
        description: 'Other industry-specific checks',
        details:
            'Additional industry-specific background checks may include professional registration verification, reference checks, or specialized clearances required for particular roles.',
        processing: 'Varies by check type',
        cost: 'Varies by provider',
        requirements: ['Varies by check type'],
    },
]

export interface CourseExtended extends Course {
    level: string
    minSupervisorLevel: string
    tgaHours: number
    placementRequirements: string[]
    assessmentMethods: string[]
}

export const mockCourses: CourseExtended[] = [
    {
        id: '1',
        name: 'Certificate III in Individual Support',
        sector: 'Community Services',
        level: 'Cert III',
        minSupervisorLevel: 'Cert III',
        requirements: 'WWCC, Police Check required',
        hodNote:
            'Students must complete 120 hours of practical placement including personal care, disability support, and community participation activities',
        tgaHours: 120,
        placementRequirements: [
            'Complete minimum 120 hours supervised practice',
            'Demonstrate person-centered care approaches',
            'Practice communication and advocacy skills',
            'Complete workplace safety training',
            'Document all client interactions appropriately',
            'Participate in care planning meetings',
        ],
        assessmentMethods: [
            'Direct observation of practice',
            'Portfolio of evidence',
            'Reflective journals',
            'Case study analysis',
            'Supervisor feedback reports',
        ],
        tasks: [
            'Personal care assistance (showering, dressing, grooming)',
            'Medication administration support',
            'Communication support and advocacy',
            'Mobility assistance and transfers',
            'Meal preparation and feeding assistance',
            'Documentation and reporting',
        ],
        equipmentAvailable:
            'Hoists, wheelchairs, communication devices, mobility aids, shower chairs, bed rails, personal care equipment',
    },
    {
        id: '1b',
        name: 'Certificate III in Disability',
        sector: 'Disability',
        level: 'Cert III',
        minSupervisorLevel: 'Cert III',
        requirements: 'WWCC, NDIS clearance, Police Check required',
        hodNote:
            'Students must demonstrate understanding of complex support needs, behaviour support, and person-centered approaches in disability services',
        tgaHours: 120,
        placementRequirements: [
            'Complete minimum 120 hours supervised practice',
            'Work with clients with complex or high-support needs',
            'Practice behaviour support strategies',
            'Implement positive behaviour support plans',
            'Complete workplace safety and manual handling training',
            'Document all support activities appropriately',
            'Participate in multidisciplinary planning meetings',
        ],
        assessmentMethods: [
            'Direct observation of support practices',
            'Portfolio of evidence',
            'Reflective practice journals',
            'Behaviour support case studies',
            'Supervisor feedback reports',
        ],
        tasks: [
            'Implementation of behaviour support plans',
            'Complex personal care and support',
            'Communication support using AAC devices',
            'Support with community participation',
            'Medication administration support',
            'Crisis prevention and intervention',
            'Documentation and incident reporting',
        ],
        equipmentAvailable:
            'Hoists, AAC devices, sensory equipment, behaviour support resources, mobility aids, specialized seating, personal care equipment',
    },
    {
        id: '1c',
        name: 'Certificate IV in Disability',
        sector: 'Disability',
        level: 'Cert IV',
        minSupervisorLevel: 'Cert IV',
        requirements: 'WWCC, NDIS clearance, Police Check required',
        hodNote:
            'Advanced disability support including coordination, advocacy and implementation of complex support strategies',
        tgaHours: 160,
        placementRequirements: [
            'Complete minimum 160 hours supervised practice',
            'Demonstrate advanced behaviour support skills',
            'Coordinate support services and resources',
            'Practice advocacy and rights-based approaches',
            'Lead implementation of support plans',
            'Facilitate community inclusion activities',
            'Participate in case management',
        ],
        assessmentMethods: [
            'Advanced competency assessments',
            'Service coordination projects',
            'Advocacy case studies',
            'Leadership observations',
            'Professional reflection reports',
        ],
        tasks: [
            'Coordinate complex support services',
            'Develop and implement support plans',
            'Advocate for client rights and choices',
            'Facilitate community access',
            'Mentor and support team members',
            'Manage challenging behaviours',
            'Coordinate multidisciplinary support',
        ],
        equipmentAvailable:
            'Advanced AAC systems, behaviour monitoring tools, advocacy resources, assessment frameworks, specialized equipment',
    },
    {
        id: '1d',
        name: 'Certificate IV in Mental Health',
        sector: 'Mental Health',
        level: 'Cert IV',
        minSupervisorLevel: 'Cert IV',
        requirements: 'WWCC, Police Check, Mental Health First Aid required',
        hodNote:
            'Students must demonstrate understanding of recovery-oriented practice and trauma-informed care approaches',
        tgaHours: 160,
        placementRequirements: [
            'Complete minimum 160 hours supervised practice',
            'Work with clients experiencing mental health challenges',
            'Practice recovery-oriented approaches',
            'Implement wellness and recovery plans',
            'Complete mental health first aid training',
            'Document support activities appropriately',
            'Participate in case reviews and planning',
        ],
        assessmentMethods: [
            'Direct observation of practice',
            'Case study analysis',
            'Recovery plan portfolios',
            'Reflective practice journals',
            'Supervisor competency assessments',
        ],
        tasks: [
            'Implement wellness and recovery plans',
            'Support with daily living activities',
            'Facilitate community participation',
            'Crisis support and de-escalation',
            'Peer support and counseling',
            'Documentation and reporting',
            'Medication support and monitoring',
        ],
        equipmentAvailable:
            'Mental health assessment tools, wellness resources, crisis intervention protocols, peer support materials',
    },
    {
        id: '1e',
        name: 'Certificate III in Individual Support (Ageing)',
        sector: 'Individual Support',
        level: 'Cert III',
        minSupervisorLevel: 'Cert III',
        requirements: 'WWCC, Police Check required',
        hodNote:
            'Focus on person-centered care for older Australians in various care settings',
        tgaHours: 120,
        placementRequirements: [
            'Complete minimum 120 hours supervised practice',
            'Provide person-centered care to older adults',
            'Practice dignity and respect approaches',
            'Complete workplace safety training',
            'Support with activities of daily living',
            'Document care appropriately',
            'Participate in care team meetings',
        ],
        assessmentMethods: [
            'Direct observation of care practices',
            'Portfolio of evidence',
            'Reflective journals',
            'Care scenario assessments',
            'Supervisor feedback reports',
        ],
        tasks: [
            'Personal care assistance',
            'Mobility and transfer support',
            'Meal preparation and feeding assistance',
            'Social support and engagement',
            'Health monitoring',
            'Medication assistance',
            'Documentation and reporting',
        ],
        equipmentAvailable:
            'Personal care equipment, mobility aids, monitoring devices, communication tools, care planning systems',
    },
    {
        id: '1f',
        name: 'Certificate III in Individual Support (Disability)',
        sector: 'Individual Support',
        level: 'Cert III',
        minSupervisorLevel: 'Cert III',
        requirements: 'WWCC, NDIS clearance, Police Check required',
        hodNote:
            'Providing support to people with disabilities across various settings and life stages',
        tgaHours: 120,
        placementRequirements: [
            'Complete minimum 120 hours supervised practice',
            'Support people with various disabilities',
            'Practice person-centered approaches',
            'Implement support plans',
            'Complete workplace safety training',
            'Document support activities',
            'Participate in planning meetings',
        ],
        assessmentMethods: [
            'Direct observation of support practice',
            'Portfolio development',
            'Reflective practice journals',
            'Support plan implementation records',
            'Supervisor assessments',
        ],
        tasks: [
            'Personal care and daily living support',
            'Communication and social support',
            'Community participation assistance',
            'Behavior support implementation',
            'Mobility and transfer assistance',
            'Activity facilitation',
            'Documentation and reporting',
        ],
        equipmentAvailable:
            'Communication devices, mobility aids, behavior support tools, personal care equipment, adaptive technology',
    },
    {
        id: '2',
        name: 'Certificate IV in Ageing Support',
        sector: 'Health Care',
        level: 'Cert IV',
        minSupervisorLevel: 'Cert IV',
        requirements: 'WWCC, NDIS clearance, Police Check',
        hodNote:
            'Focus on person-centered care approaches with emphasis on dignity of risk and consumer choice',
        tgaHours: 160,
        placementRequirements: [
            'Complete minimum 160 hours supervised practice',
            'Demonstrate advanced care planning skills',
            'Practice family and carer communication',
            'Complete medication management training',
            'Demonstrate dementia care competencies',
            'Participate in multidisciplinary team meetings',
            'Complete end-of-life care training',
        ],
        assessmentMethods: [
            'Clinical competency assessments',
            'Care plan development projects',
            'Family conference participation',
            'Medication management observations',
            'Reflective practice sessions',
        ],
        tasks: [
            'Develop and implement care plans',
            'Family and carer liaison',
            'Health monitoring and vital signs',
            'Medication management oversight',
            'Dementia care support',
            'End-of-life care assistance',
        ],
        equipmentAvailable:
            'Blood pressure monitors, pulse oximeters, mobility aids, dementia care resources, documentation systems',
    },
    {
        id: '3',
        name: 'Diploma of Early Childhood Education and Care',
        sector: 'Education',
        level: 'Diploma',
        minSupervisorLevel: 'Diploma',
        requirements: 'WWCC, Police Check, First Aid Certificate',
        hodNote:
            'Students must demonstrate educational leadership and advanced child development knowledge',
        tgaHours: 240,
        placementRequirements: [
            'Complete minimum 240 hours supervised practice',
            'Demonstrate educational program planning',
            'Practice inclusive education strategies',
            'Complete behaviour guidance training',
            'Develop family partnership skills',
            'Participate in staff meetings and professional development',
        ],
        assessmentMethods: [
            'Educational program portfolio',
            'Child observation and documentation',
            'Family engagement projects',
            'Leadership competency assessment',
            'Professional reflection reports',
        ],
        tasks: [
            'Educational program development and implementation',
            'Child development assessment and documentation',
            'Family and community engagement',
            'Staff supervision and mentoring',
            'Curriculum planning and evaluation',
            'Behaviour guidance and support',
        ],
        equipmentAvailable:
            'Educational resources, assessment tools, documentation systems, outdoor play equipment',
    },
    {
        id: '4',
        name: 'Certificate III in Commercial Cookery',
        sector: 'Hospitality',
        level: 'Cert III',
        minSupervisorLevel: 'Cert III',
        requirements: 'Food Safety Certificate, Police Check',
        hodNote:
            'Students must demonstrate commercial kitchen skills and food safety compliance',
        tgaHours: 200,
        placementRequirements: [
            'Complete minimum 200 hours supervised practice',
            'Demonstrate commercial cooking techniques',
            'Practice food safety and hygiene protocols',
            'Complete menu planning and costing',
            'Develop customer service skills',
            'Participate in kitchen operations management',
        ],
        assessmentMethods: [
            'Practical cooking assessments',
            'Food safety compliance checks',
            'Menu development projects',
            'Customer service observations',
            'Kitchen management tasks',
        ],
        tasks: [
            'Food preparation and cooking',
            'Menu planning and development',
            'Kitchen hygiene and safety',
            'Customer service delivery',
            'Stock management and ordering',
            'Equipment operation and maintenance',
        ],
        equipmentAvailable:
            'Commercial kitchen equipment, cooking utensils, food storage systems, point-of-sale systems',
    },
]

// Qualification hierarchy for supervisor matching
export const qualificationHierarchy = {
    'Cert III': 3,
    'Cert IV': 4,
    Diploma: 5,
    Bachelor: 6,
    Other: 10,
}
