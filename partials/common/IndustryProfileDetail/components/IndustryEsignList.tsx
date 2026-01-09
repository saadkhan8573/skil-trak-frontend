import {
    Badge,
    Button,
    Typography,
    LoadingAnimation,
    ShowErrorNotifications,
} from '@components'
import { useNotification } from '@hooks'
import { DocumentView } from '@partials/sub-admin'
import { CommonApi, IndustryApi } from '@queries'
import { FileCheck2, FileX, Send } from 'lucide-react'
import { useState } from 'react'

interface Template {
    id: string
    name: string
    file?: string
    status: 'sent' | 'not-sent' | 'signed'
}

interface Sector {
    id: string
    name: string
    templates: Template[]
}

export const IndustryEsignList = ({
    onCancel,
    industryId,
    industryUserId,
}: {
    industryId?: number
    onCancel: () => void
    industryUserId: number
}) => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null
    )

    const [initiate, initiateResult] = CommonApi.ESign.initiateIndustryESign()

    const { notification } = useNotification()

    const sectors = IndustryApi.Courses.useGetIndustrySectorsQuery(
        { userId: Number(industryUserId) },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const esignList = CommonApi.ESign.industryAllEsigns({ id: Number(industryId) }, {
        skip: !industryId,
    })

    const getStatusIcon = (document: any) => {
        if (document?.initiatedBy) {
            return <Send className="h-4 w-4" style={{ color: '#044866' }} />
        }
        if (document?.status === 'signed' && !document?.initiatedBy) {
            return (
                <FileCheck2 className="h-4 w-4" style={{ color: '#0D5468' }} />
            )
        }
        if (!document) {
            return <FileX className="h-4 w-4" style={{ color: '#F7A619' }} />
        }
    }

    const getStatusBadge = (document: any) => {
        if (document?.initiatedBy) {
            return <Badge variant="primaryNew" text="Sent" />
        }
        if (document?.status === 'signed' && !document?.initiatedBy) {
            return <Badge variant="accent" text="Signed" />
        }
        if (!document) {
            return <Badge variant="primary" text="Not Sent" />
        }
    }

    const handleTemplateSelect = (template: Template) => {
        setSelectedTemplate(template)
    }

    const onInitiateSign = async () => {
        if (!selectedTemplate?.id) {
            notification.warning({
                title: 'Template Required',
                description: 'Please select the esign template',
            })
            return
        }

        const res: any = await initiate({
            industryUserId,
            templateId: Number(selectedTemplate?.id),
        })
        if (res?.data) {
            notification.success({
                title: 'Esign Initiated',
                description: 'Esign Initiated Successfully',
            })
            onCancel()
        }
    }

    const sectorsAndTemplates = sectors?.data?.map((s: Sector) => ({
        ...s,
        templates: esignList?.data?.data?.filter(
            (temp: any) => temp?.sector?.id === s?.id
        ),
    }))

    const query = sectors || esignList

    return (
        <div className="h-full">
            <div className="flex gap-4 h-[calc(100%-55px)] p-2">
                <ShowErrorNotifications result={initiateResult} />
                <div className="w-[38%] min-w-[420px] space-y-4 overflow-y-auto">
                    {/* Templates */}
                    {sectors?.isLoading || esignList?.isLoading ? (
                        <LoadingAnimation />
                    ) : (
                        sectorsAndTemplates?.map(
                            (sector: Sector) =>
                                sector?.templates?.length > 0 && (
                                    <div key={sector?.id} className="pb-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-gray-900 font-medium">
                                                {sector?.name}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                {sector?.templates?.length}{' '}
                                                template
                                                {sector?.templates?.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {sector?.templates?.map(
                                                (eSign: any) =>
                                                    sector?.id ===
                                                    eSign?.sector?.id && (
                                                        <div
                                                            key={eSign.id}
                                                            className={`group border rounded-lg p-4 cursor-pointer hover:shadow-md ${selectedTemplate?.id ===
                                                                    eSign?.id
                                                                    ? 'ring-2 ring-offset-2'
                                                                    : 'hover:border-gray-300'
                                                                } ${eSign?.status ===
                                                                    'sent'
                                                                    ? 'border-2'
                                                                    : eSign?.status ===
                                                                        'signed'
                                                                        ? 'border-2'
                                                                        : 'border-2'
                                                                } ${eSign
                                                                    ?.documents?.[0]
                                                                    ?.initiatedBy
                                                                    ? 'border-2 border-primaryNew bg-primaryNew-light '
                                                                    : eSign
                                                                        ?.documents?.[0]
                                                                        ?.status ===
                                                                        'signed' &&
                                                                        !eSign
                                                                            ?.documents?.[0]
                                                                            ?.initiatedBy
                                                                        ? 'border-2 border-primaryNew bg-primaryNew-light'
                                                                        : 'border-2 border-primary bg-[#F7910F08]'
                                                                }`}
                                                            style={{
                                                                alignContent:
                                                                    '',
                                                                ...(selectedTemplate?.id ===
                                                                    eSign?.id && {
                                                                    ringColor:
                                                                        eSign?.status ===
                                                                            'sent'
                                                                            ? '#044866'
                                                                            : eSign?.status ===
                                                                                'signed'
                                                                                ? '#0D5468'
                                                                                : '#F7A619',
                                                                }),
                                                            }}
                                                            onClick={() =>
                                                                handleTemplateSelect(
                                                                    eSign
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        {getStatusIcon(
                                                                            eSign
                                                                                ?.documents?.[0]
                                                                        )}
                                                                        <span className="text-sm font-medium text-gray-900 truncate">
                                                                            {
                                                                                eSign?.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {getStatusBadge(
                                                                            eSign
                                                                                ?.documents?.[0]
                                                                        )}
                                                                        {eSign
                                                                            ?.documents?.[0]
                                                                            ?.initiatedBy && (
                                                                                <span className="text-[11px] whitespace-pre text-gray-500">
                                                                                    Ready
                                                                                    to
                                                                                    resend
                                                                                </span>
                                                                            )}
                                                                        {eSign
                                                                            ?.documents?.[0]
                                                                            ?.status ===
                                                                            'signed' && (
                                                                                <span className="text-[11px] text-gray-500 whitespace-pre">
                                                                                    Process
                                                                                    complete
                                                                                </span>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                                                    {!eSign
                                                                        ?.documents
                                                                        ?.length && (
                                                                            <Button variant="primaryNew">
                                                                                Initiate
                                                                            </Button>
                                                                        )}
                                                                    {eSign
                                                                        ?.documents?.[0]
                                                                        ?.initiatedBy && (
                                                                            <Button
                                                                                variant="primaryNew"
                                                                                outline
                                                                            >
                                                                                Resend
                                                                            </Button>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                            )}
                                        </div>
                                    </div>
                                )
                        )
                    )}
                </div>

                {selectedTemplate ? (
                    <div className="w-full flex flex-col min-h-0  h-full">
                        <Typography variant="h4">
                            {selectedTemplate?.name}
                        </Typography>
                        <div className="flex-1 min-h-0 border-2 rounded-md overflow-hidden w-full ">
                            <div className="h-full overflow-auto custom-scrollbar">
                                <DocumentView file={selectedTemplate?.file} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-center p-8 border border-gray-300 w-full rounded-xl">
                        <div>
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <FileX className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Select a Template
                            </h3>
                            <p className="text-gray-600 max-w-sm">
                                Choose a template from the left panel to view
                                its content and details
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <div className="px-6 pb-6 flex-shrink-0 border-t border-gray-100 pt-4 bg-gray-50">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        {esignList?.data?.pagination?.totalResult} total
                        templates •{' '}
                        {/* {getTotalCounts().notSent} pending actions */}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="action"
                            text="Cancel"
                            onClick={onCancel}
                        />
                        <Button
                            text="Done"
                            variant="primaryNew"
                            onClick={onInitiateSign}
                            loading={initiateResult?.isLoading}
                            disabled={
                                !selectedTemplate || initiateResult?.isLoading
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
