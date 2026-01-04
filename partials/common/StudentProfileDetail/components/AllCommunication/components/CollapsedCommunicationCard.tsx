import { Typography } from '@components'
import { IoIosArrowDown } from 'react-icons/io'
import {
    getCommunicationDate,
    getCommunicationIcon,
    getCommunicationSenderName,
    getCommunicationTitle,
} from '../communicationUtils'
import { CommunicationCardProps } from '../types'
import { CommunicationDetails } from './CommunicationDetails'
import { useState } from 'react'

export const CollapsedCommunicationCard: React.FC<CommunicationCardProps> = ({
    item,
}) => {
    const [isOpened, setIsOpened] = useState(item?.title ? true : false)
    return (
        <div className="bg-white rounded-lg border border-gray-200 mb-2 overflow-hidden">
            {item?.type !== 'workplaceHistory' && (
                <div
                    className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setIsOpened(!isOpened)}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                            <div
                                className={`text-2xl ${getCommunicationIcon(item)?.bg
                                    }`}
                            >
                                {getCommunicationIcon(item)?.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <Typography
                                        variant="label"
                                        semibold
                                        color="text-gray-900 truncate"
                                    >
                                        {getCommunicationTitle(item)}
                                    </Typography>
                                    <div className="flex items-center space-x-2">
                                        <Typography
                                            variant="small"
                                            color="text-gray-500 whitespace-nowrap"
                                        >
                                            {getCommunicationDate(item)}
                                        </Typography>
                                        <div
                                            className={`transform transition-transform text-gray-400 ${isOpened ? 'rotate-180' : ''
                                                }`}
                                        >
                                            <IoIosArrowDown />
                                        </div>
                                    </div>
                                </div>
                                <Typography
                                    variant="label"
                                    color="text-gray-600 mt-1"
                                >
                                    From:{' '}
                                    {
                                        getCommunicationSenderName(item)
                                        // getCommunicationSender(item)
                                    }
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isOpened && (
                <div
                    className={
                        item?.type !== 'workplaceHistory'
                            ? 'border-t border-gray-100 p-2 bg-gray-50'
                            : ''
                    }
                >
                    <CommunicationDetails item={item} />
                </div>
            )}
        </div>
    )
}
