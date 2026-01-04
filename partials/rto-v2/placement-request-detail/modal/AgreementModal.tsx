import { useState, useEffect } from 'react'
import { GlobalModal } from '@components/Modal/GlobalModal'
import { Button } from '@components'
import { Typography } from '@components/Typography'
import {
    FileSignature,
    FileText,
    CheckCircle2,
    AlertCircle,
    UserCircle,
} from 'lucide-react'

import { CommonApi } from '@queries'
import { InitiateSign } from '@partials/common/StudentProfileDetail/components/Workplace/components/IndustryDetail'
import { useWorkplace } from '@hooks'

interface AgreementModalProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    workplace: any
    student: any
}

export function AgreementModal({
    open,
    onClose,
    onConfirm,
    workplace,
    student,
}: AgreementModalProps) {
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
        'placement-agreement',
        'code-of-conduct',
    ])
    const course = workplace?.courses?.[0]
    const eSignDocument = CommonApi.ESign.useStudentEsignDocument(
        {
            std: student?.user?.id,
            folder: Number(course?.assessmentEvidence?.[0]?.id),
        },
        {
            skip: !course,
            refetchOnMountOrArgChange: true,
        }
    )

    const { setWorkplaceRto, workplaceRto } = useWorkplace()
    useEffect(() => {
        if (!student) return

        const rto = student?.rto
        if (!rto) return

        // prevent unnecessary updates
        if (workplaceRto?.id === rto?.id) return

        setWorkplaceRto(rto)
    }, [student])
    const documents = [
        {
            id: 'placement-agreement',
            name: 'Placement Agreement',
            description: 'Main placement agreement contract',
            required: true,
        },
        {
            id: 'code-of-conduct',
            name: 'Code of Conduct',
            description: 'Workplace behavior and ethics guidelines',
            required: true,
        },
        {
            id: 'confidentiality-agreement',
            name: 'Confidentiality Agreement',
            description: 'Privacy and confidentiality terms',
            required: false,
        },
        {
            id: 'safety-induction',
            name: 'Workplace Safety Induction',
            description: 'WHS and safety protocols',
            required: false,
        },
        {
            id: 'insurance-waiver',
            name: 'Insurance & Liability Waiver',
            description: 'Insurance coverage acknowledgment',
            required: false,
        },
    ]

    const toggleDocument = (docId: string) => {
        const doc = documents.find((d) => d.id === docId)
        if (doc?.required) return // Can't unselect required documents

        setSelectedDocuments((prev) =>
            prev.includes(docId)
                ? prev.filter((id) => id !== docId)
                : [...prev, docId]
        )
    }

    if (!open) return null

    return (
        <GlobalModal onCancel={onClose} className="max-w-[600px]">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-primaryNew text-xl font-semibold mb-2">
                        <FileSignature className="h-5 w-5" />
                        <Typography variant="h3">
                            Generate Placement Agreement
                        </Typography>
                    </div>
                    <Typography variant="small" className="text-gray-600">
                        Select documents to send for e-signing by all parties
                    </Typography>
                </div>
                <div className="flex items-center gap-x-2">
                    <InitiateSign
                        student={student}
                        folder={course?.assessmentEvidence?.[0]}
                        courseId={course?.id}
                        eSignDocument={eSignDocument}
                    />
                </div>
            </div>
        </GlobalModal>
    )
}
