import React, { useState } from 'react';
import { generateAgentResponse } from '../services/geminiService';
import { GenerateContentResponse, FunctionCall } from '@google/genai';

const Spinner: React.FC = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

interface Reminder {
  task: string;
  datetime: string;
  email: string;
}

const ReminderAgent: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [email, setEmail] = useState('m.ragabali@nu.edu.eg');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !email.trim()) {
      setError('Please provide a reminder task and an email address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setConfirmation(null);

    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response: GenerateContentResponse = await generateAgentResponse(prompt, userTimezone);
      const functionCalls: FunctionCall[] | undefined = response.functionCalls;

      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        if (call.name === 'schedule_reminder') {
          const { task, datetime_iso } = call.args;
          // Add type guards to safely access function call arguments.
          if (typeof task === 'string' && typeof datetime_iso === 'string') {
            const newReminder: Reminder = { task, datetime: datetime_iso, email };
            setReminders(prev => [...prev, newReminder]);
            setConfirmation(`✅ Reminder set! I'll remind you to "${task}" on ${new Date(datetime_iso).toLocaleString()} via email to ${email}.`);
          } else {
            setError("Invalid arguments received from AI for scheduling reminder.");
          }
        }
      } else {
        setConfirmation(`💬 AI says: "${response.text}"`);
      }

      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
        <h2 className="text-2xl font-semibold mb-2 text-gray-200">AI Reminder Agent</h2>
        <p className="text-gray-400 mb-6">Use natural language to set a reminder. The AI will use Function Calling to understand your request and schedule it.</p>
        
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            <div>
                <label htmlFor="email-input" className="block text-sm font-medium text-gray-300 mb-1">Your Email</label>
                <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., your.email@example.com"
                    className="w-full bg-gray-700 rounded-lg p-2 border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 transition-colors text-white placeholder-gray-400 outline-none"
                    required
                />
            </div>
            <div>
                 <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-1">Reminder Request</label>
                <div className="flex items-center bg-gray-700 rounded-lg p-2 border border-gray-600 focus-within:border-indigo-500 transition-colors">
                <input
                    id="prompt-input"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Remind me to submit the project proposal on Nov 20, 2025 at 9 AM"
                    className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim() || !email.trim()}
                    className="ml-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                    {isLoading ? <Spinner /> : 'Set Reminder'}
                </button>
                </div>
            </div>
            {error && <p className="text-red-400 mt-2">{error}</p>}
        </form>

        {confirmation && <p className="text-green-400 bg-green-900/50 p-3 rounded-lg mb-6">{confirmation}</p>}

        <div className="flex-grow bg-gray-900/50 p-4 rounded-lg border border-gray-700 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Scheduled Reminders</h3>
            {reminders.length > 0 ? (
            <ul className="space-y-3">
                {reminders.map((r, i) => (
                <li key={i} className="bg-gray-800 p-3 rounded-md shadow flex justify-between items-start">
                    <div>
                        <p className="font-medium text-white">{r.task}</p>
                        <p className="text-sm text-gray-400">{new Date(r.datetime).toLocaleString()}</p>
                        <p className="text-sm text-indigo-300 mt-1">To: {r.email}</p>
                    </div>
                     <span className="text-xs font-mono text-indigo-400 bg-gray-700 px-2 py-1 rounded">Scheduled</span>
                </li>
                ))}
            </ul>
            ) : (
            <p className="text-center text-gray-500">No reminders scheduled yet.</p>
            )}
        </div>
    </div>
  );
};

export default ReminderAgent;