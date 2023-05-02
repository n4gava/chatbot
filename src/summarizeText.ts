import { ChatBotClient } from "./chatBot.client/client.types";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { injectAll, injectable, inject } from "tsyringe";
import { IConversationsStore } from "./conversationsStore";

@injectable()
export default class SummarizeText implements ChatBotClient.IMessageHandler {
	openai: OpenAIApi;
	conversationStore: IConversationsStore;
	myNumber: string = process.env.PHONE ?? "";
	myNumberId: string = this.myNumber + "@c.us";

	constructor(
		@inject("IConversationsStore")
		conversationStore: IConversationsStore
	) {
		this.conversationStore = conversationStore;
		const configuration = new Configuration({
			apiKey: process.env.OPENAPI_KEY,
		});
		this.openai = new OpenAIApi(configuration);
	}

	shouldHandle(
		message: ChatBotClient.Message,
		client: ChatBotClient.IBotClient
	): boolean {
		const handle =
			message.type === "chat" && message.groupId === this.myNumberId;
		return handle;
	}

	handle(
		message: ChatBotClient.Message,
		client: ChatBotClient.IBotClient
	): void {
		if (
			message.text.toUpperCase() == "RESUMIR" ||
			message.text.toUpperCase() == "RESUMO"
		) {
			this.sendSummarize(client);
		}
	}

	async sendSummarize(client: ChatBotClient.IBotClient): Promise<void> {
		const groups = this.conversationStore.getGroups();
		await groups.map(async (group) => {
			const summary = await this.summarize(group);
			client.sendMessage(this.myNumberId, `Resumo do grupo ${group}:`);
			client.sendMessage(this.myNumberId, summary);
			this.conversationStore.clear(group);
		});
	}

	async summarize(group: string): Promise<string> {
		const conversation = this.conversationStore.getConversation(group);

		const messages: ChatCompletionRequestMessage[] = conversation.map(
			(c) => {
				return {
					content: c.fromName + ":" + c.text,
					role: "user",
				};
			}
		);

		messages.push({
			content: "Resuma a conversa entre os usuários acima",
			role: "user",
		});

		messages.push({
			content:
				"Você é um assistente que resume as mensagens da conversa, dando ênfase para os tópicos mais importantes.",
			role: "system",
		});

		const response = await this.openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: messages,
			temperature: 0.3,
			max_tokens: 1000,
		});
		return response.data.choices[0].message?.content ?? "";
	}
}
