import { AuthorizedUserComponent, Card, OutsideClickHandler, Typography } from '@components'
import { Student } from '@types'
import { useCallback, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

import { Waypoint } from 'react-waypoint'
import {
    ArchivedAssessments,
    Courses,
    DownloadAssessmentFiles,
} from './components'
import { AssessmentType } from './enums'
import { UserRoles } from '@constants'

export const AssessmentSubmissions = ({ student }: { student: Student }) => {
    const [isEntered, setIsEntered] = useState<boolean>(false)
    const [isOpened, setIsOpened] = useState<boolean>(false)
    const [selectedAssessment, setSelectedAssessment] =
        useState<AssessmentType>(AssessmentType.Active)
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null)

    const onSetSelectedCourse = useCallback((id: number | undefined) => {
        setSelectedCourse(Number(id))
    }, [])

    return (
        <Waypoint
            onEnter={() => {
                setIsEntered(true)
            }}
            onLeave={() => {
                setIsEntered(false)
            }}
        >
            <div>
                <Card noPadding fullHeight>
                    <div className="h-[inherit] overflow-auto custom-scrollbar">
                        <div className="px-4  py-3.5 flex justify-between items-center border-b border-secondary-dark">
                            <Typography variant="label" semibold>
                                Assessment Evidence{' '}
                                <span className="text-[11px] text-gray-600 font-normal">
                                    {selectedAssessment ===
                                        AssessmentType.Archived
                                        ? ' - Archived Assessment'
                                        : ''}
                                </span>
                            </Typography>
                            <AuthorizedUserComponent
                                excludeRoles={[UserRoles.OBSERVER]}
                            >
                                <div className="flex items-center gap-x-2.5">
                                    <OutsideClickHandler
                                        onOutsideClick={() => {
                                            setIsOpened(false)
                                        }}
                                    >
                                        <div className="w-40 relative">
                                            <div
                                                onClick={() => {
                                                    setIsOpened(!isOpened)
                                                }}
                                                className="w-full relative cursor-pointer px-4 py-[8.5px] flex justify-evenly gap-x-2 rounded-md border border-[#128C7E] overflow-hidden"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="text-[#128C7E]"
                                                    semibold
                                                    uppercase
                                                >
                                                    {selectedAssessment}
                                                </Typography>

                                                <IoIosArrowDown />
                                            </div>
                                            <div
                                                className={`w-full  bg-white shadow-md rounded-md z-10 absolute top-full left-0 overflow-auto custom-scrollbar transition-all duration-500 ${isOpened
                                                        ? 'max-h-72'
                                                        : 'max-h-0'
                                                    }`}
                                            >
                                                {Object.values(
                                                    AssessmentType
                                                ).map((type, index) => (
                                                    <div
                                                        onClick={() => {
                                                            setSelectedAssessment(
                                                                type
                                                            )
                                                            setIsOpened(
                                                                !isOpened
                                                            )
                                                        }}
                                                        className={`px-2 border-b border-gray-100 py-2 w-full cursor-pointer ${selectedAssessment ===
                                                                type
                                                                ? 'bg-gray-200'
                                                                : 'bg-white'
                                                            } hover:bg-gray-100 `}
                                                        key={index}
                                                    >
                                                        <Typography
                                                            variant="small"
                                                            medium
                                                        >
                                                            {type}
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </OutsideClickHandler>
                                    <DownloadAssessmentFiles
                                        studentId={student?.id}
                                        studentProfile={student}
                                        selectedCourse={selectedCourse}
                                    />
                                </div>
                            </AuthorizedUserComponent>
                        </div>

                        <div className="border-b border-secondary-dark">
                            {selectedAssessment === AssessmentType.Active ? (
                                <Courses
                                    student={student}
                                    onSetSelectedCourse={onSetSelectedCourse}
                                    isEntered={isEntered}
                                />
                            ) : selectedAssessment ===
                                AssessmentType.Archived ? (
                                <ArchivedAssessments
                                    student={student}
                                    isEntered={isEntered}
                                    onSetSelectedCourse={onSetSelectedCourse}
                                />
                            ) : null}
                        </div>
                    </div>
                </Card>
            </div>
        </Waypoint>
    )
}
