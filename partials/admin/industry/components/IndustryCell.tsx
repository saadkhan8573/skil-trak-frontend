import { InitialAvatar, Tooltip } from '@components'
import { CopyData } from '@partials/common/FindWorkplaces/components'
import { QueryType, ellipsisText, queryToUrl } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaFileSignature, FaHandshake } from 'react-icons/fa'
import { HiOutlineSpeakerphone } from 'react-icons/hi'
import { IoDiamondSharp } from 'react-icons/io5'
import { MdSnooze } from 'react-icons/md'

export const IndustryCell = ({ industry }: any) => {
    const router = useRouter()
    const query = queryToUrl(router.query as QueryType)

    const initiatedEsign = industry?.user?.signers?.filter(
        (sign: any) => sign?.document?.template
    )

    return (
        <Link href={`/portals/admin/industry/${industry?.id}`} onClick={() => {
            sessionStorage.setItem(
                'industry',
                `${router.pathname}?${query}`
            )
        }}>

            <div className="flex items-center gap-x-2 relative z-10">
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
                {industry?.isPremium ? (
                    <div
                        title="Industry Premium Feature Active"
                        className="absolute bottom-1 right-0 w-5 h-5 flex items-center justify-center bg-indigo-500 rounded-full text-white"
                    >
                        <IoDiamondSharp size={14} />
                    </div>
                ) : null}
                <div>
                    {industry?.snoozedDate &&
                    industry?.snoozedDate !== null ? (
                        <MdSnooze size={14} className="text-red-500" />
                    ) : null}
                    <div className="flex items-center gap-x-2">
                        <div className="flex flex-col gap-y-1">
                            <div className="group flex items-center gap-x-1">
                                <div className="flex gap-x-2 w-fit">
                                    <p
                                        className="font-semibold w-fit"
                                        title={industry?.user?.name}
                                    >
                                        {ellipsisText(
                                            industry?.user?.name,
                                            20
                                        )}
                                    </p>
                                    {initiatedEsign &&
                                        initiatedEsign?.length > 0 && (
                                            <div className="group relative w-fit">
                                                <FaFileSignature
                                                    size={18}
                                                    className="text-success-dark"
                                                />
                                                <Tooltip>
                                                    Checklist Initiated
                                                </Tooltip>
                                            </div>
                                        )}
                                </div>
                                <CopyData
                                    text={industry?.user?.name}
                                    type={'Industry Name'}
                                />
                            </div>
                        </div>

                        {industry?.isHiring ? (
                            <div>
                                <HiOutlineSpeakerphone className="text-lg" />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                    {/* snoozedDate */}
                </div>
            </div>

        </Link>
    );
}
