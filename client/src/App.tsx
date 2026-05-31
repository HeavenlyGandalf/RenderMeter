import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './shared/components/Sidebar/Sidebar';
import BenchmarkPage from './features/benchmark/BenchmarkPage';
import PlaygroundPage from './features/playground/PlaygroundPage';
import DocsPage from './features/docs/DocsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app-shell">
          <Sidebar />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<BenchmarkPage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/docs" element={<DocsPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
