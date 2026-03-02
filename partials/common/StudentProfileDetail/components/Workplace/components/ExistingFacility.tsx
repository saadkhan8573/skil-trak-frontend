import { ActionButton, Badge, Button, Card, Typography } from '@components'
import { ReactElement, useState } from 'react'
import {
    IoDocumentText,
    IoCalendar,
    IoBusinessOutline,
    IoPerson,
    IoEye,
} from 'react-icons/io5'
import { UseExistingFacilityModal } from '../modals'
import { useAssessmentDocumentsView } from '../../AssessmentsSubmission'
import moment from 'moment'
import { IWorkplaceIndustries } from '@redux/queryTypes'

interface ExistingDocumentContentProps {
    onCancel: () => void
    onInitiateSigning: () => void
    workplace: IWorkplaceIndustries | null
    existingDoc?: {
        url: string
        documentCreatedAt: string
        indName: string
        isExist: boolean
        rtoName: string
        initiatedBy: string
        documentName: string
    }
}

export function ExistingFacility({
    onCancel,
    existingDoc,
    onInitiateSigning,
    workplace,
}: ExistingDocumentContentProps) {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { documentsViewModal, onFileClicked } = useAssessmentDocumentsView()

    const onCancelExisting = () => setModal(null)

    const onUseExisting = () => {
        setModal(
            <UseExistingFacilityModal
                url={existingDoc?.url + ''}
                workplace={workplace}
                onCancel={() => {
                    onCancel()
                    onCancelExisting()
                }}
            />
        )
    }

    return (
        <Card>
            {modal}
            {documentsViewModal}
            <div className="space-y-4">
                <div className="">
                    <Typography variant="h4" color="text-foreground">
                        Existing Facility Checklist Found
                    </Typography>
                    <Typography variant="label" color="text-muted-foreground">
                        We found an existing facility checklist for the{' '}
                        {existingDoc?.indName} industry. Would you like to use
                        the existing document or create a new one?
                    </Typography>
                </div>

                <Card>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <IoDocumentText className="w-6 h-6 text-blue-600" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <Typography
                                    variant="title"
                                    color="text-foreground"
                                >
                                    {existingDoc?.documentName}
                                </Typography>
                                <div className="flex items-center gap-2">
                                    <Badge shape="pill" text={'Active'} />
                                    <ActionButton
                                        onClick={() => {
                                            onFileClicked({
                                                showEdit: false,
                                                file: existingDoc?.url
                                                    .replaceAll('{"', '')
                                                    .replaceAll('"}', ''),
                                                extension: existingDoc?.url
                                                    ?.split('.')
                                                    ?.reverse()?.[0],
                                                type: 'all',
                                            })
                                        }}
                                        variant="info"
                                    >
                                        <IoEye className="w-3 h-3" />
                                        View File
                                    </ActionButton>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <IoBusinessOutline className="w-4 h-4" />
                                    <Typography
                                        variant="small"
                                        color="text-muted-foreground"
                                    >
                                        Industry: {existingDoc?.indName}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IoBusinessOutline className="w-4 h-4" />
                                    <Typography
                                        variant="small"
                                        color="text-muted-foreground"
                                    >
                                        RTO Name: {existingDoc?.rtoName}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IoCalendar className="w-4 h-4" />
                                    <Typography
                                        variant="small"
                                        color="text-muted-foreground"
                                    >
                                        Created:{' '}
                                        {moment(
                                            existingDoc?.documentCreatedAt
                                        ).format('DD MM YYYY')}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IoPerson className="w-4 h-4" />
                                    <Typography
                                        variant="small"
                                        color="text-muted-foreground"
                                    >
                                        Created by: {existingDoc?.initiatedBy}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex gap-3 justify-center">
                    <Button outline variant="primaryNew" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        outline
                        variant="primaryNew"
                        onClick={onInitiateSigning}
                    >
                        Create New E-Sign
                    </Button>
                    <Button onClick={onUseExisting} variant="success">
                        Use Existing Document
                    </Button>
                </div>
            </div>
        </Card>
    )
}
