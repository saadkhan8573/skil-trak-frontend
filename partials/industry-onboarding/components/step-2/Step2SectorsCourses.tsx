import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Sparkles } from 'lucide-react'
import { SectorsCard } from './cards/SectorsCard'

interface Step2Props {
    data: any
    onChange: any
    onValidationChange: (isValid: boolean) => void
    uniqueSectors: any
    course?: any
}

function validateStep2(data: any, uniqueSectors: any): boolean {
    const apiSectorCount = Array.isArray(uniqueSectors)
        ? uniqueSectors.length
        : 0
    const clusterSectors = (data.sectors || []).filter(
        (s: any) => s.isClusterSector
    )
    const totalSectorCount = apiSectorCount + clusterSectors.length

    if (totalSectorCount === 0) return false

    return (
        (data.sectors || []).length > 0 &&
        data.sectors.every((s: any) => !!s.confirmed)
    )
}

export function Step2SectorsCourses({
    data,
    onChange,
    onValidationChange,
    uniqueSectors,
    course,
}: Step2Props) {
    useEffect(() => {
        onValidationChange(validateStep2(data, uniqueSectors))
    }, [data, uniqueSectors])
    return (
        <div className="max-w-260 mx-auto px-6 py-8 space-y-8">
            <motion.div
                className="text-center py-8 relative overflow-hidden"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                        background: `linear-gradient(135deg,
                            rgba(4, 72, 102, 0.03) 0%,
                            rgba(247, 166, 25, 0.02) 50%,
                            rgba(13, 84, 104, 0.03) 100%)`,
                    }}
                />
                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Building2 className="w-8 h-8 text-primaryNew" />
                        </motion.div>
                        <h2 className="text-3xl font-bold gradient-text">
                            Sectors & Student Placements
                        </h2>
                        <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 1,
                            }}
                        >
                            <Sparkles className="w-8 h-8 text-primary" />
                        </motion.div>
                    </div>
                    <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                        🎯 Configure your industry sectors and qualified
                        supervisors to provide exceptional student placement
                        opportunities
                    </p>
                </div>
            </motion.div>

            <SectorsCard
                onChange={onChange}
                data={data}
                handleAddSector={() => {}}
                uniqueSectors={uniqueSectors}
                {...(course ? { course: course } : {})}
            />
        </div>
    )
}
