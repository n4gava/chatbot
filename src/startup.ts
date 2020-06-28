import "reflect-metadata";
import { container } from "tsyringe";
import WhatsAppClient from "./chatBot.client.whatsapp/whatsapp.client";
import { ChatBotClient } from "./chatBot.client/client.types";
import { ChatBotQrode } from "./chatBot.qrcode/qrcode.types";
import QrcodeService from "./chatBot.qrcode/qrcode.service";
import { ChatBotFileSystem } from "./chatBot.fileSystem/fileSystem.types";
import FileSystem from "./chatBot.fileSystem/fileSystem";
import GreetingMessage from "./greetingMessage";

export default class Startup {
	public Configure(): void {
		this.registerServices();
		this.registerMessagesHandlers();
	}

	public Run(): void {
		const botClient = container.resolve<ChatBotClient.IBotClient>("IBotClient");
		botClient.initialize();
	}

	private registerMessagesHandlers = (): void => {
		const messagesHandlers: any[] = [];
		messagesHandlers.push(GreetingMessage);

		messagesHandlers.map((handler) => {
			container.register<ChatBotClient.IMessageHandler>("IMessageHandler", {
				useClass: handler,
			});
		});
	};

	private registerServices = (): void => {
		container.register<ChatBotClient.IBotClient>("IBotClient", {
			useClass: WhatsAppClient,
		});

		container.register<ChatBotQrode.IQrcodeService>("IQrcodeService", {
			useClass: QrcodeService,
		});

		container.register<ChatBotFileSystem.IFileSystem>("IFileSystem", {
			useValue: new FileSystem("data"),
		});
	};
}
