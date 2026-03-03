import { GlobalModal, Typography } from '@components'
import { MdCancel } from 'react-icons/md'

import Image from 'next/image'

export const NoLogbookFoundModal = ({
    onCancel,
    rto,
    course,
}: {
    rto: string
    course: string
    onCancel: () => void
}) => {
    return (
        <GlobalModal className="max-w-5xl! w-full!">
            <div className="w-full px-7 sm:px-16 md:px-32 xl:px-44 relative flex flex-col gap-y-5 py-10">
                <MdCancel
                    onClick={onCancel}
                    className="transition-all duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90 absolute top-2 right-2"
                />
                <div className="flex flex-col gap-y-2 justify-between items-center">
                    <Image
                        alt={''}
                        width={50}
                        height={50}
                        src={'/images/students/schedule.png'}
                    />
                    <div className="mx-auto">
                        <Typography center semibold>
                            No Logbook Found
                        </Typography>
                    </div>
                </div>
                <div>
                    <Typography center>
                        <span className="text-[15px] leading-4 text-center">
                            Please note that no logbook has been found for
                            Course Name:{' '}
                            <span className="font-semibold">{course}</span> and
                            RTO Name:{' '}
                            <span className="font-semibold">{rto}</span>. Please
                            contact your Head of Department to upload the
                            logbook first against the same course and RTO.
                        </span>
                    </Typography>
                </div>
            </div>
        </GlobalModal>
    )
}
