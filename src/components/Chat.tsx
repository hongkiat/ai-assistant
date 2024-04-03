'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/ui/card';
import { Input } from '@/ui/input';
import { ScrollArea } from '@/ui/scroll-area';
import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import { FunctionComponent, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactMarkdown, { Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Memoized ReactMarkdown component.
 * The component is memoized to prevent unnecessary re-renders.
 */
const MemoizedReactMarkdown: FunctionComponent<Options> = memo(
	ReactMarkdown,
	(prevProps, nextProps) =>
		prevProps.children === nextProps.children &&
		prevProps.className === nextProps.className
);

/**
 * Represents a chat component that allows users to interact with a chatbot.
 * The component displays a chat interface with messages exchanged between the user and the chatbot.
 * Users can input their questions and receive responses from the chatbot.
 */
export const Chat = () => {
	const { handleInputChange, handleSubmit, input, messages } = useChat({
		api: '/api/chat',
	});

	return (
		<Card className="w-full max-w-3xl min-h-[640px] grid gap-3 grid-rows-[max-content,1fr,max-content]">
			<CardHeader className="row-span-1">
				<CardTitle>AI Assistant</CardTitle>
			</CardHeader>
			<CardContent className="h-full row-span-2">
				<ScrollArea className="h-full w-full">
					{messages.map((message) => {
						return (
							<div
								className="flex gap-3 text-slate-600 text-sm mb-4"
								key={message.id}
							>
								{message.role === 'user' && (
									<Avatar>
										<AvatarFallback>U</AvatarFallback>
										<AvatarImage src="/user.png" />
									</Avatar>
								)}
								{message.role === 'assistant' && (
									<Avatar>
										<AvatarImage src="/kovi.png" />
									</Avatar>
								)}
								<p className="leading-relaxed">
									<span className="block font-bold text-slate-700">
										{message.role === 'user' ? 'User' : 'AI'}
									</span>
									<ErrorBoundary
										fallback={
											<div className="prose prose-neutral">
												{message.content}
											</div>
										}
									>
										<MemoizedReactMarkdown
											className="prose prose-neutral prose-sm"
											remarkPlugins={[remarkGfm]}
										>
											{message.content}
										</MemoizedReactMarkdown>
									</ErrorBoundary>
								</p>
							</div>
						);
					})}
				</ScrollArea>
			</CardContent>
			<CardFooter className="h-max row-span-3">
				<form className="w-full flex gap-2" onSubmit={handleSubmit}>
					<Input
						maxLength={1000}
						onChange={handleInputChange}
						placeholder="Your question..."
						value={input}
					/>
					<Button aria-label="Send" type="submit">
						<Send size={16} />
					</Button>
				</form>
			</CardFooter>
		</Card>
	);
};
