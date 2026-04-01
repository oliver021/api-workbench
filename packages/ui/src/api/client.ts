const API_BASE = '';

export async function fetchSpec() {
  const res = await fetch(`${API_BASE}/api/spec/full`);
  if (!res.ok) throw new Error('Failed to fetch spec');
  return res.json();
}

export async function fetchEndpoints(tag?: string, search?: string) {
  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (search) params.set('search', search);
  const res = await fetch(`${API_BASE}/api/endpoints?${params}`);
  if (!res.ok) throw new Error('Failed to fetch endpoints');
  return res.json();
}

export async function fetchEndpoint(id: string) {
  const res = await fetch(`${API_BASE}/api/endpoints/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('Failed to fetch endpoint');
  return res.json();
}

export async function fetchTags() {
  const res = await fetch(`${API_BASE}/api/tags`);
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

export async function fetchSchema(name: string) {
  const res = await fetch(`${API_BASE}/api/schemas/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('Failed to fetch schema');
  return res.json();
}

export async function executeRequest(payload: {
  method: string;
  path: string;
  url: string;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  body?: unknown;
}) {
  const res = await fetch(`${API_BASE}/proxy/${payload.method}/${payload.path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: payload.url,
      params: payload.params || {},
      headers: payload.headers || {},
      body: payload.body,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
}
