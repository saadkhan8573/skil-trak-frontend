import {
    LoadingAnimation,
    NoData,
    Typography,
    useWorldwideStudentDataRestriction,
} from '@components'
import { AssessmentEvidenceFolder, FolderStatusConfig } from '@types'
import { RtoV2Api, SubAdminApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { Archive, FileCheck } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { FolderDocumentCard } from '../cards'
import { InitiatedESignCard } from './InitiatedESignCard'
import { folderResponse } from '@utils'

export const FolderFiles = ({
    folder,
    config,
    eSignDocument,
    course,
    student,
}: {
    folder: AssessmentEvidenceFolder
    config: FolderStatusConfig
    eSignDocument: any
    course: any
    student: any
}) => {
    const response = useMemo(() => {
        return folderResponse(folder.studentResponse)
    }, [folder?.studentResponse])

    const isOtherDoc = folder?.isOtherDoc

    const studentId = useAppSelector(
        (state) => state?.student?.studentDetail?.id ?? 0
    )

    const rtoUserId = useAppSelector((state) => state?.rto?.rtoDetail?.user?.id)

    const { filterData } = useWorldwideStudentDataRestriction({
        userId: rtoUserId,
    })

    const otherDocsData = SubAdminApi.AssessmentEvidence.getOtherDocAssessment(
        { selectedFolder: folder?.id, student: studentId },
        {
            skip: !isOtherDoc || !studentId || !folder?.id,
        }
    )

    const filesData = RtoV2Api.StudentDocuments.getStudentDocumentFiles(
        response?.id!,
        {
            skip: isOtherDoc || !response?.id,
        }
    )
    const [viewType, setViewType] = useState<'active' | 'archived'>('active')

    const allFiles = useMemo(() => {
        if (isOtherDoc) {
            return otherDocsData?.data?.files || []
        }
        return filesData?.data || []
    }, [isOtherDoc, otherDocsData?.data, filesData?.data])

    const filteredFiles = useMemo(() => {
        if (!allFiles) return []
        return allFiles.filter((doc: any) =>
            viewType === 'active' ? !doc?.isArchived : doc?.isArchived
        )
    }, [allFiles, viewType])

    const isLoading = isOtherDoc
        ? otherDocsData.isLoading || otherDocsData.isFetching
        : filesData.isLoading || filesData.isFetching
    const isError = isOtherDoc ? otherDocsData.isError : filesData.isError
    const isSuccess = isOtherDoc ? otherDocsData.isSuccess : filesData.isSuccess

    const onEsignRefetch = useCallback(() => {
        eSignDocument.refetch()
    }, [])

    if (
        !response?.id &&
        !isOtherDoc &&
        (!eSignDocument?.data || eSignDocument?.data?.length === 0)
    ) {
        return <NoData text="No files uploaded" />
    }

    type FolderTabItem = {
        id: string
        label: string
        icon: React.ElementType
        count: number
        activeClasses: {
            button: string
            icon: string
            badge: string
        }
        hasPermission?: boolean
    }

    const folderTab: FolderTabItem[] = [
        {
            id: 'active',
            label: 'Active Files',
            icon: FileCheck,
            count: allFiles?.filter((d: any) => !d.isArchived).length || 0,
            activeClasses: {
                button: 'bg-linear-to-r from-white to-blue-50/80 text-[#044866] shadow-sm ring-1 ring-[#044866]/10',
                icon: 'text-[#044866]',
                badge: 'bg-[#044866]/10 text-[#044866]',
            },
        },
        {
            id: 'archived',
            label: 'Archived',
            icon: Archive,
            count: allFiles?.filter((d: any) => d.isArchived).length || 0,
            activeClasses: {
                button: 'bg-linear-to-r from-white to-red-50/80 text-red-600 shadow-sm ring-1 ring-red-100',
                icon: 'text-red-600',
                badge: 'bg-red-50 text-red-600',
            },
            hasPermission: true,
        },
    ]

    const folderFilesTab = filterData(folderTab)

    return (
        <div className="border-t border-slate-200 bg-white">
            {eSignDocument?.isLoading ? (
                <div className="flex flex-col justify-center items-center gap-y-2 py-4">
                    <LoadingAnimation size={30} />
                    <Typography variant="label">
                        E-Sign Documents Loading
                    </Typography>
                </div>
            ) : (
                eSignDocument?.data &&
                eSignDocument?.data?.length > 0 && (
                    <div className="p-4 border-b border-slate-100">
                        <InitiatedESignCard
                            document={eSignDocument?.data}
                            courseId={Number(course?.id)}
                            folder={folder}
                            rto={student?.rto}
                            onEsignRefetch={() => {
                                onEsignRefetch()
                            }}
                        />
                    </div>
                )
            )}

            {isError && (
                <NoData text={'There is some technical issue!'} isError />
            )}
            {isLoading ? (
                <div className="min-h-[inherit] flex justify-center items-center py-8">
                    <LoadingAnimation size={50} />
                </div>
            ) : isSuccess ? (
                <div className="flex flex-col">
                    {/* View Switcher */}
                    <div className="flex items-center gap-1 p-2 bg-slate-50/50 border-b border-slate-100">
                        {folderFilesTab.map((tab) => {
                            const isActive = viewType === tab.id
                            const Icon = tab.icon

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() =>
                                        setViewType(
                                            tab.id as 'active' | 'archived'
                                        )
                                    }
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        isActive
                                            ? tab.activeClasses.button
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                    }`}
                                >
                                    <Icon
                                        className={`w-3.5 h-3.5 ${
                                            isActive
                                                ? tab.activeClasses.icon
                                                : 'text-slate-400'
                                        }`}
                                    />
                                    {tab.label}
                                    <span
                                        className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                                            isActive
                                                ? tab.activeClasses.badge
                                                : 'bg-slate-200 text-slate-500'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {filteredFiles.length > 0 ? (
                        <div className="p-4 space-y-2">
                            {filteredFiles.map((doc: any) => (
                                <FolderDocumentCard
                                    doc={doc}
                                    key={doc.id}
                                    config={config}
                                    studentId={studentId}
                                    isOtherDoc={isOtherDoc}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-8">
                            <NoData
                                text={
                                    viewType === 'active'
                                        ? 'No active files found'
                                        : 'No archived files found'
                                }
                            />
                        </div>
                    )}
                </div>
            ) : (
                isSuccess &&
                (!eSignDocument?.data || eSignDocument?.data?.length === 0) && (
                    <NoData text="No files uploaded" />
                )
            )}
        </div>
    )
}
