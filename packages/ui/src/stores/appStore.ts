import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NormalizedSpec, NormalizedEndpoint, ResponseData, HttpMethod } from '@api-workbench/core';
import { STORAGE_KEY_RECENT, STORAGE_KEY_SIDEBAR_COLLAPSED } from '@api-workbench/core';
import { DEFAULT_THEME_ID } from '@/themes';

interface RecentEndpoint {
  id: string;
  method: string;
  path: string;
  tag: string;
  timestamp: number;
}

interface PinnedEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  tag: string;
  pinnedAt: number;
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
  pinnedEndpoints: PinnedEndpoint[];
  sidebarCollapsed: boolean;
  expandedPaths: Set<string>;
  requestState: RequestState;
  theme: string;

  setSpec: (spec: NormalizedSpec) => void;
  setSelectedEndpoint: (endpoint: NormalizedEndpoint | null) => void;
  addRecentEndpoint: (endpoint: NormalizedEndpoint) => void;
  togglePinnedEndpoint: (endpoint: NormalizedEndpoint) => void;
  isEndpointPinned: (endpointId: string) => boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  togglePathExpanded: (path: string) => void;
  setRequestState: (state: Partial<RequestState>) => void;
  setTheme: (theme: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      spec: null,
      selectedEndpoint: null,
      recentEndpoints: [],
      pinnedEndpoints: [],
      sidebarCollapsed: false,
      expandedPaths: new Set(),
      requestState: { loading: false, response: null, error: null },
      theme: DEFAULT_THEME_ID,

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

      togglePinnedEndpoint: (endpoint) => {
        set((state) => {
          const exists = state.pinnedEndpoints.find((p) => p.id === endpoint.id);
          if (exists) {
            return { pinnedEndpoints: state.pinnedEndpoints.filter((p) => p.id !== endpoint.id) };
          }
          return {
            pinnedEndpoints: [
              {
                id: endpoint.id,
                method: endpoint.method,
                path: endpoint.path,
                tag: endpoint.tags[0] || 'Other',
                pinnedAt: Date.now(),
              },
              ...state.pinnedEndpoints,
            ],
          };
        });
      },

      isEndpointPinned: (endpointId) => {
        return get().pinnedEndpoints.some((p) => p.id === endpointId);
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

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'api-workbench-store',
      partialize: (state) => ({
        [STORAGE_KEY_RECENT]: state.recentEndpoints,
        [STORAGE_KEY_SIDEBAR_COLLAPSED]: state.sidebarCollapsed,
        'api-workbench:pinned-endpoints': state.pinnedEndpoints,
        'api-workbench:theme': state.theme,
      }),
    }
  )
);
