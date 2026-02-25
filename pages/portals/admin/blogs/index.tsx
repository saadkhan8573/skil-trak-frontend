import { ReactElement, useEffect } from 'react'

import { Button, TabNavigation, TabProps } from '@components'
import { useNavbar } from '@hooks'
import { AdminLayout } from '@layouts'
import {
    BlogCategories,
    DraftBlogs,
    PublishedBlogs,
} from '@partials/admin/blog'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { AdminApi } from '@queries'
import { removeEmptyValues } from '@utils'

const BlogsList: NextPageWithLayout = () => {
    const router = useRouter()

    const navBar = useNavbar()

    const count = AdminApi.Blogs.useBlogsCount({
        search: `${JSON.stringify(
            removeEmptyValues({
                category: router?.query?.category,
            })
        )
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
    })

    useEffect(() => {
        navBar.setTitle('blogs')
    }, [])

    const tabs: TabProps[] = [
        {
            label: 'Published',
            href: {
                pathname: 'blogs',
                query: { tab: 'published', page: 1, pageSize: 50 },
            },
            badge: {
                text: count?.data?.published,
                loading: count.isLoading,
            },
            element: <PublishedBlogs />,
        },
        {
            label: 'Draft',
            href: {
                pathname: 'blogs',
                query: { tab: 'draft', page: 1, pageSize: 50 },
            },
            badge: {
                text: count?.data?.draft,
                loading: count.isLoading,
            },
            element: <DraftBlogs />,
        },
        {
            label: 'Categories',
            href: {
                pathname: 'blogs',
                query: { tab: 'categories', page: 1, pageSize: 50 },
            },
            badge: {
                text: count?.data?.categories,
                loading: count.isLoading,
            },
            element: <BlogCategories />,
        },
    ]

    return (
        <div className="p-3">
            <div className="flex justify-end"></div>

            <TabNavigation tabs={tabs}>
                {({ header, element }: any) => (
                    <div>
                        <div className="flex justify-between items-center">
                            <div className="w-full">{header}</div>
                            <div className="shrink-0">
                                <Button
                                    onClick={() => {
                                        router.push(
                                            '/portals/admin/blogs/add-blog'
                                        )
                                    }}
                                    text={'Add Blog'}
                                />
                            </div>
                        </div>
                        <div className="px-4">{element}</div>
                    </div>
                )}
            </TabNavigation>
        </div>
    )
}

BlogsList.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default BlogsList
