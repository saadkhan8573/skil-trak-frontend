import { NoData, StudentAvatar, Typography } from '@components'
import moment from 'moment'
import React from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { BiRename } from 'react-icons/bi'
import { FaAddressCard, FaBirthdayCake, FaUserCircle } from 'react-icons/fa'
import { IoLocation } from 'react-icons/io5'
import { MdBatchPrediction, MdBlock, MdPhone, MdVerified } from 'react-icons/md'
import { Course, Rto } from '@types'
import { CourseList } from '@partials/common'
import { ellipsisText } from '@utils'

type Props = {
    student: any
}

export const RtoStudentProfileCB = ({ student }: Props) => {
    const getGender = (gender: string | undefined) => {
        if (!gender) return 'N/A'

        if (gender.toLocaleLowerCase() === 'm') return 'Male'
        if (gender.toLocaleLowerCase() === 'f') return 'Female'
    }
    // get sector from courses array
    const getSectors = (courses: any) => {
        if (!courses) return {}
        const sectors = {}
        courses.forEach((c: any) => {
            if ((sectors as any)[c.sector.name]) {
                ;(sectors as any)[c.sector.name].push(c)
            } else {
                ;(sectors as any)[c.sector.name] = []
                ;(sectors as any)[c.sector.name].push(c)
            }
        })
        return sectors
    }

    const sectorsWithCourses = getSectors(student?.courses)
    return (
        <>
            <div>
                <div className="flex justify-end gap-x-2">
                    <div className="bg-blue-100 rounded-full p-1">
                        <AiFillEdit className="text-blue-400  cursor-pointer " />
                    </div>
                    <div className="bg-red-100 rounded-full p-1">
                        <MdBlock className="text-red-400  cursor-pointer bg-red-100 rounded-full" />
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <StudentAvatar
                        name={student?.user.name}
                        imageUrl={student.user.avatar}
                        gender={student.gender}
                    />

                    <div className="flex flex-col items-center">
                        <p className="text-lg font-semibold">
                            {student.user?.name}
                        </p>
                        <div className="flex items-center gap-x-2">
                            <p className="text-sm text-gray-400">
                                {student?.user?.email}
                            </p>
                            <span className="text-blue-500">
                                <MdVerified />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Row 1 */}
                <div className="flex justify-between divide-x border-b mt-4">
                    <div className="p-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300">
                                <FaAddressCard size={12} />
                            </span>
                            <p className="text-xs font-medium">
                                {ellipsisText(student?.studentId, 8)}
                            </p>
                        </div>
                        <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                            Student ID
                        </div>
                    </div>

                    <div className="p-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300">
                                <MdBatchPrediction size={12} />
                            </span>
                            <p className="text-xs font-medium">N/A</p>
                        </div>
                        <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                            Batch
                        </div>
                    </div>

                    <div className="p-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300">
                                <MdPhone size={12} />
                            </span>
                            <p className="text-xs font-medium">
                                {student?.phone}
                            </p>
                        </div>
                        <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                            Phone Number
                        </div>
                    </div>
                </div>
                {/* Info Row 2 */}
                <div className="flex justify-around divide-x border-b">
                    <div className="p-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300">
                                <FaBirthdayCake size={12} />
                            </span>
                            <p className="text-xs font-medium">
                                {moment(student?.dob).format('DD MMM, YYYY')}
                            </p>
                        </div>
                        <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                            Date Of Birth
                        </div>
                    </div>

                    <div className="p-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300">
                                <FaUserCircle size={12} />
                            </span>
                            <p className="text-xs font-medium">
                                {getGender(student.gender)}
                            </p>
                        </div>
                        <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                            Gender
                        </div>
                    </div>
                </div>

                {/* Info Row 3 */}
                <div className="flex justify-around">
                    <div className="p-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300">
                                <IoLocation size={12} />
                            </span>
                            {/* <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                            Address
                        </div> */}
                            <div>
                                <p className="text-xs font-medium">
                                    {student?.addressLine1},{' '}
                                    {student?.addressLine2}, {student?.state},{' '}
                                    {student?.suburb}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* contact person row 4 */}
                <div className="mt-4">
                    <Typography variant={'small'} color={'text-gray-500'}>
                        Emergency Contact Person
                    </Typography>
                    <div className="flex justify-around divide-x border-t border-b">
                        <div className="p-2">
                            <div className="flex items-center gap-x-2">
                                <BiRename className="text-gray-400" size={12} />
                                <Typography
                                    variant={'muted'}
                                    color={'text-gray-400'}
                                >
                                    Name
                                </Typography>
                            </div>
                            <Typography variant={'small'} color={'text-black'}>
                                {student?.emergencyPerson}
                            </Typography>
                        </div>
                        <div className="p-2">
                            <div className="flex items-center gap-x-2">
                                <MdPhone className="text-gray-400" size={12} />
                                <Typography
                                    variant={'muted'}
                                    color={'text-gray-400'}
                                >
                                    Phone
                                </Typography>
                            </div>
                            <div className="py-1">
                                <Typography
                                    variant={'small'}
                                    color={'text-black'}
                                >
                                    {student?.emergencyPersonPhone}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Of Student */}
                {/* <StudentStatus /> */}

                {/* Sector & Courses */}
                <div className="mt-4">
                    <Typography variant={'small'} color={'text-gray-500'}>
                        Sector & Courses
                    </Typography>
                    {sectorsWithCourses ? (
                        Object.keys(sectorsWithCourses).map((sector) => {
                            return (
                                <>
                                    <Typography
                                        variant={'label'}
                                        color={'text-black'}
                                    >
                                        {sector}
                                    </Typography>
                                    <CourseList
                                        courses={
                                            (sectorsWithCourses as any)[sector]
                                        }
                                    />
                                </>
                            )
                        })
                    ) : (
                        <NoData text={'No Sectors Assigned'} />
                    )}
                </div>
                {/* <div className="mt-4">
        <Typography variant={'small'} color={'text-gray-500'}>
          Sector & Courses
        </Typography>
        <Typography variant={'label'} color={'text-black'}>
          Commercial Cookery & Hospitality
        </Typography>
        <div className="mt-2 flex items-center gap-x-2">
          <div className="flex flex-col items-center">
            <div className="bg-blue-400 p-2 rounded-full"></div>
            <div className="bg-blue-400 w-[1px] h-10"></div>
            <div className="bg-blue-400 p-2 rounded-full"></div>
            <div className="bg-blue-400 w-[1px] h-10"></div>
            <div className="bg-blue-400 p-2 rounded-full"></div>
          </div>
          <div className="flex flex-col gap-y-4">
            {studentProfileData.map((course: any) => (
              <div key={course.id}>
                <div className="flex items-center gap-x-2">
                  <Typography variant={'small'} color={'text-gray-500'}>
                    {course.courseCode}
                  </Typography>
                  <div
                    className={`rounded whitespace-nowrap border px-2 ${
                      course.status === 'Not Active'
                        ? 'border-gray-400'
                        : 'border-green-400'
                    }`}
                  >
                    <Typography
                      variant={'small'}
                      color={
                        course.status === 'Not Active'
                          ? 'text-gray-500'
                          : 'text-green-500'
                      }
                    >
                      {course.status}
                    </Typography>
                  </div>
                  {course.status === 'Active' ? (
                    <div
                      className={`rounded whitespace-nowrap text-center border px-2 ${
                        data?.result?.result === 'competent'
                          ? 'bg-green-600'
                          : data?.result?.result === 'notCompetent'
                          ? 'bg-red-500'
                          : null
                      }`}
                    >
                      <Typography variant={'small'} color={'text-white'}>
                        {checkStatus(data?.result?.result)}
                      </Typography>
                    </div>
                  ) : course.status === 'Completed' ? (
                    <div
                      className={`rounded whitespace-nowrap text-center border px-2 ${
                        data?.result?.result === 'competent'
                          ? 'bg-green-600'
                          : data?.result?.result === 'notCompetent'
                          ? 'bg-red-500'
                          : null
                      }`}
                    >
                      <Typography variant={'small'} color={'text-white'}>
                        {checkStatus(data?.result?.result)}
                      </Typography>
                    </div>
                  ) : null}
                </div>
                <Typography variant={'small'} color={'text-gray-800'}>
                  {course.courseName}
                </Typography>
              </div>
            ))}

           
          </div>
        </div>
      </div> */}
            </div>
        </>
    )
}
