import { Badge, Typography } from '@components'
import { CommonApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { AssessmentEvidenceFolder } from '@types'
import { WorkplaceCurrentStatus } from '@utils'
import { CheckCircle2, Clock3, FileSignature, Users } from 'lucide-react'
import moment from 'moment'

const PARTY_LABELS: Record<string, string> = {
    industry: 'Industry',
    workplace: 'Industry',
    employer: 'Industry',
    rto: 'RTO',
    student: 'Student',
}

const getPartyLabel = (role?: string) => {
    if (!role) return 'Signer'

    const normalizedRole = role.toLowerCase()
    return PARTY_LABELS[normalizedRole] || role
}

const getSignerStatus = (status?: string) => {
    if (!status) {
        return {
            label: 'Pending',
            className: 'bg-amber-50 text-amber-700 border border-amber-200',
        }
    }

    const normalizedStatus = status.toLowerCase()

    if (normalizedStatus === 'signed') {
        return {
            label: 'Signed',
            className:
                'bg-emerald-50 text-emerald-700 border border-emerald-200',
        }
    }

    return {
        label: status,
        className: 'bg-blue-50 text-blue-700 border border-blue-200',
    }
}

export const AgreementInitiatedCard = ({
    workplace,
    workplaceCurrentStatus,
}: {
    workplace: any
    workplaceCurrentStatus: WorkplaceCurrentStatus
}) => {
    const { studentDetail, selectedCourse } = useAppSelector(
        (state) => state.student
    )

    const agreementSourceCourse = workplace?.courses?.[0]

    console.log({ selectedCourseselectedCourse: agreementSourceCourse })

    const agreementFolder = agreementSourceCourse?.assessmentEvidence?.find(
        (folder: AssessmentEvidenceFolder) => folder?.isAgreement
    )

    const eSignDocument = CommonApi.ESign.useStudentEsignDocument(
        {
            std: Number(studentDetail?.user?.id),
            folder: Number(agreementFolder?.id),
        },
        {
            skip: !studentDetail?.user?.id || !agreementFolder?.id,
            refetchOnMountOrArgChange: true,
        }
    )

    if (
        workplaceCurrentStatus !==
        WorkplaceCurrentStatus.AwaitingAgreementSigned
    ) {
        return null
    }

    const selectedDocument = eSignDocument?.data?.[0]
    const signers = selectedDocument?.signers || []
    const signedCount = signers.filter(
        (signer: any) => signer?.status?.toLowerCase() === 'signed'
    ).length

    return (
        <div className="relative overflow-hidden rounded-lg border border-sky-200 bg-linear-to-br from-sky-50 via-white to-cyan-50 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-500 via-cyan-500 to-emerald-500" />

            <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-500/20">
                        <FileSignature className="h-5 w-5 text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <Typography
                                variant="small"
                                className="font-bold text-slate-900"
                            >
                                Agreement Initiated
                            </Typography>
                            <Badge
                                text={
                                    selectedDocument
                                        ? `${signedCount}/${signers.length || 0} signed`
                                        : 'Pending initiation'
                                }
                                className="bg-sky-100 text-sky-700 border-sky-200 text-[10px]"
                            />
                        </div>
                        <Typography
                            variant="small"
                            className="mt-1 text-[11px] text-slate-600"
                        >
                            Track agreement progress for industry, RTO, and
                            student.
                        </Typography>
                    </div>
                </div>

                {eSignDocument.isLoading ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center">
                        <Clock3 className="mx-auto mb-2 h-5 w-5 animate-pulse text-sky-500" />
                        <p className="text-xs font-medium text-slate-700">
                            Loading agreement status...
                        </p>
                    </div>
                ) : selectedDocument ? (
                    <>
                        <div className="grid gap-2 sm:grid-cols-3">
                            {signers.map((signer: any) => {
                                const statusMeta = getSignerStatus(
                                    signer?.status
                                )

                                return (
                                    <div
                                        key={signer?.id || signer?.user?.id}
                                        className="rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                                                    <Users className="h-4 w-4 text-slate-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-900">
                                                        {getPartyLabel(
                                                            signer?.user?.role
                                                        )}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500  break-all">
                                                        {signer?.user?.name ||
                                                            'Waiting for signer'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between gap-2">
                                            <span
                                                className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${statusMeta.className}`}
                                            >
                                                {statusMeta.label}
                                            </span>
                                            {signer?.status?.toLowerCase() ===
                                            'signed' ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                            ) : (
                                                <Clock3 className="h-4 w-4 text-amber-500" />
                                            )}
                                        </div>

                                        <p className="mt-2 text-[11px] text-slate-500">
                                            {signer?.status?.toLowerCase() ===
                                            'signed'
                                                ? `Signed ${moment(
                                                      signer?.updatedAt
                                                  ).format('DD MMM YYYY')}`
                                                : 'Signature pending'}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        {selectedDocument?.template?.name && (
                            <div className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                                <p className="text-[11px] font-medium text-slate-500">
                                    Document
                                </p>
                                <p className="text-xs font-semibold text-slate-800">
                                    {selectedDocument?.template?.name}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="rounded-xl border border-dashed border-sky-200 bg-white/80 px-4 py-4">
                        <p className="text-xs font-semibold text-slate-800">
                            Agreement is waiting to be initiated.
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                            No e-sign document has been found for the agreement
                            folder yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
