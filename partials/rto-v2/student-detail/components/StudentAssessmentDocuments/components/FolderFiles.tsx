import React, { useCallback } from 'react'
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

    const onEsignRefetch = useCallback(() => {
        eSignDocument.refetch()
    }, [])

    if (!response?.id && (!eSignDocument?.data || eSignDocument?.data?.length === 0)) {
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
                <div className="min-h-[inherit] flex justify-center items-center">
                    <LoadingAnimation size={50} />
                </div>
            ) : filesData?.data &&
                filesData?.data?.length > 0 &&
                filesData?.isSuccess ? (
                <div className="p-4 space-y-2">
                    {filesData?.data?.map((doc: any) => {
                        const docConfig = config

                        return (
                            <FolderDocumentCard
                                doc={doc}
                                key={doc.id}
                                config={docConfig}
                                studentId={studentId}
                            />
                        )
                    })}
                </div>
            ) : (
                filesData?.isSuccess && (!eSignDocument?.data || eSignDocument?.data?.length === 0) && <NoData text="No files uploaded" />
            )}
        </div>
    )
}
