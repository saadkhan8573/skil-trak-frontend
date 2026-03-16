import { AlertCircle, CheckCircle, X } from 'lucide-react'
import { EligibilityChecks } from '../../types/sectorsAndCourses'
import { EligibilityCheckbox } from './EligibilityCheckbox'
import { EligibilityUnlockedMessage } from './EligibilityUnlockedMessage'

interface EligibilityChecksSectionProps {
    eligibilityChecks: EligibilityChecks
    onUpdate: (updates: EligibilityChecks) => void
}

export const EligibilityChecksSection: React.FC<
    EligibilityChecksSectionProps
> = ({ eligibilityChecks, onUpdate }) => {
    const allPassed =
        eligibilityChecks.directSupport &&
        eligibilityChecks.supervision &&
        eligibilityChecks.equipmentResources

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
                        Evaluate these criteria for your organization • This
                        applies to all sectors
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-yellow-800">
                        <strong>Important:</strong> Answer these questions based
                        on your organization's capabilities. All three must be
                        YES to unlock course selection and supervisor fields for
                        ALL sectors.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                    <CheckCircle className="w-4 h-4" />
                    ALL THREE MUST BE YES
                </div>

                <EligibilityCheckbox
                    label="1. Direct Support Environment"
                    description="Do you provide direct client support (personal care, daily living, community support) in a residential, community, home or centre-based setting?"
                    checked={eligibilityChecks.directSupport}
                    onChange={(value) =>
                        onUpdate({ ...eligibilityChecks, directSupport: value })
                    }
                />

                <EligibilityCheckbox
                    label="2. Supervision"
                    description="Will the student be supervised by a qualified worker (same qualification or higher) or experienced support staff?"
                    checked={eligibilityChecks.supervision}
                    onChange={(value) =>
                        onUpdate({ ...eligibilityChecks, supervision: value })
                    }
                />

                <EligibilityCheckbox
                    label="3. Equipment & Resources"
                    description="Do you have appropriate equipment and systems in place? Examples: hoists, mobility aids, transfer equipment, PPE, care plans, incident reporting, documentation systems."
                    checked={eligibilityChecks.equipmentResources}
                    onChange={(value) =>
                        onUpdate({
                            ...eligibilityChecks,
                            equipmentResources: value,
                        })
                    }
                />

                {!allPassed ? (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <X className="w-5 h-5 text-red-600 shrink-0" />
                        <div>
                            <div className="font-bold text-red-700 text-sm">
                                Not Eligible
                            </div>
                            <p className="text-xs text-red-600">
                                All three questions must be YES to unlock
                                supervisor fields and course selection for this
                                sector
                            </p>
                        </div>
                    </div>
                ) : (
                    <EligibilityUnlockedMessage />
                )}
            </div>
        </div>
    )
}
