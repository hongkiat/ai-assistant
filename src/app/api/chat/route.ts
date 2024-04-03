import { readData } from '@/lib/data';
import { OpenAIEmbeddings } from '@langchain/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Document } from 'langchain/document';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import OpenAI from 'openai';

/**
 * Create a vector store from a list of documents using OpenAI embedding.
 */
const createStore = () => {
	const data = readData();

	return MemoryVectorStore.fromDocuments(
		data.map((title) => {
			return new Document({
				pageContent: `Title: ${title}`,
			});
		}),
		new OpenAIEmbeddings()
	);
};
const openai = new OpenAI();

export async function POST(req: Request) {
	const { messages } = (await req.json()) as {
		messages: { content: string; role: 'assistant' | 'user' }[];
	};
	const store = await createStore();
	const results = await store.similaritySearch(messages[0].content, 100);
	const questions = messages
		.filter((m) => m.role === 'user')
		.map((m) => m.content);
	const latestQuestion = questions[questions.length - 1] || '';
	const response = await openai.chat.completions.create({
		messages: [
			{
				content: `You're a helpful assistant. You're here to help me with my questions.`,
				role: 'assistant',
			},
			{
				content: `
				Please answer the following question using the provided context.
				If the context is not provided, please simply say that you're not able to answer
				the question.

	      Question:
				${latestQuestion}

	      Context:
				${results.map((r) => r.pageContent).join('\n')}
				`,
				role: 'user',
			},
		],
		model: 'gpt-4',
		stream: true,
		temperature: 0,
	});
	const stream = OpenAIStream(response);

	return new StreamingTextResponse(stream);
}
