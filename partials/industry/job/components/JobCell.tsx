import { InitialAvatar } from '@components'
import { Industry, Job } from '@types'
import Link from 'next/link'
import { FaHandshake } from 'react-icons/fa'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'

export const JobCell = ({ job }: { job: Job }) => {
    return (
        <Link href={`/portals/industry/jobs/${job?.id}`} className="flex items-center gap-x-2">

            <div className="shadow-inner-image rounded-full relative">
                <InitialAvatar name={job?.title} />
            </div>
            <div>
                <p className="font-semibold">{job?.title}</p>
                <div className="font-medium text-xs text-gray-500">
                    <p className="flex items-center gap-x-1">
                        <span>
                            <MdEmail />
                        </span>
                        {job?.email}
                    </p>
                    <p className="flex items-center gap-x-1">
                        <span>
                            <MdPhoneIphone />
                        </span>
                        {job?.phone}
                    </p>
                </div>
            </div>

        </Link>
    );
}
