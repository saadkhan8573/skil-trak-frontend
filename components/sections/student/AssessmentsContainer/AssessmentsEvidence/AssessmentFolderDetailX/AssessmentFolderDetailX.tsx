import moment from 'moment'
import { useState } from 'react'

// components
import { Badge, LoadingAnimation, NoData, Typography } from '@components'
import { AssessmentFolderFileCard } from '../components'
import { UploadFile } from './UploadFile'

// query
import {
    StudentApi,
    useGetAssessmentsFolderDetailQuery,
    useUploadFolderDocsMutation,
} from '@queries'

// hoc
import { Result } from '@constants'
import { FileUpload } from '@hoc'
import { DocumentsView, useNotification } from '@hooks'
import { AssessmentFilesOtherDocUpload } from '@partials/common/StudentProfileDetail/components/AssessmentsSubmission/components/AssessmentFiles/AssessmentFilesOtherDocUpload'

type Props = {
    folder: any
    fileUpload?: any
    result?: any
}

const Loading = () => {
    return <LoadingAnimation size={32} />
}

export const getDocType = (type: string) => {
    const docs = ['pdf', 'document', 'msword']
    const images = ['jpg', 'png', 'jpeg', 'JPG', 'jfif', 'webp', 'heic']
    const videos = [
        'mp4',
        'mkv',
        'avi',
        'mpeg',
        'quicktime',
        'mov',
        'octet-stream',
    ]
    switch (type) {
        case 'docs':
            return docs
        case 'images':
            return images
        case 'video':
            return videos
        default:
            return [...docs, ...images, ...videos]
    }
}

export const AssessmentFolderDetailX = ({
    result,
    folder,
    fileUpload,
}: Props) => {
    const { onFileClicked, documentsViewModal } = DocumentsView()

    const { notification } = useNotification()

    const getAssessmentResponse = useGetAssessmentsFolderDetailQuery(
        folder?.id,
        { skip: !folder }
    )
    const otherDocs = StudentApi.AssessmentEvidence.otherStudentDocs(
        {
            selectedFolder: folder?.id,
        },
        {
            skip: !folder?.otherDoc,
        }
    )

    const folderResponse = folder?.otherDoc ? otherDocs : getAssessmentResponse

    const [uploadDocs, uploadDocsResult] = useUploadFolderDocsMutation()

    const [selected, setSelected] = useState<any>(null)

    const [modal, setModal] = useState<any>(null)

    const onModalCancel = () => {
        setModal(null)
    }

    return (
        <>
            {modal}
            {documentsViewModal}
            <div className="h-full">
                {folder && (
                    <div className="flex justify-between items-center p-2 border-b">
                        <div className="px-4">
                            <Typography variant="title">
                                {folder?.name}
                            </Typography>
                            <Typography variant="label" color="text-gray-400">
                                Uploaded{' '}
                                {folderResponse?.data?.files?.length || 0}/
                                {folder?.capacity}
                            </Typography>
                        </div>
                        <div className="ml-auto">
                            {!folder?.isAgreement ? (
                                fileUpload ? (
                                    result?.result !== Result.Competent ? (
                                        folder?.otherDoc ? (
                                            <AssessmentFilesOtherDocUpload
                                                results={result}
                                                studentId={Number(
                                                    otherDocs?.data?.studentId
                                                )}
                                                selectedFolder={folder}
                                            />
                                        ) : (
                                            <FileUpload
                                                onChange={(docs: any) => {
                                                    const formData =
                                                        new FormData()

                                                    const filteredDocs = [
                                                        ...docs,
                                                    ]?.filter((doc) => {
                                                        const docSize =
                                                            doc?.size /
                                                            1024 /
                                                            1024
                                                        return docSize <= 50
                                                    })

                                                    if (
                                                        filteredDocs?.length <
                                                        docs?.length
                                                    ) {
                                                        notification.warning({
                                                            title: 'Files Removed',
                                                            description: `${
                                                                docs?.length -
                                                                filteredDocs?.length
                                                            } ${
                                                                docs?.length -
                                                                    filteredDocs?.length ===
                                                                1
                                                                    ? 'File'
                                                                    : 'Files'
                                                            } were Removed because its size was greater than 50mb, try to upload the file which has less then 50mb size`,
                                                        })
                                                    }
                                                    filteredDocs.forEach(
                                                        (doc: any) => {
                                                            formData.append(
                                                                `${folder?.name}`,
                                                                doc
                                                            )
                                                        }
                                                    )

                                                    if (filteredDocs?.length) {
                                                        uploadDocs({
                                                            id: folder?.id,
                                                            body: formData,
                                                        })
                                                    }
                                                }}
                                                name={folder?.name}
                                                component={
                                                    uploadDocsResult.isLoading
                                                        ? Loading
                                                        : UploadFile
                                                }
                                                limit={
                                                    folder?.capacity -
                                                    (folderResponse?.data?.files
                                                        ?.length || 0)
                                                }
                                                acceptTypes={getDocType(
                                                    folder?.type
                                                )}
                                                multiple
                                            />
                                        )
                                    ) : null
                                ) : (
                                    <div>
                                        {folder.isActive ? (
                                            <Badge
                                                text="Approved"
                                                variant="success"
                                            />
                                        ) : (
                                            <Badge
                                                text="Not Approved"
                                                variant="error"
                                            />
                                        )}
                                        <Typography
                                            variant="body"
                                            color={'text-green-500'}
                                        >
                                            Assessed On
                                        </Typography>
                                    </div>
                                )
                            ) : null}
                        </div>
                    </div>
                )}
                {/* <div className="bg-white h-[350px] overflow-auto">
                <AssessmentResponse
                    folderResponse?={folderResponse?}
                    header={false}
                    // folder={selectedFolder}
                    // studentId={studentId}
                />
            </div> */}
                <div
                    className={`bg-white p-2 flex flex-col justify-between h-full relative  ${
                        folder ? 'min-h-[355px]' : 'min-h-[400px] mt-6'
                    }`}
                >
                    {folderResponse?.isLoading || folderResponse?.isFetching ? (
                        <div className="flex flex-col items-center pt-9">
                            <LoadingAnimation size={50} />
                            <Typography variant={'subtitle'}>
                                Assessment Files Loading
                            </Typography>
                        </div>
                    ) : folderResponse?.data?.files?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-2 gap-y-3">
                            {folderResponse?.data?.files.map((file: any) => (
                                <AssessmentFolderFileCard
                                    key={file.id}
                                    file={file}
                                    filename={file.filename}
                                    fileUrl={file.file}
                                    type={folder?.type}
                                    selected={selected?.id === file?.id}
                                    onClick={(file) => {
                                        setSelected(file)
                                        onFileClicked(file)
                                    }}
                                    result={result}
                                />
                            ))}
                        </div>
                    ) : (
                        <NoData text={'No Files Uploaded'} />
                    )}
                    <div className="mt-4 border-dashed border border-gray-300 rounded-lg p-2">
                        {folderResponse?.data?.assessmentFolder?.updatedAt && (
                            <Typography variant="muted" color="text-gray-400">
                                Assessed On:{' '}
                                {moment(
                                    folderResponse?.data?.assessmentFolder
                                        ?.updatedAt
                                ).format('Do MMM, YYYY')}
                            </Typography>
                        )}
                        <Typography variant="body" color="text-gray-600">
                            {folderResponse?.data?.comment}
                        </Typography>
                    </div>
                </div>
            </div>
        </>
    )
}
