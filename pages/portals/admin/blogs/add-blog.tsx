import { ReactElement, useEffect, useState } from 'react'

import { useContextBar, useNavbar } from '@hooks'
import { AdminLayout } from '@layouts'
import { NextPageWithLayout } from '@types'
import { BlogContextBar } from '@partials/admin/blog'
import { adminApi } from '@queries'
import dynamic from 'next/dynamic'
const TextEditor = dynamic(
    () => import('../../../../partials/admin/blog/TextEditor'),
    { ssr: false }
)
const AddBlog: NextPageWithLayout = () => {
    const [tagIds, setTagIds] = useState<any[]>([])
    const [categoryIds, setCategoryIds] = useState<any[]>([])
    const contextBar = useContextBar()

    const [addTags, addTagsResult] = adminApi.useAddBlogTagsMutation()
    const [addCategories, addCategoriesResult] =
        adminApi.useAddBlogCategoriesMutation()
    const { data } = adminApi.useGetTagsQuery()

    // get array of ids of data
    const newTagId = addTagsResult?.data?.id
    const newCategoryId = addCategoriesResult?.data?.id

    useEffect(() => {
        if (newTagId) {
            setTagIds((prevTagIds: any[]) => [...prevTagIds, newTagId])
        }
    }, [newTagId])

    useEffect(() => {
        if (newCategoryId) {
            setCategoryIds((prevCatIds: any[]) => [
                ...prevCatIds,
                newCategoryId,
            ])
        }
    }, [categoryIds])

    const navBar = useNavbar()
    useEffect(() => {
        navBar.setTitle('add blog')
    }, [])

    useEffect(() => {
        contextBar.setContent(
            <BlogContextBar
                addTags={addTags}
                data={data}
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
        <div className="p-6">
            <TextEditor tagIds={tagIds} />
        </div>
    )
}

AddBlog.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default AddBlog
