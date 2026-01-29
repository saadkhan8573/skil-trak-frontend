import { Button, ShowErrorNotifications } from '@components'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { RtoV2Api } from '@queries'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface GenerateIndustryBioModalProps {
    isOpen: boolean
    onClose: () => void
    industryId: number
    onBioGenerated: (bio: string) => void
}

export function GenerateIndustryBioModal({
    isOpen,
    onClose,
    industryId,
    onBioGenerated,
}: GenerateIndustryBioModalProps) {
    const [generatedBio, setGeneratedBio] = useState<string>('')
    const [generateBio, result] = RtoV2Api.Industries.generateIndustryBio()
    const { isLoading, isSuccess, isError } = result

    const handleGenerate = async () => {
        setGeneratedBio('')
        try {
            const res = await generateBio(industryId).unwrap()
            // Assuming the API returns { data: "generated bio string" } or similar
            // Adjust based on actual API response structure
            setGeneratedBio(res?.bio)
        } catch (error) {
            // console.error('Failed to generate bio:', error)
        }
    }

    const handleUseBio = () => {
        // onBioGenerated(generatedBio)
        onClose()
    }

    const resetState = () => {
        setGeneratedBio('')
        result.reset()
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose()
                    // Optional: reset state on close if desired
                    // resetState()
                }
            }}
        >
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-[#F7A619]" />
                        Generate Industry Bio
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <ShowErrorNotifications result={result} />

                    {!generatedBio && !isLoading && !isError && (
                        <div className="text-center py-6 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-600 mb-3 text-sm">
                                Use AI to automatically generate a professional
                                biography for this industry based on available
                                details.
                            </p>
                            <Button
                                onClick={handleGenerate}
                                className="bg-gradient-to-r from-[#F7A619] to-[#F7A619]/90 text-white shadow-sm hover:shadow-md transition-all h-9 text-xs"
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                Generate Biography
                            </Button>
                        </div>
                    )}

                    {isLoading && (
                        <div className="text-center py-8 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-[#044866] animate-spin mb-2" />
                            <p className="text-slate-600 font-medium text-sm">
                                Generating biography...
                            </p>
                            <p className="text-slate-400 text-xs">
                                This may take a few moments
                            </p>
                        </div>
                    )}

                    {generatedBio && (
                        <div className="space-y-3">
                            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                                    {generatedBio}
                                </p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                                <span>Is this bio suitable?</span>
                                <Button
                                    variant="secondary"
                                    onClick={handleGenerate}
                                    className="text-[#044866] h-auto p-0 bg-transparent hover:bg-transparent underline"
                                    disabled={isLoading}
                                >
                                    Regenerate
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-4 border-t bg-slate-50 shrink-0 sm:justify-between gap-2">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full sm:w-auto h-9 text-xs"
                    >
                        Cancel
                    </Button>
                    {generatedBio && (
                        <Button
                            onClick={handleUseBio}
                            className="bg-[#044866] text-white hover:bg-[#044866]/90 w-full sm:w-auto h-9 text-xs"
                        >
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                            Use this Bio
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
