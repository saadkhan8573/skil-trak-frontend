import { Button, Card, Typography } from '@components'
import { Course, Student } from '@types'
import { ReactElement, useCallback, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

import { StudentAssessmentsCourses } from './StudentAssessmentsCourses'

export const StudentAssessments = ({ profile }: { profile: any }) => {
    return (
        <>
            <Card noPadding fullHeight>
                <div className="h-[inherit] overflow-auto custom-scrollbar">
                    <div className="px-4  py-3.5 flex justify-between items-center border-b border-secondary-dark">
                        <Typography variant="label" semibold>
                            Student Submissions{' '}
                        </Typography>
                    </div>

                    <div className="border-b border-secondary-dark">
                        <StudentAssessmentsCourses profile={profile} />
                    </div>
                </div>
            </Card>
        </>
    )
}
