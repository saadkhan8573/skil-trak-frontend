import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { Note, PaginatedResponse } from '@types'
import { io } from 'socket.io-client'

enum ChatEvent {
    SendMessage = 'send_message',
    RequestAllMessages = 'mailNotification',
    SendAllMessages = 'mailNotification',
    ReceiveMessage = 'mailNotification',
}

let socket: any
function getSocket() {
    if (!socket) {
        socket = io('ws://192.168.1.13:8000', {
            withCredentials: true,
        })
    }
    return socket
}

const PREFIX = 'messaging'
export const mailsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getMessages: builder.query<any, any>({
        query: (params) => {
            return {
                url: `admin/mail/list/${params.id}`,
                params,
            }
        },
        async onCacheEntryAdded(
            photoId,
            { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
        ) {
            try {
                await cacheDataLoaded

                const socket = io('ws://192.168.1.13:8000', {
                    withCredentials: true,
                })

                socket.on('join', () => {
                    socket.emit(ChatEvent.RequestAllMessages)
                })

                socket.on(ChatEvent.SendAllMessages, (messages: any) => {
                    updateCachedData((draft) => {
                        draft.splice(0, draft.length, ...messages)
                    })
                })

                socket.on(ChatEvent.ReceiveMessage, (message: any) => {
                    updateCachedData((draft) => {
                        draft.push(message)
                    })
                })

                await cacheEntryRemoved

                socket.off('join')
                socket.off(ChatEvent.SendAllMessages)
                socket.off(ChatEvent.ReceiveMessage)
            } catch {
                // if cacheEntryRemoved resolved before cacheDataLoaded,
                // cacheDataLoaded throws
            }
        },
        providesTags: ['Mails'],
    }),
    getMailDetail: builder.query<any, any>({
        query: (id) => `${PREFIX}/detail/${id}`,
        providesTags: ['Mails'],
    }),
    sendMessage: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}/send`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Mails'],
    }),

    createNewDraft: builder.mutation({
        query: (body) => ({
            url: `templates`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Mails'],
    }),
    removeDraft: builder.mutation({
        query: (id) => ({
            url: `templates/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Mails'],
    }),
    removeMail: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/delete/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Mails'],
    }),
    removeMultipleMail: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}/delete/multiple`,
            body,
            method: 'DELETE',
        }),
        invalidatesTags: ['Mails'],
    }),
    sendBulkMail: builder.mutation<any, any>({
        query: (body) => ({
            url: `shared/bulk/send`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Mails'],
    }),

    sendCustomEmail: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}/mail/send`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Mails', 'AllCommunications'],
    }),

    getAllMails: builder.query<any, void>({
        query: () => `${PREFIX}/list/all`,
        providesTags: ['Mails'],
    }),
    getRecentMails: builder.query<any, void>({
        query: () => `${PREFIX}/list/recent`,
        providesTags: ['MailsRecent'],
    }),
    countUnreadMessage: builder.query<any, void>({
        query: () => `${PREFIX}/unread/count`,
        providesTags: ['MailCount'],
    }),
    isSeen: builder.mutation({
        query: (id: any) => ({
            url: `${PREFIX}/seen/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Mails'],
    }),
    multiplesMailsSeen: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}/seen/multiple`,
            body,
            method: 'PATCH',
        }),
        invalidatesTags: ['Mails'],
    }),
    getAllConversations: builder.query<
        any,
        { status?: string | undefined; skip: number; limit: number }
    >({
        query: (params) => ({
            url: `${PREFIX}/conversations/list`,
            params,
        }),
        providesTags: ['Mails'],
    }),
    getUsersAllMail: builder.query<
        any,
        {
            search?: string | undefined
            status?: string | undefined
            skip: number
            limit: number
            type?: 'sender' | 'receiver'
        }
    >({
        query: (params) => ({
            url: `${PREFIX}/conversations/list/by-type`,
            params,
        }),
        providesTags: ['Mails'],
    }),
    getSingleChat: builder.query<
        any,
        { id: number; limit: number; skip: number }
    >({
        query: ({ id, ...params }: any) => ({
            url: `${PREFIX}/conversation/view/${id}`,
            params,
        }),
        providesTags: ['Mails'],
    }),
    getAllMailsList: builder.query<
        any,
        { status?: string | undefined; skip: number; limit: number }
    >({
        query: (params) => ({
            url: `${PREFIX}`,
            params,
        }),
        providesTags: ['Mails'],
        serializeQueryArgs: ({ endpointName }) => endpointName,
        transformResponse: (responseData) => responseData,
        merge: (currentCache, newData) => {
            if (!currentCache) {
                return newData
            }
            return {
                data: [...currentCache?.data, ...newData?.data],
                pagination: newData?.pagination,
            }
        },
        forceRefetch({ currentArg, previousArg }) {
            return currentArg !== previousArg
        },
    }),
    getAllSentMailsList: builder.query<
        any,
        { status?: string | undefined; skip: number; limit: number }
    >({
        query: (params) => ({
            url: `${PREFIX}/list/sended`,
            params,
        }),
        providesTags: ['Mails'],
    }),
    getMailsByStatus: builder.query<PaginatedResponse<any>, any>({
        query: (params) => {
            return {
                url: `${PREFIX}/list/by-status`,
                params,
            }
        },
        providesTags: ['Mails'],
    }),
    getAllTemplates: builder.query<any, void>({
        query: () => `templates`,
        providesTags: ['Mails'],
    }),
    getTemplate: builder.query<any, any>({
        query: (id) => `templates/${id}`,
        providesTags: ['Mails'],
    }),
    updateEmailDraft: builder.mutation({
        query: ({ body, id }: any) => ({
            url: `templates/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Mails'],
    }),
    searchBulkMailStudents: builder.query<any, any>({
        query: (params) => ({
            url: `shared/students/list`,
            params,
        }),
        providesTags: ['Mails'],
    }),

    searchAllPortalStudents: builder.query<any, any>({
        query: (params) => ({
            url: `shared/students/list-for-invoices`,
            params,
        }),
        providesTags: ['Mails'],
    }),

    searchBulkMailSubadminStudents: builder.query<any, any>({
        query: (params) => ({
            url: `subadmin/bulk-email/students/list`,
            params,
        }),
        providesTags: ['Mails'],
    }),

    searchBulkMailSubadminRTOs: builder.query<any, any>({
        query: (params) => ({
            url: `subadmin/bulk-email/rtos/list`,
            params,
        }),
        providesTags: ['Mails'],
    }),

    // sendMessage: builder.mutation<any, any>({
    //     queryFn: (chatMessageContent: string) => {
    //         const socket = getSocket()
    //         return new Promise((resolve) => {
    //             socket.emit(
    //                 ChatEvent.SendMessage,
    //                 `${PREFIX}/email`,
    //                 (message: any) => {
    //                     resolve({ data: message })
    //                 }
    //             )
    //         })
    //     },
    // }),
})
