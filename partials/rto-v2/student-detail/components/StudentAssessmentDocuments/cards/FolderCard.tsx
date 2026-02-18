import { Badge, Typography } from '@components'
import {
    AssessmentEvidenceFolder,
    Folder as FolderType,
    FolderStatusConfig,
    Student,
} from '@types'
import { cn, getCourseResult } from '@utils'
import {
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    FileText,
    Folder,
    FolderOpen,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
    ApproveAllFiles,
    FolderFiles,
    RejectAllFile,
    UploadDocument,
} from '../components'
import { CommonApi, SubAdminApi } from '@queries'
import { useWorkplace } from '@hooks'
import { InitiateSigningModal } from '../../../../../sub-admin/assessmentEvidence/modal'
import { Button } from '@components'
import { Result } from '@constants'

export const FolderCard = ({
    folder,
    config,
    course,
    student,
}: {
    config: FolderStatusConfig
    folder: AssessmentEvidenceFolder
    course: any
    student: Student
}) => {

    const StatusIcon = config.icon
    const [isOpened, setIsOpened] = useState(false)
    const [modal, setModal] = useState<any>(null)

    const rtoDetail = SubAdminApi.Student.getStudentRtoDetail(
        Number(student?.id),
        {
            skip: !student?.id,
            refetchOnMountOrArgChange: 300,
        }
    )

    const getTemplate = CommonApi.ESign.useESignTemplateDetail(
        {
            folder: Number(folder?.id),
            userId: Number(rtoDetail?.data?.user?.id),
        },
        {
            skip: !folder || !rtoDetail?.data,
            refetchOnMountOrArgChange: 30,
        }
    )

    const eSignDocument = CommonApi.ESign.useStudentEsignDocument(
        {
            std: Number(student?.user?.id),
            folder: Number(folder?.id),
        },
        {
            skip: !student?.user?.id || !folder?.id,
            refetchOnMountOrArgChange: true,
        }
    )

    const response = folder?.studentResponse?.[0]

    const folderStatus = response?.status

    const responseFiles = response?.files

    const isAllFilesStatusChanged = responseFiles?.filter((file) => !file?.isArchived)?.every((file: any) => file?.status !== 'pending')

    const result = useMemo(
        () => getCourseResult(course?.results),
        [course?.results]
    )

    const onInitiateSigning = () => {
        setModal(
            <InitiateSigningModal
                onCancel={() => {
                    eSignDocument.refetch()
                    setModal(null)
                }}
                rtoUser={rtoDetail?.data?.user}
                courseId={course?.id}
                folder={folder}
            />
        )
    }

    return (
        <div
            className={`border-2 ${config.border} rounded-lg overflow-hidden hover:shadow-lg transition-all bg-linear-to-r ${config.bg} to-white`}
        >
            {modal}
            <div className="p-2.5">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setIsOpened(!isOpened)}
                            className="w-8 h-8 rounded-lg bg-white border-2 border-slate-200 flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                        >
                            {isOpened ? (
                                <ChevronDown
                                    className={`w-5 h-5 ${config.color}`}
                                />
                            ) : (
                                <ChevronRight
                                    className={`w-5 h-5 ${config.color}`}
                                />
                            )}
                        </button>

                        <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-lg ${config.bg} border-2 ${config.border}`}
                        >
                            {isOpened ? (
                                <FolderOpen
                                    className={`w-5 h-5 ${config.color}`}
                                />
                            ) : (
                                <Folder className={`w-5 h-5 ${config.color}`} />
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-slate-900">
                                    {folder?.name}
                                </h4>
                                {!folder?.isOtherDoc && <Badge
                                    text={folderStatus || 'Not Uploaded'}
                                    variant={
                                        folderStatus === 'approved'
                                            ? 'success'
                                            : folderStatus === 'pending'
                                                ? 'warning'
                                                : folderStatus === 'rejected'
                                                    ? 'error'
                                                    : 'info'
                                    }
                                    Icon={StatusIcon}
                                />}
                                {response?.filesCount > 0 &&
                                    !isAllFilesStatusChanged && response?.status === Result.Pending && result?.result !== Result.Competent && (
                                        <Typography
                                            variant="label"
                                            color="text-error"
                                            className="flex items-center gap-1 font-medium"
                                        >
                                            <AlertCircle size={14} />
                                            Approve all files before folder
                                            approval
                                        </Typography>
                                    )}
                            </div>
                            {response?.comment && (
                                <div
                                    className={cn(
                                        'flex items-start gap-2 mt-2 p-2 border rounded-lg',
                                        {
                                            'bg-red-50 border-red-200':
                                                folderStatus === 'rejected',
                                            'bg-green-50 border-green-200':
                                                folderStatus === 'approved',
                                        }
                                    )}
                                >
                                    {folderStatus === 'rejected' ? (
                                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                    )}
                                    <p
                                        className={cn('text-sm', {
                                            'text-red-700':
                                                folderStatus === 'rejected',
                                            'text-green-700':
                                                folderStatus === 'approved',
                                        })}
                                    >
                                        {response?.comment}
                                    </p>
                                </div>
                            )}
                            {!folder?.isOtherDoc && <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                <div className="flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>
                                        {response?.filesCount || 0} files
                                    </span>
                                </div>
                            </div>}
                        </div>
                    </div>

                    {result?.result !== Result.Competent && <div className="flex items-center gap-2">
                        {folderStatus === 'pending' &&
                            ((response?.filesCount || 0) === 0 ||
                                isAllFilesStatusChanged) && (
                                <>
                                    <ApproveAllFiles folder={response} />
                                    <RejectAllFile folder={response} />
                                </>
                            )}
                        {getTemplate?.isSuccess &&
                            getTemplate?.data &&
                            getTemplate?.data?.length > 0 &&
                            (
                                <Button
                                    text="Initiate E-Sign"
                                    onClick={() => onInitiateSigning()}
                                    variant="primary"
                                />
                            )}
                        <UploadDocument folder={folder} student={student} />
                    </div>}
                </div>
            </div>

            {isOpened && (
                <FolderFiles
                    folder={folder}
                    config={config}
                    eSignDocument={eSignDocument}
                    course={course}
                    student={student}
                />
            )}
        </div>
    )
}
