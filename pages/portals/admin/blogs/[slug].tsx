import { ReactElement, useEffect } from 'react'

import {
    EmptyData,
    LoadingAnimation,
    TechnicalError
} from '@components'
import { useContextBar, useNavbar } from '@hooks'
import { AdminLayout } from '@layouts'
import { NextPageWithLayout } from '@types'
import { BlogContextBar } from '@partials/admin/blog'
import { adminApi } from '@queries'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const EditBlog: NextPageWithLayout = () => {
    const contextBar = useContextBar()
    const router = useRouter()
    const blogId = router?.query?.slug as string
    const TextEditor = dynamic(
        () => import('../../../../partials/admin/blog/EditTextEditor'),
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

    // const onSubmit: any = (data: any, publish: boolean) => {
    //     const content = quillRef.current.getEditor().root.innerHTML

    //     const values = {
    //         featuredImage: data.featuredImage?.[0],
    //         title: data.title,
    //         content,
    //         isPublished: publish.toString(),
    //         isFeatured: isFeatured.toString(),
    //         tags: tagIds,
    //         category: data?.category,
    //     }

    //     const formData = new FormData()

    //     Object.entries(values).forEach(([key, value]: any) => {
    //         formData.append(key, value)
    //     })

    //     // formData.append('featuredImage', data.featuredImage?.[0])
    //     // formData.append('title', data.title)
    //     // formData.append('content', content)
    //     // formData.append('isPublished', publish.toString())
    //     // formData.append('isFeatured', isFeatured.toString())
    //     // formData.append('tags', tagIds)
    //     // formData.append('category', data?.category)

    //     updateBlog({ id: blogData?.id, body: formData })
    // }
    return (
        <div className="p-6">
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
    )
}

EditBlog.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default EditBlog
