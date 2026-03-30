import { ReactElement, useState } from 'react'

import { AdminLayout } from '@layouts'
import { NextPageWithLayout } from '@types'
import { SectorSelector } from '@partials'
import { Button } from '@components'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export interface Question {
    id: string
    title: string
    question: string
    examples?: string
    type: 'default' | 'custom'
}

export interface Course {
    id: string
    name: string
}

export interface Sector {
    id: string
    name: string
    questions: Question[]
    courses: Course[]
    isUnlocked: boolean
    isOriginal?: boolean // Track if this is the original sector
    supervisorRequirements?: string
    acceptableJobTitles?: string[]
}

const defaultQuestions: Question[] = [
    {
        id: '1',
        title: 'Direct Support Environment',
        question:
            'Do you provide direct client support (personal care, daily living, community support) in a residential, community, home or centre-based setting?',
        type: 'default',
    },
    {
        id: '2',
        title: 'Supervision',
        question:
            'Will the student be supervised by a qualified worker (same qualification or higher) or experienced support staff?',
        type: 'default',
    },
    {
        id: '3',
        title: 'Equipment & Resources',
        question: 'Do you have appropriate equipment and systems in place?',
        examples:
            'Examples: hoists, mobility aids, transfer equipment, PPE, care plans, incident reporting, documentation systems.',
        type: 'default',
    },
]

const defaultCourses: Course[] = [
    {
        id: '1',
        name: 'Certificate III in Individual Support (Ageing)',
    },
    {
        id: '2',
        name: 'Certificate IV in Ageing Support',
    },
    {
        id: '3',
        name: 'Diploma of Community Services',
    },
]

const availableSectors = [
    'Aged Care',
    'Disability Support',
    'Individual Support',
    'Community Services',
    'Health Services Assistance',
]

const SectorList: NextPageWithLayout = () => {
    const [selectedSector, setSelectedSector] = useState<string>('Aged Care')
    const [sectors, setSectors] = useState<Sector[]>([
        {
            id: 'aged-care',
            name: 'Aged Care',
            questions: [...defaultQuestions],
            courses: [...defaultCourses],
            isUnlocked: true, // Aged Care is unlocked by default
            isOriginal: true, // Mark as original sector
            supervisorRequirements:
                'Certificate III in Individual Support (Ageing) or higher\nOR\nDiploma in Community Services / Nursing qualification\nOR\nEnrolled Nurse (EN) or Registered Nurse (RN) (in residential aged care)',
            acceptableJobTitles: [
                'Personal Care Worker (Senior)',
                'Aged Care Support Worker',
                'Team Leader',
                'Enrolled Nurse',
                'Registered Nurse',
            ],
        },
    ])

    const currentSector = sectors.find((s) => s.name === selectedSector)

    const handleAddSector = (sectorName: string) => {
        if (!sectors.find((s) => s.name === sectorName)) {
            setSectors([
                ...sectors,
                {
                    id: sectorName.toLowerCase().replace(/\s+/g, '-'),
                    name: sectorName,
                    questions: [...defaultQuestions],
                    courses: [...defaultCourses],
                    isUnlocked: false,
                    isOriginal: false, // Cluster sectors are not original
                },
            ])
        }
    }

    const handleUpdateQuestions = (questions: Question[]) => {
        setSectors(
            sectors.map((sector) =>
                sector.name === selectedSector
                    ? { ...sector, questions }
                    : sector
            )
        )
    }

    const handleUpdateCourses = (courses: Course[]) => {
        setSectors(
            sectors.map((sector) =>
                sector.name === selectedSector ? { ...sector, courses } : sector
            )
        )
    }

    const handleUpdateSupervisorRequirements = (
        requirements: string,
        jobTitles: string[]
    ) => {
        setSectors(
            sectors.map((sector) =>
                sector.name === selectedSector
                    ? {
                          ...sector,
                          supervisorRequirements: requirements,
                          acceptableJobTitles: jobTitles,
                      }
                    : sector
            )
        )
    }

    const handleUnlockSector = () => {
        setSectors(
            sectors.map((sector) =>
                sector.name === selectedSector
                    ? { ...sector, isUnlocked: !sector.isUnlocked }
                    : sector
            )
        )
    }
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Sector Management
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Configure sectors, prerequisites, and course
                            requirements
                        </p>
                    </div>
                    <Link href="/industry">
                        <Button
                            variant="secondary"
                            outline
                            Icon={ExternalLink}
                            text="View Industry Page"
                        />
                    </Link>
                </div>
            </div>
            <SectorSelector
                selectedSector={selectedSector}
                sectors={sectors}
                availableSectors={availableSectors}
                onSelectSector={setSelectedSector}
                onAddSector={handleAddSector}
            />
        </div>
    )
}

SectorList.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default SectorList
