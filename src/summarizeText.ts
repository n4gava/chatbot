import { ChatBotClient } from "./chatBot.client/client.types";
import { Configuration, OpenAIApi } from "openai";
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
		return message.type === "chat" && message.groupId === this.myNumberId;
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
		let prompt =
			"Converter a conversa em um resumo de primeira mão em portugues:\n\n";

		const conversation = this.conversationStore.getConversation(group);

		conversation.map((message) => {
			prompt += message.fromName + ":" + message.text + "\n";
		});

		const response = await this.openai.createCompletion({
			model: "text-davinci-002",
			prompt: prompt + "\n\n",
			temperature: 0,
			max_tokens: 500,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		return response.data.choices[0].text?.trimStart() ?? "";
	}
}
