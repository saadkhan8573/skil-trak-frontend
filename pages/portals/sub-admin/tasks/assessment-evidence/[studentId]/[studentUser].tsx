import { NextPageWithLayout, PermissionType } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'

//Layouts
import { SubAdminStudentProfile, withPermission } from '@components'
import { useContextBar, useNavbar } from '@hooks'
import { SubAdminLayout } from '@layouts'
import { Detail } from '@partials/sub-admin'
import { useGetSubAdminStudentDetailQuery } from '@queries'

type Props = {}

const AssessmentEvidenceDetails: NextPageWithLayout = (props: Props) => {
    const pathname = useRouter()
    const { studentId, studentUser } = pathname.query

    const navBar = useNavbar()
    const contextBar = useContextBar()

    const student = useGetSubAdminStudentDetailQuery(Number(studentId), {
        skip: !studentId,
    })

    useEffect(() => {
        if (student.isSuccess && student.data) {
            contextBar.setContent(
                <SubAdminStudentProfile student={student.data} />
            )
            contextBar.show(false)
            navBar.setSubTitle(student.data?.user?.name)
        }
        return () => {
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [student])

    useEffect(() => {
        setTimeout(() => {
            navBar.setSubTitle('Assessment Evidence Detail')
        }, 1000)
    }, [])

    return (
        <>
            <Detail
                studentId={Number(studentId)}
                studentUserId={Number(studentUser)}
            />
        </>
    )
}
AssessmentEvidenceDetails.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(AssessmentEvidenceDetails, {
    permissions: [PermissionType.SUBMISSIONS],
})
