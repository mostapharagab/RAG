
import React from 'react';
import { CodeBlock } from './CodeBlock';

const FineTuning: React.FC = () => {
    const fineTuningData = `
{
  "messages": [
    {"role": "user", "content": "remind me to water plants every Mon 7pm"},
    {"role": "assistant", "content": "🌱 Got it! I’ll send you a friendly nudge every Monday at 7:00 PM to water your plants!"}
  ]
}
{
  "messages": [
    {"role": "user", "content": "Need a reminder for the Q4 report due EOD Friday"},
    {"role": "assistant", "content": "✅ Understood. A reminder for the 'Q4 report' has been set for this Friday at 5:00 PM. I'll make sure you don't miss it."}
  ]
}
{
  "messages": [
    {"role": "user", "content": "remind me team sync 10am tomorrow"},
    {"role": "assistant", "content": "👍 Roger that. I've scheduled a reminder for the 'team sync' tomorrow at 10:00 AM."}
  ]
}
    `;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-200">Fine-tuning (Conceptual)</h2>
            <p className="text-gray-400 mb-6">Fine-tuning adapts a pre-trained model to a specific task or to follow a certain style, tone, or format.</p>

            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 space-y-4">
                <h3 className="text-xl font-semibold text-indigo-400">Why Fine-tune?</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li><strong className="text-white">Improve Reliability:</strong> Make the model more consistent at performing a specific task (e.g., always responding in a certain JSON format).</li>
                    <li><strong className="text-white">Customize Tone & Style:</strong> Teach the model to adopt a specific personality, like being very formal, humorous, or using specific emojis.</li>
                    <li><strong className="text-white">Complex Tasks:</strong> For tasks that are too complex to fit into a single prompt, fine-tuning can teach the model the desired behavior over many examples.</li>
                </ul>

                <h3 className="text-xl font-semibold text-indigo-400 mt-4">The Process</h3>
                <p>Fine-tuning involves preparing a dataset of high-quality examples that demonstrate the desired input/output behavior. This dataset is then used to update the weights of the base model, creating a new, specialized model.</p>
                
                <h3 className="text-xl font-semibold text-indigo-400 mt-4">Example Dataset</h3>
                <p className="text-gray-400 mb-2">Here's a sample of a JSONL file used to fine-tune an assistant to have a friendly and confirmatory tone for setting reminders.</p>
                <CodeBlock code={fineTuningData} language="json" />

                <p className="text-sm text-gray-500 mt-4">
                    <strong>Note:</strong> Fine-tuning is an offline process that requires preparing a dataset and running a training job via an API or platform UI. It is not performed in real-time within a web application.
                </p>
            </div>
        </div>
    );
};

export default FineTuning;
