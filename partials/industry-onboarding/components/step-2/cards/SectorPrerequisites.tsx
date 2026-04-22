import { AlertCircle, CheckCircle, X } from 'lucide-react'

const STATIC_QUESTIONS = [
    {
        id: 'static_1',
        title: 'Direct Support Environment',
        question:
            'Do you provide direct client support (personal care, daily living, community support) in a residential, community, home or centre-based setting?',
    },
    {
        id: 'static_2',
        title: 'Supervision',
        question:
            'Will the student be supervised by a qualified worker (same qualification or higher) or experienced support staff?',
    },
    {
        id: 'static_3',
        title: 'Equipment & Resources',
        question: 'Do you have appropriate equipment and systems in place?',
        example:
            'hoists, mobility aids, transfer equipment, PPE, care plans, incident reporting, documentation systems.',
    },
]

interface SectorPrerequisitesProps {
    sector: any
    sectorState: any
    questions: any[]
    questionsLoading: boolean
    questionsError: boolean
    allQuestionsChecked: boolean
    onToggleQuestion: (questionId: any, checked: boolean) => void
}

export function SectorPrerequisites({
    sector,
    sectorState,
    questions,
    questionsLoading,
    questionsError,
    allQuestionsChecked,
    onToggleQuestion,
}: SectorPrerequisitesProps) {
    return (
        <div className="bg-linear-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                    📋
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg gradient-text">
                        COURSE PREREQUISITES
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Evaluate these criteria for your organization
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-yellow-800">
                        <strong>Important:</strong> Answer these questions based
                        on your organization's capabilities. At least one must
                        be YES to unlock course selection and supervisor fields
                        for this sector.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                    <CheckCircle className="w-4 h-4" />
                    At least Select one
                </div>

                {questionsLoading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Loading questions...
                    </div>
                )}

                {questionsError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-xs text-red-700">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Failed to load questions. Please refresh and try again.
                    </div>
                )}

                {/* {STATIC_QUESTIONS.map((q, qi) => {
                    const checked = !!sectorState?.questionChecks?.[q.id]
                    return (
                        <div
                            key={q.id}
                            className="bg-white rounded-xl p-4 border-2 transition-all duration-300"
                            style={{
                                borderColor: checked ? '#10B981' : '#E5E7EB',
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <div className="pt-1">
                                    <div
                                        className="w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200"
                                        style={{
                                            borderColor: checked ? '#10B981' : '#D1D5DB',
                                            backgroundColor: checked ? '#10B981' : 'white',
                                        }}
                                        onClick={() => onToggleQuestion(q.id, !checked)}
                                    >
                                        {checked && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm mb-1">
                                        {qi + 1}. {q.title}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{q.question}</p>
                                    {q.example && (
                                        <p className="text-xs italic text-muted-foreground mt-1">
                                            Examples: {q.example}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })} */}

                {!questionsLoading &&
                    !questionsError &&
                    questions?.map((q: any, qi: number) => {
                        const checked = !!sectorState?.questionChecks?.[q.id]
                        return (
                            <div
                                key={q.id}
                                className="bg-white rounded-xl p-4 border-2 transition-all duration-300"
                                style={{
                                    borderColor: checked
                                        ? '#10B981'
                                        : '#E5E7EB',
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="pt-1">
                                        <div
                                            className="w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200"
                                            style={{
                                                borderColor: checked
                                                    ? '#10B981'
                                                    : '#D1D5DB',
                                                backgroundColor: checked
                                                    ? '#10B981'
                                                    : 'white',
                                            }}
                                            onClick={() =>
                                                onToggleQuestion(q.id, !checked)
                                            }
                                        >
                                            {checked && (
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm mb-1 break-words">
                                            {qi + 1 + STATIC_QUESTIONS.length}.{' '}
                                            {q.title}
                                        </div>
                                        <p className="text-xs text-muted-foreground break-words whitespace-pre-wrap">
                                            {q.question}
                                        </p>
                                        {q.example && (
                                            <p className="text-xs italic text-muted-foreground mt-1 break-words">
                                                {q.example}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                {!allQuestionsChecked ? (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <X className="w-5 h-5 text-red-600 shrink-0" />
                        <div>
                            <div className="font-bold text-red-700 text-sm">
                                Not Eligible
                            </div>
                            <p className="text-xs text-red-600">
                                At least one selection is required to unlock
                                supervisor fields and course selection for this
                                sector
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div className="font-bold text-green-700 text-sm">
                                🔓 SECTOR UNLOCKED
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                            This sector meets the prerequisites. You can now
                            configure supervisors and select available courses
                            below.
                        </p>
                        <div className="space-y-2">
                            {(sector.supervisorRequirements || []).length >
                                0 && (
                                <>
                                    <div className="text-xs font-semibold text-green-800">
                                        Supervisor Requirements:
                                    </div>
                                    <div className="text-xs space-y-1 pl-4">
                                        {sector.supervisorRequirements.map(
                                            (req: string, ri: number) => (
                                                <div
                                                    key={ri}
                                                    className="flex items-start gap-2"
                                                >
                                                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
                                                    <span>{req}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                            {(sector.acceptableJobTitles || []).length > 0 && (
                                <>
                                    <div className="text-xs font-semibold text-green-800 mt-3">
                                        Acceptable Job Titles:
                                    </div>
                                    <div className="text-xs text-muted-foreground pl-4 space-y-0.5">
                                        {sector.acceptableJobTitles.map(
                                            (title: string, ti: number) => (
                                                <div key={ti}>• {title}</div>
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
