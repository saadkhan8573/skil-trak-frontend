import { ReactElement, useEffect } from 'react'

import { useContextBar, useNavbar } from '@hooks'
import { ManagementLayout } from '@layouts'
import { NextPageWithLayout } from '@types'
import { adminApi } from '@queries'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { BlogContextBar } from '@partials/management/blog'
import { Card, EmptyData, LoadingAnimation, TechnicalError } from '@components'
// import { TextEditor } from '@partials'

const EditBlog: NextPageWithLayout = () => {
    const contextBar = useContextBar()
    const router = useRouter()
    const blogId = router?.query?.slug as string
    const TextEditor = dynamic(
        () => import('../../../../partials/management/blog/EditTextEditor'),
        { ssr: false }
    )
    const { data, isLoading, isFetching, isError } =
        adminApi.useGetBlogDetailQuery(blogId, {
            skip: !blogId,
        })
    const [addTags, addTagsResult] = adminApi.useAddBlogTagsMutation()

    const [addCategories, addCategoriesResult] =
        adminApi.useAddBlogCategoriesMutation()
    const tags = adminApi.useGetTagsQuery()

    const navBar = useNavbar()
    useEffect(() => {
        navBar.setTitle('edit blog')

        return () => {
            navBar.setTitle('')
        }
    }, [])

    useEffect(() => {
        contextBar.setContent(
            <BlogContextBar
                addTags={addTags}
                data={tags?.data}
                addCategories={addCategories}
                addCategoriesResult={addCategoriesResult}
            />
        )
        contextBar.show(false)
        contextBar.setTitle('Blog')
        return () => {
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [])

    return (
        <Card>
            <div className="p-6 overflow-auto remove-scrollbar h-[calc(100vh-160px)]">
                {isError && <TechnicalError />}
                {isLoading || isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data ? (
                    <>
                        <TextEditor
                            blogData={data}
                        // onSubmit={() => {
                        //     onSubmit()
                        // }}
                        />
                    </>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Blog(s)!'}
                            description={'You have no blog(s) yet.'}
                            height={'50vh'}
                        />
                    )
                )}
            </div>
        </Card>
    )
}

EditBlog.getLayout = (page: ReactElement) => {
    return <ManagementLayout>{page}</ManagementLayout>
}

export default EditBlog
