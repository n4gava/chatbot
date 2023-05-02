import { injectable } from "tsyringe";

export interface Conversation {
	name: string;
	chat: ConversationChat[];
	replyTimeout?: NodeJS.Timeout;
}

export interface ConversationChat {
	fromName: string;
	text: string;
	date: Date;
	fromMe: boolean;
}

export interface IConversationsStore {
	addMessage(
		group: string,
		from: string,
		message: string,
		fromMe: boolean
	): void;
	clear(group: string): void;
	getConversation(group: string): ConversationChat[];
	getGroups(): string[];
	replyGroup(
		group: string,
		ms: number,
		callback: (conversation: Conversation) => void
	);
}

@injectable()
export default class ConversationsStore implements IConversationsStore {
	conversations: Conversation[];

	constructor() {
		this.conversations = [];
	}

	public getGroups(): string[] {
		return this.conversations.map((c) => c.name);
	}

	public addMessage(
		group: string,
		from: string,
		message: string,
		fromMe: boolean
	): void {
		const conversation = this.getConversationByGroup(group);

		conversation.chat.push({
			fromName: from,
			text: message,
			date: new Date(),
			fromMe: fromMe,
		});
	}

	public replyGroup(
		group: string,
		ms: number,
		callback: (conversation: Conversation) => void
	) {
		const conversation = this.getConversationByGroup(group);
		if (!conversation) return;

		if (conversation.replyTimeout) {
			console.log("clean timeout");
			clearTimeout(conversation.replyTimeout);
		}

		conversation.replyTimeout = setTimeout(() => {
			conversation.replyTimeout = undefined;
			callback(conversation);
		}, ms);
	}

	public clear(group: string): void {
		const conversation = this.getConversationByGroup(group);
		conversation.chat = [];
	}

	public getConversation(group: string): ConversationChat[] {
		const conversation = this.getConversationByGroup(group);
		return conversation.chat;
	}

	private getConversationByGroup(group: string): Conversation {
		let conversation = this.conversations.find((c) => c.name == group);

		if (!conversation) {
			conversation = {
				name: group,
				chat: [],
			};
			this.conversations.push(conversation);
		}

		return conversation;
	}
}
