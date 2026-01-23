import moment from 'moment'

export const CallStatus = ({ callLogEntry, wasContacted }: any) => {
    if (!wasContacted) return null

    const getStatusConfig = () => {
        if (callLogEntry?.isAnswered === true) {
            return {
                text: 'Connected',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                dotColor: 'bg-green-500',
                borderColor: 'border-green-200',
            }
        }

        if (callLogEntry?.isAnswered === false) {
            return {
                text: 'Not Answered',
                bgColor: 'bg-red-100',
                textColor: 'text-red-800',
                dotColor: 'bg-red-500',
                borderColor: 'border-red-200',
            }
        }

        return null
    }

    const statusConfig = getStatusConfig()
    if (!statusConfig) return null

    const formattedDate = callLogEntry?.updatedAt
        ? moment(callLogEntry?.updatedAt).format('DD MMM YYYY, hh:mm A')
        : null

    return (
        <div className="flex flex-col items-start gap-0.5 mt-1">
            <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} w-fit`}
            >
                <span
                    className={`w-2 h-2 rounded-full ${statusConfig.dotColor} mr-2`}
                />
                {statusConfig.text}
                {formattedDate && (
                    <span
                        className={`text-[8px] ${statusConfig.textColor} ml-2`}
                    >
                        {formattedDate}
                    </span>
                )}
            </div>
        </div>
    )
}
