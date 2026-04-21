import {
    Badge,
    Button,
    Card,
    ShowErrorNotifications,
    Switch,
    usePermissions,
} from '@components'
import { useNotification } from '@hooks'
import {
    DeleteIndustryCustomDocModal,
    UpdateCustomSectorFolderModal,
} from '@partials/common/IndustryProfileDetail/components/IndustrySectorRequiredDocs/modals'
import { IndustryApi } from '@redux'
import { Folder, PermissionType } from '@types'
import { FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@components/ui'

interface Document {
    id: number
    name: string
    required: boolean
    enabled: boolean
    isCustom: boolean
    isMandatory: boolean
}

interface DocumentCardProps {
    doc: Folder
    industryId: number
    industryUserId: number
}

export function DocumentCard({
    doc,
    industryId,
    industryUserId,
}: DocumentCardProps) {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const hasPermission = usePermissions({
        permission: [PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS],
    })

    // Toggle Logic
    const [makeOptional, makeOptionalResult] =
        IndustryApi.Folders.addIndustrySectorDocsOptional()
    const [makeCustomDocOptional, makeCustomDocOptionalResult] =
        IndustryApi.Folders.customeIndustryOptional()

    const { notification } = useNotification()

    const onCancelModal = () => setModal(null)

    const onMakeCustomDocOptional = async () => {
        try {
            const res: any = await makeCustomDocOptional({
                id: doc?.id!,
                userId: industryUserId,
            })
            if (res?.data) {
                notification.success({
                    title: 'Document Toggled',
                    description: 'Document Toggled Successfully',
                })
            }
        } catch (e) {
            console.log({ e })
        }
    }

    const onMakeDocOptional = async () => {
        try {
            const res: any = await makeOptional({
                id: doc?.id!,
                userId: industryUserId,
            })
            if (res?.data) {
                notification.success({
                    title: 'Document Toggled',
                    description: 'Document Toggled Successfully',
                })
            }
        } catch (e) {
            console.log({ e })
        }
    }

    const handleToggleDocument = async () => {
        if (doc?.isCustom) {
            onMakeCustomDocOptional()
        } else {
            onMakeDocOptional()
        }
    }

    const handleEditClick = () => {
        setModal(
            <UpdateCustomSectorFolderModal
                doc={doc}
                onCancel={onCancelModal}
                industryId={Number(industryId)}
            />
        )
    }

    const handleDeleteClick = () => {
        setModal(
            <DeleteIndustryCustomDocModal doc={doc} onCancel={onCancelModal} />
        )
    }

    return (
        <>
            {modal}
            <ShowErrorNotifications result={makeOptionalResult} />
            <Card className="p-4 hover:border-[#044866]/20 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Icon */}
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                                doc?.isRequired
                                    ? 'bg-linear-to-br from-[#044866] to-[#0D5468]'
                                    : 'bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8]'
                            }`}
                        >
                            <FileText
                                className={`w-5 h-5 ${
                                    doc?.isRequired
                                        ? 'text-white'
                                        : 'text-[#64748B]'
                                }`}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-[#1A2332]">
                                    {doc.name}
                                </h4>
                                {doc?.isMandatory && (
                                    <Badge variant="error" outline>
                                        MANDATORY
                                    </Badge>
                                )}
                                {doc?.isCustom && (
                                    <Badge variant="primaryNew">CUSTOM</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                {doc?.isRequired ? (
                                    <>
                                        <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                                        <p className="text-xs text-[#64748B]">
                                            Required for this placement
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-3.5 h-3.5 text-[#94A3B8]" />
                                        <p className="text-xs text-[#94A3B8]">
                                            Not required
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Toggle */}
                    {!hasPermission ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center">
                                    <Switch
                                        name="enabled"
                                        label={'Required'}
                                        isChecked={doc?.isRequired}
                                        customStyleClass="profileSwitch"
                                        onChange={() => handleToggleDocument()}
                                        disabled={!hasPermission}
                                        loading={makeOptionalResult?.isLoading}
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                Permission Not granted
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Switch
                            name="enabled"
                            label={'Required'}
                            isChecked={doc?.isRequired}
                            customStyleClass="profileSwitch"
                            onChange={() => handleToggleDocument()}
                            disabled={!hasPermission}
                            loading={makeOptionalResult?.isLoading}
                        />
                    )}
                </div>
                {doc.isCustom && (
                    <div className="flex items-center justify-end mt-2 gap-2">
                        <Button variant="info" onClick={handleEditClick}>
                            Edit Document
                        </Button>
                        <Button variant="error" onClick={handleDeleteClick}>
                            Delete Document
                        </Button>
                    </div>
                )}
            </Card>
        </>
    )
}
