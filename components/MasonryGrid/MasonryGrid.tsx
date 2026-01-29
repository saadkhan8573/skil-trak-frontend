import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MasonryGridProps {
    children: ReactNode
    columnWidth?: string | number
    gutterWidth?: number
    gutterHeight?: number
    className?: string
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
    children,
    columnWidth = '33%',
    gutterWidth = 11,
    gutterHeight = 11,
    className = '',
}) => {
    // Convert columnWidth to number of columns
    const getColumnCount = () => {
        if (typeof columnWidth === 'string') {
            if (columnWidth === '100%') return 1
            if (columnWidth === '50%') return 2
            if (columnWidth === '33%') return 3
            if (columnWidth === '25%') return 4
        }
        return 3 // default
    }

    const columns = getColumnCount()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: 'easeOut',
            },
        },
    }

    return (
        <motion.div
            className={className}
            style={{
                columnCount: columns,
                columnGap: `${gutterWidth}px`,
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {React.Children.map(children, (child, index) => (
                <motion.div
                    key={index}
                    variants={itemVariants}
                    style={{
                        breakInside: 'avoid',
                        marginBottom: `${gutterHeight}px`,
                        display: 'inline-block',
                        width: '100%',
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    )
}
