import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Search, Plus, ArrowDownUp, Monitor, MonitorOff } from 'lucide-react';
import { useStore, Project } from '../store';
import { SettingsModal } from './SettingsModal';
import { HighlightText } from './HighlightText';

const getRelativeTime = (timestamp: number) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = timestamp - Date.now();
  
  const diffInMinutes = Math.round(diff / (1000 * 60));
  if (Math.abs(diffInMinutes) < 1) return 'Just now';
  if (Math.abs(diffInMinutes) < 60) return rtf.format(diffInMinutes, 'minute');
  
  const diffInHours = Math.round(diff / (1000 * 60 * 60));
  if (Math.abs(diffInHours) < 24) return rtf.format(diffInHours, 'hour');
  
  const diffInDays = Math.round(diff / (1000 * 60 * 60 * 24));
  if (Math.abs(diffInDays) < 30) return rtf.format(diffInDays, 'day');
  
  const diffInMonths = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
  if (Math.abs(diffInMonths) < 12) return rtf.format(diffInMonths, 'month');
  
  const diffInYears = Math.round(diff / (1000 * 60 * 60 * 24 * 365));
  return rtf.format(diffInYears, 'year');
};

export const ProjectList = () => {
  const projects = useStore(state => state.projects);
  const selectProject = useStore(state => state.selectProject);
  const addProject = useStore(state => state.addProject);
  const isDesktopMode = useStore(state => state.isDesktopMode);
  const toggleDesktopMode = useStore(state => state.toggleDesktopMode);
  const [settingsProject, setSettingsProject] = useState<Project | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const TAGS = ['应用', 'UI组件', '包', '代码片段'];

  const filteredProjects = useMemo(() => {
    let result = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    
    if (activeTag) {
      result = result.filter(p => p.tags?.includes(activeTag));
    }

    if (sortBy === 'recent') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [projects, search, sortBy, activeTag]);

  const handleAddProject = () => {
    addProject({
      name: 'New Project',
      cover: `https://picsum.photos/seed/${Date.now()}/600/800`,
      files: []
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <h1 className="text-3xl font-bold text-zinc-100 drop-shadow-md">Projects</h1>
          <div className="flex items-center gap-1 bg-zinc-900/40 backdrop-blur-md p-1 rounded-lg border border-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTag === null ? 'bg-indigo-500/80 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
            >
              全部
            </button>
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTag === tag ? 'bg-indigo-500/80 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-64 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900/60 transition-all shadow-lg"
            />
          </div>
          <button
            onClick={() => setSortBy(s => s === 'recent' ? 'name' : 'recent')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-800/60 border border-white/10 rounded-lg text-sm font-medium text-zinc-300 transition-all shadow-lg"
          >
            <ArrowDownUp size={16} />
            {sortBy === 'recent' ? 'Latest' : 'Name'}
          </button>
          <button
            onClick={toggleDesktopMode}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-800/60 border border-white/10 rounded-lg text-sm font-medium text-zinc-300 transition-all shadow-lg"
            title="Toggle Desktop Mode"
          >
            {isDesktopMode ? <MonitorOff size={16} /> : <Monitor size={16} />}
            {isDesktopMode ? 'Web Mode' : 'Desktop Mode'}
          </button>
          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 backdrop-blur-md hover:bg-indigo-500/80 border border-indigo-500/50 rounded-lg text-sm font-medium text-white transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-6">
        {filteredProjects.map(project => (
          <motion.div
            layoutId={`project-${project.id}`}
            key={project.id}
            className="relative group cursor-pointer rounded-xl overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col max-w-[240px] w-full justify-self-center transition-all hover:border-white/30 hover:shadow-indigo-500/10"
            onClick={() => selectProject(project.id)}
          >
            <div className="aspect-[3/4] w-full relative overflow-hidden bg-zinc-950/50">
              <img src={project.cover} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); setSettingsProject(project); }}
                  className="p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md text-white transition-colors shadow-lg border border-white/10"
                >
                  <Settings size={16} />
                </button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-semibold text-white truncate drop-shadow-md" title={project.name}>
                  <HighlightText text={project.name} highlight={search} />
                </h3>
                <p className="text-xs text-zinc-300 drop-shadow-md">
                  {getRelativeTime(project.createdAt)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-12 text-zinc-400 bg-zinc-900/20 backdrop-blur-md rounded-xl border border-white/5">
            No projects found matching "{search}"
          </div>
        )}
      </div>
      <AnimatePresence>
        {settingsProject && (
          <SettingsModal project={settingsProject} onClose={() => setSettingsProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
