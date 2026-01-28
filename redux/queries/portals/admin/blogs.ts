import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'blogs'
export const blogsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    createBlog: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Blog', 'BlogCategories'],
    }),
    addBlogTags: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/tag`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Blog'],
    }),
    addBlogCategories: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/category`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['BlogCategories', 'Blog'],
    }),
    deleteBlogCategory: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/category/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['BlogCategories', 'Blog'],
    }),
    getBlogs: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}`,
            params,
        }),
        providesTags: ['Blog'],
    }),
    getBlogsCount: builder.query<any, { search: string }>({
        query: (params) => ({
            url: `${PREFIX}/count`,
            params,
        }),
        providesTags: ['Blog'],
    }),
    getFeaturedBlogs: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/featured`,
            params,
        }),
        providesTags: ['Blog'],
    }),
    getTags: builder.query<any, void>({
        query: () => `${PREFIX}/tag`,
        providesTags: ['Tags'],
    }),
    getCategories: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/category`,
            params,
        }),
        providesTags: ['Blog', 'BlogCategories'],
    }),
    getBlogDetail: builder.query<any, any>({
        query: (id) => `${PREFIX}/slug/${id}`,
        providesTags: ['Blog'],
    }),
    removeBlog: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Blog'],
    }),
    removeFaq: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/question/${id}/remove`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Blog'],
    }),
    bulkRemoveBlog: builder.mutation({
        query: (ids) => ({
            url: `${PREFIX}/remove/multiple`,
            method: 'DELETE',
            body: { ids: ids },
            // ids: [1,2,3]
        }),
        invalidatesTags: ['Blog'],
    }),
    bulkDeleteBlogCategories: builder.mutation({
        query: (ids) => ({
            url: `${PREFIX}/categories/remove`,
            method: 'DELETE',
            body: { ids },
        }),
        invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<any, { id: any; body: any }>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Blog'],
    }),

    uploadImage: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/files/upload`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Upload-Blog-Image'],
    }),
})
