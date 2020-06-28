import { ChatBotClient } from "./chatBot.client/client.types";

export default class GreetingMessage implements ChatBotClient.IMessageHandler {
	shouldReply(from: string, message: string, client: ChatBotClient.IBotClient): boolean {
		return message.toUpperCase() === "OI";
	}
	replyMessage(from: string, message: string, client: ChatBotClient.IBotClient): void {
		client.sendMessage(from, "Olá");
	}
}
