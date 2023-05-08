'use client';
import axios, { AxiosError } from 'axios';
import { FunctionComponent, useRef, useState, KeyboardEvent, ChangeEvent } from 'react';
import { toast } from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@/components/common/Button';

interface ChatInputProps {
    chatPartner: User;
    chatId: string;
}

export const ChatInput: FunctionComponent<ChatInputProps> = ({ chatPartner, chatId }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (!input) return;
        setIsLoading(true);

        try {
            await axios.post('/api/message/send', { text: input, chatId });
            setInput('');
            textareaRef.current?.focus();
        } catch (error) {
            if (error instanceof AxiosError) {
                return toast.error(error.response?.data);
            }
            toast.error('Something went wrong. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
    const onTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    const onTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value);

    return (
        <div className='mb-2 border-t border-gray-200 px-4 pt-4 sm:mb-0'>
            <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
                <TextareaAutosize
                    ref={textareaRef}
                    onKeyDown={onTextareaKeyDown}
                    rows={1}
                    value={input}
                    onChange={onTextareaChange}
                    maxRows={10}
                    placeholder='Write a message...'
                    className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
                />

                <div onClick={() => textareaRef.current?.focus()} className='py-2' aria-hidden='true'>
                    <div className='py-px'>
                        <div className='h-9' />
                    </div>
                </div>

                <div className='absolute bottom-0 right-0 flex justify-between py-2 pl-3 pr-2'>
                    <div className='flex-shrin-0'>
                        <Button isInProgress={isLoading} onClick={sendMessage} type='submit'>
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
