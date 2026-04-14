import { useContextBar, useNavbar } from '@hooks'
import { RtoLayout } from '@layouts'
import { NextPageWithLayout } from '@types'
import { ReactElement, useEffect } from 'react'

import { StudentProfileDetail } from '@partials/common'

const Detail: NextPageWithLayout = () => {
    const navBar = useNavbar()
    const contextBar = useContextBar()

    useEffect(() => {
        navBar.setTitle('Student Detail')
        contextBar.hide()

        return () => {
            navBar.setTitle('')
        }
    }, [])

    return <StudentProfileDetail />
}

Detail.getLayout = (page: ReactElement) => {
    return (
        <RtoLayout pageTitle={{ title: 'Student Profile' }}>{page}</RtoLayout>
    )
}

export default Detail
