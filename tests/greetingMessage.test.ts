import test from "tape";
import GreetingMessage from "../src/greetingMessage";
import { ChatBotClient } from "../src/chatBot.client/client.types";
import { Mock, It, Times, ExpectedGetPropertyExpression } from "moq.ts";

test("should_reply_if_message_is_oi", (t) => {
	// arrange
	const greetingMessage = new GreetingMessage();
	const from = "123";
	const mockClient = new Mock<ChatBotClient.IBotClient>({});
	// @ts-ignore
	// act
	var shouldReply = greetingMessage.shouldReply(from, "oi", mockClient.object);

	// assert
	t.true(shouldReply);
	t.end();
});

test("should_reply_if_message_is_OI", (t) => {
	// arrange
	const greetingMessage = new GreetingMessage();
	const from = "123";
	const mockClient = new Mock<ChatBotClient.IBotClient>({});
	// @ts-ignore
	// act
	var shouldReply = greetingMessage.shouldReply(from, "OI", mockClient.object);

	// assert
	t.true(shouldReply);
	t.end();
});

test("should_not_reply_if_message_is_not_oi", (t) => {
	// arrange
	const greetingMessage = new GreetingMessage();
	const from = "123";
	const mockClient = new Mock<ChatBotClient.IBotClient>({});
	// @ts-ignore
	// act
	var shouldReply = greetingMessage.shouldReply(from, "tchau", mockClient.object);

	// assert
	t.false(shouldReply);
	t.end();
});
