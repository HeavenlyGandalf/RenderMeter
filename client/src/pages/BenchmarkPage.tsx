import { useState } from 'react';
import { renderTemplate } from '../renderer';
import { saveResult } from '../api/results';
import { DEFAULT_TEMPLATES } from '../constants';
import type { TemplateEngine, RenderResult } from '../types';
import EngineSelector from '../components/EngineSelector';
import TemplateEditor from '../components/TemplateEditor';
import BenchmarkRunner from '../components/BenchmarkRunner';
import PreviewPanel from '../components/PreviewPanel';
import HistoryList from '../components/HistoryList';
import ErrorMessage from '../components/ErrorMessage';

export default function BenchmarkPage() {
  const [engine, setEngine] = useState<TemplateEngine>('handlebars');
  const [template, setTemplate] = useState(DEFAULT_TEMPLATES['handlebars']);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<RenderResult | null>(null);
  const [error, setError] = useState('');
  const [historyKey, setHistoryKey] = useState(0);

  function handleEngineChange(next: TemplateEngine) {
    setEngine(next);
    setTemplate(DEFAULT_TEMPLATES[next]);
    setResult(null);
    setError('');
  }

  async function handleRun() {
    if (isRunning) return;

    setIsRunning(true);
    setError('');

    try {
      const rendered = await renderTemplate(engine, template);
      setResult(rendered);

      await saveResult({
        templateEngine: engine,
        executionTimeMs: rendered.executionTimeMs,
        templateSize: template.length,
      });

      setHistoryKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Render failed');
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="page">
      <div className="card controls">
        <EngineSelector value={engine} onChange={handleEngineChange} />
        <TemplateEditor value={template} onChange={setTemplate} />
        <BenchmarkRunner
          isRunning={isRunning}
          executionTimeMs={result?.executionTimeMs ?? null}
          onRun={handleRun}
        />
        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      </div>

      <PreviewPanel html={result?.html ?? ''} />

      <div className="card">
        <h2>History</h2>
        <HistoryList refreshKey={historyKey} />
      </div>
    </main>
  );
}
