import type { HttpMethod } from './types';

export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: '#61affe',
  POST: '#49cc90',
  PUT: '#fca130',
  PATCH: '#50e3c2',
  DELETE: '#f93e3e',
  HEAD: '#9012fe',
  OPTIONS: '#0d5aa7',
};

export const DEFAULT_SERVER_PORT = 3000;
export const DEFAULT_SERVER_HOST = 'http://localhost';

export const DEFAULT_SERVERS = ['http://localhost:3000'];

export const STORAGE_KEY_RECENT = 'api-workbench:recent-endpoints';
export const STORAGE_KEY_HISTORY = 'api-workbench:request-history';
export const STORAGE_KEY_SIDEBAR_COLLAPSED = 'api-workbench:sidebar-collapsed';
