import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    User,
    Mail,
    Phone,
    Briefcase,
    FileText,
    Building,
    Edit2,
    Sparkles,
} from 'lucide-react'
import { Button } from '@components'
import { useAppSelector } from '@redux/hooks'
import { GenerateBioDialog } from '../modal'
import { WorkplaceTypeModal } from '../modal/WorkplaceTypeModal'
import { IndustryBioEditor } from './IndustryBioEditor'
import { PrimaryContactEditor } from './PrimaryContactEditor'
import { SecondaryContactEditor } from './SecondaryContactEditor'

interface ContactBiographyModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ContactBiographyModal({
    isOpen,
    onClose,
}: ContactBiographyModalProps) {
    const { industryDetail: industry } = useAppSelector(
        (state) => state.industry
    )
    const [showGenerateBio, setShowGenerateBio] = useState(false)
    const [showWorkplaceModal, setShowWorkplaceModal] = useState(false)

    if (!industry) return null

    return (
        <>
            <GenerateBioDialog
                open={showGenerateBio}
                industry={industry}
                onOpenChange={setShowGenerateBio}
            />
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                            onClick={(e: any) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] px-6 py-5 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                                </div>
                                <div className="relative">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h2 className="text-white text-xl font-bold mb-1">
                                                Contact & Biography Information
                                            </h2>
                                            <p className="text-white/80 text-sm">
                                                View contact details and company
                                                biography
                                            </p>
                                        </div>
                                        <Button
                                            onClick={onClose}
                                            variant="secondary"
                                            className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all text-white p-0"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Left Column - Contact & Workplace */}
                                    <div className="space-y-4">
                                        <PrimaryContactEditor
                                            industryId={Number(industry?.id)}
                                            initialData={{
                                                contactPerson: industry.contactPerson || '',
                                                email: industry.user?.email || '',
                                                contactPersonNumber: industry.contactPersonNumber || industry.phoneNumber || '',
                                            }}
                                        />

                                        <SecondaryContactEditor
                                            industryId={Number(industry?.id)}
                                            initialData={{
                                                secondaryContactName:
                                                    industry.secondaryContactName || '',
                                                secondaryContactEmail:
                                                    industry.secondaryContactEmail || '',
                                                secondaryContactPersonPhone:
                                                    industry.secondaryContactPersonPhone || '',
                                            }}
                                        />

                                        {/* Workplace Type */}
                                        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all">
                                            <div className="bg-[#F8FAFB] border-b border-[#E2E8F0] p-3 flex items-center justify-between">
                                                <h3 className="text-[#1A2332] flex items-center gap-2 text-sm font-medium">
                                                    <Briefcase className="w-4 h-4 text-[#64748B]" />
                                                    Workplace Type
                                                </h3>
                                                <Button
                                                    onClick={() =>
                                                        setShowWorkplaceModal(
                                                            true
                                                        )
                                                    }
                                                    variant="secondary"
                                                    className="w-6 h-6 bg-white hover:bg-white text-[#64748B] hover:text-[#044866] border border-[#E2E8F0] hover:border-[#044866]/30 p-0 flex items-center justify-center rounded-md transition-all shadow-sm"
                                                    title="Edit Workplace Type"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </Button>
                                            </div>

                                            <div className="p-3">
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFB] border border-[#E2E8F0]">
                                                    <div className="w-10 h-10 bg-[#E2E8F0] rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Briefcase className="w-5 h-5 text-[#64748B]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#1A2332]">
                                                            {industry
                                                                .workplaceType
                                                                ?.name ||
                                                                'Not specified'}
                                                        </p>
                                                        <p className="text-xs text-[#64748B]">
                                                            Current work
                                                            environment
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Biography */}
                                    <div>
                                        <IndustryBioEditor
                                            industryId={Number(
                                                industry?.id
                                            )}
                                            initialBio={industry.bio || ''}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-2 bg-[#F8FAFB] border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                                <Button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gradient-to-br from-[#044866] to-[#0D5468] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all h-auto"
                                >
                                    Done
                                </Button>
                            </div>
                        </motion.div >
                    </motion.div >
                )
                }
            </AnimatePresence >

            {industry?.user && (
                <WorkplaceTypeModal
                    open={showWorkplaceModal}
                    onOpenChange={setShowWorkplaceModal}
                    industryUserId={industry.user.id}
                />
            )}
        </>
    )
}
