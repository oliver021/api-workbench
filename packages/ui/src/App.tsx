import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { SearchLanding } from '@/routes/SearchLanding';
import { EndpointRoute } from '@/routes/EndpointRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<SearchLanding />} />
        <Route path="/e/:method/*" element={<EndpointRoute />} />
      </Route>
    </Routes>
  );
}
