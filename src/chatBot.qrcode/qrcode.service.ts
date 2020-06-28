import { ChatBotQrode } from "./qrcode.types";
import qrcode from "qrcode-terminal";

export default class QrcodeService implements ChatBotQrode.IQrcodeService {
	generateQrcode(qr: string) {
		qrcode.generate(qr, { small: true });
	}
}
