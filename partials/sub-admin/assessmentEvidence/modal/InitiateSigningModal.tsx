import {
    EmptyData,
    LoadingAnimation,
    Modal,
    NoData,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { CommonApi } from '@queries'
import { AssessmentEvidenceDetailType, Folder, Rto } from '@types'
import { useEffect, useMemo, useState } from 'react'
import {
    DocumentView,
    InitiateSignStudent,
    PreviewAsSignerTemplate,
} from '../components'
import { useWorkplace } from '@hooks'

interface PdfViewModalProps {
    onCancel: () => void
    courseId: number
    folder: AssessmentEvidenceDetailType | null
    rtoUser?: any
}
export const InitiateSigningModal = ({
    courseId,
    onCancel,
    folder,
    rtoUser,
}: PdfViewModalProps) => {
    const [isPreviewAsSigner, setIsPreviewAsSigner] = useState<boolean>(false)
    const [selectedDocument, setSelectedDocument] = useState<any>(null)
    const [userIds, setUserIds] = useState<any>({})

    const { workplaceRto } = useWorkplace()
    console.log('workplaceRto', workplaceRto)
    const rtoId = rtoUser ? rtoUser?.id : Number(workplaceRto?.user?.id)
    const getTemplate = CommonApi.ESign.useESignTemplateDetail(
        { folder: Number(folder?.id), userId: rtoId },
        {
            skip: !folder,
            refetchOnMountOrArgChange: true,
        }
    )

    useEffect(() => {
        if (
            getTemplate.isSuccess &&
            getTemplate?.data &&
            getTemplate?.data?.length > 0
        ) {
            setSelectedDocument(getTemplate?.data?.[0])
        }
    }, [getTemplate])

    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const file = getTemplate?.data?.file
    const extension = file?.split('.').pop()

    return (
        <Modal
            title="You are about to send document for signing"
            subtitle="this document will be used for signing:"
            showActions={false}
            onCancelClick={() => onCancel()}
        >
            <ShowErrorNotifications result={getTemplate} />
            <div className="w-[75vw] h-[80vh] overflow-auto custom-scrollbar">
                {isPreviewAsSigner ? (
                    <PreviewAsSignerTemplate
                        folder={folder}
                        template={selectedDocument}
                        goBack={() => {
                            setIsPreviewAsSigner(!isPreviewAsSigner)
                        }}
                        userIds={userIds}
                        rto={workplaceRto as Rto}
                    />
                ) : (
                    <div className={'h-[inherit]'}>
                        {getTemplate.isError && (
                            <NoData
                                text="There is some technical issue"
                                isError
                            />
                        )}
                        {getTemplate.isLoading || getTemplate?.isFetching ? (
                            <LoadingAnimation height="h-[30vh]" />
                        ) : getTemplate?.data && getTemplate?.isSuccess ? (
                            <>
                                <div className="grid grid-cols-5 gap-x-6 h-[inherit]">
                                    <div className="col-span-3 h-[inherit] overflow-auto remove-scrollbar">
                                        <div>
                                            <Typography
                                                variant="label"
                                                semibold
                                                color="text-gray-500"
                                            >
                                                Select Template
                                            </Typography>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {getTemplate?.data?.map(
                                                    (template: any) => (
                                                        <div
                                                            onClick={() => {
                                                                setSelectedDocument(
                                                                    template
                                                                )
                                                            }}
                                                            className={`border cursor-pointer rounded-md ${
                                                                template?.id ===
                                                                selectedDocument?.id
                                                                    ? 'bg-gray-200'
                                                                    : 'bg-gray-50'
                                                            } px-4 py-2.5`}
                                                        >
                                                            <Typography
                                                                variant="small"
                                                                bold
                                                            >
                                                                {template?.name}
                                                            </Typography>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <DocumentView
                                            file={selectedDocument?.file}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <InitiateSignStudent
                                            courseId={courseId}
                                            setIsPreviewAsSigner={(userIds) => {
                                                setUserIds(userIds())
                                                setIsPreviewAsSigner(
                                                    !isPreviewAsSigner
                                                )
                                            }}
                                            getTemplate={getTemplate?.data}
                                            template={selectedDocument}
                                            onCancel={() => onCancel()}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            getTemplate?.isSuccess && <EmptyData />
                        )}{' '}
                    </div>
                )}
            </div>
        </Modal>
    )
}
