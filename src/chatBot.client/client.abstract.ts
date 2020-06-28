import { ChatBotClient } from "./client.types";

export default abstract class ClientAbstract implements ChatBotClient.IBotClient {
	constructor(protected receiveMessagesHandler: ChatBotClient.IMessageHandler[]) {}

	public abstract initialize(): void;

	public abstract sendMessage(to: string, message: string): void;

	public receiveMessageHandler = (from: string, message: string): void => {
		this.receiveMessagesHandler.map((msgHandler) => {
			if (msgHandler.shouldReply(from, message, this)) {
				msgHandler.replyMessage(from, message, this);
			}
		});
	};
}
