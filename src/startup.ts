import "reflect-metadata";
import { container } from "tsyringe";
import WhatsAppClient from "./chatBot.client.whatsapp/whatsapp.client";
import { ChatBotClient } from "./chatBot.client/client.types";
import { ChatBotQrode } from "./chatBot.qrcode/qrcode.types";
import QrcodeService from "./chatBot.qrcode/qrcode.service";
import { ChatBotFileSystem } from "./chatBot.fileSystem/fileSystem.types";
import FileSystem from "./chatBot.fileSystem/fileSystem";
import SummarizeText from "./summarizeText";
import ConversationsStore, { IConversationsStore } from "./conversationsStore";
import StoreMessages from "./storeMessages";
import AssistantChatBot from "./assistantChatBot";

export default class Startup {
	public Configure(): void {
		require("dotenv").config();
		this.registerServices();
		this.registerMessagesHandlers();
	}

	public Run(): void {
		const botClient =
			container.resolve<ChatBotClient.IBotClient>("IBotClient");
		botClient.initialize();
	}

	private registerMessagesHandlers = (): void => {
		const messagesHandlers: any[] = [];
		//messagesHandlers.push(SummarizeText);
		//messagesHandlers.push(StoreMessages);
		messagesHandlers.push(AssistantChatBot);

		messagesHandlers.map((handler) => {
			container.register<ChatBotClient.IMessageHandler>(
				"IMessageHandler",
				{
					useClass: handler,
				}
			);
		});
	};

	private registerServices = (): void => {
		container.register<ChatBotClient.IBotClient>("IBotClient", {
			useClass: WhatsAppClient,
		});

		const teste = new ConversationsStore();
		container.register<IConversationsStore>("IConversationsStore", {
			useValue: teste,
		});

		var teste2 = container.resolve<IConversationsStore>(
			"IConversationsStore"
		);

		container.register<ChatBotQrode.IQrcodeService>("IQrcodeService", {
			useClass: QrcodeService,
		});

		container.register<ChatBotFileSystem.IFileSystem>("IFileSystem", {
			useValue: new FileSystem("data"),
		});
	};
}
