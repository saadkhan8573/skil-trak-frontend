
import {
    InitialAvatar,
    Typography
} from '@components'

import moment from 'moment'
type Props = {
    selectedMessage: any
}

export const SentMailDetail = ({ selectedMessage }: Props) => {
    return (
        <div className="w-full h-full">
            {selectedMessage && (
                <>
                    <div className="px-4 border-b py-2 flex justify-between items-center w-full">
                        <div>
                            <Typography variant={'subtitle'}>
                                {selectedMessage?.receiver?.name}
                            </Typography>
                            <Typography variant={'muted'} color={'text-muted'}>
                                {moment(
                                    new Date(selectedMessage?.createdAt)
                                ).format('LL')}
                            </Typography>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <InitialAvatar name={selectedMessage?.receiver?.name || ""} />
                            <Typography variant={'subtitle'}>
                                {selectedMessage?.email}
                            </Typography>
                        </div>
                    </div>
                    <div className='px-4 py-2'>
                        <span
                            className="break-all block mr-6"
                            dangerouslySetInnerHTML={{
                                __html: selectedMessage?.message,
                            }}
                        >
                            {/* {message?.message} */}
                        </span>
                        {/* {selectedMessage?.message} */}
                    </div>
                </>
            )}
            {/* <div className="p-4 h-full">
                <div
                    className={`w-full bg-gray-50 rounded-lg p-2 h-[calc(100%-50px)] overflow-y-auto remove-scrollbar`}
                >
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={fetchMoreData}
                        hasMore={hasNext}
                        useWindow={false}
                        loader={
                            <div className="py-6 flex items-center justify-center">
                                <PulseLoader size={10} />
                            </div>
                        }
                    >
                        <div className={`flex flex-col gap-y-2.5 `}>
                            {mailDetail && mailDetail?.length > 0
                                ? mailDetail?.map((mail: any, i: number) => (
                                    <Mail
                                        key={mail?.id}
                                        sender={
                                            mail?.sender?.role === 'admin'
                                        }
                                        message={mail}
                                        index={i}
                                    />
                                ))
                                : !message?.isError &&
                                !hasNext &&
                                (selectedMessage ? (
                                    <EmptyData
                                        imageUrl="/images/icons/common/mails.png"
                                        title={'No Mails'}
                                        description={
                                            'You have not sent/received any mail yet'
                                        }
                                        height={'40vh'}
                                    />
                                ) : (
                                    <EmptyData
                                        imageUrl="/images/icons/common/mails.png"
                                        title={'No Mails Selected'}
                                        description={
                                            'You did not select any mail yet'
                                        }
                                        height={'40vh'}
                                    />
                                ))}

                            {message?.isError && (
                                <NoData
                                    text={
                                        'There is some network issue,Data cant load, try to refresh the browser'
                                    }
                                />
                            )}
                        </div>
                    </InfiniteScroll>
                </div>
            </div> */}
        </div>
    )
}
