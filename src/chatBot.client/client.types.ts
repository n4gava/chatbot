export namespace ChatBotClient {
	export interface IBotClient {
		initialize(): void;

		sendMessage(to: string, message: string): void;
	}

	export interface IMessageHandler {
		shouldHandle(message: Message, client: IBotClient): boolean;

		handle(message: Message, client: IBotClient): void;
	}

	export interface Message {
		text: string;
		senderId: string;
		groupId: string;
		senderName: string;
		groupName: string;
		type: "chat" | "voice" | "image" | "video" | "other";
		hasMedia: boolean;
		isGroup: boolean;
		fromMe: boolean;
		knowContact: boolean;
	}
}
