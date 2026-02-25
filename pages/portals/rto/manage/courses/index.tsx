import { LoadingAnimation, NoData, TechnicalError } from '@components'
import { RtoLayoutV2 } from '@layouts'
import { ActionRequiredHeader } from '@partials'
import { CourseHeader } from '@partials/rto-v2/courses'
import { RtoApi } from '@queries'
import { GraduationCap, Info } from 'lucide-react'
import { ReactElement } from 'react'

export const Courses = () => {
    const { data, isLoading, isError } = RtoApi.Courses.useRtoCourses()
    return (
        <div className="space-y-6">
            <ActionRequiredHeader
                icon={GraduationCap}
                title="Course Setup & Configuration"
                description="Configure placement requirements, documents, and workplace eligibility for each course"
                UrgentIcon={GraduationCap}
                warningMessage="<strong>Important:</strong> All courses must be 100% configured before automation matching can begin. Review TGA requirements and ensure all documents are uploaded."
                gradientFrom="primaryNew"
                gradientTo="primaryNew"
                iconGradient="from-primaryNew to-primaryNew"
                WarningIcon={Info}
            />
            {isError ? <TechnicalError /> : null}
            {isLoading ? (
                <LoadingAnimation />
            ) : data && data?.length > 0 ? (
                <CourseHeader coursesData={data} />
            ) : (
                !isError && <NoData text="No Course Found" />
            )}
        </div>
    )
}

Courses.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: GraduationCap,
                title: 'Courses',
                description: 'Manage your courses',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default Courses
