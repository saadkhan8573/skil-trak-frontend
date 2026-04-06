import {
    AuthorizedUserComponent,
    BackButton,
    Button,
    NoData,
    Typography,
} from '@components'
import { MediaQueries, UserRoles } from '@constants'
import Modal from '@modals/Modal'
import { Course } from '@types'
import { useEffect, useState } from 'react'
import { FaBook } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import { AddCustomCourseRequirements } from './AddCustomCourseRequirements'

const getFirstCourse = (sectorWithCourse: any) => {
    if (!sectorWithCourse) return undefined
    const keys = Object.keys(sectorWithCourse)
    if (keys.length) {
        return sectorWithCourse[keys[0]][0]
    }

    return undefined
}

export const CourseRequirementsDetail = ({
    sectorsWithCourses,
    loading,
}: {
    sectorsWithCourses: any
    loading: boolean
}) => {
    const isMobile = useMediaQuery(MediaQueries.Mobile)

    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>()

    useEffect(() => {
        const firstCourse = getFirstCourse(sectorsWithCourses)
        const allCourses = Object.values(sectorsWithCourses)?.flat()
        const course = allCourses?.find(
            (a: any) => a?.id === selectedCourse?.id
        )

        if (firstCourse && !isMobile) {
            setSelectedCourse(course ? course : firstCourse)
        }
    }, [loading, sectorsWithCourses])

    const onCourseClicked = (course: Course) => {
        setSelectedCourse(course)
    }

    return (
        <>
            <div className="hidden md:block">
                <BackButton
                    text="Back to Dashboard"
                    onClick={() => {
                        setSelectedCourse(undefined)
                    }}
                    link={'/portals/rto'}
                />
            </div>
            <div className="flex items-start gap-x-2 min-h-[450px]">
                <div
                    className={`${
                        selectedCourse ? 'md:block hidden' : 'block'
                    } bg-gray-100 py-2 pl-2 rounded-xl shadow-xl w-full md:w-2/5 `}
                >
                    <div className="text-sm font-medium text-gray-500">
                        Select a course
                    </div>
                    <div className="overflow-auto custom-scrollbar max-h-96 pr-4">
                        {sectorsWithCourses ? (
                            Object.keys(sectorsWithCourses).map(
                                (sector: string) => {
                                    return (
                                        <div className="mb-2 pt-2" key={sector}>
                                            <p className="text-xs font-medium text-gray-400 mb-2">
                                                {sector}
                                            </p>

                                            {(sectorsWithCourses as any)[
                                                sector
                                            ].map((c: Course) => (
                                                <div
                                                    key={c.id}
                                                    className={`px-2 py-1 flex gap-x-2 items-start cursor-pointer hover:bg-gray-300 rounded-md ${
                                                        selectedCourse?.id ===
                                                        c.id
                                                            ? 'bg-gray-300'
                                                            : ''
                                                    }`}
                                                    onClick={() =>
                                                        onCourseClicked(c)
                                                    }
                                                >
                                                    <div className="pt-1 text-blue-600">
                                                        <FaBook size={12} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">
                                                            {c.code}
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800">
                                                            {c.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            )
                        ) : (
                            <NoData text={'No Sectors Assigned'} />
                        )}
                    </div>
                </div>

                <div
                    className={`${
                        selectedCourse ? 'block' : 'hidden md:block'
                    } w-full md:w-3/5`}
                >
                    <div className={` w-full  bg-white rounded-xl shadow-xl `}>
                        <div className="bg-slate-100 rounded-t-xl p-2 text-sm">
                            {selectedCourse ? (
                                <div className="flex justify-between items-center">
                                    <span>
                                        {selectedCourse.code} -{' '}
                                        {selectedCourse?.title}
                                    </span>
                                    <AuthorizedUserComponent
                                        roles={[UserRoles.RTO]}
                                    >
                                        <div>
                                            <Modal>
                                                <Modal.Open opens="updateCourseRequirements">
                                                    <Button
                                                        text={
                                                            'Edit Requirements'
                                                        }
                                                        variant={'info'}
                                                    />
                                                </Modal.Open>
                                                <Modal.Window name="updateCourseRequirements">
                                                    <AddCustomCourseRequirements
                                                        courseId={
                                                            selectedCourse?.id
                                                        }
                                                        initialRequirements={
                                                            selectedCourse
                                                                ?.courseRequirements?.[0]
                                                                ?.requirements
                                                        }
                                                        // requirementId={
                                                        //     selectedCourse
                                                        //         ?.courseRequirements?.[0]
                                                        //         ?.id
                                                        // }
                                                    />
                                                </Modal.Window>
                                            </Modal>
                                        </div>
                                    </AuthorizedUserComponent>
                                </div>
                            ) : (
                                'No Course Selected'
                            )}
                        </div>
                        <div className="overflow-auto custom-scrollbar min-h-92 max-h-96">
                            {selectedCourse?.courseRequirements &&
                            selectedCourse?.courseRequirements?.length ? (
                                <div className="p-4 flex flex-col gap-y-4">
                                    <Typography
                                        variant="title"
                                        color="text-gray-500"
                                    >
                                        RTO Added Requirements
                                    </Typography>
                                    <div
                                        className="break-all text-xs leading-6"
                                        dangerouslySetInnerHTML={{
                                            __html: selectedCourse
                                                ?.courseRequirements?.[0]
                                                ?.requirements,
                                        }}
                                    />
                                </div>
                            ) : selectedCourse?.requirements &&
                              selectedCourse?.requirements?.trim() !==
                                  '<p>null</p>' ? (
                                <div className="p-4 flex flex-col gap-y-4">
                                    <Typography variant="title">
                                        Admin Added Requirements
                                    </Typography>
                                    <div
                                        className="break-all"
                                        dangerouslySetInnerHTML={{
                                            __html: selectedCourse?.requirements,
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="p-4 h-full w-full flex justify-center items-center">
                                    <NoData text="No Course Requirements added yet" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
