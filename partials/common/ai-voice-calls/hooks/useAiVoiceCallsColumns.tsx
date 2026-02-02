import { ColumnDef } from '@tanstack/react-table'
import { Phone, Calendar } from 'lucide-react'
import React, { useReducer } from 'react'
import { Student } from '@types'
import { ActionButton, Badge, Button, InitialAvatar } from '@components'
import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { BookOpen } from 'lucide-react'

type State = {
    selectedStudent: Student | null
    selectedStudentsForBulk: Student[]
}

type Action =
    | { type: 'SET_SELECTED_STUDENT'; payload: Student | null }
    | { type: 'SET_SELECTED_STUDENTS_FOR_BULK'; payload: Student[] }

const initialState: State = {
    selectedStudent: null,
    selectedStudentsForBulk: [],
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_SELECTED_STUDENT':
            return { ...state, selectedStudent: action.payload }
        case 'SET_SELECTED_STUDENTS_FOR_BULK':
            return { ...state, selectedStudentsForBulk: action.payload }
        default:
            return state
    }
}

export const useAiVoiceCallsColumns = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { selectedStudent, selectedStudentsForBulk } = state

    const setSelectedStudent = (student: Student | null) =>
        dispatch({ type: 'SET_SELECTED_STUDENT', payload: student })
    const setSelectedStudentsForBulk = (students: Student[]) =>
        dispatch({ type: 'SET_SELECTED_STUDENTS_FOR_BULK', payload: students })


    const quickActionsElements = {
        id: 'id',
        individual: (student: Student) => (
            <div className="flex items-center gap-2">
                <Badge
                    variant="primaryNew"
                    className='whitespace-pre'
                    onClick={() => setSelectedStudent(student)}
                    Icon={Phone}
                >
                    AI Voice Call
                </Badge>
            </div>
        ),
        common: (students: Student[]) => (
            <Button
                variant="primaryNew"
                className='!py-1'
                onClick={() => setSelectedStudentsForBulk(students)}
            >
                Schedule
            </Button>
        ),
    }

    const columns: ColumnDef<Student>[] = [
        {
            header: 'Student',
            accessorKey: 'user.name',
            cell: ({ row }) => {
                const student = row.original
                return (
                    <Link href={`/portals/admin/student/${student?.id}/detail`} className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                            {
                                student?.user?.name && <InitialAvatar name={student?.user?.name} imageUrl={student?.user?.avatar} />
                            }
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {student?.user?.name} {student?.familyName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {student?.phone}
                            </p>
                        </div>
                    </Link>
                )
            }
        },
        {
            header: 'Phone Number',
            accessorKey: 'phone',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{row.original?.phone}</span>
                </div>
            )
        },
        {
            header: 'Courses',
            accessorKey: 'courses',
            cell: ({ row }) => {
                const courses = row.original?.courses || []
                if (courses.length === 0) return <span className="text-gray-400 text-sm italic">N/A</span>

                const firstCourse = courses[0]
                const courseName = firstCourse?.title || firstCourse?.name

                if (courses.length === 1) {
                    return (
                        <div className="flex items-center gap-2 max-w-[200px]">
                            <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-700 truncate" title={courseName}>
                                {courseName}
                            </span>
                        </div>
                    )
                }

                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors group">
                                <BookOpen className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="truncate max-w-[120px] font-medium" title={courseName}>
                                    {courseName}
                                </span>
                                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                                    +{courses.length - 1}
                                </span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-0 overflow-hidden" align="start">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                                <h4 className="font-bold text-sm text-gray-900">Enrolled Courses</h4>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{courses.length} total courses</p>
                            </div>
                            <div className="max-h-60 overflow-y-auto p-2">
                                <ul className="space-y-1">
                                    {courses.map((course: any, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                                            <span className="text-xs text-gray-600 leading-relaxed font-medium">
                                                {course.title || course.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </PopoverContent>
                    </Popover>
                )
            }
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Badge
                        variant="primaryNew"
                        className='whitespace-pre'
                        onClick={() => setSelectedStudent(row.original)}
                        Icon={Phone}
                    >
                        AI Voice Call
                    </Badge>
                </div>
            )
        }
    ]

    return {
        columns,
        selectedStudent,
        setSelectedStudent,
        quickActionsElements,
        selectedStudentsForBulk,
        setSelectedStudentsForBulk
    }
}
