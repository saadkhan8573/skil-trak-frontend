import { Button, OutsideClickHandler } from '@components'
import { ReactElement, useState } from 'react'
import { IoMdDownload } from 'react-icons/io'


import { getUserCredentials } from '@utils'
import { ReportListModal } from '../components/ReportListModal'
type Props = {
    startDate: Date
    setStartDate: (startDate: Date) => void
    endDate: Date
    setEndDate: (endDate: Date) => void
}

export const DownloadButton = ({
    setStartDate,
    setEndDate,
    startDate,
    endDate,
}: Props) => {
    const [showDropDown, setShowDropDown] = useState(false)
    const userId = getUserCredentials()?.id
    const [modal, setModal] = useState<ReactElement | null>(null)
    const onClose = () => {
        setModal(null)
    }
    const onViewClicked = () => {
        setModal(<ReportListModal onClose={() => onClose()} />)
    }

    return (
        <>
            {modal && modal}
            <div className="flex items-center gap-x-2">
                <div className="flex items-center gap-x-3">
                    <OutsideClickHandler
                        onOutsideClick={() => setShowDropDown(false)}
                    >
                        <div
                            className="relative"
                            // onMouseEnter={() => setShowDropDown(true)}
                            // onMouseLeave={() => setShowDropDown(false)}
                            onClick={() => setShowDropDown(!showDropDown)}
                        >
                            <Button
                                onClick={() => {
                                    onViewClicked()
                                }}
                                variant="dark"
                            >
                                <span className="flex items-center gap-x-2">
                                    <IoMdDownload size={18} />
                                    <span>Download</span>
                                    {/* {showDropDown ? (
                                        <MdKeyboardArrowUp size={15} />
                                    ) : (
                                        <MdKeyboardArrowDown size={15} />
                                    )} */}
                                </span>
                            </Button>

                            {/* {showDropDown ? (
                                <ul className="bg-white shadow-xl rounded-lg overflow-hidden absolute z-30 top-9 right-0">
                                    <li>
                                        <Link
                                            className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2  hover:bg-gray-200"
                                            href={`${process.env.NEXT_PUBLIC_END_POINT}/statistics/rto/summary/generate/${userId}`}
                                            target="_blank"
                                            download
                                        >
                                            <span className="">As PDF</span>
                                        </Link>
                                    </li>
                                </ul>
                            ) : null} */}
                        </div>
                    </OutsideClickHandler>
                </div>
                {/* <Button variant="action">
                <span className="flex items-center gap-x-2">
                    <AiFillPrinter size={18} />
                    <span>Print</span>
                </span>
            </Button> */}
            </div>
        </>
    )
}
