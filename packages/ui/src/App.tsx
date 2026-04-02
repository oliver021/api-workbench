import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { SearchLanding } from '@/routes/SearchLanding';
import { EndpointRoute } from '@/routes/EndpointRoute';
import { useAppStore } from '@/stores/appStore';
import { getTheme, THEMES } from '@/themes';
import { applyTheme } from '@/lib/theme';

export default function App() {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    const savedTheme = theme || THEMES[0].id;
    const t = getTheme(savedTheme);
    applyTheme(t);
    setTheme(savedTheme);
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<SearchLanding />} />
        <Route path="/e/:method/*" element={<EndpointRoute />} />
      </Route>
    </Routes>
  );
}
