import { InitialAvatar } from '@components'
import { RtoApi, SubAdminApi } from '@queries'
import { setRtoDetail, useAppDispatch, useAppSelector } from '@redux'
import React, { useEffect } from 'react'

export const RtoInfo = () => {
    const studentId = useAppSelector((state) => state.student.studentDetail?.id)

    const rtoProfile = SubAdminApi.Student.getStudentRtoDetail(studentId!, {
        skip: !studentId,
        refetchOnMountOrArgChange: 300,
    })
    const dispatch = useAppDispatch()
    useEffect(()=>{
        if(rtoProfile.isSuccess && rtoProfile?.data){
            dispatch(setRtoDetail(rtoProfile?.data))
        }
    }, [rtoProfile])

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
                            <h1 className="text-slate-900 text-[19.87px]">
                                {rtoProfile?.data?.user?.name || '---'}
                            </h1>
                            <p className="text-slate-600 text-[11.59px] mt-[1.66px]">
                                Training & Education Counsel
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-[9.94px]">
                        <div className="text-right">
                            <p className="text-[11.59px] text-slate-600">
                                Contact Person
                            </p>
                            <p className="text-slate-900 text-[13.25px]">
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
        </header>
    )
}
