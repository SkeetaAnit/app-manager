import { useState } from 'react';
import { Folder, File, PlusCircle, MinusCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { FileNode, useStore } from '../store';

const EMPTY_ARRAY: string[] = [];

const TreeNode = ({ node, projectId, onSelectFile, level, parentExcluded }: { key?: string, node: FileNode, projectId: string, onSelectFile: (f: FileNode) => void, level: number, parentExcluded: boolean }) => {
  const excludedPaths = useStore(state => state.excludedPaths[projectId] || EMPTY_ARRAY);
  const toggleExcludePath = useStore(state => state.toggleExcludePath);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isSelfExcluded = excludedPaths.includes(node.path);
  const isExcluded = parentExcluded || isSelfExcluded;
  const isFolder = node.type === 'folder';

  return (
    <div>
      <div
        className={`flex items-center group py-1.5 px-2 hover:bg-zinc-800/50 cursor-pointer ${isExcluded ? 'opacity-50' : ''}`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => {
          if (isFolder) {
            setIsCollapsed(!isCollapsed);
          } else {
            onSelectFile(node);
          }
        }}
      >
        {isFolder ? (
          <div className="flex items-center justify-center w-4 h-4 mr-1 shrink-0 text-zinc-400 hover:text-zinc-200 transition-colors">
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </div>
        ) : (
          <div className="w-4 h-4 mr-1 shrink-0" />
        )}
        {isFolder ? <Folder size={14} className="mr-2 text-blue-400 shrink-0" /> : <File size={14} className="mr-2 text-zinc-400 shrink-0" />}
        <span className={`text-sm truncate flex-1 ${isExcluded ? 'text-zinc-500' : 'text-zinc-300'}`}>
          {node.name}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); toggleExcludePath(projectId, node.path); }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-200 transition-opacity"
          title={isSelfExcluded ? "Include" : "Exclude"}
        >
          {isSelfExcluded ? <PlusCircle size={14} /> : <MinusCircle size={14} />}
        </button>
      </div>
      {isFolder && node.children && !isCollapsed && (
        <TreeView nodes={node.children} projectId={projectId} onSelectFile={onSelectFile} level={level + 1} parentExcluded={isExcluded} />
      )}
    </div>
  );
};

export const TreeView = ({ nodes, projectId, onSelectFile, level = 0, parentExcluded = false }: { nodes: FileNode[], projectId: string, onSelectFile: (f: FileNode) => void, level?: number, parentExcluded?: boolean }) => {
  return (
    <div className="flex flex-col">
      {nodes.map(node => (
        <TreeNode key={node.path} node={node} projectId={projectId} onSelectFile={onSelectFile} level={level} parentExcluded={parentExcluded} />
      ))}
    </div>
  );
};
