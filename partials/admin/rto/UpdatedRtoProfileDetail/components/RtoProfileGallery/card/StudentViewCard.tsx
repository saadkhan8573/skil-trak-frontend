import { Typography } from '@components'
import { Student } from '@types'
import { ellipsisText } from '@utils'
import React from 'react'
import { HiOutlineDocumentText } from 'react-icons/hi'

export const StudentViewCard = ({
    onClick,
    active,
    student,
}: {
    student: Student
    active?: boolean
    onClick: () => void
}) => {
    return (
        <div
            onClick={() => {
                if (onClick) {
                    onClick()
                }
            }}
            className={`cursor-pointer p-2.5 ${
                active
                    ? 'bg-primaryNew'
                    : 'bg-white border border-secondary-dark'
            }  rounded-md flex flex-col gap-y-1`}
        >
            <div className="flex items-center justify-between gap-x-2">
                <div className="flex items-center gap-x-2">
                    <HiOutlineDocumentText
                        className={active ? 'text-white' : 'text-[#374151]'}
                    />
                    <div>
                        <Typography
                            variant="xxs"
                            color={active ? 'text-white' : 'text-[#374151]'}
                            medium
                        >
                            {student?.user?.name}
                        </Typography>
                        <Typography
                            variant="xxs"
                            color={active ? 'text-white' : 'text-[#374151]'}
                            medium
                        >
                            {student?.user?.email}
                        </Typography>
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
                    <div>
                        <Typography
                            variant="xxs"
                            color={active ? 'text-white' : 'text-[#374151]'}
                            medium
                        >
                            {ellipsisText(student?.studentId, 8)}{' '}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    )
}
