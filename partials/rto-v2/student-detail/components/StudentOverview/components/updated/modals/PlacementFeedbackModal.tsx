'use client'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Typography } from '@components'
import { CommonApi } from '@queries'
import { useNotification } from '@hooks'
import { TextArea } from '@components/inputs'
import { CompactRadioGroup } from '@partials/common/StudentProfileDetail/feedbackForm/form-fields/CompactRadioGroup'
import { StarRating as FeedbackStarRating } from '@partials/common/StudentProfileDetail/feedbackForm/form-fields/StarRating'
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    BookOpen,
    Building2,
    Users,
    Loader2,
} from 'lucide-react'
import {
    satisfactionOptions,
    agreementOptions,
    confidenceOptions,
    recommendOptions,
    skillTrackSatisfactionOptions,
    clarityOptions,
} from '@partials/common/StudentProfileDetail/feedbackForm/config'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlacementFeedbackModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    stdUserId: number
    courseId: string
}

type FormValues = {
    overallSatisfaction: string
    enjoyedMost: string
    challenges: string
    skillsGained: string
    skillsExamples: string
    confidence: string
    professionalism: number
    communication: number
    supportMentorship: number
    learningOpportunities: number
    recommendEmployer: string
    employerFeedback: string
    skilltrakSupport: string
    skilltrakCommunication: string
    skilltrakImprovement: string
    finalComments: string
}

const initialValues: FormValues = {
    overallSatisfaction: '',
    enjoyedMost: '',
    challenges: '',
    skillsGained: '',
    skillsExamples: '',
    confidence: '',
    professionalism: 0,
    communication: 0,
    supportMentorship: 0,
    learningOpportunities: 0,
    recommendEmployer: '',
    employerFeedback: '',
    skilltrakSupport: '',
    skilltrakCommunication: '',
    skilltrakImprovement: '',
    finalComments: '',
}

const steps = [
    { id: 1, title: 'Experience', icon: ClipboardList },
    { id: 2, title: 'Skills', icon: BookOpen },
    { id: 3, title: 'Employer', icon: Building2 },
    { id: 4, title: 'Skiltrak', icon: Users },
    { id: 5, title: 'Final', icon: CheckCircle2 },
]

const FieldLabel = ({
    children,
    color = 'primaryNew',
}: {
    children: React.ReactNode
    color?: string
}) => (
    <label className={`mb-3 block text-${color} text-sm font-medium`}>
        {children}
    </label>
)

// ─── Main Modal ───────────────────────────────────────────────────────────────

