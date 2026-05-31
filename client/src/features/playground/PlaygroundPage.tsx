import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Handlebars from 'handlebars';
import Mustache from 'mustache';
import type { TemplateEngine, RenderResult } from '../../shared/types';
import { DEFAULT_TEMPLATES, SERVER_ENGINES } from '../../shared/constants';
import { useSaveResult, useServerRender, usePlaygroundHistory } from './api';
import EngineSelector from './components/EngineSelector/EngineSelector';
import HistoryList from './components/HistoryList/HistoryList';
import PreviewPanel from './components/PreviewPanel/PreviewPanel';
import ErrorMessage from '../../shared/components/ErrorMessage/ErrorMessage';
import TemplateEditor from './components/TemplateEditor/TemplateEditor';
import BenchmarkRunner from './components/BenchmarkRunner/BenchmarkRunner';

const SAMPLE_DATA = {
  title: 'RenderMeter',
  items: ['Apple', 'Banana', 'Cherry'],
  user: { name: 'Developer', active: true },
};

function renderClientSide(engine: TemplateEngine, template: string): RenderResult {
  const start = performance.now();
  let html: string;
  switch (engine) {
    case 'handlebars': html = Handlebars.compile(template)(SAMPLE_DATA); break;
    case 'mustache':   html = Mustache.render(template, SAMPLE_DATA); break;
    default: throw new Error(`Not a client-side engine: ${engine}`);
  }
  return { html, executionTimeMs: Math.round((performance.now() - start) * 1000) / 1000 };
}

export default function PlaygroundPage() {
  const { t } = useTranslation();
  const [engine, setEngine] = useState<TemplateEngine>('handlebars');
  const [template, setTemplate] = useState(DEFAULT_TEMPLATES['handlebars']);
  const [result, setResult] = useState<RenderResult | null>(null);
  const [error, setError] = useState('');

  const { mutate: saveResult } = useSaveResult();
  const { mutate: serverRender, isPending: isServerPending } = useServerRender();
  const { data: history = [], isLoading: historyLoading } = usePlaygroundHistory();

  const isRunning = isServerPending;

  function handleEngineChange(next: TemplateEngine) {
    setEngine(next);
    setTemplate(DEFAULT_TEMPLATES[next]);
    setResult(null);
    setError('');
  }

  function handleRun() {
    if (isRunning) return;
    setError('');

    if (SERVER_ENGINES.includes(engine)) {
      serverRender({ engine, template }, {
        onSuccess: (rendered) => {
          setResult(rendered);
          saveResult({ templateEngine: engine, executionTimeMs: rendered.executionTimeMs, templateSize: template.length });
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'Render failed');
          setResult(null);
        },
      });
    } else {
      try {
        const rendered = renderClientSide(engine, template);
        setResult(rendered);
        saveResult({ templateEngine: engine, executionTimeMs: rendered.executionTimeMs, templateSize: template.length });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Render failed');
        setResult(null);
      }
    }
  }

  return (
    <main className="page">
      <div className="page-header">
        <div className="page-title">{t('playground.title')}</div>
        <div className="page-subtitle">
          {t('playground.subtitle')}{' — '}
          <Link to="/docs" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 'inherit' }}>
            {t('docs.title')} →
          </Link>
        </div>
      </div>

      <div className="card controls">
        <EngineSelector value={engine} onChange={handleEngineChange} />
        <div className="server-note">
          {SERVER_ENGINES.includes(engine) && (
            <span className="badge-note">{t('playground.serverBadge')}</span>
          )}
        </div>
        <TemplateEditor value={template} onChange={setTemplate} />
        <BenchmarkRunner isRunning={isRunning} executionTimeMs={result?.executionTimeMs ?? null} onRun={handleRun} />
        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      </div>

      <PreviewPanel html={result?.html ?? ''} />

      <div className="card">
        <h2>{t('benchmark.history')}</h2>
        <HistoryList history={history} isLoading={historyLoading} />
      </div>
    </main>
  );
}
