import { useState } from 'react';
import { motion } from 'motion/react';
import { X, LayoutTemplate, Code2, Smartphone, Globe, Database } from 'lucide-react';
import { useStore } from '../store';

const TEMPLATES = [
  { id: 'react-spa', name: 'React SPA', description: 'Basic React Single Page Application with Vite', icon: Globe, color: 'text-blue-400' },
  { id: 'nextjs', name: 'Next.js App', description: 'Full-stack React framework with SSR', icon: LayoutTemplate, color: 'text-zinc-100' },
  { id: 'express-api', name: 'Express API', description: 'Node.js REST API server', icon: Database, color: 'text-green-400' },
  { id: 'react-native', name: 'React Native', description: 'Mobile app template for iOS and Android', icon: Smartphone, color: 'text-purple-400' },
  { id: 'vanilla-ts', name: 'Vanilla TS', description: 'Blank TypeScript project', icon: Code2, color: 'text-yellow-400' },
];

export const TemplateSelectModal = ({ onClose }: { onClose: () => void }) => {
  const addProject = useStore(state => state.addProject);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [projectName, setProjectName] = useState('New Project');

  const handleCreate = () => {
    const template = TEMPLATES.find(t => t.id === selectedTemplate);
    addProject({
      name: projectName,
      cover: `https://picsum.photos/seed/${Date.now()}/600/800`,
      tags: ['应用'],
      files: [
        { name: 'README.md', type: 'file', path: '/README.md', content: `# ${projectName}\n\nCreated from template: ${template?.name}` }
      ]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
          <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <LayoutTemplate size={20} className="text-indigo-400" />
            从模板中添加
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Template List */}
          <div className="w-full md:w-1/2 border-r border-zinc-800 overflow-y-auto p-2 space-y-1">
            {TEMPLATES.map(template => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${isSelected ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-zinc-800/50 border border-transparent'}`}
                >
                  <div className={`p-2 rounded-md bg-zinc-950 shrink-0 ${template.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${isSelected ? 'text-indigo-300' : 'text-zinc-200'}`}>{template.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{template.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Project Details */}
          <div className="w-full md:w-1/2 p-6 flex flex-col gap-6 bg-zinc-950/30 overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">工程名称</label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">模板详情</label>
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <h4 className="text-zinc-200 font-medium">{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</h4>
                <p className="text-sm text-zinc-400 mt-2">{TEMPLATES.find(t => t.id === selectedTemplate)?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800 bg-zinc-950/50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            创建工程
          </button>
        </div>
      </motion.div>
    </div>
  );
};
