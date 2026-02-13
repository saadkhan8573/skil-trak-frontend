import { InitialAvatar } from '@components'
import { Student } from '@types'
import Link from 'next/link'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'

export const StudentCellInfo = ({
    student,
    id,
    wpIndustry,
}: {
    wpIndustry?: any
    student: Student
    id: number
}) => {
    return (
        <Link
            href={`/portals/industry/students/current-students/${id}/detail`}
            className="flex items-center gap-x-2"
        >

            {student?.user?.name && (
                <div className="">
                    <InitialAvatar
                        name={student?.user?.name || ''}
                        imageUrl={student?.user?.avatar || ''}
                    />
                </div>
            )}
            <div>
                <p className="flex items-center gap-x-1 text-xs">
                    {student?.studentId}
                </p>
                <p className="font-semibold">{student?.user?.name}</p>
                {wpIndustry?.awaitingAgreementSigned && (
                    <div className="font-medium text-xs text-gray-500">
                        <p className="flex items-center gap-x-1">
                            <span>
                                <MdEmail />
                            </span>
                            {student?.user?.email}
                        </p>
                    </div>
                )}
            </div>

        </Link>
    );
}
