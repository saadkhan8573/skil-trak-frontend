import { EsignDocumentStatus } from '@utils'

export interface RtoEsignFilterType {
    studentName: string
    date: string
    status: EsignDocumentStatus | ''
}
