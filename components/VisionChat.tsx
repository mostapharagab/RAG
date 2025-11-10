
import React, { useState, useRef } from 'react';
import type { Message } from '../types';
import { generateMultimodalResponse } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

const Spinner: React.FC = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const VisionChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setError(null);
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !image) {
      setError('Please provide an image and a prompt.');
      return;
    }
    setError(null);
    setIsLoading(true);

    const userMessage: Message = { role: 'user', text: prompt, image: imagePreview! };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');

    try {
      const base64Image = await fileToBase64(image);
      const modelResponse = await generateMultimodalResponse(prompt, base64Image, image.type);
      const modelMessage: Message = { role: 'model', text: modelResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get response: ${errorMessage}`);
      setMessages(prev => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
      removeImage();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6">
        {messages.length === 0 && (
            <div className="text-center text-gray-400">
                <h2 className="text-2xl font-semibold mb-2">Multimodal Vision Chat</h2>
                <p>Upload an image, ask a question about it, and see the AI's response.</p>
            </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center font-bold">A</div>}
            <div className={`rounded-xl p-4 max-w-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
              {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-3 max-h-64" />}
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
            {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center font-bold">Y</div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        {error && <p className="text-red-400 mb-2">{error}</p>}
        {imagePreview && (
          <div className="mb-4 relative w-48">
            <img src={imagePreview} alt="Selected preview" className="rounded-lg" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              &times;
            </button>
          </div>
        )}
        <div className="flex items-center bg-gray-700 rounded-lg p-2 border border-gray-600 focus-within:border-indigo-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer p-2 rounded-md hover:bg-gray-600 transition-colors mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={image ? "Ask something about the image..." : "Upload an image first..."}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            disabled={isLoading || !image}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim() || !image}
            className="ml-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isLoading ? <Spinner/> : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisionChat;
