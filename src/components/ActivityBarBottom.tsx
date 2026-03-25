import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { List, Search, ArrowLeft, Tag, X, Plus } from 'lucide-react';
import { useStore, Project } from '../store';
import { HighlightText } from './HighlightText';

export const ActivityBarBottom = ({ project }: { project: Project }) => {
  const isQuickSelectOpen = useStore(state => state.isQuickSelectOpen);
  const toggleQuickSelect = useStore(state => state.toggleQuickSelect);
  const setQuickSelectOpen = useStore(state => state.setQuickSelectOpen);
  const projects = useStore(state => state.projects);
  const selectProject = useStore(state => state.selectProject);
  const updateProject = useStore(state => state.updateProject);
  
  const [search, setSearch] = useState('');
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  const quickSelectRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickSelectRef.current && !quickSelectRef.current.contains(event.target as Node)) {
        setQuickSelectOpen(false);
      }
      if (tagsRef.current && !tagsRef.current.contains(event.target as Node)) {
        setIsTagsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setQuickSelectOpen]);

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    
    const currentTags = project.tags || [];
    if (!currentTags.includes(newTag.trim())) {
      updateProject(project.id, { tags: [...currentTags, newTag.trim()] });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = project.tags || [];
    updateProject(project.id, { tags: currentTags.filter(t => t !== tagToRemove) });
  };

  return (
    <div className="mt-auto flex flex-col items-center gap-4 pb-4">
      {/* Tags Button & Panel */}
      <div className="relative" ref={tagsRef}>
        <button
          onClick={() => {
            setIsTagsOpen(!isTagsOpen);
            setQuickSelectOpen(false);
          }}
          className={`p-2 rounded-lg transition-colors ${isTagsOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
          title="Manage Tags"
        >
          <Tag size={20} />
        </button>

        <AnimatePresence>
          {isTagsOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-14 w-64 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden flex flex-col z-50"
            >
              <div className="p-3 border-b border-zinc-700 bg-zinc-900/50 flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-200">Project Tags</h3>
                <button onClick={() => setIsTagsOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X size={14} />
                </button>
              </div>
              <div className="p-3 flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                {(!project.tags || project.tags.length === 0) && (
                  <div className="text-xs text-zinc-500 w-full text-center py-2">No tags added yet</div>
                )}
                {project.tags?.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-700/50 text-xs font-medium text-zinc-300 border border-zinc-600/50">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="text-zinc-500 hover:text-zinc-300 ml-1">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="p-2 border-t border-zinc-700 bg-zinc-900/30">
                <form onSubmit={handleAddTag} className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-3 pr-8 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button type="submit" className="absolute right-2 text-zinc-400 hover:text-indigo-400" disabled={!newTag.trim()}>
                    <Plus size={14} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Select Button & Panel */}
      <div className="relative" ref={quickSelectRef}>
        <button
          onClick={() => {
            toggleQuickSelect();
            setIsTagsOpen(false);
          }}
          className={`p-2 rounded-lg transition-colors ${isQuickSelectOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
          title="Quick Select"
        >
          <List size={20} />
        </button>

        <AnimatePresence>
          {isQuickSelectOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-14 w-72 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[400px] z-50"
            >
              <div className="p-2 border-b border-zinc-700 bg-zinc-900/50">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div className="overflow-y-auto p-2 flex flex-col gap-1">
                {filteredProjects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      selectProject(p.id);
                      setSearch('');
                    }}
                    className={`flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${p.id === project.id ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-zinc-700 text-zinc-300'}`}
                  >
                    <img src={p.cover} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                    <span className="text-sm font-medium truncate">
                      <HighlightText text={p.name} highlight={search} />
                    </span>
                  </button>
                ))}
                {filteredProjects.length === 0 && (
                  <div className="text-center text-zinc-500 text-sm py-4">No projects found</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back Button */}
      <button
        onClick={() => selectProject(null)}
        className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
        title="Back to Projects (Esc)"
      >
        <ArrowLeft size={20} />
      </button>
    </div>
  );
};
