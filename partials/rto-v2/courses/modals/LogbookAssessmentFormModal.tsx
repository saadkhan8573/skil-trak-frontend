import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Label } from '@components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import {
    Building2,
    Calendar,
    ClipboardCheck,
    Clock,
    Download,
    FileText,
    Lock,
    Save,
    Send,
    Signature,
    User,
} from 'lucide-react'
import { useState } from 'react'
import { Checkbox } from '@components/ui/checkbox'
import { ScrollArea } from '@components/ui/scroll-area'
import { TextArea, TextInput } from '@components'

type LogbookStatus =
    | 'uploaded'
    | 'summarized'
    | 'formReady'
    | 'inProgress'
    | 'pendingSign'
    | 'signedLocked'
type UserRole = 'student' | 'supervisor' | 'assessor'

interface LogbookAssessmentFormProps {
    open: boolean
    onClose: () => void
    courseId: string
    courseName: string
    logbookSummary: {
        student: string
        course: string
        site: string
        dateRange: string
        totalHours: number
        weeklyHours: number
        keyActivities: string[]
        supervisor: string
        extractedDate: string
    }
    currentRole: UserRole
    status: LogbookStatus
    onStatusChange: (newStatus: LogbookStatus) => void
}

export const LogbookAssessmentForm = ({
    open,
    onClose,
    courseId,
    courseName,
    logbookSummary,
    currentRole: initialRole,
    status,
    onStatusChange,
}: LogbookAssessmentFormProps) => {
    const [activeTab, setActiveTab] = useState<string>('student')
    const [currentRole, setCurrentRole] = useState<UserRole>(initialRole)

    // Student section state
    const [weeklyEntries, setWeeklyEntries] = useState([
        {
            week: 1,
            startDate: 'Sep 1, 2024',
            endDate: 'Sep 7, 2024',
            hours: 20,
            tasks: '',
            challenges: '',
            learning: '',
            skillsDeveloped: '',
        },
        {
            week: 2,
            startDate: 'Sep 8, 2024',
            endDate: 'Sep 14, 2024',
            hours: 20,
            tasks: '',
            challenges: '',
            learning: '',
            skillsDeveloped: '',
        },
        {
            week: 3,
            startDate: 'Sep 15, 2024',
            endDate: 'Sep 21, 2024',
            hours: 20,
            tasks: '',
            challenges: '',
            learning: '',
            skillsDeveloped: '',
        },
        {
            week: 4,
            startDate: 'Sep 22, 2024',
            endDate: 'Sep 28, 2024',
            hours: 20,
            tasks: '',
            challenges: '',
            learning: '',
            skillsDeveloped: '',
        },
        {
            week: 5,
            startDate: 'Sep 29, 2024',
            endDate: 'Oct 5, 2024',
            hours: 20,
            tasks: '',
            challenges: '',
            learning: '',
            skillsDeveloped: '',
        },
        {
            week: 6,
            startDate: 'Oct 6, 2024',
            endDate: 'Oct 12, 2024',
            hours: 20,
            tasks: '',
            challenges: '',
            learning: '',
            skillsDeveloped: '',
        },
    ])

    const [studentReflection, setStudentReflection] = useState({
        overallExperience: '',
        mostValuableLearning: '',
        areasForImprovement: '',
        careerImpact: '',
        futureGoals: '',
    })

    // Supervisor section state
    const [hoursVerified, setHoursVerified] = useState(false)
    const [supervisorAssessment, setSupervisorAssessment] = useState({
        punctuality: '',
        professionalism: '',
        communication: '',
        technicalSkills: '',
        initiative: '',
        teamwork: '',
        safetyCompliance: '',
        clientInteraction: '',
        overallComments: '',
    })
    const [supervisorSignature, setSupervisorSignature] = useState('')
    const [supervisorSignDate, setSupervisorSignDate] = useState('')

    // Assessor section state
    const [competencyChecklist, setCompetencyChecklist] = useState([
        {
            id: 'c1',
            code: 'CHCCCS015',
            name: 'Provide individualised support',
            checked: false,
            evidence: '',
        },
        {
            id: 'c2',
            code: 'CHCCCS023',
            name: 'Support independence and wellbeing',
            checked: false,
            evidence: '',
        },
        {
            id: 'c3',
            code: 'HLTAAP001',
            name: 'Recognise healthy body systems',
            checked: false,
            evidence: '',
        },
        {
            id: 'c4',
            code: 'CHCDIV001',
            name: 'Work with diverse people',
            checked: false,
            evidence: '',
        },
        {
            id: 'c5',
            code: 'CHCLEG001',
            name: 'Work legally and ethically',
            checked: false,
            evidence: '',
        },
        {
            id: 'c6',
            code: 'CHCCOM005',
            name: 'Communicate and work in health or community services',
            checked: false,
            evidence: '',
        },
        {
            id: 'c7',
            code: 'HLTINF001',
            name: 'Comply with infection prevention and control policies',
            checked: false,
            evidence: '',
        },
        {
            id: 'c8',
            code: 'HLTWHS002',
            name: 'Follow safe work practices for direct client care',
            checked: false,
            evidence: '',
        },
    ])

    const [performanceEvidence, setPerformanceEvidence] = useState({
        demonstratedCompetence: false,
        consistentPerformance: false,
        industryStandards: false,
        regulatoryCompliance: false,
    })

    const [assessorComments, setAssessorComments] = useState({
        strengths: '',
        areasForDevelopment: '',
        recommendations: '',
        additionalNotes: '',
    })

    const [assessmentOutcome, setAssessmentOutcome] = useState<string>('')
    const [assessorSignature, setAssessorSignature] = useState('')
    const [assessorSignDate, setAssessorSignDate] = useState('')

    const isLocked = status === 'signedLocked'
    const canEdit = !isLocked

    const statusConfig = {
        uploaded: { label: 'Uploaded', color: 'bg-blue-500' },
        summarized: { label: 'Summarized', color: 'bg-cyan-500' },
        formReady: { label: 'Form Ready', color: 'bg-purple-500' },
        inProgress: { label: 'In Progress', color: 'bg-amber-500' },
        pendingSign: { label: 'Pending Sign', color: 'bg-orange-500' },
        signedLocked: { label: 'Signed/Locked', color: 'bg-success' },
    }

    const handleSave = () => {
        if (status === 'formReady') {
            onStatusChange('inProgress')
        }
    }

    const handleSubmit = () => {
        if (currentRole === 'student') {
            onStatusChange('pendingSign')
        }
    }

    const handleSign = () => {
        if (currentRole === 'supervisor' && supervisorSignature) {
        } else if (currentRole === 'assessor' && assessorSignature) {
            onStatusChange('signedLocked')
        }
    }

    const canStudentEdit =
        canEdit && currentRole === 'student' && status !== 'pendingSign'
    const canSupervisorEdit =
        canEdit && currentRole === 'supervisor' && status === 'pendingSign'
    const canAssessorEdit =
        canEdit && currentRole === 'assessor' && status === 'pendingSign'

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="min-w-4xl max-h-[95vh] overflow-auto flex flex-col p-0"
                aria-describedby="assessment-description"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>
                        Work Placement Assessment Form - {courseName}
                    </DialogTitle>
                    <DialogDescription id="assessment-description">
                        Complete the three-part assessment form for{' '}
                        {logbookSummary.student}'s placement at{' '}
                        {logbookSummary.site}. This includes student
                        reflections, supervisor evaluation, and RTO assessor
                        competency verification.
                    </DialogDescription>
                </DialogHeader>

                {/* PDF-Style Header */}
                <div className="bg-linear-to-r from-primary to-secondary text-white px-8 py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-5 w-5" />
                                <h1 className="text-lg uppercase tracking-wide">
                                    Work Placement Assessment Form
                                </h1>
                            </div>
                            <h2 className="text-2xl font-bold mb-1">
                                {courseName}
                            </h2>
                            <p className="text-sm text-white/80">
                                Course Code: {courseId}
                            </p>
                        </div>
                        <Badge
                            className={`${statusConfig[status].color} text-white border-0 shrink-0`}
                        >
                            {statusConfig[status].label}
                        </Badge>
                    </div>
                </div>

                {/* Document Info Bar */}
                <div className="bg-muted/30 px-8 py-3 border-b">
                    <div className="flex items-center justify-between gap-4">
                        <div className="grid grid-cols-4 gap-4 text-xs flex-1">
                            <div>
                                <p className="text-muted-foreground mb-0.5">
                                    Student Name
                                </p>
                                <p className="font-semibold">
                                    {logbookSummary.student}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-0.5">
                                    Placement Site
                                </p>
                                <p className="font-semibold">
                                    {logbookSummary.site}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-0.5">
                                    Duration
                                </p>
                                <p className="font-semibold">
                                    {logbookSummary.dateRange}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-0.5">
                                    Total Hours
                                </p>
                                <p className="font-semibold">
                                    {logbookSummary.totalHours} hours
                                </p>
                            </div>
                        </div>

                        {/* Role Switcher for Demo */}
                        <div className="flex items-center gap-2 border-l pl-4">
                            <p className="text-xs text-muted-foreground">
                                Viewing as:
                            </p>
                            <select
                                value={currentRole}
                                onChange={(e: any) =>
                                    setCurrentRole(e.target.value as UserRole)
                                }
                                className="h-8 px-2 text-xs rounded-md border border-input bg-background"
                            >
                                <option value="student">Student</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="assessor">RTO Assessor</option>
                            </select>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <div className="sticky top-0 bg-background z-10 border-b px-8 pt-4">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="student" className="gap-2">
                                    <User className="h-4 w-4" />
                                    Part A: Student
                                </TabsTrigger>
                                <TabsTrigger
                                    value="supervisor"
                                    className="gap-2"
                                >
                                    <Building2 className="h-4 w-4" />
                                    Part B: Supervisor
                                </TabsTrigger>
                                <TabsTrigger value="assessor" className="gap-2">
                                    <ClipboardCheck className="h-4 w-4" />
                                    Part C: RTO Assessor
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Part A: Student Tab */}
                        <TabsContent
                            value="student"
                            className="px-8 py-6 space-y-6 mt-0"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-primary">
                                    <div className="bg-primary text-white h-8 w-8 rounded flex items-center justify-center font-bold">
                                        A
                                    </div>
                                    <h3 className="text-lg font-bold">
                                        PART A: STUDENT SECTION
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Complete all sections below. Provide
                                    detailed responses demonstrating your
                                    learning and skill development throughout
                                    the placement period.
                                </p>

                                {/* Section 1: Weekly Activity Log */}
                                <div className="mb-8">
                                    <h4 className="font-bold text-sm mb-3 bg-muted/50 p-2 rounded">
                                        Section 1: Weekly Activity Log
                                    </h4>

                                    {weeklyEntries.map((entry, index) => (
                                        <div
                                            key={entry.week}
                                            className="mb-6 border rounded-lg p-4 bg-white dark:bg-background"
                                        >
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b">
                                                <h5 className="font-semibold">
                                                    Week {entry.week}
                                                </h5>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {entry.startDate} -{' '}
                                                        {entry.endDate}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {entry.hours} hours
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <TextArea
                                                        name="tasks"
                                                        label={`1.${
                                                            index + 1
                                                        }.1 Describe
                                                        the main tasks and
                                                        activities performed
                                                        this week`}
                                                        value={entry.tasks}
                                                        onChange={(e: any) => {
                                                            const updated = [
                                                                ...weeklyEntries,
                                                            ]
                                                            updated[
                                                                index
                                                            ].tasks =
                                                                e.target.value
                                                            setWeeklyEntries(
                                                                updated
                                                            )
                                                        }}
                                                        placeholder="Detail specific tasks, client interactions, and daily responsibilities..."
                                                        disabled={
                                                            !canStudentEdit
                                                        }
                                                        className="min-h-25 text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <TextArea
                                                        name="challenges"
                                                        label={`1.${
                                                            index + 1
                                                        }.2 What
                                                        challenges did you
                                                        encounter and how did
                                                        you address them?`}
                                                        value={entry.challenges}
                                                        onChange={(e: any) => {
                                                            const updated = [
                                                                ...weeklyEntries,
                                                            ]
                                                            updated[
                                                                index
                                                            ].challenges =
                                                                e.target.value
                                                            setWeeklyEntries(
                                                                updated
                                                            )
                                                        }}
                                                        placeholder="Describe any difficulties, problem-solving approaches, and outcomes..."
                                                        disabled={
                                                            !canStudentEdit
                                                        }
                                                        className="min-h-20 text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <TextArea
                                                        label={`1.${
                                                            index + 1
                                                        }.3 Key
                                                        learning outcomes and
                                                        insights gained`}
                                                        name="learning"
                                                        value={entry.learning}
                                                        onChange={(e: any) => {
                                                            const updated = [
                                                                ...weeklyEntries,
                                                            ]
                                                            updated[
                                                                index
                                                            ].learning =
                                                                e.target.value
                                                            setWeeklyEntries(
                                                                updated
                                                            )
                                                        }}
                                                        placeholder="What did you learn? How does this relate to your course units?"
                                                        disabled={
                                                            !canStudentEdit
                                                        }
                                                        className="min-h-20 text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <TextArea
                                                        name="skillsDeveloped"
                                                        label={`1.${
                                                            index + 1
                                                        }.4 Skills
                                                        developed or improved`}
                                                        value={
                                                            entry.skillsDeveloped
                                                        }
                                                        onChange={(e: any) => {
                                                            const updated = [
                                                                ...weeklyEntries,
                                                            ]
                                                            updated[
                                                                index
                                                            ].skillsDeveloped =
                                                                e.target.value
                                                            setWeeklyEntries(
                                                                updated
                                                            )
                                                        }}
                                                        placeholder="Identify specific technical, communication, or professional skills..."
                                                        disabled={
                                                            !canStudentEdit
                                                        }
                                                        className="min-h-20 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Section 2: Overall Reflection */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-sm mb-3 bg-muted/50 p-2 rounded">
                                        Section 2: Overall Placement Reflection
                                    </h4>

                                    <div className="space-y-4 border rounded-lg p-4 bg-white dark:bg-background">
                                        <div>
                                            <TextArea
                                                label={
                                                    '2.1 Describe your overall experience during this placement'
                                                }
                                                name="overallExperience"
                                                value={
                                                    studentReflection.overallExperience
                                                }
                                                onChange={(e: any) =>
                                                    setStudentReflection({
                                                        ...studentReflection,
                                                        overallExperience:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Provide a comprehensive overview of your placement experience..."
                                                disabled={!canStudentEdit}
                                                className="min-h-30 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                label={
                                                    ' 2.2 What was the most valuable learning from this placement?'
                                                }
                                                name={'mostValuableLearning'}
                                                value={
                                                    studentReflection.mostValuableLearning
                                                }
                                                onChange={(e: any) =>
                                                    setStudentReflection({
                                                        ...studentReflection,
                                                        mostValuableLearning:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Identify the most significant insights or skills gained..."
                                                disabled={!canStudentEdit}
                                                className="min-h-25 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                label={
                                                    '2.3 Identify areas where you believe you need further development'
                                                }
                                                name="areasForImprovement"
                                                value={
                                                    studentReflection.areasForImprovement
                                                }
                                                onChange={(e: any) =>
                                                    setStudentReflection({
                                                        ...studentReflection,
                                                        areasForImprovement:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Be honest about skills or knowledge areas requiring improvement..."
                                                disabled={!canStudentEdit}
                                                className="min-h-25 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                name="careerImpact"
                                                label={
                                                    '2.4 How has this placement influenced your career goals?'
                                                }
                                                value={
                                                    studentReflection.careerImpact
                                                }
                                                onChange={(e: any) =>
                                                    setStudentReflection({
                                                        ...studentReflection,
                                                        careerImpact:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Reflect on how this experience has shaped your career direction..."
                                                disabled={!canStudentEdit}
                                                className="min-h-25 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-xs font-semibold mb-1.5 block">
                                                2.5 What are your future
                                                professional development goals?
                                            </Label>
                                            <TextArea
                                                label={
                                                    '2.5 What are your future professional development goals?'
                                                }
                                                name="futureGoals"
                                                value={
                                                    studentReflection.futureGoals
                                                }
                                                onChange={(e: any) =>
                                                    setStudentReflection({
                                                        ...studentReflection,
                                                        futureGoals:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Outline specific goals and next steps in your professional journey..."
                                                disabled={!canStudentEdit}
                                                className="min-h-25 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {canStudentEdit && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                            onClick={handleSave}
                                            variant="outline"
                                            className="gap-2"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Draft
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                            className="gap-2"
                                        >
                                            <Send className="h-4 w-4" />
                                            Submit to Supervisor
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Part B: Supervisor Tab */}
                        <TabsContent
                            value="supervisor"
                            className="px-8 py-6 space-y-6 mt-0"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-secondary">
                                    <div className="bg-secondary text-white h-8 w-8 rounded flex items-center justify-center font-bold">
                                        B
                                    </div>
                                    <h3 className="text-lg font-bold">
                                        PART B: INDUSTRY SUPERVISOR ASSESSMENT
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Please provide a comprehensive assessment of
                                    the student's performance during their
                                    placement. Your feedback is critical for
                                    their competency assessment.
                                </p>

                                {/* Hours Verification */}
                                <div className="mb-6 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                    <h4 className="font-bold text-sm mb-3">
                                        Hours Verification (Required)
                                    </h4>
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            id="verify-hours"
                                            checked={hoursVerified}
                                            onCheckedChange={(checked) =>
                                                setHoursVerified(
                                                    checked as boolean
                                                )
                                            }
                                            disabled={!canSupervisorEdit}
                                            className="mt-1"
                                        />
                                        <Label
                                            htmlFor="verify-hours"
                                            className="cursor-pointer text-sm"
                                        >
                                            I verify that{' '}
                                            <strong>
                                                {logbookSummary.student}
                                            </strong>{' '}
                                            has completed{' '}
                                            <strong>
                                                {logbookSummary.totalHours}{' '}
                                                hours
                                            </strong>{' '}
                                            of supervised placement at{' '}
                                            <strong>
                                                {logbookSummary.site}
                                            </strong>{' '}
                                            from {logbookSummary.dateRange}. The
                                            student attended regularly and
                                            completed the required hours as
                                            documented.
                                        </Label>
                                    </div>
                                </div>

                                {/* Performance Assessment */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-sm mb-3 bg-muted/50 p-2 rounded">
                                        Performance Assessment
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Rate and comment on the following areas.
                                        Use the rating scale: Outstanding (5),
                                        Very Good (4), Good (3), Satisfactory
                                        (2), Needs Improvement (1)
                                    </p>

                                    <div className="space-y-4 border rounded-lg p-4 bg-white dark:bg-background">
                                        <div>
                                            <Label className="text-xs font-semibold mb-1.5 block">
                                                1. Punctuality and Attendance
                                            </Label>
                                            <div className="flex gap-2 mb-2">
                                                {[1, 2, 3, 4, 5].map(
                                                    (rating) => (
                                                        <button
                                                            key={rating}
                                                            className={`px-3 py-1 text-xs border rounded ${
                                                                supervisorAssessment.punctuality ===
                                                                rating.toString()
                                                                    ? 'bg-primary text-white border-primary'
                                                                    : 'border-border hover:bg-muted'
                                                            }`}
                                                            onClick={() =>
                                                                setSupervisorAssessment(
                                                                    {
                                                                        ...supervisorAssessment,
                                                                        punctuality:
                                                                            rating.toString(),
                                                                    }
                                                                )
                                                            }
                                                            disabled={
                                                                !canSupervisorEdit
                                                            }
                                                        >
                                                            {rating}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                            <TextArea
                                                name="punctuality"
                                                value={
                                                    supervisorAssessment.punctuality
                                                }
                                                onChange={(e: any) =>
                                                    setSupervisorAssessment({
                                                        ...supervisorAssessment,
                                                        punctuality:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Comments on attendance, timeliness, and reliability..."
                                                disabled={!canSupervisorEdit}
                                                className="min-h-15 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                name="professionalism"
                                                label={
                                                    '2. Professionalism and Work Ethic'
                                                }
                                                value={
                                                    supervisorAssessment.professionalism
                                                }
                                                onChange={(e: any) =>
                                                    setSupervisorAssessment({
                                                        ...supervisorAssessment,
                                                        professionalism:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Comment on professional behavior, attitude, dress code compliance..."
                                                disabled={!canSupervisorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                label={
                                                    '3. Communication Skills (verbal and written)'
                                                }
                                                name="communication"
                                                value={
                                                    supervisorAssessment.communication
                                                }
                                                onChange={(e: any) =>
                                                    setSupervisorAssessment({
                                                        ...supervisorAssessment,
                                                        communication:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Assess ability to communicate with clients, colleagues, and management..."
                                                disabled={!canSupervisorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                name="technicalSkills"
                                                label={
                                                    '4. Technical Skills and Competency'
                                                }
                                                value={
                                                    supervisorAssessment.technicalSkills
                                                }
                                                onChange={(e: any) =>
                                                    setSupervisorAssessment({
                                                        ...supervisorAssessment,
                                                        technicalSkills:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Evaluate practical skills, ability to perform tasks, learning curve..."
                                                disabled={!canSupervisorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                label={
                                                    '5. Initiative and Problem-Solving'
                                                }
                                                name="initiative"
                                                value={
                                                    supervisorAssessment.initiative
                                                }
                                                onChange={(e: any) =>
                                                    setSupervisorAssessment({
                                                        ...supervisorAssessment,
                                                        initiative:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Comment on proactive behavior, critical thinking, decision-making..."
                                                disabled={!canSupervisorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                name="teamwork"
                                                label={
                                                    '6. Teamwork and Collaboration'
                                                }
                                                value={
                                                    supervisorAssessment.teamwork
                                                }
                                                onChange={(e: any) =>
                                                    setSupervisorAssessment({
                                                        ...supervisorAssessment,
                                                        teamwork:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Assess ability to work with others, contribute to team goals..."
                                                disabled={!canSupervisorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                name="safetyCompliance"
                                                label={
                                                    '7. Safety and Compliance'
                                                }
                                                value={
                                                    supervisorAssessment.safetyCompliance
                                                }
                                                onChange={(e: any) =>
                                                    setSupervisorAssessment({
                                                        ...supervisorAssessment,
                                                        safetyCompliance:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Comment on adherence to WHS procedures, infection control, policies..."
                                                disabled={!canSupervisorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                name="clientInteraction"
                                                label={
                                                    '8. Client Interaction and Care Quality'
                                                }
                                                value={
                                                    supervisorAssessment.clientInteraction
                                                }
                                                onChange={(e: any) =>
                                                    setSupervisorAssessment({
                                                        ...supervisorAssessment,
                                                        clientInteraction:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Evaluate rapport with clients, dignity of care, person-centered approach..."
                                                disabled={!canSupervisorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                label={
                                                    '9. Overall Performance Summary'
                                                }
                                                name="overallComments"
                                                value={
                                                    supervisorAssessment.overallComments
                                                }
                                                onChange={(e: any) =>
                                                    setSupervisorAssessment({
                                                        ...supervisorAssessment,
                                                        overallComments:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Provide overall assessment, strengths, areas for improvement, recommendations..."
                                                disabled={!canSupervisorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Supervisor Declaration */}
                                <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <h4 className="font-bold text-sm mb-3">
                                        Supervisor Declaration
                                    </h4>
                                    <p className="text-xs mb-4">
                                        I declare that the information provided
                                        above is true and accurate to the best
                                        of my knowledge. I have directly
                                        supervised this student and can attest
                                        to their performance during the
                                        placement period.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <TextInput
                                                label={
                                                    'Supervisor Name (Signature)'
                                                }
                                                name="supervisorSignature"
                                                value={supervisorSignature}
                                                onChange={(e: any) =>
                                                    setSupervisorSignature(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Type your full name"
                                                disabled={!canSupervisorEdit}
                                                className="font-serif italic"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs font-semibold mb-1.5 block">
                                                Date
                                            </Label>
                                            <TextInput
                                                label={'Date'}
                                                name="date"
                                                type="date"
                                                value={supervisorSignDate}
                                                onChange={(e: any) =>
                                                    setSupervisorSignDate(
                                                        e.target.value
                                                    )
                                                }
                                                disabled={!canSupervisorEdit}
                                            />
                                        </div>
                                    </div>

                                    {canSupervisorEdit && (
                                        <Button
                                            onClick={handleSign}
                                            className="w-full gap-2 mt-4"
                                            disabled={
                                                !hoursVerified ||
                                                !supervisorSignature ||
                                                !supervisorSignDate
                                            }
                                        >
                                            <Signature className="h-4 w-4" />
                                            Sign & Submit to RTO
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Part C: Assessor Tab */}
                        <TabsContent
                            value="assessor"
                            className="px-8 py-6 space-y-6 mt-0"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-accent">
                                    <div className="bg-accent text-white h-8 w-8 rounded flex items-center justify-center font-bold">
                                        C
                                    </div>
                                    <h3 className="text-lg font-bold">
                                        PART C: RTO ASSESSOR EVALUATION
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Review student documentation and supervisor
                                    feedback. Verify competency evidence against
                                    unit requirements.
                                </p>

                                {/* Unit Competency Checklist */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-sm mb-3 bg-muted/50 p-2 rounded">
                                        Unit Competency Evidence Checklist
                                    </h4>

                                    <div className="space-y-3 border rounded-lg p-4 bg-white dark:bg-background">
                                        {competencyChecklist.map((item) => (
                                            <div
                                                key={item.id}
                                                className="border-b pb-3 last:border-b-0"
                                            >
                                                <div className="flex items-start gap-3 mb-2">
                                                    <Checkbox
                                                        id={item.id}
                                                        checked={item.checked}
                                                        onCheckedChange={(
                                                            checked: any
                                                        ) => {
                                                            setCompetencyChecklist(
                                                                (prev) =>
                                                                    prev.map(
                                                                        (i) =>
                                                                            i.id ===
                                                                            item.id
                                                                                ? {
                                                                                      ...i,
                                                                                      checked:
                                                                                          checked as boolean,
                                                                                  }
                                                                                : i
                                                                    )
                                                            )
                                                        }}
                                                        disabled={
                                                            !canAssessorEdit
                                                        }
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <Label
                                                            htmlFor={item.id}
                                                            className="cursor-pointer font-semibold text-sm"
                                                        >
                                                            {item.code}:{' '}
                                                            {item.name}
                                                        </Label>
                                                    </div>
                                                </div>
                                                <TextArea
                                                    name="evidence"
                                                    value={item.evidence}
                                                    onChange={(e: any) => {
                                                        setCompetencyChecklist(
                                                            (prev) =>
                                                                prev.map((i) =>
                                                                    i.id ===
                                                                    item.id
                                                                        ? {
                                                                              ...i,
                                                                              evidence:
                                                                                  e
                                                                                      .target
                                                                                      .value,
                                                                          }
                                                                        : i
                                                                )
                                                        )
                                                    }}
                                                    placeholder="Document evidence observed (e.g., logbook entries, supervisor feedback, specific examples)..."
                                                    disabled={!canAssessorEdit}
                                                    className="min-h-15 text-xs ml-7"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Performance Evidence */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-sm mb-3 bg-muted/50 p-2 rounded">
                                        Performance Evidence Assessment
                                    </h4>

                                    <div className="space-y-3 border rounded-lg p-4 bg-white dark:bg-background">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="pe1"
                                                checked={
                                                    performanceEvidence.demonstratedCompetence
                                                }
                                                onCheckedChange={(
                                                    checked: any
                                                ) =>
                                                    setPerformanceEvidence({
                                                        ...performanceEvidence,
                                                        demonstratedCompetence:
                                                            checked as boolean,
                                                    })
                                                }
                                                disabled={!canAssessorEdit}
                                                className="mt-1"
                                            />
                                            <Label
                                                htmlFor="pe1"
                                                className="cursor-pointer text-sm"
                                            >
                                                Student has demonstrated
                                                competence across all required
                                                performance criteria
                                            </Label>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="pe2"
                                                checked={
                                                    performanceEvidence.consistentPerformance
                                                }
                                                onCheckedChange={(checked) =>
                                                    setPerformanceEvidence({
                                                        ...performanceEvidence,
                                                        consistentPerformance:
                                                            checked as boolean,
                                                    })
                                                }
                                                disabled={!canAssessorEdit}
                                                className="mt-1"
                                            />
                                            <Label
                                                htmlFor="pe2"
                                                className="cursor-pointer text-sm"
                                            >
                                                Evidence shows consistent
                                                performance over the placement
                                                duration
                                            </Label>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="pe3"
                                                checked={
                                                    performanceEvidence.industryStandards
                                                }
                                                onCheckedChange={(checked) =>
                                                    setPerformanceEvidence({
                                                        ...performanceEvidence,
                                                        industryStandards:
                                                            checked as boolean,
                                                    })
                                                }
                                                disabled={!canAssessorEdit}
                                                className="mt-1"
                                            />
                                            <Label
                                                htmlFor="pe3"
                                                className="cursor-pointer text-sm"
                                            >
                                                Performance meets industry
                                                standards and workplace
                                                expectations
                                            </Label>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="pe4"
                                                checked={
                                                    performanceEvidence.regulatoryCompliance
                                                }
                                                onCheckedChange={(
                                                    checked: any
                                                ) =>
                                                    setPerformanceEvidence({
                                                        ...performanceEvidence,
                                                        regulatoryCompliance:
                                                            checked as boolean,
                                                    })
                                                }
                                                disabled={!canAssessorEdit}
                                                className="mt-1"
                                            />
                                            <Label
                                                htmlFor="pe4"
                                                className="cursor-pointer text-sm"
                                            >
                                                Work complies with relevant
                                                legislation, regulations, and
                                                codes of practice
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Assessor Comments */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-sm mb-3 bg-muted/50 p-2 rounded">
                                        Assessor Professional Comments
                                    </h4>

                                    <div className="space-y-4 border rounded-lg p-4 bg-white dark:bg-background">
                                        <div>
                                            <TextArea
                                                name="strengths"
                                                label={
                                                    'Strengths and Competencies Demonstrated'
                                                }
                                                value={
                                                    assessorComments.strengths
                                                }
                                                onChange={(e: any) =>
                                                    setAssessorComments({
                                                        ...assessorComments,
                                                        strengths:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Identify key strengths and well-demonstrated competencies..."
                                                disabled={!canAssessorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                name="areasForDevelopment"
                                                label={
                                                    'Areas Requiring Further Development'
                                                }
                                                value={
                                                    assessorComments.areasForDevelopment
                                                }
                                                onChange={(e: any) =>
                                                    setAssessorComments({
                                                        ...assessorComments,
                                                        areasForDevelopment:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Note any areas needing improvement or additional evidence..."
                                                disabled={!canAssessorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                label={'Recommendations'}
                                                name="recommendations"
                                                value={
                                                    assessorComments.recommendations
                                                }
                                                onChange={(e: any) =>
                                                    setAssessorComments({
                                                        ...assessorComments,
                                                        recommendations:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Provide recommendations for student's ongoing development..."
                                                disabled={!canAssessorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <TextArea
                                                label={'Additional Notes'}
                                                name="additionalNotes"
                                                value={
                                                    assessorComments.additionalNotes
                                                }
                                                onChange={(e: any) =>
                                                    setAssessorComments({
                                                        ...assessorComments,
                                                        additionalNotes:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Any other relevant observations or comments..."
                                                disabled={!canAssessorEdit}
                                                className="min-h-20 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Final Assessment Outcome */}
                                <div className="bg-purple-50/50 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                    <h4 className="font-bold text-sm mb-3">
                                        Final Assessment Outcome
                                    </h4>

                                    <div className="mb-4">
                                        <Label className="text-xs font-semibold mb-2 block">
                                            Overall Assessment Decision
                                        </Label>
                                        <select
                                            value={assessmentOutcome}
                                            onChange={(e: any) =>
                                                setAssessmentOutcome(
                                                    e.target.value
                                                )
                                            }
                                            disabled={!canAssessorEdit}
                                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                        >
                                            <option value="">
                                                Select assessment outcome...
                                            </option>
                                            <option value="competent">
                                                ✓ COMPETENT - All requirements
                                                met
                                            </option>
                                            <option value="not-yet-competent">
                                                ✗ NOT YET COMPETENT - Further
                                                evidence required
                                            </option>
                                            <option value="resubmit">
                                                ⟳ RESUBMIT - Minor adjustments
                                                needed
                                            </option>
                                        </select>
                                    </div>

                                    <p className="text-xs mb-4 text-muted-foreground">
                                        By signing below, I certify that I have
                                        reviewed all evidence and assessed this
                                        student's competency according to the
                                        unit requirements and assessment
                                        guidelines.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <TextInput
                                                name="assessorSignature"
                                                label={
                                                    'Assessor Name (Signature)'
                                                }
                                                value={assessorSignature}
                                                onChange={(e: any) =>
                                                    setAssessorSignature(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Type your full name"
                                                disabled={!canAssessorEdit}
                                                className="font-serif italic"
                                            />
                                        </div>
                                        <div>
                                            <TextInput
                                                label={'Assessment Date'}
                                                name={'date'}
                                                type="date"
                                                value={assessorSignDate}
                                                onChange={(e: any) =>
                                                    setAssessorSignDate(
                                                        e.target.value
                                                    )
                                                }
                                                disabled={!canAssessorEdit}
                                            />
                                            {/* <Label className="text-xs font-semibold mb-1.5 block">
                                                Assessment Date
                                            </Label>
                                            <Input
                                                type="date"
                                                value={assessorSignDate}
                                                onChange={(e:any) =>
                                                    setAssessorSignDate(
                                                        e.target.value
                                                    )
                                                }
                                                disabled={!canAssessorEdit}
                                            /> */}
                                        </div>
                                    </div>

                                    {canAssessorEdit && (
                                        <Button
                                            onClick={handleSign}
                                            className="w-full gap-2 mt-4 bg-accent hover:bg-accent/90"
                                            disabled={
                                                !competencyChecklist.every(
                                                    (item) => item.checked
                                                ) ||
                                                !assessmentOutcome ||
                                                !assessorSignature ||
                                                !assessorSignDate
                                            }
                                        >
                                            <Lock className="h-4 w-4" />
                                            Sign, Lock & Finalize Assessment
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </ScrollArea>

                {/* Sticky Footer */}
                <div className="border-t px-8 py-4 bg-background">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            {isLocked && (
                                <Badge
                                    variant="outline"
                                    className="gap-1 bg-success/10 text-success border-success/20"
                                >
                                    <Lock className="h-3 w-3" />
                                    Document Locked
                                </Badge>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Document ID: WPA-{courseId}-
                                {logbookSummary.student.replace(/\s/g, '')}-2024
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {canEdit && (
                                <Button
                                    onClick={handleSave}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Progress
                                </Button>
                            )}

                            <Button onClick={onClose} variant="ghost">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
