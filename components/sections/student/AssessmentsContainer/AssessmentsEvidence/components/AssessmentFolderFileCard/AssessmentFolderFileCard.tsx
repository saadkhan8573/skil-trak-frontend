import { Typography } from '@components/Typography'
import { VideoPreview } from '@components/VideoPreview'
import { useArchiveAssessmentFilesMutation } from '@queries'
import { ellipsisText } from '@utils'
import Image from 'next/image'
import { AiFillDelete } from 'react-icons/ai'
import { IoMdDocument } from 'react-icons/io'
import { PulseLoader } from 'react-spinners'
import { getDocType } from '../../AssessmentFolderDetailX'
import { AuthorizedUserComponent } from '@components/AuthorizedUserComponent'
import { UserRoles } from '@constants'

type AssessmentFolderFileCardProps = {
    file?: any
    fileUrl: string
    filename: string
    type: string
    selected?: boolean
    onClick?: (file: any) => void
    result?: any
}

export const AssessmentFolderFileCard = ({
    file,
    type,
    fileUrl,
    filename,
    selected,
    onClick,
    result,
}: AssessmentFolderFileCardProps) => {
    const [archiveFile, archiveFileResult] = useArchiveAssessmentFilesMutation()

    let fileName = file ? file.file.split('\\') : ''
    if (fileName.length === 1) {
        fileName = file.file.split('/')

        if (fileName.length > 1) {
            fileName = fileName[fileName.length - 1]
        }
    }

    const extension = fileName?.split('.').reverse()[0].toLowerCase()

    return (
        <div
            className={`relative basis-1/6 border rounded p-2 cursor-pointer ${
                selected ? 'bg-blue-200' : ''
            }`}
        >
            <AuthorizedUserComponent
                roles={[UserRoles.SUBADMIN, UserRoles.STUDENT]}
            >
                {!result?.isSubmitted ? (
                    archiveFileResult.isLoading ? (
                        <div className="bg-red-500 px-1 rounded-md absolute top-1 right-1 z-30">
                            <PulseLoader size={3} color={'white'} />
                        </div>
                    ) : (
                        <AiFillDelete
                            className="absolute top-1 right-1 text-red-600 cursor-pointer z-20"
                            onClick={() => {
                                archiveFile(file?.id)
                                // alert('Saad')
                            }}
                        />
                    )
                ) : null}
            </AuthorizedUserComponent>
            <div
                onClick={() => {
                    onClick &&
                        onClick({
                            ...file,
                            extension,
                            type,
                        })
                }}
            >
                {fileUrl && (
                    <div className="relative w-full min-h-[40px] flex flex-col gap-y-1.5">
                        {/* Video Preview */}
                        {(type === 'video' ||
                            getDocType('video')?.includes(extension)) && (
                            // Preview Video
                            <div className="bg-black w-24 h-24 overflow-hidden">
                                <div className="">
                                    <VideoPreview url={fileUrl} />
                                </div>
                            </div>
                        )}
                        {/* PDF Preview */}
                        {(type === 'docs' ||
                            getDocType('docs')?.includes(extension)) && (
                            <div className="h-full flex justify-center items-center w-full text-gray-500">
                                <IoMdDocument className="text-5xl text-gray" />
                            </div>
                        )}
                        {/* Image Preview */}
                        {(type === 'images' ||
                            getDocType('images')?.includes(extension)) && (
                            // <div
                            //     className="w-full h-[80px] bg-center bg-no-repeat bg-cover rounded-sm"
                            //     style={{
                            //         backgroundImage: `url(${`${file.file}` || ''})`,
                            //     }}
                            // ></div>
                            <div className="w-full h-[80px] relative">
                                <Image
                                    src={file.file}
                                    alt={filename || fileName}
                                    sizes="100vw"
                                    fill
                                    className="bg-cover"
                                />
                            </div>
                        )}
                        {/* <Typography variant="body" center>
                        {filename
                            ? ellipsisText(filename?.split('_')[0], 11)
                            : ellipsisText(
                                  pathname?.split('/')?.slice(1)[0],
                                  7
                              )}
                    </Typography> */}
                        <div title={fileName}>
                            <Typography variant="small" center>
                                {filename
                                    ? ellipsisText(filename?.split('_')[0], 11)
                                    : `${ellipsisText(
                                          fileName,
                                          5
                                      )}.${extension}`}
                            </Typography>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
