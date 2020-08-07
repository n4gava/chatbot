# Chatbot (Whatsapp bot)
Simple chatbot that replies messages. 

Currently, there is only one whatsapp client implementation using [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)

## Quick Start

First of all, you will need node 10.12.0 or newer because this project uses recursive option for creating directories.

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

## How implement new IMessageHandler

The project contains a single message handler that replies "oi" messages.

For creating a new handler, first of all, create a new class that inherits `ChatBotClient.IMessageHandler`

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

After that, you have to register it on container in `Startup.ts` file.

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
