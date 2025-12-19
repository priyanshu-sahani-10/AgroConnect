
import express from "express";
import {
    startConversation,
  getAllConversations,
  getMessages,
  sendMessage,
  deleteConversation,
} from "../controllers/chat.controllers.js";

const chatRouter = express.Router();


chatRouter.route("/start").post(startConversation);
chatRouter.route("/list").get(getAllConversations);
chatRouter.route("/:conversationId/messages").get(getMessages);
chatRouter.route("/:conversationId/message").post(sendMessage);
chatRouter.route("/:conversationId").delete( deleteConversation);

export default chatRouter;