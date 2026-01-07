import { Badge, Button } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@components/ui/dialog'
import { motion } from 'framer-motion'
import { Award, Mail, Phone, UserCheck, UserPlus, Pencil, Trash2 } from 'lucide-react'
import { Supervisor } from '@types'
import { useState } from 'react'
import { AddSupervisorDialog } from './AddSupervisorDialog'
import { DeleteSupervisorDialog } from './DeleteSupervisorDialog'

interface SupervisorsModalProps {
    isOpen: boolean
    onClose: () => void
    supervisors: Supervisor[]
    sectorName: string
    sectorId?: number
}

export function SupervisorsModal({
    isOpen,
    onClose,
    supervisors,
    sectorName,
    sectorId,
}: SupervisorsModalProps) {
    const [addSupervisor, setAddSupervisor] = useState(false)
    const [editingSupervisor, setEditingSupervisor] = useState<any>(null)
    const [deletingSupervisor, setDeletingSupervisor] = useState<any>(null)

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="w-[95vw] sm:w-full sm:max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden bg-white">
                    <DialogTitle className="sr-only">
                        Supervisors - {sectorName}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        View and manage {supervisors.length} supervisor
                        {supervisors.length === 1 ? '' : 's'} for {sectorName}
                    </DialogDescription>

                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-[#044866] to-[#0D5468] px-6 py-5 border-b border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="relative flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                <UserCheck className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white">
                                    Supervisors
                                </h2>
                                <p className="text-sm text-white/80 mt-0.5">
                                    {sectorName}
                                </p>
                            </div>
                            <div className="flex items-center gap-x-2 mr-2">
                                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                    {supervisors.length}{' '}
                                    {supervisors.length === 1
                                        ? 'Supervisor'
                                        : 'Supervisors'}
                                </Badge>
                                <Button
                                    variant="action"
                                    onClick={() => setAddSupervisor(true)}
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Add Supervisor
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 w-full max-h-[calc(90vh-140px)]">
                        {supervisors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E8F4F8] to-[#F8FAFB] flex items-center justify-center mb-4 shadow-sm">
                                    <UserCheck className="w-10 h-10 text-[#64748B]" />
                                </div>
                                <p className="font-semibold text-[#1A2332] mb-1">
                                    No Supervisors Added
                                </p>
                                <p className="text-sm text-[#64748B]">
                                    There are no supervisors assigned to this sector yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {supervisors.map((supervisor, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: index * 0.1,
                                            duration: 0.3,
                                        }}
                                        className="bg-gradient-to-br from-[#FAFBFC] to-white rounded-xl p-5 border-2 border-[#E2E8F0] hover:border-[#044866]/30 hover:shadow-xl transition-all duration-300"
                                    >
                                        {/* Supervisor Header */}
                                        <div className="flex items-start gap-3 mb-4">
                                            {/* Avatar */}
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg flex-shrink-0">
                                                <span className="text-white font-bold text-lg">
                                                    {supervisor.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Name & Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <h3 className="font-bold text-[#1A2332] leading-tight truncate">
                                                        {supervisor.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                                        <button
                                                            onClick={() => setEditingSupervisor(supervisor)}
                                                            className="p-1.5 rounded-lg hover:bg-[#044866]/5 text-[#64748B] hover:text-[#044866] transition-all"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingSupervisor(supervisor)}
                                                            className="p-1.5 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600 transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-[#044866] font-semibold mb-2 leading-relaxed">
                                                    {supervisor.title}
                                                </p>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[9px]"
                                                >
                                                    {supervisor?.position}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {supervisor.description && (
                                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 mb-4 border border-[#E2E8F0]">
                                                <p className="text-xs text-[#64748B] leading-relaxed">
                                                    {supervisor.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Experience Badge */}
                                        <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-gradient-to-br from-[#10B981]/10 to-transparent rounded-lg border border-[#10B981]/20">
                                            <Award className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-[9px] text-[#64748B] uppercase tracking-wide font-semibold mb-0.5">
                                                    Experience
                                                </p>
                                                <p className="text-xs font-bold text-[#059669]">
                                                    {supervisor?.experience}{' '}
                                                    Years
                                                </p>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-2.5">
                                            {/* Email */}
                                            <div className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-[#E8F4F8]/50 transition-colors group">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8F4F8] to-[#F8FAFB] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                                    <Mail className="w-4 h-4 text-[#044866]" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] text-[#64748B] uppercase tracking-wide font-semibold mb-1">
                                                        Email
                                                    </p>
                                                    <a
                                                        href={`mailto:${supervisor.email}`}
                                                        className="text-xs text-[#044866] hover:text-[#0D5468] font-medium truncate block hover:underline transition-colors"
                                                    >
                                                        {supervisor.email}
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-[#E8F4F8]/50 transition-colors group">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8F4F8] to-[#F8FAFB] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                                    <Phone className="w-4 h-4 text-[#044866]" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[9px] text-[#64748B] uppercase tracking-wide font-semibold mb-1">
                                                        Phone
                                                    </p>
                                                    <a
                                                        href={`tel:${supervisor.phone}`}
                                                        className="text-xs text-[#044866] hover:text-[#0D5468] font-medium hover:underline transition-colors"
                                                    >
                                                        {supervisor.phone}
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Footer Email */}
                                            <div className="flex items-center gap-2 pt-3">
                                                <Mail className="w-3.5 h-3.5 text-[#64748B]" />
                                                <span className="text-xs text-[#64748B] truncate">{supervisor.email}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-[#E2E8F0] bg-gray-50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-[#64748B]">
                                {supervisors.length > 0
                                    ? `Managing ${supervisors.length} supervisor${supervisors.length === 1 ? '' : 's'} for this sector`
                                    : 'No supervisors assigned yet'}
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-[#044866] text-white rounded-lg font-bold text-sm hover:bg-[#033a52] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AddSupervisorDialog
                open={addSupervisor || !!editingSupervisor}
                onOpenChange={(open) => {
                    if (!open) {
                        setAddSupervisor(false)
                        setEditingSupervisor(null)
                    }
                }}
                edit={!!editingSupervisor}
                initialData={editingSupervisor}
                sectorId={sectorId!}
            />

            {deletingSupervisor && (
                <DeleteSupervisorDialog
                    open={!!deletingSupervisor}
                    onOpenChange={(open) => !open && setDeletingSupervisor(null)}
                    supervisor={deletingSupervisor}
                />
            )}
        </>
    )
}
