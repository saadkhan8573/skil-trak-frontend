import { motion } from 'framer-motion'
import { CheckCircle, Clock, User, Calendar, Shield, ShieldCheck } from 'lucide-react'
import moment from 'moment'

interface Signature {
    status: string
    updatedAt: string
    user: {
        name: string
        email: string
        role: string
    }
}

export const SignatureBlocks = ({
    signature,
    label,
}: {
    signature?: Signature
    label: string
}) => {
    const isSigned = signature?.status === 'signed'
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg border-2 p-3 shadow-sm hover:shadow-md transition-all duration-300"
            style={{ borderColor: isSigned ? '#00A651' : '#E2E8F0' }}
        >
            <div className="flex items-center justify-between mb-2">
                <h4
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: isSigned ? '#00A651' : '#64748B' }}
                >
                    {label}
                </h4>
                {isSigned ? (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                    >
                        <CheckCircle
                            className="w-4 h-4"
                            style={{ color: '#00A651' }}
                        />
                    </motion.div>
                ) : (
                    <Clock className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                )}
            </div>
            {isSigned ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-1.5"
                >
                    <div className="flex items-center gap-1.5 text-xs">
                        <User
                            className="w-3 h-3"
                            style={{ color: '#94A3B8' }}
                        />
                        <span
                            className="font-semibold"
                            style={{ color: '#0F172A' }}
                        >
                            {signature?.user?.name}
                        </span>
                    </div>
                    <div
                        className="text-xs truncate"
                        style={{ color: '#64748B' }}
                    >
                        {signature?.user?.email}
                    </div>
                    <div
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: '#94A3B8' }}
                    >
                        <Calendar className="w-3 h-3" />
                        <span>
                            {moment(signature?.updatedAt).format('MMM D, YYYY, h:mm A')}
                        </span>
                    </div>
                    <div className="text-xs mt-0.5 flex items-center gap-1 font-bold text-gray-600 capitalize">
                        <ShieldCheck className="w-3.5 h-3.5 text-success" />
                        Document signed by {signature?.user?.role || 'User'}
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#E2E8F0]">
                        <div className="font-signature text-xl text-info">
                            {signature?.user?.name}
                        </div>
                        <div className="text-[11px] mt-0.5 flex text-gray-500 items-center gap-1">
                            <Shield className="w-2.5 h-2.5" />
                            Verified Digital Signature
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="text-center py-4">
                    <div
                        className="text-xs font-medium"
                        style={{ color: '#94A3B8' }}
                    >
                        Awaiting signature
                    </div>
                </div>
            )}
        </motion.div>
    )
}
