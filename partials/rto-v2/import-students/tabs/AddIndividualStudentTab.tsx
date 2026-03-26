import { AlertCircle } from 'lucide-react'
import React from 'react'
import { AddIndividualStudentFormV2 } from '../components'

export const AddIndividualStudentTab = ({
    onCancel,
}: {
    onCancel?: () => void
}) => {
    return (
        <div>
            <div className="flex items-start gap-2 rounded-md border border-[#F7A619]/30 bg-[#F7A619]/5 p-3 mb-4">
                <AlertCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <p className="text-sm text-gray-400">
                    Please ensure your file adheres to the following format. As
                    an example, please refer to the sample file provided.
                </p>
            </div>
            <AddIndividualStudentFormV2 onCancel={onCancel} />
        </div>
    )
}
