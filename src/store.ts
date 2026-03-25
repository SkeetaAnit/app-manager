import { create } from 'zustand';

export type FileNode = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  path: string;
};

export type Project = {
  id: string;
  name: string;
  cover: string;
  files: FileNode[];
  createdAt: number;
  tags?: string[];
};

const MOCK_PROJECTS: Omit<Project, 'createdAt'>[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    cover: 'https://picsum.photos/seed/ecommerce/600/800',
    tags: ['应用', 'UI组件'],
    files: [
      {
        name: 'src',
        type: 'folder',
        path: '/src',
        children: [
          { name: 'auth.ts', type: 'file', path: '/src/auth.ts', content: 'export const login = () => {\n  console.log("login");\n};\n\nexport const logout = () => {\n  console.log("logout");\n};' },
          { name: 'App.tsx', type: 'file', path: '/src/App.tsx', content: 'import React from "react";\nimport { login } from "./auth";\n\nexport default function App() {\n  return (\n    <div>\n      <h1>App</h1>\n      <button onClick={login}>Login</button>\n    </div>\n  );\n}' },
          {
            name: 'components',
            type: 'folder',
            path: '/src/components',
            children: [
              { name: 'Button.tsx', type: 'file', path: '/src/components/Button.tsx', content: 'import React from "react";\n\nexport const Button = ({ children }) => (\n  <button className="btn">{children}</button>\n);' },
              { name: 'Header.tsx', type: 'file', path: '/src/components/Header.tsx', content: 'import React from "react";\n\nexport const Header = () => (\n  <header>Header</header>\n);' }
            ]
          }
        ]
      },
      { name: 'package.json', type: 'file', path: '/package.json', content: '{\n  "name": "ecommerce",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0"\n  }\n}' },
      { name: 'README.md', type: 'file', path: '/README.md', content: '# E-commerce Platform\n\nThis is an e-commerce platform built with React.' }
    ]
  },
  {
    id: '2',
    name: 'Admin Dashboard',
    cover: 'https://picsum.photos/seed/dashboard/600/800',
    tags: ['应用', '包'],
    files: [
      {
        name: 'src',
        type: 'folder',
        path: '/src',
        children: [
          { name: 'index.ts', type: 'file', path: '/src/index.ts', content: 'console.log("Admin Dashboard");' },
          { name: 'utils.ts', type: 'file', path: '/src/utils.ts', content: 'export const formatDate = (date: Date) => date.toISOString();' }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Mobile App API',
    cover: 'https://picsum.photos/seed/api/600/800',
    tags: ['包', '代码片段'],
    files: [
      {
        name: 'routes',
        type: 'folder',
        path: '/routes',
        children: [
          { name: 'users.ts', type: 'file', path: '/routes/users.ts', content: 'export const getUsers = () => [];' }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Landing Page',
    cover: 'https://picsum.photos/seed/landing/600/800',
    tags: ['UI组件', '代码片段'],
    files: [
      { name: 'index.html', type: 'file', path: '/index.html', content: '<html><body><h1>Landing Page</h1></body></html>' },
      { name: 'styles.css', type: 'file', path: '/styles.css', content: 'body { margin: 0; }' }
    ]
  }
];

interface AppState {
  projects: Project[];
  selectedProjectId: string | null;
  isQuickSelectOpen: boolean;
  isDesktopMode: boolean;
  excludedPaths: Record<string, string[]>;
  selectProject: (id: string | null) => void;
  toggleQuickSelect: () => void;
  setQuickSelectOpen: (isOpen: boolean) => void;
  toggleDesktopMode: () => void;
  toggleExcludePath: (projectId: string, path: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  addProject: (data: Omit<Project, 'id' | 'createdAt'>) => void;
}

export const useStore = create<AppState>((set) => ({
  projects: MOCK_PROJECTS.map((p, i) => ({ ...p, createdAt: Date.now() - i * 100000 })),
  selectedProjectId: null,
  isQuickSelectOpen: false,
  isDesktopMode: false,
  excludedPaths: {},
  selectProject: (id) => set({ selectedProjectId: id, isQuickSelectOpen: false }),
  toggleQuickSelect: () => set((state) => ({ isQuickSelectOpen: !state.isQuickSelectOpen })),
  setQuickSelectOpen: (isOpen) => set({ isQuickSelectOpen: isOpen }),
  toggleDesktopMode: () => set((state) => ({ isDesktopMode: !state.isDesktopMode })),
  toggleExcludePath: (projectId, path) => set((state) => {
    const projectExcluded = state.excludedPaths[projectId] || [];
    const isExcluded = projectExcluded.includes(path);
    const newExcluded = isExcluded
      ? projectExcluded.filter(p => p !== path)
      : [...projectExcluded, path];
    return { excludedPaths: { ...state.excludedPaths, [projectId]: newExcluded } };
  }),
  updateProject: (id, data) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...data } : p)
  })),
  addProject: (data) => set((state) => ({
    projects: [{ ...data, id: Date.now().toString(), createdAt: Date.now() }, ...state.projects]
  }))
}));
