import { CheckCircle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui'

interface IndustryCheckInfoModalProps {
    selectedIndustryCheck: string | null
    setSelectedIndustryCheck: (id: string | null) => void
    getIndustryCheckInfo: (checkId: string) => any
}

export function IndustryCheckInfoModal({
    selectedIndustryCheck,
    setSelectedIndustryCheck,
    getIndustryCheckInfo,
}: IndustryCheckInfoModalProps) {
    const info = selectedIndustryCheck ? getIndustryCheckInfo(selectedIndustryCheck) : null

    return (
        <Dialog
            open={!!selectedIndustryCheck}
            onOpenChange={() => setSelectedIndustryCheck(null)}
        >
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {info?.icon} {info?.name} Requirements
                    </DialogTitle>
                    <DialogDescription>{info?.description}</DialogDescription>
                </DialogHeader>

                {info && (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Details</h4>
                            <p className="text-sm text-muted-foreground">{info.details}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">Processing Time</h4>
                                <p className="text-sm">{info.processing}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Cost</h4>
                                <p className="text-sm">{info.cost}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Requirements</h4>
                            <ul className="text-sm space-y-1">
                                {info.requirements?.map((req: string, index: number) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
