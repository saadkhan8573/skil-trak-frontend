import React from 'react'
import { CheckCircle, Clock, FileText } from 'lucide-react'
import { Typography } from '@components'

export const FolderHeaderCard = ({
    courseStats,
    title,
    description,
}: {
    courseStats: { approved: number; pending: number }
    title: string
    description: string
}) => {
    return (
        <div className="bg-linear-to-r from-[#0D5468] to-[#044866] p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <FileText className="w-5 h-6 text-white" />
                    </div>
                    <div>
                        <Typography variant="title" color="text-white">
                            {title}
                        </Typography>
                        <Typography
                            variant="label"
                            normal
                            color="text-white/90"
                        >
                            {description}
                        </Typography>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>{courseStats?.approved} Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{courseStats?.pending} Pending</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
