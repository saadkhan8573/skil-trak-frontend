import Image from 'next/image'
import { MdCancel } from 'react-icons/md'
import {
    Button,
    GlobalModal,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { SubAdminApi } from '@queries'
import { useNotification } from '@hooks'
import { AssessmentToolsType, Course, Rto } from '@types'
import { useAssessmentDocumentsView } from '../../AssessmentsSubmission'

export const ReleaseLogbookModal = ({
    rto,
    course,
    onCancel,
    selectedWorkplaceId,
}: {
    rto: Rto
    course: Course
    onCancel: () => void
    selectedWorkplaceId: number
}) => {
    const { onFileClicked, documentsViewModal } = useAssessmentDocumentsView()

    const { notification } = useNotification()

    const [releaseLogbook, releaseLogbookResult] =
        SubAdminApi.Student.releaseStudentLogbook()

    const onReleaseLogbook = async () => {
        const res: any = await releaseLogbook(selectedWorkplaceId)

        if (res?.data) {
            notification.success({
                title: 'Logbook Released',
                description: 'Logbook Released Successfully',
            })
            onCancel()
        }
    }

    const file = rto?.assessmentTools?.[0]

    let fileName = file ? file?.file?.split('\\') : ''
    if (fileName?.length === 1) {
        fileName = file?.file?.split('/')

        if (fileName.length > 1) {
            fileName = fileName[fileName?.length - 1]
        }
    }

    const extension = file?.file?.split('.')?.reverse()[0]
    return (
        <>
            {documentsViewModal}
            <ShowErrorNotifications result={releaseLogbookResult} />
            <GlobalModal className="max-w-5xl! w-full!">
                <div className="min-w-full max-w-full mx-auto py-9 px-7 sm:px-16 md:px-32 xl:px-44 relative flex flex-col gap-y-4">
                    <MdCancel
                        onClick={onCancel}
                        className="transition-all duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90 absolute top-2 right-2"
                    />
                    <div className="w-full flex flex-col gap-y-2 justify-between items-center">
                        <Image
                            alt={''}
                            width={50}
                            height={50}
                            src={'/images/students/schedule.png'}
                        />
                        <div className="mx-auto">
                            <Typography center semibold>
                                Release Logbook for Student
                            </Typography>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-1.5">
                        <div className="bg-primaryNew-dark rounded-[5px] px-6 py-5">
                            <div className="grid grid-cols-4 py-3 border-b-2 border-[#F7910F]">
                                <Typography variant="xs" color={'text-white'}>
                                    RTO Name
                                </Typography>
                                <div className="border-l-2 pl-3 border-[#F7910F] col-span-3">
                                    <Typography
                                        variant="xs"
                                        color={'text-white'}
                                        medium
                                    >
                                        {rto?.user?.name}
                                    </Typography>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 py-3">
                                <Typography variant="xs" color={'text-white'}>
                                    Course
                                </Typography>
                                <div className="border-l-2 pl-3 border-[#F7910F] col-span-3">
                                    <Typography
                                        variant="xs"
                                        color={'text-white'}
                                        medium
                                    >
                                        {course?.title}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-col gap-y-3">
                            {rto?.assessmentTools?.map(
                                (assessmentTool: AssessmentToolsType) => (
                                    <div className=" bg-primaryNew-dark rounded-[5px] flex justify-between items-center px-5 py-2.5">
                                        <Typography
                                            variant="small"
                                            medium
                                            color="text-white"
                                        >
                                            {assessmentTool?.title}
                                        </Typography>
                                        <Button
                                            text="View Document"
                                            onClick={() =>
                                                onFileClicked({
                                                    ...assessmentTool,
                                                    file: assessmentTool?.file
                                                        .replaceAll('{"', '')
                                                        .replaceAll('"}', ''),
                                                    extension:
                                                        assessmentTool?.file
                                                            ?.split('.')
                                                            .pop(),
                                                    type: 'all',
                                                    showEdit: false,
                                                })
                                            }
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Button
                            text="Release LOGBOOK"
                            onClick={onReleaseLogbook}
                            loading={releaseLogbookResult?.isLoading}
                            disabled={releaseLogbookResult?.isLoading}
                        />
                    </div>
                </div>
            </GlobalModal>
        </>
    )
}
