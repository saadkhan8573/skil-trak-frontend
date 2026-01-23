import moment from 'moment'
import { FaCheck } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

export const StatusBadge = ({
    status = null,
    date,
}: {
    status: boolean | null
    date?: string
}) => {
    if (status === null) return null

    const formattedDate = date
        ? moment(date).format('DD MMM YYYY, hh:mm A')
        : null

    return (
        <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-medium ${
                status
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
            }`}
        >
            {status ? (
                <>
                    <FaCheck className="w-2 h-2" />
                    <span>Interested</span>
                </>
            ) : (
                <>
                    <IoClose className="w-2 h-2" />
                    <span>Not Interested</span>
                </>
            )}

            {formattedDate && (
                <span className="opacity-70 whitespace-nowrap">
                    • {formattedDate}
                </span>
            )}
        </div>
    )
}
