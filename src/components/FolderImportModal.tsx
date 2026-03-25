import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Folder, Upload } from 'lucide-react';
import { useStore } from '../store';

export const FolderImportModal = ({ onClose }: { onClose: () => void }) => {
  const addProject = useStore(state => state.addProject);
  const [projectName, setProjectName] = useState('Imported Project');

  const handleImport = () => {
    addProject({
      name: projectName,
      cover: `https://picsum.photos/seed/${Date.now()}/600/800`,
      files: [] // In a real app, this would read the selected folder
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <Folder size={20} className="text-indigo-400" />
            从文件夹添加
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">工程名称</label>
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-500 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors cursor-pointer">
            <Upload size={32} className="mb-3 text-zinc-400" />
            <p className="text-sm font-medium text-zinc-300">点击选择文件夹</p>
            <p className="text-xs mt-1">或将文件夹拖拽到此处</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800 bg-zinc-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            导入
          </button>
        </div>
      </motion.div>
    </div>
  );
};
