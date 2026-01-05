import { motion } from 'framer-motion'

export const StatusWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        {children}
    </motion.div>
)
