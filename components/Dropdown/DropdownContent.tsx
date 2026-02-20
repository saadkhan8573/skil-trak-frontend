'use client'
import { ReactNode } from 'react'
import { useDropdown } from './Dropdown'
import { motion, AnimatePresence } from 'framer-motion'

export const DropdownContent = ({
    children,
    align = 'start',
}: {
    children: ReactNode
    align?: 'start' | 'end'
}) => {
    const { open } = useDropdown()

    const alignment =
        align === 'end' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute z-99999! mt-2 w-48 rounded-md bg-white! shadow-lg ring-1 ring-gray-200  focus:outline-none ${alignment}`}
                >
                    <div className="py-1">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
