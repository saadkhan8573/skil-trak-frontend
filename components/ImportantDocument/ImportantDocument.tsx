import { useEffect, MouseEventHandler } from 'react'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useJoyRide } from '@hooks'
export const ImportantDocument = ({
    imageUrl,
    title,
    href,
    detail,
    onClick,
}: {
    imageUrl: string
    title: string
    href?: string
    detail?: boolean
    onClick?: MouseEventHandler<HTMLDivElement>
}) => {
    const detailContainerClasses = classNames({
        'flex items-center rounded-md bg-white cursor-pointer transition-all duration-300 shadow scale-100 hover:shadow-xl hover:scale-105':
            detail,
        'rounded-md bg-gray-700 cursor-pointer transition-all duration-300 shadow scale-100 hover:shadow-xl hover:scale-105':
            !detail,
    })

    const titleClasses = classNames({
        'text-sm text-gray-500 px-2 py-1': detail,
        'text-xs font-semibold drop-shadow text-white px-2 py-1': !detail,
    })
    // WORKPLACE JOY RIDE - Start
    const joyride = useJoyRide()

    useEffect(() => {
        if (joyride.state.tourActive) {
            // ✅ Store timeout to ensure cleanup
            const timeoutId = setTimeout(() => {
                joyride.setState({ ...joyride.state, run: true, stepIndex: 0 })
            }, 1200)

            // ✅ Cleanup on unmount or state change
            return () => clearTimeout(timeoutId)
        }
    }, [joyride])
    return href ? (
        <Link href={href ? href : '#'} id="important-docs" className="w-full">
            <div className={detailContainerClasses}>
                <Image
                    width={detail ? 60 : 200}
                    height={detail ? 50 : 150}
                    src={imageUrl}
                    alt={title}
                    className="rounded-t w-full"
                />
                <p className={titleClasses}>{title}</p>
            </div>
        </Link>
    ) : (
        <div id="important-docs" className="w-full" onClick={onClick}>
            <div className={detailContainerClasses}>
                <Image
                    width={detail ? 60 : 200}
                    height={detail ? 50 : 150}
                    src={imageUrl}
                    alt={title}
                    className="rounded-t w-full"
                />
                <p className={titleClasses}>{title}</p>
            </div>
        </div>
    )
}
