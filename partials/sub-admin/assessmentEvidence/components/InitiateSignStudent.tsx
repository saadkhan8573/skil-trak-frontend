import {
    Button,
    InitialAvatar,
    NoData,
    Select,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import { UserRoles } from '@constants'
import { useNotification, useWorkplace } from '@hooks'
import { CommonApi } from '@queries'
import { Industry, OptionType, SubAdmin } from '@types'
import { AuthUtils, getUserCredentials } from '@utils'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { MdEmail } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { apiSlice } from '@queries/portals/empty.query'
import { PuffLoader } from 'react-spinners'

const UserCellInfo = ({
    profile,
    setSecondaryMails,
}: {
    setSecondaryMails: (values: any) => void
    profile: any
}) => (
    <div>
        <div className="flex items-center gap-x-2">
            <div className="shadow-inner-image rounded-full">
                {profile?.user?.name && (
                    <InitialAvatar
                        name={profile?.user?.name}
                        imageUrl={profile?.user?.avatar}
                    />
                )}
            </div>
            <div>
                {profile?.studentId && (
                    <p className={'font-light text-[10px] text-gray-600'}>
                        {profile?.studentId}
                    </p>
                )}
                <p className={'font-medium'}>{profile?.user?.name}</p>
                <div className="font-medium text-xs text-gray-500">
                    <p className="flex items-center gap-x-1">
                        <span>
                            <MdEmail />
                        </span>
                        {profile?.user?.email}
                    </p>
                </div>
            </div>
        </div>

        <div className="mt-1.5">
            <TextInput
                name={profile?.user?.name}
                type="email"
                placeholder={`Add Secondary mail for ${profile?.user?.role}`}
                showError={false}
                onChange={(e: any) => {
                    setSecondaryMails((sMail: any) => {
                        const findUser = sMail?.find(
                            (a: any) => profile?.user?.id === a?.user
                        )
                        const usersMails = sMail?.map((a: any) =>
                            profile?.user?.id === a?.user
                                ? {
                                      ...a,
                                      email: e?.target?.value,
                                  }
                                : a
                        )

                        return findUser
                            ? [...usersMails]
                            : [
                                  ...sMail,
                                  {
                                      user: profile?.user?.id,
                                      email: e?.target?.value,
                                  },
                              ]
                    })
                }}
            />
        </div>
    </div>
)

export const InitiateSignStudent = ({
    onCancel,
    template,
    courseId,
    getTemplate,
    setIsPreviewAsSigner,
}: {
    template: any
    courseId: number
    getTemplate: any
    onCancel: () => void
    setIsPreviewAsSigner: (userIds: any) => void
}) => {
    const router = useRouter()
    const { workplaceRto } = useWorkplace()
    const role = getUserCredentials()?.role

    const dispatch = useDispatch()

    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
        null
    )
    const [isSelectAnotherIndustry, setIsSelectAnotherIndustry] =
        useState<boolean>(false)
    const [selectedCoordinator, setSelectedCoordinator] =
        useState<SubAdmin | null>(null)
    const [isSelectAnotherCoordinator, setIsSelectAnotherCoordinator] =
        useState<boolean>(false)
    const [secondaryMails, setSecondaryMails] = useState<any>([])
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const { notification } = useNotification()

    const pathName = router.asPath.startsWith(
        `/portals/${role}/students-and-placements/placement-requests`
    )

    const stdId = pathName
        ? Number(router?.query?.studentId)
        : Number(router.query?.id)
    const student = CommonApi.ESign.useGetESignStudent(
        {
            student: stdId,
            courseId,
        },
        {
            skip: !router.query.id,
            refetchOnMountOrArgChange: true,
        }
    )
    const subadmins = CommonApi.ESign.getCoordinatorsByCourse(
        Number(courseId),
        {
            refetchOnMountOrArgChange: true,
        }
    )
    const [initiateSign, initiateSignResult] =
        CommonApi.ESign.useInitiateESign()

    useEffect(() => {
        if (initiateSignResult?.isSuccess) {
            notification.success({
                title: 'Document Initiated',
                description: 'Document Initiated Successfully',
            })
            onCancel()
        }
    }, [initiateSignResult])

    const ind = student?.data?.workplace
        ?.map((w: any) => w?.industries?.map((indus: any) => indus?.industry))
        ?.flat()
    useEffect(() => {
        if (
            student?.data &&
            student?.data?.workplace?.length > 0 &&
            student?.isSuccess &&
            !selectedIndustry
        ) {
            setSelectedIndustry(ind?.[0])
        }
    }, [student])

    const user = getUserCredentials()

    useEffect(
        () => {
            if (
                student?.data &&
                student?.isSuccess &&
                subadmins.isSuccess &&
                !selectedCoordinator
            ) {
                setSelectedCoordinator(
                    student?.data?.subadmin
                        ? student?.data?.subadmin
                        : subadmins?.data?.find(
                              (s: SubAdmin) => s?.user?.id === user?.id
                          ) || subadmins?.data?.[0]
                )
            }
        },
        [
            // student, subadmins
        ]
    )

    const industryOptions = useMemo(
        () =>
            ind?.map((industry: Industry) => ({
                label: industry?.user?.name,
                value: industry?.user?.id,
                item: industry,
            })),
        [ind]
    )

    const subAdminOptions = useMemo(
        () =>
            subadmins?.data?.map((subAdmin: SubAdmin) => ({
                label: subAdmin?.user?.name,
                value: subAdmin?.id,
                item: subAdmin,
            })),
        [subadmins]
    )

    const userIds = () => {
        const ids = {
            [UserRoles.INDUSTRY]: Number(selectedIndustry?.user?.id),
            [UserRoles.STUDENT]: student?.data?.user?.id,
            coordinator: Number(selectedCoordinator?.user?.id),
            [UserRoles.RTO]: workplaceRto?.user?.id,
        }
        const updatedIds = {}

        const idsKeys = Object.keys(ids)
        idsKeys?.forEach((key: any) => {
            const updatedKey = key === 'coordinator' ? UserRoles.SUBADMIN : key
            template?.recipients?.includes(updatedKey)
                ? ((updatedIds as any)[updatedKey] = (ids as any)[key])
                : null
        })
        return updatedIds
    }

    const isAllRolesExist = Object.entries(userIds())
        ?.filter(([key, value]: any) => {
            return !value && key
        })
        ?.map(([key, value]) => key)

    const showMissingUsersError = () => {
        isAllRolesExist?.forEach((key: string) => {
            notification.error({
                title: key,
                description: `${key} is missing`,
            })
        })
    }

    const onInitiateSigning = async () => {
        if (isAllRolesExist && isAllRolesExist?.length > 0) {
            showMissingUsersError()
        } else {
            const axiosInstance = axios.create({
                baseURL: `${process.env.NEXT_PUBLIC_END_POINT}`, // Replace with your API base URL
            })

            // Add an interceptor to include the authorization token in the headers
            axiosInstance.interceptors.request.use(
                (config) => {
                    const authToken = AuthUtils.token() // Replace with your actual authentication token
                    // const authToken = data?.accessToken
                    if (authToken) {
                        config.headers.Authorization = `Bearer ${authToken}`
                    }

                    return config
                },
                (error) => {
                    return Promise.reject(error)
                }
            )

            try {
                setIsLoading(true)
                const response = await axiosInstance.post(
                    `/esign/document/initiate/${
                        template?.id
                    }?users=${Object.values(userIds())?.join(',')}`,
                    // (...{
                    //     signers: secondaryMails,
                    // })
                    {
                        ...(secondaryMails && secondaryMails?.length > 0
                            ? { signers: secondaryMails }
                            : { signers: secondaryMails }),
                    }
                )

                // Handle the response as needed

                // Assuming you need to perform some actions based on the response
                if (response.data) {
                    notification.success({
                        title: 'Document Initiated',
                        description: 'Document Initiated Successfully',
                    })

                    dispatch(apiSlice.util.invalidateTags(['SubAdminStudents']))
                    dispatch(apiSlice.util.invalidateTags(['E-Sign']))
                    onCancel()
                }
                setIsLoading(false)
                setIsSuccess(true)
            } catch (error) {
                setIsLoading(false)
                setIsError(true)
                // Handle errors
                console.error('Axios Error:', error)

                // Assuming you want to show an error notification
                notification.error({
                    title: 'Error',
                    description:
                        'An error occurred while initiating the document.',
                })
            }
        }
    }

    // useEffect(() => {
    //     if (
    //         userIds() &&
    //         secondaryMails?.filter((s: any) => s?.user)?.length <
    //             template?.recipients?.length
    //     ) {
    //         setSecondaryMails(
    //             Object.entries(userIds())?.map(([role, id]: any) => ({
    //                 user: id,
    //                 email: null,
    //                 role,
    //             }))
    //         )
    //     }
    // }, [userIds(), template?.recipients, secondaryMails])

    useEffect(
        () => {
            // Only proceed if userIds is a function and returns a truthy value
            const userIdsValue = userIds()

            if (
                userIdsValue &&
                (!secondaryMails ||
                    secondaryMails.filter((s: any) => s?.user)?.length <
                        (template?.recipients?.length || 0))
            ) {
                const newSecondaryMails = Object.entries(userIdsValue).map(
                    ([role, id]: [string, any]) => ({
                        user: id,
                        email: null,
                        role,
                    })
                )

                // Use functional update to ensure we're working with the most recent state
                setSecondaryMails((prevMails: any) => {
                    // Avoid unnecessary updates if the new mails are the same as existing ones
                    const areSame =
                        newSecondaryMails.length === prevMails.length &&
                        newSecondaryMails.every(
                            (mail, index) =>
                                mail.user === prevMails[index]?.user &&
                                mail.role === prevMails[index]?.role
                        )

                    return areSame ? prevMails : newSecondaryMails
                })
            }
        },
        [
            // Use a stable reference to the userIds object/function
            userIds,
            template?.recipients?.length,
            secondaryMails?.length,
        ]
    )

    return (
        <>
            {modal}
            <ShowErrorNotifications result={initiateSignResult} />
            {student.isError && (
                <NoData text="There is some technical issue!" isError />
            )}
            {student.isLoading ? (
                <div className="flex justify-center items-center h-[calc(100%-100px)]">
                    <PuffLoader />
                </div>
            ) : student?.data && student.isSuccess ? (
                <div className="flex flex-col justify-between gap-y-6 h-full">
                    <div>
                        <Typography variant="small" color={'text-gray-400'}>
                            Document Detail
                        </Typography>

                        <div className="grid grid-cols-2 mt-3">
                            <div>
                                <Typography
                                    variant="small"
                                    color={'text-gray-400'}
                                >
                                    Document Name
                                </Typography>
                                <Typography variant="label" color={'text-dark'}>
                                    {template?.name}
                                </Typography>
                            </div>
                            <div>
                                <Typography
                                    variant="small"
                                    color={'text-gray-400'}
                                >
                                    Course
                                </Typography>
                                <Typography variant="label" color={'text-dark'}>
                                    {template?.course?.title}
                                </Typography>
                            </div>
                        </div>

                        <div>
                            <div className="pt-3 border-b">
                                <Typography variant="small" color={'text-dark'}>
                                    RTO
                                </Typography>
                                <UserCellInfo
                                    profile={workplaceRto}
                                    setSecondaryMails={setSecondaryMails}
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            <Typography variant="small" color={'text-gray-500'}>
                                Following users will assigned as signers:
                            </Typography>

                            <div className="flex flex-col gap-y-2 mt-2">
                                <div>
                                    <Typography variant="label" semibold>
                                        Student
                                    </Typography>
                                    <UserCellInfo
                                        profile={{
                                            id: student?.data?.id,
                                            studentId: student?.data?.studentId,
                                            user: student?.data?.user,
                                        }}
                                        setSecondaryMails={setSecondaryMails}
                                    />
                                </div>
                                {selectedIndustry && (
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <Typography
                                                variant="label"
                                                semibold
                                            >
                                                Industry
                                            </Typography>
                                            {industryOptions?.length > 0 && (
                                                <Typography
                                                    variant="small"
                                                    color={'text-info'}
                                                    light
                                                >
                                                    <span
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setIsSelectAnotherIndustry(
                                                                !isSelectAnotherIndustry
                                                            )
                                                        }}
                                                    >
                                                        {isSelectAnotherIndustry
                                                            ? 'Cancel'
                                                            : 'Choose Another'}
                                                    </span>
                                                </Typography>
                                            )}
                                        </div>
                                        {isSelectAnotherIndustry ? (
                                            <Select
                                                name={'industry'}
                                                // value={commentType}
                                                options={industryOptions}
                                                value={industryOptions?.find(
                                                    (industry: OptionType) =>
                                                        industry?.value ===
                                                        selectedIndustry?.id
                                                )}
                                                onChange={(e: OptionType) => {
                                                    const ind =
                                                        industryOptions?.find(
                                                            (
                                                                industry: OptionType
                                                            ) =>
                                                                industry?.value ===
                                                                e?.value
                                                        )

                                                    setSelectedIndustry(
                                                        ind?.item
                                                    )
                                                    setIsSelectAnotherIndustry(
                                                        false
                                                    )
                                                    setSecondaryMails(
                                                        (preVal: any) => {
                                                            const ind =
                                                                preVal?.find(
                                                                    (i: any) =>
                                                                        i?.role ===
                                                                        UserRoles.INDUSTRY
                                                                )

                                                            return [
                                                                ...preVal?.filter(
                                                                    (i: any) =>
                                                                        i?.role !==
                                                                        UserRoles.INDUSTRY
                                                                ),
                                                                {
                                                                    ...ind,
                                                                    user: ind?.item,
                                                                },
                                                            ]
                                                        }
                                                    )
                                                }}
                                            />
                                        ) : (
                                            <UserCellInfo
                                                profile={selectedIndustry}
                                                setSecondaryMails={
                                                    setSecondaryMails
                                                }
                                            />
                                        )}
                                    </div>
                                )}
                                {template?.recipients?.includes(
                                    UserRoles.SUBADMIN
                                ) ? (
                                    <div className="pr-4">
                                        <div className="flex justify-between items-center">
                                            <Typography
                                                variant="label"
                                                semibold
                                            >
                                                Coordinator
                                            </Typography>
                                            {subadmins?.data &&
                                                subadmins?.data?.length > 0 && (
                                                    <Typography
                                                        variant="small"
                                                        color={'text-info'}
                                                        light
                                                    >
                                                        <span
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                setIsSelectAnotherCoordinator(
                                                                    !isSelectAnotherCoordinator
                                                                )
                                                            }}
                                                        >
                                                            {isSelectAnotherCoordinator
                                                                ? 'Cancel'
                                                                : 'Choose Another'}
                                                        </span>
                                                    </Typography>
                                                )}
                                        </div>

                                        {isSelectAnotherCoordinator ? (
                                            <Select
                                                menuPlacement="top"
                                                label={'Sub Admin'}
                                                name={'subAdmin'}
                                                placeholder={'Select Sub Admin'}
                                                options={subAdminOptions}
                                                value={subAdminOptions?.find(
                                                    (coordinator: OptionType) =>
                                                        coordinator?.value ===
                                                        selectedCoordinator?.id
                                                )}
                                                loading={subadmins?.isLoading}
                                                disabled={subadmins?.isLoading}
                                                onChange={(e: OptionType) => {
                                                    const subadmin =
                                                        subAdminOptions?.find(
                                                            (
                                                                subadmin: OptionType
                                                            ) =>
                                                                subadmin?.value ===
                                                                e?.value
                                                        )

                                                    setSelectedCoordinator(
                                                        subadmin?.item as SubAdmin
                                                    )
                                                    setIsSelectAnotherCoordinator(
                                                        false
                                                    )
                                                    setSecondaryMails(
                                                        (preVal: any) => {
                                                            const coordinator =
                                                                preVal?.find(
                                                                    (i: any) =>
                                                                        i?.role ===
                                                                        UserRoles.SUBADMIN
                                                                )

                                                            return [
                                                                ...preVal?.filter(
                                                                    (i: any) =>
                                                                        i?.role !==
                                                                        UserRoles.SUBADMIN
                                                                ),
                                                                {
                                                                    ...coordinator,
                                                                    user: coordinator?.item,
                                                                },
                                                            ]
                                                        }
                                                    )
                                                }}
                                            />
                                        ) : (
                                            <UserCellInfo
                                                profile={selectedCoordinator}
                                                setSecondaryMails={
                                                    setSecondaryMails
                                                }
                                            />
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-x-3">
                        <Button
                            text={'Preview'}
                            variant={'dark'}
                            onClick={() => {
                                if (
                                    isAllRolesExist &&
                                    isAllRolesExist?.length > 0
                                ) {
                                    showMissingUsersError()
                                } else {
                                    setIsPreviewAsSigner(userIds)
                                }
                            }}
                            disabled={!student?.data}
                        />
                        <Button
                            text={'Initiate'}
                            onClick={() => {
                                onInitiateSigning()
                            }}
                            loading={isLoading}
                            disabled={isLoading || !student?.data}
                        />
                    </div>
                </div>
            ) : (
                student.isSuccess && <NoData text="No Student were found" />
            )}
        </>
    )
}
