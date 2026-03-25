import { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Project, FileNode, useStore } from '../store';

const getIncludedFiles = (nodes: FileNode[], excludedPaths: string[]): FileNode[] => {
  let result: FileNode[] = [];
  for (const node of nodes) {
    if (excludedPaths.includes(node.path)) continue;
    if (node.type === 'file') {
      result.push(node);
    } else if (node.children) {
      result = result.concat(getIncludedFiles(node.children, excludedPaths));
    }
  }
  return result;
};

const EMPTY_ARRAY: string[] = [];

export const ConcatenatedView = ({ project }: { project: Project }) => {
  const excludedPaths = useStore(state => state.excludedPaths[project.id] || EMPTY_ARRAY);
  const includedFiles = useMemo(() => getIncludedFiles(project.files, excludedPaths), [project.files, excludedPaths]);
  const [copied, setCopied] = useState(false);

  const fileBlocks = useMemo(() => {
    let currentLine = 1;
    return includedFiles.map(file => {
      const content = file.content || '';
      const lineCount = content.split('\n').length;
      const block = {
        file,
        startLine: currentLine,
        endLine: currentLine + lineCount - 1,
        content
      };
      currentLine += lineCount + 2; // +2 for spacing
      return block;
    });
  }, [includedFiles]);

  const scrollToRef = (path: string) => {
    const el = document.getElementById(`file-${path}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopy = async () => {
    const textToCopy = fileBlocks.map(b => `// --- ${b.file.path} ---\n${b.content}`).join('\n\n');
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-full h-full overflow-hidden bg-transparent">
      {/* TOC */}
      <div className="w-64 border-r border-white/5 bg-zinc-900/20 flex flex-col shrink-0">
        <div className="p-3 border-b border-white/5 text-xs font-bold text-zinc-400 uppercase tracking-wider flex justify-between items-center">
          <span>Table of Contents</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {fileBlocks.map(block => (
            <div
              key={block.file.path}
              onClick={() => scrollToRef(block.file.path)}
              className="py-2 px-3 hover:bg-zinc-800/50 rounded-lg cursor-pointer flex flex-col transition-colors"
            >
              <span className="text-sm text-zinc-300 truncate font-medium">{block.file.path}</span>
              <span className="text-xs text-zinc-500 mt-0.5">Lines {block.startLine}-{block.endLine}</span>
            </div>
          ))}
          {fileBlocks.length === 0 && (
            <div className="text-zinc-500 text-xs text-center mt-4">No files</div>
          )}
        </div>
      </div>

      {/* Long Text */}
      <div className="flex-1 overflow-y-auto p-6 bg-transparent font-mono text-sm scroll-smooth relative">
        <div className="absolute top-4 right-6 z-10">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/60 hover:bg-zinc-700/80 backdrop-blur-md border border-white/10 rounded-lg text-sm font-medium text-zinc-200 transition-all shadow-lg"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy All'}
          </button>
        </div>
        
        <div className="pt-8">
          {fileBlocks.map(block => (
            <div key={block.file.path} id={`file-${block.file.path}`} className="mb-12 scroll-mt-6">
              <div className="text-zinc-400 mb-3 border-b border-white/10 pb-2 select-none flex items-center justify-between">
                <span className="font-semibold text-zinc-300 drop-shadow-sm">{block.file.path}</span>
                <span className="text-xs opacity-70">Lines {block.startLine}-{block.endLine}</span>
              </div>
              <pre className="text-zinc-300 whitespace-pre-wrap break-all">
                {block.content}
              </pre>
            </div>
          ))}
          {fileBlocks.length === 0 && (
            <div className="text-zinc-500 text-center mt-10">All files are excluded.</div>
          )}
        </div>
      </div>
    </div>
  );
};
