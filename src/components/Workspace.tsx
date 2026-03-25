import { useState, useEffect } from 'react';
import { Combine, Folder, Beaker, FileText, Code2 } from 'lucide-react';
import { Project, FileNode } from '../store';
import { TreeView } from './TreeView';
import { ConcatenatedView } from './ConcatenatedView';
import { ActivityBarBottom } from './ActivityBarBottom';

export const Workspace = ({ project }: { project: Project }) => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [isConcatenated, setIsConcatenated] = useState(false);
  const [activeTab, setActiveTab] = useState<'directory' | 'test' | 'readme'>('directory');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle concatenated view on Ctrl+C (or Cmd+C on Mac) if no text is selected
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          e.preventDefault();
          setIsConcatenated(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex w-full h-full bg-transparent">
      {/* Activity Bar */}
      <div className="w-12 border-r border-white/5 bg-zinc-950/50 flex flex-col items-center py-4 gap-4 shrink-0">
        <button
          onClick={() => setActiveTab('directory')}
          className={`p-2 rounded-lg transition-colors ${activeTab === 'directory' ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
          title="工程目录"
        >
          <Folder size={20} />
        </button>
        <button
          onClick={() => setActiveTab('test')}
          className={`p-2 rounded-lg transition-colors ${activeTab === 'test' ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
          title="工程测试"
        >
          <Beaker size={20} />
        </button>
        <button
          onClick={() => setActiveTab('readme')}
          className={`p-2 rounded-lg transition-colors ${activeTab === 'readme' ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
          title="工程Readme"
        >
          <FileText size={20} />
        </button>

        <ActivityBarBottom project={project} />
      </div>

      {/* Sidebar */}
      {activeTab === 'directory' && (
        <div className="w-72 border-r border-white/5 bg-zinc-900/30 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 flex gap-3 bg-zinc-900/20 shrink-0">
            <img src={project.cover} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 shadow-md" />
            <div className="flex flex-col justify-between flex-1 overflow-hidden py-0.5">
              <h2 className="text-sm font-bold text-zinc-100 leading-tight drop-shadow-sm truncate" title={project.name}>
                {project.name}
              </h2>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setIsConcatenated(!isConcatenated)}
                  className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    isConcatenated 
                      ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/40' 
                      : 'bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-200 border border-white/10'
                  }`}
                  title="一键拼接 (Ctrl+C)"
                >
                  <Combine size={14} />
                  {isConcatenated ? 'Exit' : 'Concat'}
                </button>
                <button
                  className="flex-1 px-2 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20"
                  title="Open in VSCode"
                >
                  <Code2 size={14} />
                  VSCode
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <TreeView nodes={project.files} projectId={project.id} onSelectFile={(f) => { setSelectedFile(f); setIsConcatenated(false); }} />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 bg-transparent overflow-hidden flex flex-col relative">
        {activeTab === 'test' ? (
          <div className="flex-1 flex items-center justify-center text-zinc-500 bg-zinc-950/50">
            工程测试页面 (Project Test Page)
          </div>
        ) : activeTab === 'readme' ? (
          <div className="flex-1 flex items-center justify-center text-zinc-500 bg-zinc-950/50">
            工程Readme页面 (Project Readme Page)
          </div>
        ) : isConcatenated ? (
          <ConcatenatedView project={project} />
        ) : selectedFile ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-10 border-b border-white/5 flex items-center px-4 bg-zinc-900/20 shrink-0">
              <span className="text-sm text-zinc-400">{selectedFile.path}</span>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-zinc-300 font-mono text-sm whitespace-pre-wrap break-all">
                {selectedFile.content}
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            Select a file to view or click Concat Files
          </div>
        )}
      </div>
    </div>
  );
};