export const PlacementFeedbackModal = ({
    open,
    onOpenChange,
    stdUserId,
    courseId,
}: PlacementFeedbackModalProps) => {
    const [step, setStep] = useState(0)
    const [values, setValues] = useState<FormValues>(initialValues)
    const [submitted, setSubmitted] = useState(false)
    const { notification } = useNotification()
    const [placementFeedback, result] =
        CommonApi.Feedback.usePlacementFeedback()

    const set = (key: keyof FormValues) => (v: any) =>
        setValues((prev) => ({ ...prev, [key]: v }))

    const handleClose = () => {
        onOpenChange(false)
        setStep(0)
        setValues(initialValues)
        setSubmitted(false)
    }

    const handleSubmit = async () => {
        try {
            const hostEmployerRating =
                (values.professionalism +
                    values.communication +
                    values.supportMentorship +
                    values.learningOpportunities) /
                4

            await placementFeedback({
                stdUserId,
                body: { ...values, hostEmployerRating, course: courseId },
            })
            setSubmitted(true)
        } catch {
            notification.error({
                title: 'Submission Failed',
                description: 'Something went wrong. Please try again.',
            })
        }
    }

    const totalSteps = steps.length

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl! p-0 overflow-hidden flex flex-col max-h-[92vh]">
                <style jsx global>{`
                    [data-slot='dialog-content'] > button {
                        color: white !important;
                        opacity: 0.8;
                    }
                    [data-slot='dialog-content'] > button:hover {
                        opacity: 1;
                    }
                `}</style>

                {/* Header */}
                <DialogHeader className="bg-primaryNew px-6 py-4 text-left shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                            <ClipboardList size={18} className="text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-white text-lg leading-tight">
                                Placement Feedback
                            </DialogTitle>
                            <Typography
                                variant="small"
                                className="text-white/80"
                            >
                                Share your experience — step {step + 1} of{' '}
                                {totalSteps}
                            </Typography>
                        </div>
                    </div>

                    {/* Step progress bar */}
                    <div className="mt-4 flex items-center gap-1.5">
                        {steps.map((s, i) => {
                            const Icon = s.icon
                            const isActive = i === step
                            const isDone = i < step || submitted
                            return (
                                <div
                                    key={s.id}
                                    className="flex items-center gap-1.5 flex-1"
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                            isDone
                                                ? 'bg-white text-primaryNew'
                                                : isActive
                                                  ? 'bg-white/30 text-white ring-2 ring-white'
                                                  : 'bg-white/10 text-white/40'
                                        }`}
                                    >
                                        <Icon size={12} />
                                    </div>
                                    {i < totalSteps - 1 && (
                                        <div
                                            className={`h-0.5 flex-1 rounded transition-all ${
                                                isDone
                                                    ? 'bg-white'
                                                    : 'bg-white/20'
                                            }`}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </DialogHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2
                                    size={32}
                                    className="text-green-500"
                                />
                            </div>
                            <Typography variant="h4" className="text-gray-800">
                                Thank you for your feedback!
                            </Typography>
                            <Typography
                                variant="small"
                                className="text-gray-500 max-w-sm"
                            >
                                Your response has been recorded and will help us
                                improve future placements.
                            </Typography>
                            <button
                                onClick={handleClose}
                                className="mt-2 px-6 py-2 rounded-lg bg-primaryNew text-white text-sm font-medium hover:bg-primaryNew/90 transition"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Step 1 — Overall Experience */}
                            {step === 0 && (
                                <>
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                        <Typography
                                            variant="label"
                                            className="text-primaryNew font-semibold"
                                        >
                                            Overall Placement Experience
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className="text-gray-500 mt-0.5"
                                        >
                                            Tell us how your placement went
                                            overall
                                        </Typography>
                                    </div>

                                    <div>
                                        <FieldLabel>
                                            1. How satisfied are you with your
                                            placement experience overall?
                                        </FieldLabel>
                                        <CompactRadioGroup
                                            value={values.overallSatisfaction}
                                            onValueChange={set(
                                                'overallSatisfaction'
                                            )}
                                            options={satisfactionOptions}
                                            name="overallSatisfaction"
                                        />
                                    </div>

                                    <TextArea
                                        id="enjoyedMost"
                                        name="enjoyedMost"
                                        label="2. What did you enjoy most about your placement?"
                                        value={values.enjoyedMost}
                                        onChange={(e: any) =>
                                            set('enjoyedMost')(e.target.value)
                                        }
                                        placeholder="Share the highlights..."
                                        helpText="Think about specific projects, people, or learning opportunities"
                                        showError={false}
                                    />

                                    <TextArea
                                        id="challenges"
                                        name="challenges"
                                        label="3. Were there any challenges? How were they addressed?"
                                        value={values.challenges}
                                        onChange={(e: any) =>
                                            set('challenges')(e.target.value)
                                        }
                                        placeholder="Describe challenges and how they were overcome..."
                                        helpText="This helps us understand how well support systems worked"
                                        showError={false}
                                    />
                                </>
                            )}

                            {/* Step 2 — Skills */}
                            {step === 1 && (
                                <>
                                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                        <Typography
                                            variant="label"
                                            className="text-purple-700 font-semibold"
                                        >
                                            Learning & Skills Development
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className="text-gray-500 mt-0.5"
                                        >
                                            Share details about your learning
                                            journey
                                        </Typography>
                                    </div>

                                    <div>
                                        <FieldLabel color="brand-secondary">
                                            4. I gained practical skills and
                                            knowledge relevant to my course
                                        </FieldLabel>
                                        <CompactRadioGroup
                                            value={values.skillsGained}
                                            onValueChange={set('skillsGained')}
                                            options={agreementOptions}
                                            name="skillsGained"
                                        />
                                    </div>

                                    <TextArea
                                        id="skillsExamples"
                                        name="skillsExamples"
                                        label="5. Please give examples of the key skills you developed"
                                        value={values.skillsExamples}
                                        onChange={(e: any) =>
                                            set('skillsExamples')(
                                                e.target.value
                                            )
                                        }
                                        placeholder="List specific skills, tools, or knowledge you gained..."
                                        helpText="Be specific — this helps other students understand what to expect"
                                        color="brand-secondary"
                                        showError={false}
                                    />

                                    <div>
                                        <FieldLabel color="brand-secondary">
                                            6. How confident do you feel about
                                            applying what you've learned?
                                        </FieldLabel>
                                        <CompactRadioGroup
                                            value={values.confidence}
                                            onValueChange={set('confidence')}
                                            options={confidenceOptions}
                                            name="confidence"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Step 3 — Employer */}
                            {step === 2 && (
                                <>
                                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                        <Typography
                                            variant="label"
                                            className="text-amber-700 font-semibold"
                                        >
                                            Host Employer Feedback
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className="text-gray-500 mt-0.5"
                                        >
                                            Rate your host employer across key
                                            areas
                                        </Typography>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FeedbackStarRating
                                            name="professionalism"
                                            label="Professionalism"
                                            description="How professional was the work environment?"
                                            value={values.professionalism}
                                            onChange={set('professionalism')}
                                        />
                                        <FeedbackStarRating
                                            name="communication"
                                            label="Communication"
                                            description="How clear and helpful was communication?"
                                            value={values.communication}
                                            onChange={set('communication')}
                                        />
                                        <FeedbackStarRating
                                            name="supportMentorship"
                                            label="Support & Mentorship"
                                            description="How well were you supported and mentored?"
                                            value={values.supportMentorship}
                                            onChange={set('supportMentorship')}
                                        />
                                        <FeedbackStarRating
                                            name="learningOpportunities"
                                            label="Learning Opportunities"
                                            description="How many learning opportunities were provided?"
                                            value={values.learningOpportunities}
                                            onChange={set(
                                                'learningOpportunities'
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <FieldLabel color="brand-accent">
                                            8. Would you recommend this host
                                            employer for future placements?
                                        </FieldLabel>
                                        <CompactRadioGroup
                                            value={values.recommendEmployer}
                                            onValueChange={set(
                                                'recommendEmployer'
                                            )}
                                            options={recommendOptions}
                                            name="recommendEmployer"
                                        />
                                    </div>

                                    <TextArea
                                        id="employerFeedback"
                                        name="employerFeedback"
                                        label="9. Share any positive experiences or suggestions for your host employer"
                                        value={values.employerFeedback}
                                        onChange={(e: any) =>
                                            set('employerFeedback')(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Share your experiences and suggestions..."
                                        helpText="Your feedback helps improve future placements"
                                        color="brand-accent"
                                        showError={false}
                                    />
                                </>
                            )}

                            {/* Step 4 — Skiltrak */}
                            {step === 3 && (
                                <>
                                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                        <Typography
                                            variant="label"
                                            className="text-green-700 font-semibold"
                                        >
                                            Skiltrak & Placement Process
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className="text-gray-500 mt-0.5"
                                        >
                                            Tell us about your experience with
                                            Skiltrak support
                                        </Typography>
                                    </div>

                                    <div>
                                        <FieldLabel>
                                            10. How satisfied are you with the
                                            support provided by Skiltrak?
                                        </FieldLabel>
                                        <CompactRadioGroup
                                            value={values.skilltrakSupport}
                                            onValueChange={set(
                                                'skilltrakSupport'
                                            )}
                                            options={
                                                skillTrackSatisfactionOptions
                                            }
                                            name="skilltrakSupport"
                                        />
                                    </div>

                                    <div>
                                        <FieldLabel>
                                            11. How clear was communication from
                                            Skiltrak regarding expectations?
                                        </FieldLabel>
                                        <CompactRadioGroup
                                            value={
                                                values.skilltrakCommunication
                                            }
                                            onValueChange={set(
                                                'skilltrakCommunication'
                                            )}
                                            options={clarityOptions}
                                            name="skilltrakCommunication"
                                        />
                                    </div>

                                    <TextArea
                                        id="skilltrakImprovement"
                                        name="skilltrakImprovement"
                                        label="12. What could Skiltrak do to improve the placement process?"
                                        value={values.skilltrakImprovement}
                                        onChange={(e: any) =>
                                            set('skilltrakImprovement')(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Share your suggestions for improvement..."
                                        helpText="Your suggestions help us make the process better for everyone"
                                        showError={false}
                                    />
                                </>
                            )}

                            {/* Step 5 — Final */}
                            {step === 4 && (
                                <>
                                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                        <Typography
                                            variant="label"
                                            className="text-indigo-700 font-semibold"
                                        >
                                            Final Comments
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className="text-gray-500 mt-0.5"
                                        >
                                            Any additional thoughts you'd like
                                            to share
                                        </Typography>
                                    </div>

                                    <TextArea
                                        id="finalComments"
                                        name="finalComments"
                                        label="13. Any other feedback you'd like to share? (optional)"
                                        value={values.finalComments}
                                        onChange={(e: any) =>
                                            set('finalComments')(e.target.value)
                                        }
                                        placeholder="Feel free to share any additional thoughts..."
                                        helpText="This section is completely optional"
                                        color="brand-secondary"
                                        showError={false}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                {!submitted && (
                    <div className="shrink-0 px-6 py-4 border-t bg-gray-50 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft size={16} />
                            Back
                        </button>

                        <div className="flex gap-1.5">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 rounded-full transition-all ${
                                        i === step
                                            ? 'bg-primaryNew w-5'
                                            : i < step
                                              ? 'bg-primaryNew/40 w-2'
                                              : 'bg-gray-200 w-2'
                                    }`}
                                />
                            ))}
                        </div>

                        {step < totalSteps - 1 ? (
                            <button
                                type="button"
                                onClick={() =>
                                    setStep((s) =>
                                        Math.min(totalSteps - 1, s + 1)
                                    )
                                }
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primaryNew text-white text-sm font-medium hover:bg-primaryNew/90 transition"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={result?.isLoading}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primaryNew text-white text-sm font-medium hover:bg-primaryNew/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
                            >
                                {result?.isLoading ? (
                                    <>
                                        <Loader2
                                            size={15}
                                            className="animate-spin"
                                        />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={15} />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
