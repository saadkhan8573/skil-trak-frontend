import { Card } from '@components/cards'
import Image from 'next/image'
import Link from 'next/link'
import { PuffLoader } from 'react-spinners'

interface Href {
    pathname?: string
    query: any
}

interface TabVIIProps {
    label: string
    icon?: string
    active: boolean
    loading?: boolean
    count?: number
    href: Href
    onClick: () => void
}

export interface TabPropsVII {
    label: string
    href: Href
    element: React.ReactNode
    count?: number
    icon?: string // Optional icon for the tab
}

export const TabVII = ({
    label,
    icon,
    active,
    onClick,
    loading,
    count,
    href,
}: TabVIIProps) => {
    return (
        <Link href={href}>
            {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
            }
            <div
                onClick={onClick}
                className={`cursor-pointer ${
                    active ? 'border-blue-500 border rounded-lg' : ''
                }`}
            >
                <Card>
                    <div className="flex justify-end relative">
                        {icon && (
                            <div className="absolute bottom-8 left-0 flex items-center gap-x-2 justify-between">
                                <Image
                                    src={`/images/documents/${icon}` || ''}
                                    alt={label}
                                    width={48}
                                    height={48}
                                />
                            </div>
                        )}

                        <div className="flex flex-col items-end">
                            {loading ? (
                                <div className="h-[36px]">
                                    <PuffLoader size={28} />
                                </div>
                            ) : (
                                <p className="text-3xl font-bold">
                                    {/* <CountUp end={count} /> */}
                                    {count || 0}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 leading-3 uppercase">
                                {label}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </Link>
    );
}
