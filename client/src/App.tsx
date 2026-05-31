import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BenchmarkPage from './pages/BenchmarkPage';
import PlaygroundPage from './pages/PlaygroundPage';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-shell">
        <Sidebar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<BenchmarkPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
