import { ChatBotQrode } from "./qrcode.types";
import qrcodeTerminal from "qrcode-terminal";
import nodemailer from "nodemailer";
import qrcode from "qrcode";
import os from "os";
import path from 'path';

export default class QrcodeService implements ChatBotQrode.IQrcodeService {

	private qrCodePath = path.join(os.tmpdir(), "qrcode.png")

	generateQrcode(qr: string) {
		qrcodeTerminal.generate(qr, { small: true });

		qrcode.toFile(this.qrCodePath, qr, (err) => {
			if (err) throw err;

			this.sendMail();
		});
	}

	private sendMail() {
		if (!process.env.OUTLOOK_USER) {
			console.log("E-mail não configurado");
			return;
		}

		let transporter = nodemailer.createTransport({
			host: "smtp-mail.outlook.com",
			secureConnection: false, // TLS requires secureConnection to be false
			port: 587, // port for secure SMTP
			tls: {
				ciphers: "SSLv3",
			},
			auth: {
				user: process.env.OUTLOOK_USER,
				pass: process.env.OUTLOOK_PASS,
			},
		});
		
		let mailOptions = {
			from: process.env.OUTLOOK_USER,
			to: "guilherme.gavazzoni@outlook.com",
			subject: "Whatsappp QrCode",
			text: "Realize a leitura do qr code pelo whatsapp",
			attachments: [
				{
					filename: this.qrCodePath,
					path: this.qrCodePath,
				},
			],
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log("Message sent: %s", info.messageId);
			}
		});
	}
}
