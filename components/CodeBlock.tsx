
import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text' }) => {
  return (
    <div className="bg-gray-900 rounded-md my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <span className="text-xs font-sans text-gray-400 uppercase">{language}</span>
      </div>
      <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};
