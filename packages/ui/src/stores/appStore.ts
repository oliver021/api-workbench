import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NormalizedSpec, NormalizedEndpoint, ResponseData } from '@api-workbench/core';
import { STORAGE_KEY_RECENT, STORAGE_KEY_SIDEBAR_COLLAPSED } from '@api-workbench/core';

interface RecentEndpoint {
  id: string;
  method: string;
  path: string;
  tag: string;
  timestamp: number;
}

interface RequestState {
  loading: boolean;
  response: ResponseData | null;
  error: string | null;
}

interface AppState {
  spec: NormalizedSpec | null;
  selectedEndpoint: NormalizedEndpoint | null;
  recentEndpoints: RecentEndpoint[];
  sidebarCollapsed: boolean;
  expandedPaths: Set<string>;
  requestState: RequestState;

  setSpec: (spec: NormalizedSpec) => void;
  setSelectedEndpoint: (endpoint: NormalizedEndpoint | null) => void;
  addRecentEndpoint: (endpoint: NormalizedEndpoint) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  togglePathExpanded: (path: string) => void;
  setRequestState: (state: Partial<RequestState>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      spec: null,
      selectedEndpoint: null,
      recentEndpoints: [],
      sidebarCollapsed: false,
      expandedPaths: new Set(),
      requestState: { loading: false, response: null, error: null },

      setSpec: (spec) => set({ spec }),

      setSelectedEndpoint: (endpoint) => {
        set({ selectedEndpoint: endpoint });
        if (endpoint) {
          get().addRecentEndpoint(endpoint);
        }
      },

      addRecentEndpoint: (endpoint) => {
        const tag = endpoint.tags[0] || 'Other';
        const recent: RecentEndpoint = {
          id: endpoint.id,
          method: endpoint.method,
          path: endpoint.path,
          tag,
          timestamp: Date.now(),
        };

        set((state) => {
          const filtered = state.recentEndpoints.filter((r) => r.id !== endpoint.id);
          const updated = [recent, ...filtered].slice(0, 10);
          return { recentEndpoints: updated };
        });
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      togglePathExpanded: (path) =>
        set((state) => {
          const next = new Set(state.expandedPaths);
          if (next.has(path)) {
            next.delete(path);
          } else {
            next.add(path);
          }
          return { expandedPaths: next };
        }),

      setRequestState: (partial) =>
        set((state) => ({
          requestState: { ...state.requestState, ...partial },
        })),
    }),
    {
      name: 'api-workbench-store',
      partialize: (state) => ({
        [STORAGE_KEY_RECENT]: state.recentEndpoints,
        [STORAGE_KEY_SIDEBAR_COLLAPSED]: state.sidebarCollapsed,
      }),
    }
  )
);
