import { useContextBar, useNavbar, useNotification } from '@hooks'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { BackButton, Button, Card, ShowErrorNotifications } from '@components'
import { PageHeading } from '@components/headings'
import { ImportStudentForm, SpecifyColumns } from '@partials/admin/rto/students'
import { AdminApi } from '@queries'
import { ImportStudentFormType } from '@types'
import { ellipsisText, trimText } from '@utils'

export const ImportStudentList = ({
    onSubmit,
    setFoundStudents,
    setExistingEmails,
    foundStudents,
    result,
    rtoCourses,
}: {
    onSubmit: (values: ImportStudentFormType) => void
    setFoundStudents: any
    setExistingEmails: any
    foundStudents: any
    result: any
    rtoCourses: any
}) => {
    const { notification } = useNotification()
    const router = useRouter()
    const navBar = useNavbar()
    const contextBar = useContextBar()

    const [emailExistList, setEmailExistList] = useState<any | null>(null)

    const [checkMails, checkMailsResult] =
        AdminApi.Rtos.useUserExistingEmailCheck()

    useEffect(() => {
        navBar.setTitle('RTO Detail')
        contextBar.hide()

        return () => {
            navBar.setTitle('')
        }
    }, [])
    // const [foundStudents, setFoundStudents] = useState<any>([])
    const [studentList, setStudentList] = useState<any>([])
    // const [existingEmails, setExistingEmails] = useState<any>([])

    const [columnsToRead, setColumnsToRead] = useState<any>({
        id: 'id',
        name: 'name',
        email: 'email',
        contact: 'contact',
        address: 'address',
        suburb: 'suburb',
        // state: 'state',
        // zipcode: 'zipcode',
    })
    const [file, setFile] = useState<any>(null)

    const onStudentFound = (students: any, file: any, emailExists: any) => {
        setFoundStudents(students)
        setStudentList(students)

        const mails = students.map((std: any) => trimText(std.email))
        checkMails({
            emails: mails,
        })
            .then((res: any) => {
                if (res.data?.length) {
                    setExistingEmails(res.data?.map((o: any) => o.email))
                }
                // let list = [...foundStudents]
                // res.data?.forEach((item: any) => {
                //     if (list.findIndex((o) => o.email === item.email) !== -1) {
                //         list = list.filter((o) => o.email !== item.email)
                //     }
                // })
                // setStudentList([...list])
            })
            .catch((err) => {})
    }

    const onColumnsChange = (columns: any) => {
        setColumnsToRead(columns)
    }

    return (
        <>
            <ShowErrorNotifications result={result} />
            <div className="p-6">
                <div className="mb-4">
                    <div className="">
                        <BackButton text="Profile" />
                        <PageHeading
                            title={'Student List'}
                            subtitle={'Students you have imported using lists'}
                        ></PageHeading>
                    </div>
                </div>
                {!result.data || !result.isSuccess ? (
                    <div className="flex flex-col gap-2">
                        <div className="w-full flex items-stretch gap-2">
                            <Card>
                                <ImportStudentForm
                                    onSubmit={onSubmit}
                                    onStudentFound={onStudentFound}
                                    setEmailExistList={setEmailExistList}
                                    result={result}
                                    rtoCourses={rtoCourses}
                                />
                            </Card>
                        </div>
                        <div className="w-full">
                            <div className="w-full mb-2">
                                <SpecifyColumns
                                    initialValues={{ ...columnsToRead }}
                                    onColumnsChange={onColumnsChange}
                                />
                            </div>
                            <div className="w-full">
                                {foundStudents.length ? (
                                    <div className="w-full">
                                        <Card>
                                            <p>
                                                <span className="text-sm text-gray-500">
                                                    Total of
                                                </span>{' '}
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {foundStudents.length}
                                                </span>{' '}
                                                <span className="text-sm text-gray-500">
                                                    student(s) were found:
                                                </span>
                                            </p>

                                            {checkMailsResult.data?.length ? (
                                                <div className="bg-red-50 text-red-600 text-sm p-2 rounded-lg my-2">
                                                    <p>
                                                        Following user already
                                                        have accounts, their
                                                        accounts will ignored:
                                                    </p>
                                                    <ul>
                                                        {checkMailsResult.data?.map(
                                                            (mail: any) => (
                                                                <li
                                                                    key={
                                                                        mail.email
                                                                    }
                                                                >
                                                                    -{' '}
                                                                    {mail.email}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            ) : null}

                                            <table className="w-full">
                                                <thead>
                                                    <tr>
                                                        <th>Student Id</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Contact</th>
                                                        <th>Address</th>
                                                        <th>Suburb</th>
                                                        {/* <th>State</th> */}
                                                        {/* <th>Zip Code</th> */}
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {foundStudents.map(
                                                        (
                                                            student: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                {Object.values(
                                                                    columnsToRead
                                                                ).map(
                                                                    (
                                                                        k: any
                                                                    ) => {
                                                                        return (
                                                                            <td
                                                                                key={
                                                                                    k?.id
                                                                                }
                                                                            >
                                                                                {k ===
                                                                                    'email' &&
                                                                                checkMailsResult.data?.findIndex(
                                                                                    (
                                                                                        obj: any
                                                                                    ) =>
                                                                                        student[
                                                                                            k
                                                                                        ] ===
                                                                                        obj.email
                                                                                ) !==
                                                                                    -1 ? (
                                                                                    <s>
                                                                                        {
                                                                                            student[
                                                                                                k
                                                                                            ]
                                                                                        }
                                                                                    </s>
                                                                                ) : (
                                                                                    student[
                                                                                        k
                                                                                    ]
                                                                                )}
                                                                            </td>
                                                                        )
                                                                    }
                                                                )}
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </Card>
                                    </div>
                                ) : (
                                    <div className="mt-2 w-full border-2 border-dashed rounded-md flex flex-col items-center justify-center h-40">
                                        <p className="text-lg font-semibold text-gray-600">
                                            No Students
                                        </p>
                                        <p className="text-md font-medium text-gray-500">
                                            Students not found, or you have not
                                            selected any file
                                        </p>
                                        <p className="text-sm font-medium text-gray-400">
                                            Also try to specify column names for
                                            particular field
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {result.data?.created?.length ? (
                            <div className="bg-green-100 rounded-lg p-4">
                                <p className="text-green-600 font-medium">
                                    {result.data?.created.length | 0} student(s)
                                    imported successfully
                                </p>

                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th>Student Id</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {result.data?.created.map(
                                            (student: any, i: number) => (
                                                <tr key={i}>
                                                    <td>
                                                        {ellipsisText(
                                                            student.studentId,
                                                            8
                                                        )}
                                                    </td>
                                                    <td>{student.user.name}</td>
                                                    <td>
                                                        {student.user.email}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <></>
                        )}

                        <div className="my-4" />

                        {result.data?.ignored?.length ? (
                            <div className="bg-red-100 rounded-lg p-4">
                                <p className="text-red-600 font-medium">
                                    {result.data?.ignored.length | 0} student(s)
                                    were ignored
                                </p>

                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {result.data?.ignored.map(
                                            (student: any, i: number) => (
                                                <tr key={i}>
                                                    <td>{student}</td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <></>
                        )}

                        <div>
                            <Button
                                text="Back"
                                onClick={() => {
                                    router.back()
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
