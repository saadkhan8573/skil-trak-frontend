import { TextInput, Typography } from '@components'
import React, { useEffect } from 'react'
import { workplaceQuestions } from '../questionListData'
import { fromAddress, geocode, GeocodeOptions, setKey } from 'react-geocode'
import {
    useGetStudentProfileDetailQuery,
    useGetSubAdminStudentDetailQuery,
} from '@queries'
import { useRouter } from 'next/router'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'

export const TextTypeQuestions = ({
    ques,
    index,
    formMethods,
    textTypeLength,
}: {
    ques: any
    index: number
    formMethods: any
    textTypeLength: number
}) => {
    useEffect(() => {
        setKey(process.env.NEXT_PUBLIC_MAP_KEY as string)
    }, [])
    const router = useRouter()
    const { id } = router.query

    const role = getUserCredentials()?.role

    // query
    const student = useGetSubAdminStudentDetailQuery(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })
    const studentProfile = useGetStudentProfileDetailQuery(undefined, {
        refetchOnMountOrArgChange: true,
        skip: role !== UserRoles.STUDENT,
    })

    useEffect(() => {
        const address =
            student?.data?.addressLine1 || studentProfile?.data?.addressLine1
        const zip = student?.data?.zipCode || studentProfile?.data?.zipCode

        if (address) {
            formMethods.setValue('suburb', address, {
                shouldValidate: true,
                shouldDirty: true,
            })
        }
        if (zip) {
            formMethods.setValue('zip', zip, {
                shouldValidate: true,
                shouldDirty: true,
            })
        }
    }, [student?.data, studentProfile?.data])

    const getDateAfterDays = (daysAhead: number) => {
        const date = new Date()
        date.setDate(date.getDate() + daysAhead)

        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')

        return `${yyyy}-${mm}-${dd}` // format for input[type="date"]
    }

    return (
        <>
            <div
                className={`${
                    ques?.fullWidth ? 'col-span-2' : ''
                } flex flex-col gap-y-1`}
            >
                <div>
                    <Typography variant="label" semibold block>
                        {ques?.index}. {ques?.title}
                    </Typography>

                    <Typography variant="label" block>
                        {
                            workplaceQuestions[
                                ques?.name as keyof typeof workplaceQuestions
                            ]
                        }
                    </Typography>
                </div>
                {ques?.inputValues && ques?.inputValues?.length > 0 ? (
                    <div
                        className={`grid grid-cols-1 ${
                            ques?.inputValues?.length > 1
                                ? 'lg:grid-cols-2'
                                : 'lg:grid-cols-1'
                        }  gap-3`}
                    >
                        {ques?.inputValues?.map((inp: any, i: number) => {
                            return inp?.name === 'suburb' ||
                                inp?.name === 'zip' ? (
                                <TextInput
                                    key={i}
                                    name={inp?.name}
                                    label={inp?.label}
                                    placeholder={inp?.placeholder}
                                    required
                                    type={inp?.type as any}
                                    placesSuggetions={inp?.name === 'suburb'}
                                    onChange={(e: any) => {
                                        if (inp?.name === 'suburb') {
                                            if (e?.target?.value?.length > 4) {
                                                fromAddress(e?.target?.value)
                                                    .then(
                                                        ({ results }: any) => {
                                                            const { lat, lng } =
                                                                results[0]
                                                                    .geometry
                                                                    .location
                                                            geocode(
                                                                'latlng',
                                                                `${lat},${lng}`,
                                                                {
                                                                    key: process
                                                                        .env
                                                                        .NEXT_PUBLIC_MAP_KEY,
                                                                } as GeocodeOptions
                                                            )
                                                                .then(
                                                                    (
                                                                        response
                                                                    ) => {
                                                                        const addressComponents =
                                                                            response
                                                                                .results[0]
                                                                                .address_components

                                                                        for (let component of addressComponents) {
                                                                            if (
                                                                                component.types.includes(
                                                                                    'postal_code'
                                                                                )
                                                                            ) {
                                                                                formMethods.setValue(
                                                                                    'zip',
                                                                                    component.long_name,
                                                                                    {
                                                                                        shouldValidate: true,
                                                                                        shouldDirty: true,
                                                                                    }
                                                                                )

                                                                                break
                                                                            }
                                                                        }
                                                                    }
                                                                )
                                                                .catch(
                                                                    (
                                                                        error
                                                                    ) => {}
                                                                )
                                                        }
                                                    )
                                                    .catch(console.error)
                                            }
                                        }

                                        formMethods.setValue(
                                            inp?.name,
                                            e?.target?.value,
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            }
                                        )
                                    }}
                                    defaultValue={
                                        inp.name === 'suburb'
                                            ? student?.data?.addressLine1 ||
                                              studentProfile?.data?.addressLine1
                                            : inp.name === 'zip'
                                              ? student?.data?.zipCode ||
                                                studentProfile?.data?.zipCode
                                              : ''
                                    }
                                />
                            ) : inp.type === 'date' ? (
                                <TextInput
                                    key={i}
                                    name={inp?.name}
                                    label={inp?.label}
                                    placeholder={inp?.placeholder}
                                    required
                                    type={inp?.type as any}
                                    min={getDateAfterDays(7)}
                                />
                            ) : (
                                <TextInput
                                    key={i}
                                    name={inp?.name}
                                    label={inp?.label}
                                    placeholder={inp?.placeholder}
                                    required
                                    type={inp?.type as any}
                                    placesSuggetions={inp?.name === 'suburb'}
                                    onChange={(e: any) => {
                                        if (inp?.name === 'suburb') {
                                            if (e?.target?.value?.length > 4) {
                                                fromAddress(e?.target?.value)
                                                    .then(
                                                        ({ results }: any) => {
                                                            const { lat, lng } =
                                                                results[0]
                                                                    .geometry
                                                                    .location
                                                            geocode(
                                                                'latlng',
                                                                `${lat},${lng}`,
                                                                {
                                                                    key: process
                                                                        .env
                                                                        .NEXT_PUBLIC_MAP_KEY,
                                                                } as GeocodeOptions
                                                            )
                                                                .then(
                                                                    (
                                                                        response
                                                                    ) => {
                                                                        const addressComponents =
                                                                            response
                                                                                .results[0]
                                                                                .address_components

                                                                        for (let component of addressComponents) {
                                                                            if (
                                                                                component.types.includes(
                                                                                    'postal_code'
                                                                                )
                                                                            ) {
                                                                                formMethods.setValue(
                                                                                    'zip',
                                                                                    component.long_name,
                                                                                    {
                                                                                        shouldValidate: true,
                                                                                        shouldDirty: true,
                                                                                    }
                                                                                )

                                                                                break
                                                                            }
                                                                        }
                                                                    }
                                                                )
                                                                .catch(
                                                                    (error) => {
                                                                        console.error(
                                                                            {
                                                                                error,
                                                                            }
                                                                        )
                                                                    }
                                                                )
                                                        }
                                                    )
                                                    .catch(console.error)
                                            }
                                        }

                                        formMethods.setValue(
                                            inp?.name,
                                            e?.target?.value,
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            }
                                        )
                                    }}
                                />
                            )
                        })}
                    </div>
                ) : null}
            </div>
        </>
    )
}
