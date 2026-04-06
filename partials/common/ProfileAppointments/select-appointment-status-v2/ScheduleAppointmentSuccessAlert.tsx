import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from '@components/ui/alert-dialog'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import React from 'react'

export const ScheduleAppointmentSuccessAlert = ({
    showSuccessAlert,
    setShowSuccessAlert,
    handleSuccessAlertClose,
}: any) => {
    return (
        <>
            {/* Success Alert */}
            <AlertDialog
                open={showSuccessAlert}
                onOpenChange={setShowSuccessAlert}
            >
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader className="space-y-4">
                        <div className="mx-auto p-3 bg-[#0D5468]/10 rounded-full">
                            <CheckCircle2 className="w-12 h-12 text-[#0D5468]" />
                        </div>
                        <AlertDialogTitle className="text-center text-xl">
                            Schedule Added Successfully!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center space-y-3">
                            <p className="text-base">
                                Your schedule has been added to your account.
                            </p>
                            <div className="bg-[#F7A619]/10 border border-[#F7A619]/30 rounded-lg p-4 text-left">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-[#F7A619] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900 mb-1 text-sm">
                                            Important Notice
                                        </p>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Keep in mind that your placement
                                            will be on hold and cannot start
                                            until the placement agreement is
                                            signed by all parties:{' '}
                                            <span className="font-semibold">
                                                Industry, Student, and Training
                                                Organisation
                                            </span>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={handleSuccessAlertClose}
                            className="w-full bg-[#0D5468] hover:bg-[#0D5468]/90 text-white"
                        >
                            Got it, Thanks!
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
