import { Typography, NoData } from '@components'
import { CommonApi } from '@queries'
import Image from 'next/image'
import { PulseLoader } from 'react-spinners'

export const EmailsCard = () => {
    const { data, isError, isLoading } = CommonApi.Messages.useRecentMails()

    return (
        <div className="bg-linear-to-r from-[#2DD8FD] to-[#0E71E6] p-4 rounded-2xl">
            <Typography variant={'subtitle'} color={'text-white'}>
                New Emails
            </Typography>
            <div className="mt-2 flex justify-between">
                {isLoading ? (
                    <PulseLoader color={'#fff'} size={10} />
                ) : data?.length > 0 ? (
                    <div className="flex flex-col gap-y-2">
                        <div className="border border-white rounded-2xl p-2">
                            <Typography
                                variant={'subtitle'}
                                color={'text-white'}
                            >
                                Subject:{' '}
                                {data[data?.length - 1]?.subject || 'N/A'}
                            </Typography>
                            {/* <Typography
                                variant={'subtitle'}
                                color={'text-[#2763CA]'}
                            >
                                {data[data?.length - 1]?.message?.substring(
                                    0,
                                    32
                                ) || 'N/A'}
                            </Typography> */}

                        </div>
                        <div className="border border-white rounded-2xl p-2">
                            <Typography
                                variant={'subtitle'}
                                color={'text-white'}
                            >
                                Subject:{' '}
                                {data[data?.length - 2]?.subject || 'N/A'}
                            </Typography>
                            {/* <Typography
                                variant={'subtitle'}
                                color={'text-[#2763CA]'}
                            >
                                {data[data?.length - 2]?.message?.substring(
                                    0,
                                    32
                                ) || 'N/A'}
                            </Typography> */}
                        </div>
                    </div>
                ) : (
                    <NoData text={'No New Emails were found'} />
                )}
                <div className="animate-float">
                    <Image
                        src={'/images/card-icons/ic_email.png'}
                        alt="Emails"
                        width={100}
                        height={100}
                    />
                </div>
            </div>
        </div>
    )
}
