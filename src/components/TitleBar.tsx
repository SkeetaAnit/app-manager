import { Minus, Square, X } from 'lucide-react';

export const TitleBar = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`h-10 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-4 border-b border-white/5 select-none shrink-0 ${className}`}>
      <div className="text-xs text-zinc-400 font-medium flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
        Project Manager
      </div>
      <div className="flex items-center gap-4">
        <button className="text-zinc-500 hover:text-white transition-colors"><Minus size={14} /></button>
        <button className="text-zinc-500 hover:text-white transition-colors"><Square size={12} /></button>
        <button className="text-zinc-500 hover:text-red-500 transition-colors"><X size={14} /></button>
      </div>
    </div>
  );
};
