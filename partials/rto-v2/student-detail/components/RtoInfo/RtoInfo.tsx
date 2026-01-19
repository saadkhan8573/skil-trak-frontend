import { InitialAvatar, Button, AuthorizedUserComponent } from '@components'
import { RtoApi, SubAdminApi } from '@queries'
import { setRtoDetail, useAppDispatch, useAppSelector } from '@redux'
import React, { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import { RtoInsuranceDocModal } from './modals/RtoInsuranceDocModal'
import { UserRoles } from '@constants'
import { useRouter } from 'next/router'
import { Rto } from '@types'

export const RtoInfo = () => {
    const studentId = useAppSelector((state) => state.student.studentDetail?.id)
    const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false)

    const router = useRouter()

    const rtoProfile = SubAdminApi.Student.getStudentRtoDetail(studentId!, {
        skip: !studentId,
        refetchOnMountOrArgChange: true,
    })
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (rtoProfile.isSuccess && rtoProfile?.data) {
            dispatch(setRtoDetail(rtoProfile?.data))
        }
        return () => {
            dispatch(setRtoDetail(null as unknown as Rto))
        }
    }, [rtoProfile, dispatch])

    const rtoDetail = useAppSelector((state) => state.rto.rtoDetail)

    const rtoCoordinator = rtoProfile?.data?.contactPersons?.[0]

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
            <div className="w-full mx-auto px-[13.25px] sm:px-[19.87px] lg:px-[26.5px] py-[13.25px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[9.94px]">
                        <div className="w-[33.12px] h-[33.12px] rounded-xl bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg shadow-[#044866]/20">
                            <span className="text-white text-[14.9px]">📚</span>
                        </div>
                        <div>
                            <h1 className="text-slate-900 text-[19.87px] font-medium">
                                {rtoProfile?.data?.user?.name || '---'}
                            </h1>
                            <p className="text-slate-600 text-[11.59px] mt-[1.66px]">
                                Training & Education Counsel
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        {rtoProfile?.data?.user && (
                            <Button
                                onClick={() => setIsInsuranceModalOpen(true)}
                                variant="info"
                                outline
                                className="h-9 gap-2 border-[#044866]/20 text-[#044866] hover:bg-[#044866]/5"
                            >
                                <FileText className="w-4 h-4" />
                                RTO Insurance
                            </Button>
                        )}

                        <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                            <Button
                                text={'View RTO Details'}
                                onClick={() => {
                                    router.push(
                                        `/portals/admin/rto/${rtoProfile?.data?.id}`
                                    )
                                }}
                                variant="info"
                            />
                        </AuthorizedUserComponent>

                        <div className="flex items-center gap-[9.94px]">
                            <div className="text-right">
                                <p className="text-[11.59px] text-slate-600">
                                    Contact Person
                                </p>
                                <p className="text-slate-900 text-[13.25px] font-medium">
                                    {rtoCoordinator?.name || '---'}
                                </p>
                            </div>
                            {rtoCoordinator?.name && (
                                <InitialAvatar
                                    imageUrl={rtoCoordinator?.avatar}
                                    name={rtoCoordinator?.name || '---'}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {rtoProfile?.data?.user && (
                <RtoInsuranceDocModal
                    open={isInsuranceModalOpen}
                    onOpenChange={setIsInsuranceModalOpen}
                    rtoUser={rtoProfile?.data?.user}
                />
            )}
        </header>
    )
}
