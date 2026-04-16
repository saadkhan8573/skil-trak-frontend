import { Typography } from '@components'
import React, { ReactNode, createContext, useContext, useState } from 'react'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { PuffLoader } from 'react-spinners'

export const DownloadAssessmentContext = createContext<any>(null)

export const DownloadAssessmentProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const [isAssessmentDownloading, setIsAssessmentDownloading] =
        useState<boolean>(false)
    const [minimizeDownloading, setMinimizeDownloading] =
        useState<boolean>(false)

    const value = {
        isAssessmentDownloading,
        setIsAssessmentDownloading: (value: boolean) =>
            setIsAssessmentDownloading(value),
    }
    return (
        <DownloadAssessmentContext.Provider value={value}>
            <div className="w-full" suppressHydrationWarning>
                {isAssessmentDownloading && (
                    <div className="w-96 fixed bottom-0 right-10 rounded-t-xl bg-success z-50 border border-primary">
                        <div className="px-4 py-1.5 flex justify-between items-center">
                            <Typography variant={'label'} color={'text-white'}>
                                Preparing Download
                            </Typography>
                            <MdOutlineKeyboardArrowDown
                                size={23}
                                onClick={() => {
                                    setMinimizeDownloading(!minimizeDownloading)
                                }}
                                className={`cursor-pointer text-white ${
                                    minimizeDownloading ? 'rotate-180' : ''
                                } transition-all`}
                            />
                        </div>
                        <div
                            className={`bg-white  ${
                                minimizeDownloading
                                    ? 'h-0 px-0 py-0 overflow-hidden'
                                    : 'px-4 py-2.5'
                            } transition-all`}
                        >
                            <div className="flex justify-between items-center">
                                <Typography
                                    variant={'label'}
                                    color={'text-black'}
                                >
                                    Files Downloading
                                </Typography>
                                <PuffLoader size={20} />
                            </div>
                        </div>
                    </div>
                )}
                {children}
            </div>
        </DownloadAssessmentContext.Provider>
    )
}

export const useDownloadAssessment = () => {
    return useContext(DownloadAssessmentContext) as any
}
