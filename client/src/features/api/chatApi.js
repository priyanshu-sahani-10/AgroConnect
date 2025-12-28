import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/v1/chat`,
    credentials: "include",
  }),
  tagTypes: ["Conversations", "Messages"],
  endpoints: (builder) => ({
    // Start or get conversation
    startConversation: builder.mutation({
      query: ({otherUserId}) => ({
        url: "/start",
        method: "POST",
        body: { otherUserId },
      }),
      invalidatesTags: ["Conversations"],
    }),

    // Get all conversations
    getAllConversations: builder.query({
      query: () => "/list",
      providesTags: ["Conversations"],
    }),

    // Get messages in conversation
    getMessages: builder.query({
      query: ({ conversationId, page = 1, limit = 50 }) =>
        `/${conversationId}/messages?page=${page}&limit=${limit}`,
      providesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    // Send message (not used with socket, but good for fallback)
    sendMessage: builder.mutation({
      query: ({ conversationId, text, relatedOrderId, relatedCropId }) => ({
        url: `/${conversationId}/message`,
        method: "POST",
        body: { text, relatedOrderId, relatedCropId },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        "Conversations",
        { type: "Messages", id: conversationId },
      ],
    }),

    // Delete conversation
    deleteConversation: builder.mutation({
      query: (conversationId) => ({
        url: `/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversations"],
    }),
  }),
});

export const {
  useStartConversationMutation,
  useGetAllConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteConversationMutation,
} = chatApi;
