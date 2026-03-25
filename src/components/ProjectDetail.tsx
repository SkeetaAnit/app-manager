import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { Workspace } from './Workspace';

export const ProjectDetail = ({ id }: { id: string }) => {
  const project = useStore(state => state.projects.find(p => p.id === id));
  const selectProject = useStore(state => state.selectProject);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectProject]);

  if (!project) return null;

  return (
    <motion.div
      layoutId={`project-${id}`}
      className="absolute inset-0 z-50 bg-zinc-950/60 backdrop-blur-2xl flex flex-col overflow-hidden origin-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="flex flex-col h-full w-full relative"
      >
        <Workspace project={project} />
      </motion.div>
    </motion.div>
  );
};
