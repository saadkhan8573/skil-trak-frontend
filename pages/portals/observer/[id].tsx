import { ReactElement } from 'react'

//Layouts
import { RtoContactPersonLayout } from '@layouts'
import { RtoStudentDetail } from '@partials'
import { NextPageWithLayout } from '@types'

const StudentsProfileDetail: NextPageWithLayout = () => {
    return (
        <RtoStudentDetail />
    )
}
StudentsProfileDetail.getLayout = (page: ReactElement) => {
    return <RtoContactPersonLayout>{page}</RtoContactPersonLayout>
}

export default StudentsProfileDetail
