import { Client, ClientOptions, ClientSession, Message } from "whatsapp-web.js";
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
		@injectAll("IMessageHandler") receiveMessagesHandler: ChatBotClient.IMessageHandler[],
		@inject("IQrcodeService") private qrcodeService: ChatBotQrode.IQrcodeService,
		@inject("IFileSystem") private fileSystem: ChatBotFileSystem.IFileSystem
	) {
		super(receiveMessagesHandler);

		const options: ClientOptions = {};
		options.session = this.loadCurrentSession();
		this._client = new Client(options);
	}

	public sendMessage(to: string, message: string): void {
		this._client.sendMessage(to, message, {});
	}

	public initialize = (): void => {
		this._client.on("qr", this.handleOnQr);
		this._client.on("ready", this.handleOnReady);
		this._client.on("message", this.handleOnReceiveMessage);
		this._client.on("authenticated", this.handleOnAuthenticated);

		this._client.initialize();
	};

	private handleOnQr = (qr: string) => {
		this.qrcodeService.generateQrcode(qr);
	};

	private handleOnReady = () => {
		console.log("Whatsapp is ready");
	};

	private handleOnAuthenticated = (clientSession: ClientSession) => {
		this.saveCurrentSession(clientSession);
	};

	private handleOnReceiveMessage = (msg: Message) => {
		this.receiveMessageHandler(msg.from, msg.body);
	};

	private loadCurrentSession = (): ClientSession | undefined => {
		const session = this.fileSystem.readFile(this._sessionFile);
		return session ? (JSON.parse(session) as ClientSession) : undefined;
	};

	private saveCurrentSession = (clientSession: ClientSession) => {
		const fileData = JSON.stringify(clientSession);
		this.fileSystem.writeFile(this._sessionFile, fileData);
	};
}
