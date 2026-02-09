import { SubAdminApi } from '@queries'
import { marked } from 'marked'
import { useRouter } from 'next/router'
import React from 'react'

export const PendingCourseCard = ({ pendingCourse }: any) => {
    const router = useRouter()
    const pendingCourses = SubAdminApi.Industry.useIndustryRequestedCourses(
        {
            id: router.query.id,
            params: {
                search: `status:pending`,
                skip: 50 * 1 - 50,
                limit: 50,
            },
        },
        {
            skip: !router.query.id,
            refetchOnMountOrArgChange: true,
        }
    )
    const rawText = pendingCourse?.description || ''
    const parsedHtml = String(marked.parse(rawText))

    return (
        <div>
            <div
                className={` relative bg-red-500 text-white p-4 rounded-md w-full mb-4 flex gap-x-5 items-start max-h-56 overflow-auto custom-scrollbar`}
            >
                <div>
                    <div className="w-full min-w-80">
                        <div
                            className="w-full customTailwingStyles-inline-style customTailwingStyles text-xs text-white bg-transparent! leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html:
                                    parsedHtml || 'No description available',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
