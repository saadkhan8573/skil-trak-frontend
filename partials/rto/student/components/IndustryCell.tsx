import Link from 'next/link'
import { Industry } from '@types'
import { InitialAvatar } from '@components'
import { FaHandshake } from 'react-icons/fa'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'

export const IndustryCell = ({ industry }: { industry: Industry }) => {
    return (
        <Link
            href={`/portals/rto/industries/workplaces/${industry?.id}`}
            className="flex items-center gap-x-2"
        >

            <div className="shadow-inner-image rounded-full relative">
                <InitialAvatar
                    name={industry?.user?.name}
                    imageUrl={industry?.user?.avatar}
                />
                {industry?.studentCapacity ? (
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

        </Link>
    );
}
