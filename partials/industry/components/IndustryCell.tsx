import { InitialAvatar } from '@components'
import { Industry } from '@types'
import { QueryType, queryToUrl } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaHandshake } from 'react-icons/fa'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'

export const IndustryCell = ({ industry }: { industry: Industry }) => {
    const router = useRouter()
    const query = queryToUrl(router.query as QueryType)
    return (
        <a
            onClick={() => {
                sessionStorage.setItem(
                    'industry',
                    `${router.pathname}?${query}`
                )
            }}
            className="flex items-center gap-x-2"
        >
            <div className="shadow-inner-image rounded-full relative">
                {industry?.user?.name && (
                    <InitialAvatar
                        name={industry?.user?.name}
                        imageUrl={industry?.user?.avatar}
                    />
                )}
                {industry?.isPartner ? (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center bg-green-500 rounded-full text-white">
                        <FaHandshake size={14} />
                    </div>
                ) : null}
            </div>
            <div>
                <p className="font-semibold">{industry?.user?.name}</p>
                <div className="font-medium text-xs text-gray-500">
                    <p className="flex items-center gap-x-1">
                        <span>
                            <MdEmail />
                        </span>
                        {industry?.user?.email}
                    </p>
                    <p className="flex items-center gap-x-1">
                        <span>
                            <MdPhoneIphone />
                        </span>
                        {industry?.phoneNumber}
                    </p>
                </div>
            </div>
        </a>
    )
}
