import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BenchmarkPage from './pages/BenchmarkPage';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header />
      <Routes>
        <Route path="/" element={<BenchmarkPage />} />
      </Routes>
    </BrowserRouter>
  );
}
