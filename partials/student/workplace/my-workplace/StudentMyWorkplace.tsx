import { Button, Card, Typography } from '@components'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const StudentMyWorkplace = () => {
    const router = useRouter()

    const role = getUserCredentials()?.role
    return (
        <div className="mx-auto mt-8 flex items-center justify-center max-w-5xl">
            <Card>
                <div className="py-2">
                    <Typography
                        variant="h4"
                        color="text-[#6F6C90]"
                        center
                        normal
                    >
                        Create Your Workplace Request
                    </Typography>
                    <div className="flex flex-col gap-y-2.5 items-center mx-auto max-w-2xl mt-4">
                        <Image
                            src={'/images/workplace/darkTab.png'}
                            alt={'Workplace Icon'}
                            width={45}
                            height={45}
                        />
                        <Typography
                            variant="h3"
                            bold
                            color="text-[#170F49]"
                            center
                        >
                            Get Help Finding a Workplace
                        </Typography>
                        <Typography variant="small" center>
                            <span className="font-semibold"> No problem!</span>{' '}
                            Just fill out the form with your details, education,
                            and when you’re available. Once you send it in, our
                            Skilltrak Coordinator will check your info and help
                            find a good fit Workplace for you.
                        </Typography>
                    </div>

                    {/*  */}
                    <div className="mt-4 flex flex-col gap-y-4">
                        <div className="w-44 h-10 mx-auto">
                            <Button
                                onClick={() => {
                                    if (role === UserRoles.SUBADMIN) {
                                        router.push(
                                            `/portals/sub-admin/students/${router?.query?.id}/request-workplace-detail`
                                        )
                                    } else if (role === UserRoles.STUDENT) {
                                        router.push(
                                            '/portals/student/workplace/my-workplace/dont-have-workplace'
                                        )
                                    }
                                }}
                                fullHeight
                                fullWidth
                                text={'Proceed'}
                            />
                        </div>

                        <Typography
                            variant="label"
                            color={'text-[#6F6C90]'}
                            block
                            center
                        >
                            OR{' '}
                        </Typography>
                        <Link
                            href={
                                role === UserRoles.SUBADMIN
                                    ? `/portals/sub-admin/students/${router?.query?.id}/provide-workplace-detail`
                                    : role === UserRoles.STUDENT
                                    ? '/portals/student/workplace/my-workplace/have-workplace'
                                    : '#'
                            }
                        >
                            <Typography
                                semibold
                                color={'!text-[#284886]'}
                                center
                            >
                                Currently employed / Arrangements in relevant
                                field?
                            </Typography>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    )
}
