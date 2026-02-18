import { StudentResponseType } from '@types'
import moment from 'moment'

export const folderResponse = (studentResponse: StudentResponseType[]) => {
    if (!studentResponse?.length) return null
    return studentResponse.reduce((latest: any, current: any) =>
        moment(current.createdAt).isAfter(moment(latest.createdAt))
            ? current
            : latest
    )
}
