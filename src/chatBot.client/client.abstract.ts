import { ChatBotClient } from "./client.types";

export default abstract class ClientAbstract
	implements ChatBotClient.IBotClient
{
	constructor(
		protected receiveMessagesHandler: ChatBotClient.IMessageHandler[]
	) {}

	public abstract initialize(): void;

	public abstract sendMessage(to: string, message: string): void;

	public receiveMessageHandler = (message: ChatBotClient.Message): void => {
		this.receiveMessagesHandler.map((msgHandler) => {
			if (msgHandler.shouldHandle(message, this)) {
				msgHandler.handle(message, this);
			}
		});
	};
}
