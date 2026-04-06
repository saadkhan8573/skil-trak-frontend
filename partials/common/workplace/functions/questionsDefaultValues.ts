import { workplaceQuestionsKeys } from '../enum'

export const questionsDefaultValues = (questions: any) => {
    let updatedQuestions: any = {}
    questions?.forEach((question: any) => {
        if (question?.type === workplaceQuestionsKeys.suburb) {
            updatedQuestions[workplaceQuestionsKeys.suburb] =
                question?.answer?.suburb
            updatedQuestions['zip'] = question?.answer?.zip
        } else if (
            question?.type === workplaceQuestionsKeys.supervisorMeeting
        ) {
            updatedQuestions['supervisorMeetingDate1'] =
                question?.answer?.supervisorMeetingDate1
            updatedQuestions['supervisorMeetingDate2'] =
                question?.answer?.supervisorMeetingDate2
        } else if (
            question?.type === workplaceQuestionsKeys.possession ||
            question?.type === workplaceQuestionsKeys.serviceOffered
        ) {
            updatedQuestions[question?.type] = question?.answer?.split(',')
        } else if (
            question?.type === workplaceQuestionsKeys.preferredContactTime
        ) {
            updatedQuestions[question?.type] = question?.answer
        } else {
            updatedQuestions[question?.type] = question?.answer
        }
    })
    return updatedQuestions
}
