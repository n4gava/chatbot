import { ChatBotQrode } from "./qrcode.types";
import qrcodeTerminal from "qrcode-terminal";
import nodemailer from "nodemailer";
import qrcode from "qrcode";

export default class QrcodeService implements ChatBotQrode.IQrcodeService {
	generateQrcode(qr: string) {
		qrcodeTerminal.generate(qr, { small: true });

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

		qrcode.toFile("qrcode.png", qr, (err) => {
			if (err) throw err;

			let mailOptions = {
				from: process.env.OUTLOOK_USER,
				to: "guilherme.gavazzoni@outlook.com",
				subject: "Whatsappp QrCode",
				text: "Realize a leitura do qr code pelo whatsapp",
				attachments: [
					{
						filename: "qrcode.png",
						path: "qrcode.png",
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
		});
	}
}
