import { ChatBotClient } from "./chatBot.client/client.types";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { injectAll, injectable, inject } from "tsyringe";
import ConversationsStore, {
	Conversation,
	IConversationsStore,
} from "./conversationsStore";

@injectable()
export default class AssistantChatBot implements ChatBotClient.IMessageHandler {
	openai: OpenAIApi;
	conversationStore: IConversationsStore;
	myNumber: string = process.env.PHONE ?? "";
	myNumberId: string = this.myNumber + "@c.us";

	constructor() {
		this.conversationStore = new ConversationsStore();
		const configuration = new Configuration({
			apiKey: process.env.OPENAPI_KEY,
		});
		this.openai = new OpenAIApi(configuration);
	}

	shouldHandle(
		message: ChatBotClient.Message,
		client: ChatBotClient.IBotClient
	): boolean {
		const shouldHandle = !message.isGroup && !message.knowContact;

		return (
			shouldHandle ||
			message.senderName === "Bárbara Amor" ||
			message.senderName === "Joao Carlos Joju" ||
			message.senderName === "Joao Joju Joju"
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
			message.fromMe
		);

		this.conversationStore.replyGroup(message.groupName, 5000, (c) =>
			this.replyMessages(c, message, client)
		);
	}

	async replyMessages(
		conversation: Conversation,
		message: ChatBotClient.Message,
		client: ChatBotClient.IBotClient
	): Promise<void> {
		const systemInfos: string[] = [];
		systemInfos.push(
			"Vocé é um chatbot para um aplicativo de mensageria de textos curtos e direto."
		);
		systemInfos.push("Seu nome é Guilherme Gavazzoni");
		systemInfos.push("Não deve dizer que é um chatbot ou assistente.");
		systemInfos.push(
			"Você é um arquiteto de software e possui uma software house chamada Codeed. "
		);
		systemInfos.push(
			"Você tem um projeto em andamento chamado Codeed Meta. É uma plataforma no metaverso para realizar eventos hibridos ou online"
		);
		systemInfos.push(
			"O Codeed Meta está em fase de desenvolvimento e validação e não possui preço definido ainda."
		);
		systemInfos.push(
			"Caso esteja interessado entrar em contato pelo email guilherme.gavazzoni@outlook.com"
		);
		systemInfos.push("Você não pode ajudar com outros assuntos");
		systemInfos.push("Você é objetivo nas respostas");

		const system = systemInfos.join("\n");

		conversation.chat = conversation.chat.splice(-20);

		const messages: ChatCompletionRequestMessage[] = [
			{
				content: system,
				role: "system",
			},
		];

		conversation.chat.map((c) => {
			messages.push({
				content: c.text,
				role: c.fromMe ? "assistant" : "user",
			});
		});

		const response = await this.openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: messages,
			temperature: 0.3,
			max_tokens: 200,
		});

		const messageText = response.data.choices[0].message?.content ?? "";

		messageText
			.split(". ")
			.filter((m) => !!m)
			.map((m) => m.trim())
			.map((m) => {
				this.conversationStore.addMessage(
					message.groupName,
					"bot",
					m,
					true
				);
				client.sendMessage(message.senderId, m);
			});
	}
}
