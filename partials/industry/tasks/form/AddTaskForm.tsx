import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

// Icons
import { ImCancelCircle } from 'react-icons/im'

// components
import {
    Button,
    Checkbox,
    TextArea,
    Typography,
    TextInput,
    Select,
    ShowErrorNotifications,
    Card,
} from '@components'

// redux
import {
    useGetEmployeeQuery,
    useAddEmployeeTaskMutation,
    useGetEmployeeDetailQuery,
} from '@queries'
import { employeeScheduleValidation, getDate } from '@utils'
import { useNotification } from '@hooks'
import { useRouter } from 'next/router'
import moment from 'moment'
import { InputErrorMessage } from '@components/inputs/components'

const DaysOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
]

export const AddTaskForm = ({ publishTask, DraftTask }: any) => {
    const [employeeId, setEmployeeId] = useState('')
    const [filteredDays, setFilteredDays] = useState(DaysOptions)
    const [addedDays, setAddedDays] = useState<string[]>([])
    const [email, setEmail] = useState('')
    const router = useRouter()
    // hooks
    const { notification } = useNotification()
    // Employee
    const EmployeeData = useGetEmployeeQuery(null)
    // const { data } = useGetEmployeeDetailQuery(employeeId, {
    //     skip: !employeeId,
    // })
    // Add Task
    const [addEmployee, addEmployeeData] = useAddEmployeeTaskMutation()

    const validationSchema = yup.object().shape({
        selectEmployee: yup
            .number()
            .nullable()
            .required('Employee is a required field'),
        // Validation for each day
        email: yup
            .string()
            .email('Invalid Email')
            .required('Email is required'),
    })

    // Import yup and other necessary libraries

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    useEffect(() => {
        if (addEmployeeData.isSuccess) {
            notification.success({
                title: 'Schedule Added',
                description: 'Schedule Added Successfully',
            })
            router.push(
                '/portals/industry/tasks/add-a-schedule/schedule?tab=create-task'
            )
            // setIsSchedule(false)
        }
    }, [addEmployeeData])

    const onSelectEmployee = (employee: any) => {
        // setEmployeeId(employee)
        const selectedEmployeeTasks = EmployeeData?.data?.data
            ?.find((selected: any) => selected.id === employee)
            ?.tasks?.map((task: any) => task.day)
        const filteredData = DaysOptions.filter(
            (days) => !selectedEmployeeTasks?.includes(days.value)
        )
        setFilteredDays(filteredData)

        const selectedEmployeeEmail = EmployeeData?.data?.data?.find(
            (selected: any) => selected.id === employee
        )?.email
        if (selectedEmployeeEmail) {
            setEmail(selectedEmployeeEmail)
            methods.setValue('email', selectedEmployeeEmail)
        }
    }
    const { fields, append, remove } = useFieldArray({
        control: methods.control as any,
        name: 'tasks',
    })

    const onSubmit = async (values: any) => {
        const employee = values.selectEmployee
        delete values.selectEmployee

        const tasks = values.tasks.map((task: any) => {
            // Destructure day-specific data
            const {
                day,
                endTime,
                note,
                title,
                startTime,
                totalHours,
                location,
            } = task
            return {
                day,
                startTime,
                endTime,
                totalHours,
                note,
                title,
                location,
                // repeatShift,
            }
        })
        const validationFlag = { isAnyFieldInvalid: false }

        employeeScheduleValidation(tasks, methods, validationFlag)
        if (validationFlag?.isAnyFieldInvalid) {
            return
        }

        await addEmployee({
            employee,
            sendInvite: true,
            tasks: tasks,
        })
    }
    const handleRemoveFAQ = (index: number) => {
        remove(index)
    }
    const generateInitialValues = () => {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        const initialValues = days.reduce((acc: any, day: any, index: any) => {
            acc[day] = {
                totalHours: '',
                startTime: '',
                endTime: '',
                priority: '',
                title: '',
                location: '',
                note: '',
                repeatShift: false,
            }
            return acc
        }, {})
        return initialValues
    }

    const handleAddShift = () => {
        // Check if all days from Monday to Friday are already added
        if (addedDays.length === 5) {
            return // If all days are added, do nothing
        }
        // If not, find the next available day and add it
        const nextDay = DaysOptions.find(
            (day) => !addedDays.includes(day.value)
        )
        if (nextDay) {
            append(generateInitialValues())
            // Update the added days
            setAddedDays([...addedDays, nextDay.value])
        }
    }

    const isAddShiftDisabled = () => addedDays.length === filteredDays.length

    return (
        <Card>
            <ShowErrorNotifications result={addEmployeeData} />
            <div className="flex justify-between items-center">
                <Typography variant={'subtitle'}>Add Shift</Typography>
            </div>

            {/* Form */}
            <FormProvider {...methods}>
                <form
                    className="mt-2 w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <div className="mb-6">
                        <Select
                            label={'Select Employee'}
                            name={'selectEmployee'}
                            options={
                                EmployeeData.isSuccess
                                    ? EmployeeData?.data?.data?.map(
                                        ({
                                            id,
                                            firstName,
                                            lastName,
                                        }: any) => ({
                                            value: id,
                                            label: `${firstName} ${lastName}`,
                                        })
                                    )
                                    : []
                            }
                            loading={EmployeeData?.isLoading}
                            disabled={EmployeeData?.isLoading}
                            onlyValue
                            onChange={onSelectEmployee}
                        />
                    </div>

                    <Typography variant={'small'} color={'gray'}>
                        Shift Time
                    </Typography>

                    <div className="">
                        {fields?.map((field: any, index: any) => (
                            <div
                                key={field.id}
                                className="border-r border-b p-4"
                            >
                                <Select
                                    required
                                    label={'Select Day'}
                                    name={`tasks[${index}].day`}
                                    options={filteredDays}
                                    onlyValue
                                />
                                <InputErrorMessage
                                    name={`tasks[${index}].day`}
                                />
                                <TextInput
                                    label={'Total Hours'}
                                    // name={`${filteredDays[index]?.value}.totalHours`}
                                    name={`tasks[${index}].totalHours`}
                                    type={'number'}
                                    placeholder={'Total Hours...'}
                                />
                                <InputErrorMessage
                                    name={`tasks[${index}].totalHours`}
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <TextInput
                                            label={'Start Time'}
                                            // name={`${filteredDays[index]?.value}.startTime`}
                                            name={`tasks[${index}].startTime`}
                                            type={'time'}
                                            // min={getDate()}
                                            placeholder={'Start Time...'}
                                        />
                                        <InputErrorMessage
                                            name={`tasks[${index}].startTime`}
                                        />
                                    </div>
                                    <div>
                                        <TextInput
                                            label={'End Time'}
                                            name={`tasks[${index}].endTime`}
                                            placeholder={'End Time...'}
                                            type={'time'}
                                        // min={getDate()}
                                        />
                                        <InputErrorMessage
                                            name={`tasks[${index}].endTime`}
                                        />
                                    </div>
                                </div>
                                <Select
                                    label={'Priority'}
                                    name={`tasks[${index}].priority`}
                                    options={[
                                        { value: 'low', label: 'Low ' },
                                        { value: 'high', label: 'High' },
                                        {
                                            value: 'medium',
                                            label: 'Medium ',
                                        },
                                    ]}
                                    onlyValue
                                />
                                <InputErrorMessage
                                    name={`tasks[${index}].priority`}
                                />
                                <TextInput
                                    required
                                    label={'Title'}
                                    name={`tasks[${index}].title`}
                                    placeholder={'Title...'}
                                />
                                <InputErrorMessage
                                    name={`tasks[${index}].title`}
                                />
                                <TextInput
                                    required
                                    label={'Location'}
                                    name={`tasks[${index}].location`}
                                    placeholder={'Location...'}
                                />
                                <InputErrorMessage
                                    name={`tasks[${index}].location`}
                                />
                                <TextArea
                                    required
                                    label={'Notes'}
                                    name={`tasks[${index}].note`}
                                    placeholder={'Add note here...'}
                                />
                                <InputErrorMessage
                                    name={`tasks[${index}].note`}
                                />
                                {/* <Checkbox
                                    name={`${filteredDays[index]?.value}.repeatShift`}
                                    label={'Repeat Shift'}
                                /> */}

                                <div className="flex justify-end">
                                    <Button
                                        text="Remove"
                                        onClick={() => {
                                            handleRemoveFAQ(index)
                                        }}
                                        variant="error"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full my-3">
                        <Button
                            variant={'success'}
                            onClick={handleAddShift}
                            disabled={isAddShiftDisabled()}
                        >
                            Click here to add shift(s)
                        </Button>
                    </div>
                    {/* <Typography variant={'small'} color={'gray'}>
                        Shift Details
                    </Typography> */}

                    <div className="flex flex-col gap-y-2 my-2">
                        <TextInput
                            required
                            label={'Email'}
                            name={'email'}
                            placeholder={'Email...'}
                            value={email || ''}
                        />
                    </div>

                    <div className="flex items-center gap-x-2">
                        <Button
                            submit
                            loading={addEmployeeData.isLoading}
                            disabled={addEmployeeData.isLoading}
                        >
                            Publish
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Card>
    )
}
