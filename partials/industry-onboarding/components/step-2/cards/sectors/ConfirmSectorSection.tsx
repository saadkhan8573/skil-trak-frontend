import { AlertCircle, CheckCircle } from 'lucide-react'
import { Sector } from '../../types/sectorsAndCourses'
import { motion } from 'framer-motion'
import { Button } from '@components'
interface ConfirmSectorSectionProps {
    sector: Sector
    onConfirm: () => void
}

export const ConfirmSectorSection: React.FC<ConfirmSectorSectionProps> = ({
    sector,
    onConfirm,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pt-6 border-t-2 border-dashed border-gray-200"
    >
        <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-green-900">
                        Sector Configuration Complete!
                    </h4>
                    <p className="text-sm text-green-700">
                        All required fields have been filled for this sector
                    </p>
                </div>
            </div>

            <Button
                onClick={onConfirm}
                className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
            >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm and Process This Sector
            </Button>

            <div className="flex items-start gap-2 text-xs text-green-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                    By confirming, you verify that all information is accurate
                    and this sector is ready for student placements.
                </p>
            </div>
        </div>
    </motion.div>
)
