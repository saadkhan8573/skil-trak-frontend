import moment from 'moment'
import { useState } from 'react'

// Icons
import { BiCheckDouble, BiDotsVerticalRounded } from 'react-icons/bi'

// components
import { Typography } from '@components/Typography'

// functions
import { AuthUtils } from '@utils'
import { MdAvTimer } from 'react-icons/md'

import { ellipsisText, userStatus } from '@utils'
import { Attachments } from './Attachments'

export const Mail = ({ message, sender, index }: any) => {
    const [showOptions, setShowOptions] = useState(false)

    const checkMessageStatus = () => {
        switch (message.status) {
            case userStatus.PENDING:
                return <MdAvTimer title={userStatus.PENDING} />
            case 'deliverd':
                return (
                    <BiCheckDouble
                        title="deliverd"
                        className={`${message.isSeen ? 'text-info' : ''}`}
                    />
                )
            default:
                return
        }
    }

    function reduceFontSize(htmlString: string, newSize: string) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlString, 'text/html')

        // Select and modify the font size for all <p> elements
        const paragraphs = doc.querySelectorAll('p')
        paragraphs.forEach((paragraph) => {
            paragraph.style.fontSize = newSize
        })

        // Serialize the modified HTML back to a string
        const modifiedHtml = new XMLSerializer().serializeToString(doc)
        return modifiedHtml
    }

    const myMessages =
        AuthUtils.getUserCredentials()?.id === message?.sender?.id

    const removeWhiteBackground = (htmlString: string) => {
        // Remove background-color:#ffffff from style attributes
        let result = htmlString?.replace(
            /background-color\s*:\s*#ffffff\s*;?/gi,
            ''
        )

        // Also remove the div style rule that's in the <style> tag
        result = result?.replace(
            /div\s*\{\s*background-color\s*:\s*#ffffff\s*;/gi,
            'div {'
        )

        return result
    }

    return (
        <div
            id={message?.id}
            className={`flex gap-x-2 ${
                myMessages ? 'flex-row-reverse' : ''
            } group`}
        >
            {/* {(message?.sender?.name || message?.receiver?.name) && (
                <InitialAvatar
                    name={
                        myMessages
                            ? message?.sender?.name
                            : message?.receiver?.name
                    }
                    imageUrl={
                        myMessages
                            ? message?.sender?.avatar
                            : message?.receiver?.avatar
                    }
                />
            )} */}
            <div
                className={`flex items-center gap-x-2 ${
                    myMessages ? 'flex-row-reverse' : ''
                }`}
            >
                <div
                    className={`max-w-600 min-w-280  shadow-1 rounded-b-lg p-2 pt-1.5 flex flex-col justify-between ${
                        message.parent ? 'min-h-[105px]' : 'min-h-[77px]'
                    } ${
                        myMessages
                            ? 'bg-white rounded-tr-0 rounded-tl-lg'
                            : 'bg-[#FCD6A540] rounded-tl-0 rounded-tr-lg'
                    }`}
                >
                    {message?.parent && (
                        <div className={`bg-[#00000009] p-1.5 mb-1`}>
                            <Typography variant={'muted'} color={'grayLight'}>
                                <span className="italic">
                                    {ellipsisText(
                                        message?.parent?.message,
                                        350
                                    )}
                                </span>
                            </Typography>
                        </div>
                    )}
                    <div
                        className={`flex justify-between items-start gap-x-2 ${
                            message?.parent ? 'mb-3' : ''
                        }`}
                    >
                        <div>
                            <Typography variant={'subtitle'}>
                                {message?.subject || 'Message Subject'}
                            </Typography>
                            <Typography variant={'label'} color={'gray'}>
                                {myMessages ? 'You' : message?.sender?.name}
                            </Typography>
                            {message?.ccUsers &&
                                message?.ccUsers?.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-y-3 gap-x-1">
                                        <Typography variant="muted">
                                            CC:
                                        </Typography>
                                        {message?.ccUsers.map((ccUser: any) => {
                                            return (
                                                <div className="flex items-center gap-x-1">
                                                    <Typography variant="muted">
                                                        {ccUser?.user?.name},
                                                    </Typography>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                        </div>
                        <div>
                            <Typography variant={'small'} color={'grayLight'}>
                                {/* Jul 15, 2022 10:55am */}
                                {/* {moment(message.createdAt).format('LLL')} */}
                                {moment(
                                    message?.isEnabled || message.createdAt,
                                    'YYYY-MM-DD hh:mm:ss Z'
                                ).format('MMM DD, YYYY hh:mm a')}
                            </Typography>
                            {message.status === userStatus.PENDING && (
                                <div className="relative hidden group-hover:block">
                                    {/* reactions */}
                                    <BiDotsVerticalRounded
                                        onClick={() =>
                                            setShowOptions(!showOptions)
                                        }
                                        className=" hover:bg-[#00000020] rounded-full p-0.5 cursor-pointer absolute right-0 z-20"
                                    />
                                    {showOptions && (
                                        <div
                                            onClick={() =>
                                                setShowOptions(false)
                                            }
                                            className="cursor-pointer absolute z-10 bg-secondary rounded-md border border-gray-300 w-40 right-0 top-3 flex flex-col gap-y-1 py-2.5 p-1.5"
                                        >
                                            <Typography
                                                variant={'muted'}
                                                color={'gray'}
                                            >
                                                Resend Message
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-x-2 relative mt-3">
                        <p className="text-sm">
                            <span
                                className="block mr-6 content-editor"
                                dangerouslySetInnerHTML={{
                                    __html: removeWhiteBackground(
                                        message?.message
                                    ),
                                }}
                            ></span>

                            {message?.attachments &&
                            message?.attachments?.length > 0 ? (
                                <>
                                    <div className="mt-3">
                                        <Typography
                                            variant={'label'}
                                            color={'text-gray-700'}
                                        >
                                            Attachments
                                        </Typography>
                                    </div>
                                    <Attachments
                                        attachments={message?.attachments}
                                    />
                                </>
                            ) : null}
                        </p>

                        {/* show message status icons */}
                        {myMessages && (
                            <span className="absolute bottom-0 right-0 z-0">
                                {checkMessageStatus()}
                            </span>
                        )}
                    </div>
                </div>
                {/* <div
                    onClick={() => {
                        setReplyMessage({
                            id: message?.id,
                            message: message.message,
                        })
                    }}
                >
                    {myMessages ? (
                        <RiShareForwardFill className={replyIconClasses} />
                    ) : (
                        <TiArrowBack className={replyIconClasses} />
                    )}
                </div> */}
            </div>
        </div>
    )
}
