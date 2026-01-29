import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'students'
export const assessmentToolEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getStudentAssessmentTool: builder.query<any, string | null>({
        query: (id: string | null) => `${PREFIX}/assessment-tool/view/${id}`,
        providesTags: ['StudentAssessmentEvidence'],
    }),
})
