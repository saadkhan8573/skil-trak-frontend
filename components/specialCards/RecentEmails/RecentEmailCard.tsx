import Image from 'next/image'
import Link from 'next/link'

import { BsCalendarFill } from 'react-icons/bs'
import { MdLocationPin, MdOutlineAccessTimeFilled } from 'react-icons/md'

interface RecentEmail {
    subject: string
    sender: string
    body: string
    dated: string
}
interface RecentEmailCardProps {
    emails: RecentEmail[]
}
export const RecentEmailCard = ({ emails }: RecentEmailCardProps) => {
    return (
        <div className="bg-gradient-to-r from-[#2DD8FD] to-[#0E71E6] rounded-2xl h-full p-4">
            <div className="flex justify-between items-center mb-1.5">
                <div>
                    <p className="font-medium text-sm text-white">
                        Recent Emails
                    </p>
                </div>
                <div>
                    <Link href="#" className="text-xs rounded-full bg-white px-2 py-1 text-indigo-800">
                        
                            View All
                        
                    </Link>
                </div>
            </div>
            <div className="flex justify-between gap-x-8 items-center">
                <div className="w-full">
                    {emails.map((email, i) => (
                        <Link href="#" key={i}>

                            <div
                                key={email.subject}
                                className="transition-all duration-200 w-full bg-sky-300 p-2 mb-1 rounded-lg hover:bg-sky-400"
                            >
                                <div className="flex justify-between">
                                    <div className="flex items-center space-x-2">
                                        <p className="font-semibold text-cyan-700 text-sm">
                                            {email.subject}
                                        </p>
                                        <p className="font-medium text-xs text-cyan-100">
                                            {email.sender}
                                        </p>
                                    </div>

                                    <p className="text-[9px] text-cyan-800">
                                        {email.dated}
                                    </p>
                                </div>

                                <p className="text-xs text-cyan-600">
                                    {email.body.slice(0, 60)} ...
                                </p>
                            </div>

                        </Link>
                    ))}
                </div>
                <div className="animate-float flex-shrink-0">
                    <Image
                        src="/images/card-icons/ic_email.png"
                        width={100}
                        height={100}
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
}
