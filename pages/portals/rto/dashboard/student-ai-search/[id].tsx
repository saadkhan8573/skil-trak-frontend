import { StudentAiSearchDetail } from '@components'
import { RtoLayoutV2 } from '@layouts'
import { Sparkles } from 'lucide-react'
import { ReactElement } from 'react'

const StudentAiSearchDetailPage = () => {
    return <StudentAiSearchDetail />
}

StudentAiSearchDetailPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: Sparkles,
                title: 'Student Detail',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default StudentAiSearchDetailPage
