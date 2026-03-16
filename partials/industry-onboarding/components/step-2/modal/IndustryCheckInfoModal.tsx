import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui'
import { CheckCircle } from 'lucide-react'

export const IndustryCheckInfoModal = ({
    selectedIndustryCheck,
    setSelectedIndustryCheck,
    getIndustryCheckInfo,
}: any) => {
    return (
        <>
            {' '}
            <Dialog
                open={!!selectedIndustryCheck}
                onOpenChange={() => setSelectedIndustryCheck(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedIndustryCheck &&
                                getIndustryCheckInfo(selectedIndustryCheck)
                                    ?.icon}
                            {selectedIndustryCheck &&
                                getIndustryCheckInfo(selectedIndustryCheck)
                                    ?.name}{' '}
                            Requirements
                        </DialogTitle>
                        <DialogDescription>
                            {selectedIndustryCheck &&
                                getIndustryCheckInfo(selectedIndustryCheck)
                                    ?.description}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedIndustryCheck && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Details</h4>
                                <p className="text-sm text-muted-foreground">
                                    {
                                        getIndustryCheckInfo(
                                            selectedIndustryCheck
                                        )?.details
                                    }
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">
                                        Processing Time
                                    </h4>
                                    <p className="text-sm">
                                        {
                                            getIndustryCheckInfo(
                                                selectedIndustryCheck
                                            )?.processing
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Cost</h4>
                                    <p className="text-sm">
                                        {
                                            getIndustryCheckInfo(
                                                selectedIndustryCheck
                                            )?.cost
                                        }
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">
                                    Requirements
                                </h4>
                                <ul className="text-sm space-y-1">
                                    {getIndustryCheckInfo(
                                        selectedIndustryCheck
                                    )?.requirements.map(
                                        (req: any, index: any) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                {req}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
