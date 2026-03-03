import { Button, ButtonVariantOptions } from '@components'
import { ellipsisText } from '@utils'
import { useRouter } from 'next/router'
import React from 'react'

export const CreatedStudentsList = ({
    importedStudentsResult,
    onBack,
    buttonVariant,
}: {
    onBack?: () => void
    buttonVariant?: (typeof ButtonVariantOptions)[number]
    importedStudentsResult: any
}) => {
    const router = useRouter()

    return (
        <div>
            {importedStudentsResult?.created &&
            importedStudentsResult?.created?.length > 0 ? (
                <div className="bg-green-100 rounded-lg p-4">
                    <p className="text-green-600 font-medium">
                        {importedStudentsResult?.created.length | 0} student(s)
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
                            {importedStudentsResult?.created.map(
                                (student: any, i: number) => (
                                    <tr key={i}>
                                        <td>
                                            {ellipsisText(student.studentId, 8)}
                                        </td>
                                        <td>{student.user.name}</td>
                                        <td>{student.user.email}</td>
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

            <>
                {importedStudentsResult?.ignored &&
                importedStudentsResult?.ignored?.length ? (
                    <div className="bg-red-100 rounded-lg p-4">
                        <p className="text-red-600 font-medium">
                            {importedStudentsResult?.ignored.length | 0}{' '}
                            student(s) were ignored
                        </p>

                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                </tr>
                            </thead>

                            <tbody>
                                {importedStudentsResult?.ignored.map(
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

                {importedStudentsResult ? (
                    <div className="mt-4">
                        <Button
                            text="Back"
                            onClick={() => {
                                if (onBack) {
                                    onBack()
                                } else {
                                    router.back()
                                }
                            }}
                            variant={buttonVariant || 'primary'}
                        />
                    </div>
                ) : null}
            </>
        </div>
    )
}
