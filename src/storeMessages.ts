import { ChatBotClient } from "./chatBot.client/client.types";
import { injectAll, injectable, inject } from "tsyringe";
import { IConversationsStore } from "./conversationsStore";

@injectable()
export default class StoreMessages implements ChatBotClient.IMessageHandler {
	conversationStore: IConversationsStore;
	myNumber: string = process.env.PHONE ?? "";
	myNumberId: string = this.myNumber + "@c.us";

	constructor(
		@inject("IConversationsStore")
		conversationStore: IConversationsStore
	) {
		this.conversationStore = conversationStore;
	}

	shouldHandle(
		message: ChatBotClient.Message,
		client: ChatBotClient.IBotClient
	): boolean {
		return (
			message.type === "chat" &&
			!!message.text &&
			message.groupId !== this.myNumberId &&
			!!message.groupName.trimStart()
		);
	}

	handle(
		message: ChatBotClient.Message,
		client: ChatBotClient.IBotClient
	): void {
		this.conversationStore.addMessage(
			message.groupName,
			message.senderName,
			message.text,
			false
		);
	}
}
