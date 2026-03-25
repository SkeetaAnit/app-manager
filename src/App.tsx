/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import { AnimatePresence } from 'motion/react';
import { useStore } from './store';
import { TitleBar } from './components/TitleBar';
import { AtmosphericBackground } from './components/AtmosphericBackground';

export default function App() {
  const selectedProjectId = useStore(state => state.selectedProjectId);
  const isDesktopMode = useStore(state => state.isDesktopMode);

  return (
    <div className="h-screen text-zinc-100 font-sans relative overflow-hidden flex flex-col">
      <AtmosphericBackground />
      {isDesktopMode && <TitleBar className="z-50" />}
      <div className="flex-1 overflow-auto relative">
        <ProjectList />
        <AnimatePresence>
          {selectedProjectId && <ProjectDetail id={selectedProjectId} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
