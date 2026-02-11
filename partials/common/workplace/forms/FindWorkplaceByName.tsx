import {
    Button,
    Card,
    InitialAvatar,
    LoadingAnimation,
    NoData,
    OutsideClickHandler,
    Select,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import {
    SubAdminApi,
    useApplyWorkplaceOnExistingIndustryMutation,
} from '@queries'
import { Course, Industry, Student } from '@types'
import { CourseSelectOption, formatOptionLabel } from '@utils'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { ImPhone } from 'react-icons/im'
import { IoLocation } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'


export const FindWorkplaceByName = ({
    setWorkplaceData,
    setActive,
    student,
}: {
    setActive: any
    student: Student
    setWorkplaceData: any
}) => {
    const [selectedIndustry, setSelectedIndustry] = useState<any>(null)
    const [answer, setAnswer] = useState<any>('')
    const [isDropdown, setIsDropdown] = useState<boolean>(false)
    const [selectedCourse, setselectedCourse] = useState<number | null>(null)
    const [searchedName, setSearchedName] = useState<string>('')

    const { notification } = useNotification()

    const router = useRouter()

    const courses = SubAdminApi.Student.useCourses(Number(router.query?.id), {
        skip: !router.query?.id,
        refetchOnMountOrArgChange: true,
    })
    const industries = SubAdminApi.Student.useFindSuggestedIndustries(
        {
            name: searchedName,
        },
        {
            skip: !searchedName,
        }
    )

    const [applyForWorkplace, applyForWorkplaceResult] =
        useApplyWorkplaceOnExistingIndustryMutation()

    useEffect(() => {
        if (applyForWorkplaceResult.isSuccess) {
            setWorkplaceData(applyForWorkplaceResult?.data?.workplaceRequest)
            setActive((active: number) => 3)
            setIsDropdown(false)
        }
    }, [applyForWorkplaceResult])

    const courseOptions =
        courses?.data && courses?.data?.length > 0
            ? courses?.data?.map((course: Course) => ({
                item: course,
                value: course?.id,
                label: course?.title,
            }))
            : []

    const delayedSearch = useCallback(
        debounce((value) => {
            setSearchedName(value)
        }, 700),
        []
    )
    return (
        <div>
            <ShowErrorNotifications result={applyForWorkplaceResult} />
            <Card>
                <div className="mt-2">
                    <Select
                        label={'Select Course'}
                        name={'course'}
                        required
                        options={courseOptions}
                        placeholder={'Select Course...'}
                        loading={courses.isLoading}
                        onChange={(e: any) => {
                            setselectedCourse(e?.value)
                        }}
                        components={{
                            Option: CourseSelectOption,
                        }}
                        formatOptionLabel={formatOptionLabel}
                    />
                </div>
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setIsDropdown(false)
                    }}
                >
                    <div className="relative">
                        <TextInput
                            name={'searchWork'}
                            label={'Find Industry'}
                            placeholder={'Find Industry'}
                            onFocus={() => {
                                setIsDropdown(true)
                            }}
                            onChange={(e: any) => {
                                delayedSearch(e.target?.value)
                            }}
                        />
                        {isDropdown && searchedName && (
                            <div className="absolute top-full left-0 w-full  rounded-md bg-white p-3 shadow-md">
                                {industries.isError && (
                                    <NoData
                                        text="There is some technical issue!"
                                        isError
                                    />
                                )}
                                {industries.isLoading ? (
                                    <LoadingAnimation />
                                ) : industries?.data &&
                                    industries?.data?.length > 0 &&
                                    industries?.isSuccess ? (
                                    <div className="flex flex-col gap-y-1 p-3 h-80 overflow-auto custom-scrollbar">
                                        {industries?.data?.map(
                                            (industry: Industry) => (
                                                <div
                                                    key={industry?.id}
                                                    className="py-1 rounded-md bg-gray-100 hover:bg-gray-200 px-5 flex justify-between items-center"
                                                >
                                                    <div className="flex items-center gap-x-2 ">
                                                        <InitialAvatar
                                                            name={
                                                                industry?.user
                                                                    ?.name
                                                            }
                                                            imageUrl={
                                                                industry?.user
                                                                    ?.avatar
                                                            }
                                                        />
                                                        <div>
                                                            <Typography variant="label">
                                                                {
                                                                    industry
                                                                        ?.user
                                                                        ?.name
                                                                }
                                                            </Typography>
                                                            <div className="flex items-center gap-x-1">
                                                                <ImPhone className="text-gray-400 text-xs" />
                                                                <Typography
                                                                    variant="small"
                                                                    color="text-gray-400"
                                                                >
                                                                    {
                                                                        industry?.phoneNumber
                                                                    }
                                                                </Typography>
                                                            </div>
                                                            <div className="flex items-center gap-x-1">
                                                                <MdEmail className="text-gray-400 text-xs" />
                                                                <Typography
                                                                    variant="small"
                                                                    color="text-gray-400"
                                                                >
                                                                    {
                                                                        industry
                                                                            ?.user
                                                                            ?.email
                                                                    }
                                                                </Typography>
                                                            </div>
                                                            <div className="flex items-center gap-x-1">
                                                                <IoLocation className="text-gray-400 text-xs" />
                                                                <Typography
                                                                    variant="small"
                                                                    color="text-gray-400"
                                                                >
                                                                    {
                                                                        industry?.addressLine1
                                                                    }{' '}
                                                                    {
                                                                        industry?.suburb
                                                                    }{' '}
                                                                    {
                                                                        industry?.state
                                                                    }{' '}
                                                                    {
                                                                        industry?.zipCode
                                                                    }
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        text={'Apply'}
                                                        onClick={() => {
                                                            if (
                                                                selectedCourse
                                                            ) {
                                                                setSelectedIndustry(
                                                                    true
                                                                )
                                                                applyForWorkplace(
                                                                    {
                                                                        document:
                                                                            -1,
                                                                        student:
                                                                            Number(
                                                                                student
                                                                                    ?.user
                                                                                    ?.id
                                                                            ),
                                                                        IndustryId:
                                                                            industry?.id,
                                                                        courseId:
                                                                            selectedCourse,
                                                                    }
                                                                )
                                                            } else {
                                                                notification.warning(
                                                                    {
                                                                        title: 'Course Required',
                                                                        description:
                                                                            'Course Must be selected',
                                                                    }
                                                                )
                                                            }
                                                        }}
                                                        loading={
                                                            applyForWorkplaceResult.isLoading
                                                        }
                                                        disabled={
                                                            applyForWorkplaceResult.isLoading
                                                        }
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    industries.isSuccess && (
                                        <NoData text="No Industries were found" />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </OutsideClickHandler>
            </Card>
        </div>
    )
}
