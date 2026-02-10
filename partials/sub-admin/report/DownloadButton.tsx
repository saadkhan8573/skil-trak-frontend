import React, { useEffect, useState } from 'react'
import { IoMdDownload } from 'react-icons/io'
import { AiFillPrinter } from 'react-icons/ai'
import { Button, OutsideClickHandler } from '@components'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

import { RtoApi } from '@queries'

import Link from 'next/link'
import { getUserCredentials } from '@utils'
type Props = {}

export const DownloadButton = (props: Props) => {

    const [showDropDown, setShowDropDown] = useState(false);
    const userId = getUserCredentials()?.id;


    return (
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
                        <Button variant="dark">
                            <span className="flex items-center gap-x-2">
                                <IoMdDownload size={18} />
                                <span>Download</span>
                                {showDropDown ? (
                                    <MdKeyboardArrowUp size={15} />
                                ) : (
                                    <MdKeyboardArrowDown size={15} />
                                )}
                            </span>
                        </Button>

                        {showDropDown ? (
                            <ul className="bg-white shadow-xl rounded-lg overflow-hidden absolute z-30 top-9 right-0">
                                <li>
                                    <Link
                                        className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2  hover:bg-gray-200"
                                        href={`${process.env.NEXT_PUBLIC_END_POINT}/statistics/rto/summary/generate/${userId}`}
                                    >
                                        <span className="">As PDF</span>
                                    </Link>
                                </li>
                                {/* <li>
                                    <button
                                        onClick={() => {
                                        }}
                                        className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2 hover:bg-gray-200"
                                    >
                                        
                                        <span className="">As Excel</span>
                                    </button>
                                </li> */}
                                {/* <li>
                                    <button
                                        onClick={() => {
                                        }}
                                        className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2 hover:bg-gray-200"
                                    >
                                       
                                        <span className="">As CSV</span>
                                    </button>
                                </li> */}
                            </ul>
                        ) : null}
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
    )
}
