import {
    Button,
    Card,
    LoadingAnimation,
    TechnicalError,
    TextInput,
} from '@components'
import { RtoLayoutV2 } from '@layouts'
import { ActionRequiredHeader, Title } from '@partials/rto-v2/components'
import {
    FilteredStudents,
    SkiltrakFlaggedStudents,
} from '@partials/rto/student'
import { RtoApi, useGetSkiltrakFlaggedStudentsListQuery } from '@queries'
import { checkFilteredDataLength } from '@utils'
import debounce from 'lodash/debounce'
import { AlertTriangle, FileText, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/router'
import { ReactElement, useCallback, useEffect, useState } from 'react'

export const SkiltrakFlaggedStudentsPage = () => {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)

    const [studentId, setStudentId] = useState<any | null>(null)
    const [studentIdValue, setStudentIdValue] = useState<string>('')

    const [studentName, setStudentName] = useState<any | null>(null)
    const [studentNameValue, setStudentNameValue] = useState<string>('')

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const count = RtoApi.Students.useCount()

    const filteredStudents = useGetSkiltrakFlaggedStudentsListQuery(
        {
            search: `${JSON.stringify({
                ...studentId,
                ...studentName,
            })
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            skip: !Object.keys({
                ...(studentId?.studentId ? studentId : {}),
                ...(studentName?.name ? studentName : {}),
            }).length,
        }
    )

    const delayedNameSearch = useCallback(
        debounce((value) => {
            setStudentName({ name: value })
        }, 700),
        []
    )

    const delayedIdSearch = useCallback(
        debounce((value) => {
            setStudentId({ studentId: value })
        }, 700),
        []
    )

    const handleClear = () => {
        setStudentIdValue('')
        setStudentId(null)
        setStudentNameValue('')
        setStudentName(null)
    }

    const filteredDataLength = checkFilteredDataLength({
        ...(studentId?.studentId ? studentId : {}),
        ...(studentName?.name ? studentName : {}),
    })

    return (
        <div className="space-y-4">
            <ActionRequiredHeader
                icon={AlertTriangle}
                title="Skiltrak Flagged Students"
                description="List of students flagged by Skiltrak"
                gradientFrom="amber-500"
                gradientTo="yellow-700"
                iconGradient="from-amber-400 to-amber-600"
            />

            <Card
                noPadding
                className="border border-border/50 shadow-premium-lg mt-5"
            >
                <div className="border-b p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <Title
                            Icon={FileText}
                            title="Filter Students"
                            description="Filter and search through Skiltrak flagged student records"
                        />
                        <div className="flex items-center gap-2">
                            <div className="w-60">
                                <TextInput
                                    name={'studentId'}
                                    placeholder={'Search by Student Id'}
                                    value={studentIdValue}
                                    onChange={(e: any) => {
                                        setStudentIdValue(e.target.value)
                                        delayedIdSearch(e.target.value)
                                    }}
                                    showError={false}
                                />
                            </div>
                            <div className="w-60">
                                <TextInput
                                    name={'name'}
                                    placeholder={'Search by Student Name'}
                                    value={studentNameValue}
                                    onChange={(e: any) => {
                                        setStudentNameValue(e.target.value)
                                        delayedNameSearch(e.target.value)
                                    }}
                                    showError={false}
                                />
                            </div>

                            <Button
                                outline
                                onClick={handleClear}
                                className="flex items-center gap-x-2 h-10"
                                disabled={!studentIdValue && !studentNameValue}
                            >
                                <RotateCcw className="w-4 h-4" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>

                <div>
                    {filteredDataLength && filteredStudents.isError && (
                        <TechnicalError />
                    )}
                    {filteredDataLength ? (
                        filteredStudents.isLoading ? (
                            <LoadingAnimation />
                        ) : (
                            filteredStudents.isSuccess && (
                                <FilteredStudents
                                    setPage={setPage}
                                    itemPerPage={itemPerPage}
                                    student={filteredStudents}
                                    setItemPerPage={setItemPerPage}
                                />
                            )
                        )
                    ) : (
                        <div className="p-4">
                            <SkiltrakFlaggedStudents />
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}

SkiltrakFlaggedStudentsPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: AlertTriangle,
                title: 'Skiltrak Flagged Students',
                description: 'List of students flagged by Skiltrak',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default SkiltrakFlaggedStudentsPage
