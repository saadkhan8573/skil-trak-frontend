import React, { useCallback, useMemo, useState } from 'react'
import { Archive, FileCheck } from 'lucide-react'
import { RtoV2Api } from '@queries'
import { FolderDocumentCard } from '../cards'
import { LoadingAnimation, NoData, Typography } from '@components'
import { useAppSelector } from '@redux/hooks'
import { InitiatedESignCard } from './InitiatedESignCard'

export const FolderFiles = ({
    folder,
    config,
    eSignDocument,
    course,
    student,
}: {
    folder: any
    config: any
    eSignDocument: any
    course: any
    student: any
}) => {
    const response = folder?.studentResponse?.[0]

    const filesData = RtoV2Api.StudentDocuments.getStudentDocumentFiles(
        response?.id,
        {
            skip: !response?.id,
        }
    )

    const studentId = useAppSelector(
        (state) => state?.student?.studentDetail?.id ?? 0
    )
    const [viewType, setViewType] = useState<'active' | 'archived'>('active')

    const filteredFiles = useMemo(() => {
        if (!filesData?.data) return []
        return filesData.data.filter((doc: any) =>
            viewType === 'active' ? !doc?.isArchived : doc?.isArchived
        )
    }, [filesData?.data, viewType])

    const onEsignRefetch = useCallback(() => {
        eSignDocument.refetch()
    }, [])

    if (
        !response?.id &&
        (!eSignDocument?.data || eSignDocument?.data?.length === 0)
    ) {
        return <NoData text="No files uploaded" />
    }

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

            {filesData.isError && (
                <NoData text={'There is some technical issue!'} isError />
            )}
            {filesData.isLoading || filesData.isFetching ? (
                <div className="min-h-[inherit] flex justify-center items-center py-8">
                    <LoadingAnimation size={50} />
                </div>
            ) : filesData?.isSuccess ? (
                <div className="flex flex-col">
                    {/* View Switcher */}
                    <div className="flex items-center gap-1 p-2 bg-slate-50/50 border-b border-slate-100">
                        <button
                            onClick={() => setViewType('active')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                viewType === 'active'
                                    ? 'bg-gradient-to-r from-white to-blue-50/80 text-[#044866] shadow-sm ring-1 ring-[#044866]/10'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                        >
                            <FileCheck
                                className={`w-3.5 h-3.5 ${
                                    viewType === 'active'
                                        ? 'text-[#044866]'
                                        : 'text-slate-400'
                                }`}
                            />
                            Active Files
                            <span
                                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                                    viewType === 'active'
                                        ? 'bg-[#044866]/10 text-[#044866]'
                                        : 'bg-slate-200 text-slate-500'
                                }`}
                            >
                                {filesData?.data?.filter(
                                    (d: any) => !d.isArchived
                                ).length || 0}
                            </span>
                        </button>
                        <button
                            onClick={() => setViewType('archived')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                viewType === 'archived'
                                    ? 'bg-gradient-to-r from-white to-red-50/80 text-red-600 shadow-sm ring-1 ring-red-100'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                        >
                            <Archive
                                className={`w-3.5 h-3.5 ${
                                    viewType === 'archived'
                                        ? 'text-red-600'
                                        : 'text-slate-400'
                                }`}
                            />
                            Archived
                            <span
                                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                                    viewType === 'archived'
                                        ? 'bg-red-50 text-red-600'
                                        : 'bg-slate-200 text-slate-500'
                                }`}
                            >
                                {filesData?.data?.filter(
                                    (d: any) => d.isArchived
                                ).length || 0}
                            </span>
                        </button>
                    </div>

                    {filteredFiles.length > 0 ? (
                        <div className="p-4 space-y-2">
                            {filteredFiles.map((doc: any) => (
                                <FolderDocumentCard
                                    doc={doc}
                                    key={doc.id}
                                    config={config}
                                    studentId={studentId}
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
                filesData?.isSuccess &&
                (!eSignDocument?.data || eSignDocument?.data?.length === 0) && (
                    <NoData text="No files uploaded" />
                )
            )}
        </div>
    )
}
