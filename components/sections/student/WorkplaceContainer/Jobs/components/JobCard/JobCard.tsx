import Image from 'next/image'
import Link from 'next/link'

// React icons
import { Typography } from '@components/Typography'
import { FaLocationArrow, FaPhoneAlt } from 'react-icons/fa'
import { GiBanknote } from 'react-icons/gi'
import { HiUserGroup } from 'react-icons/hi'
import { IoMdBriefcase } from 'react-icons/io'
import { MdContactPhone } from 'react-icons/md'
import { RiTimeFill } from 'react-icons/ri'
import { ApplyNowButton } from '../ApplyNowButton'
import { InitialAvatar } from '@components/InitialAvatar'
import moment from 'moment'

// query

type Props = {
    savedJobs?: any
    job: any
}

export enum jobType {
    FULLTIME = 'fullTime',
    PARTTIME = 'partTime',
}
export const JobCard = ({ savedJobs, job }: Props) => {
    return (
        <>
            <div className="my-3 bg-white border rounded-2xl shadow-sm">
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link href={`/portals/student/jobs/${job?.id}`}>

                                <Typography
                                    variant="subtitle"
                                    color="text-black"
                                >
                                    {job?.title}
                                </Typography>

                            </Link>

                            <div className="flex items-center gap-x-2 mb-2">
                                {job?.industry?.user?.name && (
                                    <InitialAvatar
                                        imageUrl={job?.industry?.user?.avatar}
                                        name={job?.industry?.user?.name}
                                    />
                                )}
                                {/* <Image
                                        className="rounded-full"
                                        src={
                                            job?.avatar ||
                                            'https://placeimg.com/100/10/any'
                                        }
                                        alt="industry"
                                        width={100}
                                        height={100}
                                    /> */}
                                <Typography
                                    variant="muted"
                                    color="text-gray-400"
                                >
                                    {job?.industry?.user?.name}
                                </Typography>
                            </div>
                        </div>
                        <ApplyNowButton
                            onClick={() => {
                                // saveJob(id)
                            }}
                            id={job?.id}
                            job={job}
                            savedJob={savedJobs
                                ?.map(({ id }: any) => id)
                                .includes(job?.id)}
                        />
                    </div>
                    <div className="flex item-center gap-x-2 pt-2">
                        <div className="flex item-center gap-x-2">
                            <HiUserGroup className="text-[#7E9CAF]" />
                            <Typography variant="small" color="text-gray-400">
                                Vacancies :
                            </Typography>
                            <Typography variant="muted" color="text-black">
                                {job?.vacancies}
                            </Typography>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <IoMdBriefcase className="text-[#7E9CAF]" />
                            <Typography variant="small" color="text-gray-400">
                                Job Type :
                            </Typography>
                            <Typography variant="muted" color="text-black">
                                {job?.employmentType === jobType.FULLTIME
                                    ? 'Full Time'
                                    : job?.employmentType === jobType.PARTTIME
                                    ? 'Part Time'
                                    : 'Freelance'}
                            </Typography>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <MdContactPhone className="text-[#7E9CAF]" />
                            <Typography variant="small" color="text-gray-400">
                                Contact to :
                            </Typography>
                            <Typography variant="muted" color="text-black">
                                {job?.contactPerson}
                            </Typography>
                        </div>
                    </div>
                    <div className="pt-2">
                        <Typography variant="small" color="text-gray-600">
                            {job?.description}
                        </Typography>
                    </div>
                    <div className="mt-2 flex items-center gap-x-2">
                        <GiBanknote className="text-[#D1D5DB]" />
                        <Typography variant="label" color="text-black">
                            AUD {job?.salaryFrom} - Aud {job?.salaryTo}
                        </Typography>
                    </div>
                </div>
                <div className="border-t">
                    <div className="flex justify-between px-4 py-2">
                        <div className="flex items-center gap-x-6">
                            <div className="flex gap-x-2 items-center">
                                <FaLocationArrow className="text-[#D1D5DB]" />
                                <Typography variant="muted" color="text-black">
                                    {`${job?.addressLine1} ${job?.suburb}`}
                                </Typography>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <FaPhoneAlt className="text-[#D1D5DB]" />
                                <Typography variant="muted" color="text-black">
                                    {job?.phone}
                                </Typography>
                            </div>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <RiTimeFill className="text-[#D1D5DB]" />
                            <Typography variant="small" color="text-black">
                                {moment(
                                    job?.createdAt,
                                    'YYYYMMDDhhmmss'
                                ).fromNow()}
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
