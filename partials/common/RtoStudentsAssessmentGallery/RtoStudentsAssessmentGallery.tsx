import {
    Card,
    LoadingAnimation,
    NoData,
    TextInput,
    Typography,
} from '@components'
import { useContextBar } from '@hooks'
import { CommonApi } from '@queries'
import { Student } from '@types'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useState } from 'react'
import {
    AssessmentFileCard,
    FileViewModal,
    PdfViewModal,
    VideoPlayerModal,
} from './components'
import { ellipsisText } from '@utils'

export const RtoStudentsAssessmentGallery = () => {
    const router = useRouter()

    const [modal, setModal] = useState<ReactNode>(null)
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
    const [selectedUserId, setSelectedUserId] = useState(-1)
    const [searchValueKey, setSearchValueKey] = useState<string>('')
    const [searchValue, setSearchValue] = useState<string>('')

    const contextBar = useContextBar()

    const { isLoading, isFetching, data, isError } =
        CommonApi.StudentAssessmentFiles.useGetAllRtoGalleryStudents(
            { id: Number(router.query?.id), search: searchValueKey },
            { refetchOnMountOrArgChange: true }
        )

    const studentAllAssessmentFiles =
        CommonApi.StudentAssessmentFiles.useAllStudentAssessmentFiles(
            Number(selectedStudent),
            { skip: !selectedStudent }
        )

    const delayedSearch = useCallback(
        debounce((value) => setSearchValueKey(value), 700),
        []
    )

    const onModalCancel = () => {
        setModal(null)
    }

    const getImageViewModal = (file: any) => {
        return (
            <FileViewModal
                title=""
                subtitle=""
                url={file?.file}
                onCancelButtonClick={onModalCancel}
                fileId={file?.id}
            >
                <div className="max-w-[650px] relative">
                    <img src={file?.file} alt="" className="max-w-full" />
                </div>
            </FileViewModal>
        )
    }

    const onFileClicked = (file: any) => {
        // setSelected(file)

        if (
            ['jpg', 'jpeg', 'png', 'jfif', 'heiv'].includes(
                file?.extension?.toLowerCase()
            )
        ) {
            setModal(getImageViewModal(file))
        } else if (
            ['pdf', 'document'].includes(file?.extension?.toLowerCase())
        ) {
            // const fileSplit = file.file.split('https://')
            // const url = `https://www.${fileSplit[1]}`
            const url = `${file?.file}`
            setModal(
                <PdfViewModal
                    url={url}
                    downloadUrl={file?.file}
                    onCancelButtonClick={onModalCancel}
                    extension={file?.extension}
                />
            )
        } else if (
            ['mp4', 'mkv', 'avi', 'mpeg', 'quicktime', 'mov'].includes(
                file?.extension?.toLowerCase()
            )
        ) {
            // const fileSplit = file.file.split('https://')
            // const url = `https://www.${fileSplit[1]}`
            setModal(
                <VideoPlayerModal
                    // url={url}
                    url={file?.file}
                    downloadUrl={file?.file}
                    onCancelButtonClick={onModalCancel}
                />
            )
        }
    }

    return (
        <div>
            {modal}
            <Card noPadding>
                <div className="flex min-h-[360px] max-h-[600px]">
                    <div className="w-[25%] border-r h-[inherit]">
                        <div className={`p-3.5 h-[inherit]`}>
                            <Typography variant="label" color="text-black">
                                Students List
                            </Typography>
                            <TextInput
                                name={'search'}
                                value={searchValue}
                                placeholder={'Search Name'}
                                onChange={(e: any) => {
                                    delayedSearch(e.target.value)
                                    setSearchValue(e.target.value)
                                }}
                            />
                        </div>
                        <div className="h-96 custom-scrollbar overflow-y-auto">
                            {isError && <NoData text={'Technical Error'} />}
                            {isLoading || isFetching ? (
                                <LoadingAnimation size={50} />
                            ) : data && data?.length > 0 ? (
                                data?.map((student: Student) => (
                                    <div
                                        onClick={() => {
                                            setSelectedStudent(student?.id)
                                            setSelectedUserId(student?.user?.id)
                                        }}
                                        className={`${
                                            student?.id === selectedStudent
                                                ? 'bg-red-100'
                                                : 'bg-white'
                                        } relative w-full hover:bg-red-100 border-gray-200 rounded cursor-pointer p-2 border-b`}
                                    >
                                        <Typography
                                            variant="xs"
                                            color="text-gray-400 font-thin"
                                            right
                                        >
                                            {ellipsisText(
                                                student?.studentId,
                                                8
                                            )}
                                        </Typography>
                                        <Typography
                                            variant={'label'}
                                            color="text-black font-bold"
                                        >
                                            {student?.user?.name}
                                        </Typography>
                                        <Typography
                                            variant="xs"
                                            color="text-gray-400 font-thin"
                                        >
                                            {student?.user?.email}
                                        </Typography>
                                    </div>
                                ))
                            ) : (
                                !isError && (
                                    <NoData text={'No Students Found'} />
                                )
                            )}
                        </div>
                    </div>
                    <div className="w-[75%]">
                        <div className="flex justify-end gap-x-2.5 py-1.5 px-4"></div>

                        <div className={`border-b border-t p-4`}>
                            <div className="flex justify-between">
                                <Typography variant="label" color="text-black">
                                    Files
                                </Typography>
                            </div>
                        </div>
                        <div className="p-2">
                            {studentAllAssessmentFiles.isError && (
                                <NoData text={'Some Technical Issue'} isError />
                            )}
                            {studentAllAssessmentFiles.isLoading ||
                            studentAllAssessmentFiles.isFetching ? (
                                <LoadingAnimation size={60} />
                            ) : studentAllAssessmentFiles.data &&
                              studentAllAssessmentFiles.data?.length > 0 ? (
                                <div className="grid grid-cols-5 gap-3">
                                    {studentAllAssessmentFiles?.data?.map(
                                        (file: any, i: number) => (
                                            <AssessmentFileCard
                                                key={file?.id}
                                                file={file}
                                                index={i}
                                                filename={file?.filename}
                                                fileUrl={file?.file}
                                                selected={
                                                    selectedStudent === file?.id
                                                }
                                                type={file?.type}
                                                onClick={(e: any) => {
                                                    onFileClicked(e)
                                                    // onFileDetailView()
                                                }}
                                            />
                                        )
                                    )}
                                </div>
                            ) : (
                                !studentAllAssessmentFiles.isError && (
                                    <NoData text={'No Files'} />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
