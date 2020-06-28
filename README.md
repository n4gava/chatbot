# Chatbot (Whatsapp bot)
Simple chatbot that reply messages. 
There is currently only a whatsapp client implementation using [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)

## Quick Start

First of all, you will need node 10.12.0 or newest because this project use recursive option for create directories.
After that, just run the following commands:

```
npm install
npm start
```

**or**

```
yarn install
yarn start
```

## How implement news IMessageHandler

The project contains a single message handler that reply "oi" messages.
For create a new handler, first of all, create a new class that inherit `ChatBotClient.IMessageHandler`

```javascript
import { ChatBotClient } from "./chatBot.client/client.types";

export default class replyAllMessages implements ChatBotClient.IMessageHandler {
  
	// this method will check if this handler will reply the message
	shouldReply(from: string, message: string, client: ChatBotClient.IBotClient): boolean {
		return true;
	}
  
	// reply the message
	replyMessage(from: string, message: string, client: ChatBotClient.IBotClient): void {
		client.sendMessage(from, `you sent ${message}`);
	}
}
```

After, you will need register it on container in `Startup.ts`file.

```javascript
  { ... }
  
	private registerMessagesHandlers = (): void => {
		const messagesHandlers: any[] = [];
		messagesHandlers.push(GreetingMessage);
    

		// register my handler on container
    		messagesHandlers.push(replyAllMessages);
		messagesHandlers.map((handler) => {
			container.register<ChatBotClient.IMessageHandler>("IMessageHandler", {
				useClass: handler,
			});
		});
	};
  
  { ... }
```
