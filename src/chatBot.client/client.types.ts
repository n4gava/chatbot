export namespace ChatBotClient {
	export interface IBotClient {
		initialize(): void;

		sendMessage(to: string, message: string): void;
	}

	export interface IMessageHandler {
		shouldReply(from: string, message: string, client: IBotClient): boolean;

		replyMessage(from: string, message: string, client: IBotClient): void;
	}
}
