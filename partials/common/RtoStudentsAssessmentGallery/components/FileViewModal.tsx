// Icons
import { MdCancel, MdDownload } from 'react-icons/md'

// components
import { ReactNode } from 'react'
import { FileDetail } from './FileDetail'
import { Button, OutsideClickHandler } from '@components'


interface FileViewModalProps {
    title: string
    subtitle: string
    children: ReactNode
    loading?: boolean
    onCancelButtonClick?: () => void
    url: string
    fileId: number
}

export const FileViewModal = ({
    children,
    title,
    subtitle,
    loading,
    url,
    fileId,
    onCancelButtonClick,
}: FileViewModalProps) => {
    return (
        <div className="bg-[#00000050] w-full h-screen flex items-start justify-center fixed top-0 left-0 z-40 overflow-scroll py-16">
            <OutsideClickHandler
                onOutsideClick={() => {
                    onCancelButtonClick && onCancelButtonClick()
                }}
            >
                <div className="bg-white rounded-2xl flex flex-col justify-between shadow-md w-[70vw] overflow-hidden">
                    <div className="px-2 py-1 flex justify-end items-center">
                        {/* <div>
                        <Typography variant={'title'}>{title}</Typography>
                        <Typography variant={'subtitle'} color={'text-muted'}>
                            {subtitle}
                        </Typography>
                    </div> */}

                        <MdCancel
                            onClick={onCancelButtonClick}
                            className="transition-all duration-300 text-gray-400 hover:text-black text-2xl cursor-pointer hover:rotate-90"
                        />
                    </div>

                    <div className="grid grid-cols-3">
                        <div className="col-span-2">{children}</div>
                        <div className="">
                            <FileDetail fileId={fileId} url={url} />
                        </div>
                    </div>

                    {/* <div className="flex justify-end items-end gap-x-4 px-4 py-2">
                    <Button variant={'secondary'} onClick={onCancelButtonClick}>
                        {'Cancel'}
                    </Button>
                </div> */}
                </div>
            </OutsideClickHandler>
        </div>
    )
}
