import Image from 'next/image'
// import CountUp from 'react-countup'

import { Card } from '@components/cards'
import { PuffLoader } from 'react-spinners'
import Link from 'next/link'
import { Typography } from '@components/Typography'
import { ImBook } from 'react-icons/im'

type FigureCardProps = {
    imageUrl?: string | undefined
    loading?: boolean
    index: number
    sector: any
}

export const SectorCourseStudentCount = ({
    imageUrl,
    loading,
    index,
    sector,
}: FigureCardProps) => {
    const countNumber = Math.floor(Math.random() * 9)

    const studentCountDetail = {
        Pending: {
            color: 'text-gray-400',
            bgColor: 'bg-green-100',
            count: sector?.Pending,
        },
        'Awaiting Agreement Signed': {
            color: 'text-gray-400',
            bgColor: 'bg-gray-100',
            count: sector?.AwaitingAgreementSigned,
        },
        'Expired Student': {
            color: 'text-red-400',
            bgColor: 'bg-red-100',
            count: sector?.ExpiredStudents,
        },
        'Partner Industries': {
            color: 'text-orange-400',
            bgColor: 'bg-orange-100',
            count: `${sector?.profileCompleted}/${sector?.PartnerIndustries}`
        },
        'New Students': {
            color: 'text-cyan-500',
            bgColor: 'bg-cyan-100',
            count: sector?.newStudents,
            last30Days: true,
        },
        'Placement Started': {
            color: 'text-green-400',
            bgColor: 'bg-green-100',
            count: sector?.placementStarted,
            last30Days: true,
        },
    }
    return (
        <Link href={''} className="w-full">

            <Card>
                <div className="flex justify-between">
                    <div className="flex items-start gap-x-2">
                        <div className="mt-1 -rotate-12">
                            <ImBook size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <Typography
                                variant={'label'}
                                color={'text-gray-600'}
                            >
                                <span className="font-bold">
                                    {sector?.name}
                                </span>
                            </Typography>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        {loading ? (
                            <div className="h-[36px]">
                                <PuffLoader size={28} />
                            </div>
                        ) : (
                            <p className="text-3xl font-bold">
                                {/* <CountUp end={count} /> */}
                                {sector?.totalStudents}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 leading-3 uppercase">
                            Students
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-start gap-2">
                    {Object.entries(studentCountDetail)?.map(
                        ([key, value]: any) => (
                            <div
                                key={key}
                                className={`rounded-md shadow p-3 flex flex-col gap-x-1 ${value?.bgColor}`}
                            >
                                <div className={`flex gap-x-1`}>
                                    <Typography
                                        variant={'small'}
                                        right
                                        color={value.color}
                                    >
                                        <span className="font-semibold">
                                            {' '}
                                            {value?.count || 0}
                                        </span>
                                    </Typography>
                                    <Typography
                                        variant={'small'}
                                        color={value.color}
                                    >
                                        <span
                                            className="font-normal block"
                                            dangerouslySetInnerHTML={{
                                                __html: key,
                                            }}
                                        ></span>
                                    </Typography>
                                </div>
                                {value?.last30Days && (
                                    <Typography
                                        variant={'small'}
                                        color={value.color}
                                    >
                                        <span className="text-[10px] block">
                                            (last 30 days)
                                        </span>
                                    </Typography>
                                )}
                            </div>
                        )
                    )}

                    {/* <div className="rounded-md shadow p-3 flex flex-col gap-y-1">
                        <Typography variant={'small'} right>
                            {sector?.ExpiredStudents || 0}
                        </Typography>
                        <Typography variant={'small'}>
                            <span className="font-semibold">
                                Expired Student
                            </span>
                        </Typography>
                    </div>
                    <div className="rounded-md shadow p-3 flex flex-col gap-y-1">
                        <Typography variant={'small'} right>
                            {sector?.PartnerIndustries || 0}
                        </Typography>
                        <Typography variant={'small'}>
                            <span className="font-semibold">
                                Industry Partners
                            </span>
                        </Typography>
                    </div>
                    <div className="rounded-md shadow p-3 flex flex-col gap-y-1">
                        <Typography variant={'small'} right>
                            {sector?.newStudents || 0}
                        </Typography>
                        <Typography variant={'small'}>
                            <span className="font-semibold">
                                New Students
                            </span>
                        </Typography>
                    </div>
                    <div className="rounded-md shadow p-3 flex flex-col gap-y-1">
                        <Typography variant={'small'} right>
                            {sector?.placementStarted || 0}
                        </Typography>
                        <Typography variant={'small'}>
                            <span className="font-semibold">
                                Placement Started Students
                            </span>
                        </Typography>
                    </div> */}
                </div>

                {/* <div className="mt-2.5 flex justify-between items-center border-b border-[#E8E8E8] py-2">
                    <Typography variant={'small'}>
                        <span className="font-medium">
                            Pending Requests
                        </span>
                    </Typography>
                    <Typography variant={'small'}>
                        {sector?.AwaitingAgreementSigned}
                    </Typography>
                </div>
                <div className="flex justify-between items-center border-b border-[#E8E8E8] py-2">
                    <Typography variant={'small'}>
                        <span className="font-medium">Expired Student</span>
                    </Typography>
                    <Typography variant={'small'}>
                        {sector?.ExpiredStudents}
                    </Typography>
                </div>
                <div className="flex justify-between items-center border-b border-[#E8E8E8] py-2">
                    <Typography variant={'small'}>
                        <span className="font-medium">
                            Industry Partners
                        </span>
                    </Typography>
                    <Typography variant={'small'}>
                        {sector?.PartnerIndustries}
                    </Typography>
                </div>
                <div className="flex justify-between items-center border-b border-[#E8E8E8] py-2">
                    <Typography variant={'small'}>
                        <span className="font-medium"> New Students</span>
                    </Typography>
                    <Typography variant={'small'}>
                        {sector?.newStudents}
                    </Typography>
                </div>
                <div className="flex justify-between items-center border-b border-[#E8E8E8] py-2">
                    <Typography variant={'small'}>
                        <span className="font-medium">
                            Placement Started Students
                        </span>
                    </Typography>
                    <Typography variant={'small'}>
                        {sector?.placementStarted}
                    </Typography>
                </div> */}

                <div className="mt-4">
                    <Typography variant={'small'}>
                        <span className="font-bold">Detail</span>
                    </Typography>

                    <div className="mt-2">
                        {sector?.courses?.map((course: any, i: number) => (
                            <div
                                key={i}
                                className="flex justify-between items-center border-b border-[#E8E8E8] py-2"
                            >
                                <Typography variant={'small'}>
                                    <span className="font-medium">
                                        {course?.title}
                                    </span>
                                </Typography>
                                <Typography variant={'small'}>
                                    {course?.studentCount}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

        </Link>
    );
}
