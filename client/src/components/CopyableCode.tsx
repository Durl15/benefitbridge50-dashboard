import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function CopyableCode({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
      <button onClick={copy} className="absolute top-2 right-2 p-2 hover:bg-slate-700 rounded">
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre>{code}</pre>
    </div>
  );
}
