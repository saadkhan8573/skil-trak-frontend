import { CheckCircle } from 'lucide-react'

export const EligibilityUnlockedMessage: React.FC = () => (
    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="font-bold text-green-700 text-sm">
                🔓 SECTOR UNLOCKED
            </div>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
            This sector meets the prerequisites. You can now configure
            supervisors and select available courses below.
        </p>
        <div className="space-y-2">
            <div className="text-xs font-semibold text-green-800">
                Minimum Supervisor Requirement:
            </div>
            <div className="text-xs space-y-1 pl-4">
                <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
                    <span>
                        Certificate III in Individual Support (Ageing) or higher
                    </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="ml-5">OR</span>
                </div>
                <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
                    <span>
                        Diploma in Community Services / Nursing qualification
                    </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="ml-5">OR</span>
                </div>
                <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
                    <span>
                        Enrolled Nurse (EN) or Registered Nurse (RN) (in
                        residential aged care)
                    </span>
                </div>
            </div>
            <div className="text-xs font-semibold text-green-800 mt-3">
                Acceptable Job Titles:
            </div>
            <div className="text-xs text-muted-foreground pl-4 space-y-0.5">
                <div>• Personal Care Worker (Senior)</div>
                <div>• Aged Care Support Worker</div>
                <div>• Team Leader</div>
                <div>• Enrolled Nurse</div>
                <div>• Registered Nurse</div>
            </div>
        </div>
    </div>
)
