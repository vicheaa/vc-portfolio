import React from "react";

interface CodeProps {
    code?: string;
}

export class Code extends React.Component<CodeProps> {

    public render() {
    return (
      <div className="relative mb-12">
            <button
              onClick={() => {
                navigator.clipboard.writeText(this.props.code || '');
                const btn = document.getElementById('copy-btn');
                if (btn) {
                  btn.textContent = 'Copied!';
                  setTimeout(() => btn.textContent = 'Copy', 2000);
                }
              }}
              id="copy-btn"
              className="absolute top-3 right-3 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Copy
            </button>
            <code className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex gap-2">
              <p className="text-green-600">$</p>
              <pre>{this.props.code || ''}</pre>
            </code>
          </div>
    );
  }
}