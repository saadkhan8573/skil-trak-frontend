import {
    Link2,
    ExternalLink,
    Edit2,
    Plus,
    CheckCircle,
    Trash2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Permissions } from '@components'
import { useAppSelector } from '@redux/hooks'
import { usePlacementFormUrl } from './hooks/usePlacementFormUrl'
import { PlacementFormUrlForm } from './components/PlacementFormUrlForm'
import { PermissionType } from '@types'

/**
 * PlacementFormUrl Component
 *
 * Manages industry partner-specific form URLs that automatically open when students approve placements.
 */
export function PlacementFormUrl() {
    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const {
        isEditing,
        methods,
        isLoading,
        handleEdit,
        handleSave,
        handleCancel,
        handleRemove,
    } = usePlacementFormUrl(industryDetail)

    // Derived values from Redux
    const formUrl = industryDetail?.placementUrl

    const openUrl = () => {
        if (formUrl) {
            window.open(formUrl, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div className="bg-linear-to-br from-[#FAFBFC] to-white rounded-xl border-2 border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* Header */}
            <div className="bg-linear-to-r from-[#F7A619]/10 to-[#F9B84A]/10 px-4 py-3 border-b border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#F7A619] to-[#EA580C] flex items-center justify-center shadow-md">
                            <Link2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A2332] text-sm">
                                Placement Form URL
                            </h3>
                            <p className="text-[9px] text-[#64748B]">
                                Auto-opens when student approves placement
                            </p>
                        </div>
                    </div>
                    {formUrl && !isEditing && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-[#10B981]/10 rounded-full border border-[#10B981]/30">
                            <CheckCircle className="w-3 h-3 text-[#10B981]" />
                            <span className="text-[9px] font-semibold text-[#10B981]">
                                Active
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-4">
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <PlacementFormUrlForm
                            methods={methods}
                            handleSave={handleSave}
                            onCancel={handleCancel}
                            isLoading={isLoading}
                        />
                    ) : formUrl ? (
                        <motion.div
                            key="display"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="space-y-3"
                        >
                            {/* URL Display */}
                            <div className="bg-white rounded-lg border-2 border-[#E2E8F0] p-3 hover:border-[#F7A619]/30 transition-colors">
                                <div className="flex items-start gap-2">
                                    <Link2 className="w-4 h-4 text-[#F7A619] shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] text-[#64748B] uppercase tracking-wide font-semibold mb-1">
                                            Current Form URL
                                        </p>
                                        <a
                                            href={formUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#044866] hover:text-[#F7A619] font-medium break-all hover:underline transition-colors"
                                        >
                                            {formUrl}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Workflow Info */}
                            <div className="bg-linear-to-br from-[#F7A619]/5 to-[#F9B84A]/5 rounded-lg p-3 border border-[#F7A619]/20">
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#F7A619] to-[#EA580C] flex items-center justify-center shrink-0">
                                        <ExternalLink className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-semibold text-[#1A2332] mb-1">
                                            Auto-Open Workflow
                                        </p>
                                        <p className="text-[9px] text-[#64748B] leading-relaxed">
                                            When a student approves their
                                            placement at this workplace, this
                                            form will automatically open for the
                                            industry partner to complete.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                                <Button
                                    variant="primary"
                                    onClick={openUrl}
                                    Icon={ExternalLink}
                                    className="flex-1 bg-linear-to-br from-[#044866] to-[#0D5468] border-none text-white hover:shadow-lg transition-all"
                                    text="Test URL"
                                />
                                <Permissions
                                    permission={
                                        PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS
                                    }
                                >
                                    <Button
                                        variant="secondary"
                                        onClick={handleEdit}
                                        outline
                                        Icon={Edit2}
                                        className="px-4"
                                        text="Edit"
                                    />
                                    <Button
                                        variant="error"
                                        onClick={handleRemove}
                                        outline
                                        Icon={Trash2}
                                        className="px-4"
                                        text="Remove"
                                        loading={isLoading}
                                    />
                                </Permissions>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-[#E8F4F8] to-[#F8FAFB] flex items-center justify-center mb-3 shadow-sm">
                                <Link2 className="w-8 h-8 text-[#64748B]" />
                            </div>
                            <p className="text-sm font-semibold text-[#1A2332] mb-1">
                                No Form URL Set
                            </p>
                            <Permissions
                                permission={
                                    PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS
                                }
                            >
                                <p className="text-xs text-[#64748B] mb-4 px-4">
                                    Add a placement form URL that will open
                                    automatically when students approve
                                    placements
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={handleEdit}
                                    Icon={Plus}
                                    className="bg-linear-to-br from-[#F7A619] to-[#EA580C] border-none text-white hover:shadow-lg transition-all mx-auto"
                                    text="Add Form URL"
                                />
                            </Permissions>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
