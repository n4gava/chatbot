import {
	Client,
	ClientOptions,
	ClientSession,
	Message,
	LocalAuth,
	MessageTypes,
} from "whatsapp-web.js";
import { injectAll, injectable, inject } from "tsyringe";
import { ChatBotClient } from "../chatBot.client/client.types";
import BaseBotClient from "../chatBot.client/client.abstract";
import { ChatBotQrode } from "../chatBot.qrcode/qrcode.types";
import { ChatBotFileSystem } from "../chatBot.fileSystem/fileSystem.types";

@injectable()
export default class WhatsAppClient extends BaseBotClient {
	private _client: Client;
	private _sessionFile: string = "session.data";

	public OnQrCodeGenerated = () => {};

	constructor(
		@injectAll("IMessageHandler")
		receiveMessagesHandler: ChatBotClient.IMessageHandler[],
		@inject("IQrcodeService")
		private qrcodeService: ChatBotQrode.IQrcodeService,
		@inject("IFileSystem") private fileSystem: ChatBotFileSystem.IFileSystem
	) {
		super(receiveMessagesHandler);

		const options: ClientOptions = {};
		options.authStrategy = new LocalAuth({ clientId: "client-one" });
		this._client = new Client(options);
	}

	public sendMessage(to: string, message: string): void {
		this._client.sendMessage(to, message, {});
	}

	public initialize = (): void => {
		this._client.on("qr", this.handleOnQr);
		this._client.on("ready", this.handleOnReady);
		//this._client.on("message", this.handleOnReceiveMessage);
		this._client.on("message_create", this.handleOnReceiveMessage);
		this._client.on("authenticated", this.handleOnAuthenticated);

		this._client.initialize();
	};

	private handleOnQr = (qr: string) => {
		this.qrcodeService.generateQrcode(qr);
	};

	private handleOnReady = () => {
		console.log("Whatsapp is ready");
	};

	private handleOnAuthenticated = (clientSession: ClientSession) => {};

	private handleOnReceiveMessage = async (msg: Message) => {
		const contact = await msg.getContact();
		const chat = await msg.getChat();

		const message: ChatBotClient.Message = {
			senderId: msg.author ?? msg.from,
			groupId: msg.from,
			groupName: chat.name,
			senderName:
				contact.name ?? contact.pushname ?? msg.author ?? msg.from,
			hasMedia: msg.hasMedia,
			text: msg.body,
			fromMe: msg.fromMe,
			isGroup: chat.isGroup,
			knowContact: !!contact.name,
			type:
				msg.type === MessageTypes.TEXT
					? "chat"
					: msg.type === MessageTypes.VOICE
					? "voice"
					: msg.type === MessageTypes.IMAGE
					? "image"
					: msg.type === MessageTypes.VIDEO
					? "video"
					: "other",
		};

		this.receiveMessageHandler(message);
	};
}
