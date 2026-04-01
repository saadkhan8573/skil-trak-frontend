import { Button } from '@components/buttons'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { NavLink2 } from './NavLink2'
import { AdminApi } from '@redux'

export function Navbar2() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()

    const { data, isLoading, isError } = AdminApi.Blogs.categoriesList({
        skip: 0,
        limit: 20,
    })

    const blogsMenuOptions = data?.data?.map((category: any) => ({
        text: category?.title ?? 'NA',
        url: `/blogs?category=${category?.id}`,
    }))
    const navLinks = [
        {
            text: 'Home',
            url: '/',
        },

        {
            text: 'Services',
            url: '/our-services',
            subMenus: [
                {
                    text: 'Work Based Training',
                    url: '/our-services/work-based-training',
                },
                {
                    text: 'Talent Pool',
                    url: '/our-services/talent-pool',
                },
                // {
                //     text: 'Employment Hub',
                //     url: '/our-services/employment-hub',
                // },
                // {
                //     text: 'Upskill Traineeship Program',
                //     url: '/our-services/upskill-traineeship-program',
                // },
            ],
        },
        {
            text: 'Who We Serve',
            url: '#',
            subMenus: [
                {
                    text: 'Students',
                    url: '/who-we-serve/students',
                },
                {
                    text: 'RTO',
                    url: '/who-we-serve/rto',
                },
                {
                    text: 'Industry',
                    url: '/who-we-serve/industry',
                },
                // {
                //     text: 'Employment Hub',
                //     url: '/our-services/employment-hub',
                // },
                // {
                //     text: 'Upskill Traineeship Program',
                //     url: '/our-services/upskill-traineeship-program',
                // },
            ],
        },
        {
            text: 'Features',
            url: '/features',
        },
        {
            text: 'Blogs',
            url: '/blogs',
        },
        {
            text: 'Sectors',
            url: '/sectors',
        },
        // {
        //     text: 'Placements',
        //     url: '/blogs?category=34',
        //     // subMenus: blogsMenuOptions,
        // },
        {
            text: 'About Us',
            url: '/about-us',
        },
        {
            text: 'Contact Us',
            url: '/contact-us',
        },
        {
            text: 'Login',
            // url: "/login",
            // url: 'https://www.skiltrak.com.au',
            url: '/auth/login',
            asButton: true,
            external: true,
        },
    ]
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }
    const [show, setShow] = useState(false)
    const [scrollPosition, setScrollPosition] = useState(0)
    const [prevScrollPosition, setPrevScrollPosition] = useState(0)
    const [scrollDirection, setScrollDirection] = useState('')

    const handleScroll = () => {
        const currentPosition = window.pageYOffset
        setScrollPosition(currentPosition)

        if (currentPosition > prevScrollPosition) {
            // Scrolled down
            setScrollDirection('down')
            setShow(true)
        } else if (currentPosition < prevScrollPosition) {
            // Scrolled up
            setScrollDirection('up')
            setShow(false)
        }

        setPrevScrollPosition(currentPosition)
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [prevScrollPosition])

    return (
        // <nav className={`md:active-nav ${show && 'hidden-nav'}`}>
        <nav className="shadow-sm border-b sticky top-0 z-50 bg-white">
            <div className="w-full mx-auto max-w-7xl px-4 lg:px-0">
                <div className="relative max-w-full w-full flex items-center justify-between h-24">
                    <div className="px-4 md:px-0 flex-1 flex items-center justify-between">
                        {/* Logo */}
                        <div className="shrink-0 flex items-center">
                            <Link href={'/'}>
                                <Image
                                    width={0}
                                    height={0}
                                    sizes={'100vh 100vw'}
                                    className="block lg:hidden h-8 w-auto"
                                    // src={'/images/skiltrak-christmas.png'}
                                    src={'/images/site/logo-light.webp'}
                                    alt="Skiltrak Logo"
                                />
                            </Link>
                            <Link href={'/'}>
                                <img
                                    width={0}
                                    height={0}
                                    sizes={'100vh 100vw'}
                                    className="hidden lg:block h-12 w-auto"
                                    // src={'/images/skiltrak-christmas.png'}
                                    src="/images/site/logo-light.webp"
                                    alt="Skiltrak Logo"
                                />
                            </Link>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center gap-x-2 lg:hidden">
                            <div className="">
                                <button
                                    type="button"
                                    onClick={toggleMenu}
                                    className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    p-2
                                    rounded-md
                                    text-gray-400
                                    hover:text-white hover:bg-amber-500 
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-inset
                                    focus:ring-white
                                    "
                                    aria-controls="mobile-menu"
                                    aria-expanded="false"
                                >
                                    <span className="sr-only">
                                        Open main menu
                                    </span>

                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                    <svg
                                        className="hidden h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="pr-4">
                                <Button
                                    text={'Login'}
                                    variant="primary"
                                    onClick={() => {
                                        router.push('/auth/login')
                                    }}
                                />
                            </div>
                        </div>

                        {/* Nav Links */}
                        <div className="hidden lg:block lg:ml-auto">
                            <div className="flex lg:items-center">
                                {navLinks.map((link, i: number) => (
                                    <NavLink2
                                        key={i}
                                        to={link.url}
                                        text={link.text}
                                        subMenus={link?.subMenus}
                                        asButton={link.asButton}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute
                inset-y-0
                right-0
                flex
                items-center
                pr-2
                lg:static lg:inset-auto lg:ml-6 lg:pr-0
              "
                    >
                        <div className="ml-3 relative hidden">
                            <div>
                                <button
                                    type="button"
                                    className="
                      bg-gray-800
                      flex
                      text-sm
                      rounded-full
                      focus:outline-none
                      focus:ring-2
                      focus:ring-offset-2
                      focus:ring-offset-gray-800
                      focus:ring-white
                    "
                                    id="user-menu-button"
                                    aria-expanded="false"
                                >
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    {/* <img
                    className="h-8 w-8 rounded-full"
                    src=""
                    alt=""
                  /> */}
                                </button>
                            </div>

                            <div
                                className="
                    origin-top-right
                    absolute
                    right-0
                    mt-2
                    w-48
                    rounded-md
                    shadow-lg
                    py-1
                    bg-white
                    ring-1 ring-black ring-opacity-5
                    focus:outline-none
                  "
                                role="menu"
                            >
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700"
                                    role="menuitem"
                                    id="user-menu-item-0"
                                >
                                    Your Profile
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700"
                                    role="menuitem"
                                    id="user-menu-item-1"
                                >
                                    Settings
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700"
                                    role="menuitem"
                                    id="user-menu-item-2"
                                >
                                    Sign out
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`${
                    isMenuOpen ? 'h-full' : 'h-0'
                } transition-all overflow-hidden duration-300 ease-in-out lg:hidden`}
                id="mobile-menu"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col items-start">
                    {navLinks.map((link, i: number) => (
                        <NavLink2
                            key={i}
                            to={link.url}
                            text={link.text}
                            asButton={link.asButton}
                            subMenus={link?.subMenus}
                            onClick={() => setIsMenuOpen(false)}
                        />
                    ))}
                </div>
            </div>
        </nav>
    )
}
