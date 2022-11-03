import { injectable } from "tsyringe";

interface Conversation {
	name: string;
	chat: ConversationChat[];
}

interface ConversationChat {
	fromName: string;
	text: string;
	date: Date;
}

export interface IConversationsStore {
	addMessage(group: string, from: string, message: string): void;
	clear(group: string): void;
	getConversation(group: string): ConversationChat[];
	getGroups(): string[];
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

	public addMessage(group: string, from: string, message: string): void {
		const conversation = this.getConversationByGroup(group);

		conversation.chat.push({
			fromName: from,
			text: message,
			date: new Date(),
		});
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
