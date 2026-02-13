import { Footer } from '@components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { SideBarItem } from '../SideBarItem'

import { PortalTypeBadge } from '@components/Badge'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { UserActions } from './components'
import { RouteNavLink } from '@layouts'
import { UserRoles } from '@constants'

export const SideBar = ({
    routes,
    portalType,
}: {
    routes: RouteNavLink[]
    portalType: UserRoles
}) => {
    const router = useRouter()
    const currentPath = router.pathname.replace('/portals/admin', '')

    const isActiveRoute = (path: string) => {
        const trimmedPath = path.replace('/portals/admin', '')

        if (!currentPath && !trimmedPath) {
            return true
        }

        if (currentPath) {
            return trimmedPath.includes(currentPath)
        }
    }
    const role = getUserCredentials()?.role

    return (
        <div className="w-56 flex-shrink-0 h-screen pb-24 bg-white border-r border-secondary-dark px-2 py-2 relative overflow-y-scroll remove-scrollbar">
            {/* <IoMdArrowDroprightCircle className="absolute top-12 scale-150 opacity-50" /> */}
            <Link href={`/portals/${role === 'subadmin' ? 'sub-admin' : role}`}>
                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                }
                <div className="relative w-fit mx-auto pt-2 mb-2">
                    <Image
                        src={'/images/skiltrak_logo.svg'}
                        alt="Skiltrak 2.0 Logo"
                        width="0"
                        height={'0'}
                        sizes="100vw"
                        className="w-32"
                        priority
                    />
                    <PortalTypeBadge type={portalType} />
                </div>
            </Link>
            <UserActions />
            <div className="px-2">
                {/* Before Ad Routes */}
                <div className="overflow-hidden">
                    <div
                        className={`my-1 flex flex-col items-start transition-all overflow-hidden`}
                    >
                        {routes.map((route: any, i: number) => {
                            if (route.placement && route.placement === 'after')
                                return null
                            if (route.type === 'title' && route.text)
                                return (
                                    <p
                                        key={i}
                                        className="text-xs font-semibold text-gray-400 mb-2"
                                    >
                                        {route.text}
                                    </p>
                                )
                            else if (route.type === 'divider')
                                return (
                                    <div
                                        key={i}
                                        className="w-full h-[0.1px] bg-gray-200 my-2"
                                    ></div>
                                )
                            else {
                                return (
                                    <SideBarItem
                                        key={route.text}
                                        Icon={route.Icon}
                                        link={route.path.replace('*', '')}
                                        active={isActiveRoute(route.path)}
                                        count={route?.count}
                                    >
                                        {route.text}
                                    </SideBarItem>
                                )
                            }
                        })}
                    </div>
                </div>

                {/* <Advertisement /> */}

                {/* After Ad Routes */}
                <div className="overflow-hidden">
                    <div
                        className={`my-1 flex flex-col items-start transition-all overflow-hidden`}
                    >
                        {routes.map((route: any) => {
                            if (
                                !route.placement ||
                                route.placement === 'before'
                            )
                                return null
                            if (route.type === 'title' && route.text)
                                return (
                                    <p
                                        key={route.text}
                                        className="text-sm font-semibold text-gray"
                                    >
                                        {route.text}
                                    </p>
                                )
                            else if (route.type === 'divider')
                                return (
                                    <div
                                        key={route.text}
                                        className="w-full h-[0.1px] bg-gray-300 my-2"
                                    ></div>
                                )
                            else
                                return (
                                    <SideBarItem
                                        key={route.text}
                                        Icon={route.Icon}
                                        link={route.path}
                                        active={isActiveRoute(route.path)}
                                    >
                                        {route.text}
                                    </SideBarItem>
                                )
                        })}
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 w-[223px]">
                <Footer />
            </div>
        </div>
    );
}
