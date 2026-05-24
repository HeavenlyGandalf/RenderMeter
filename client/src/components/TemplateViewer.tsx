import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { ENGINES } from '../constants';
import type { TemplateEngine } from '../types';
import { fetchTemplates } from '../api/benchmark';

// Monaco не знает синтаксис handlebars/mustache/pug — используем ближайшие аналоги
const LANG_MAP: Record<TemplateEngine, string> = {
  handlebars: 'html',
  mustache: 'html',
  pug: 'python', // отступы похожи; 'jade' не всегда доступен в bundled Monaco
  ejs: 'html',
};

export default function TemplateViewer() {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<Record<string, string> | null>(null);
  const [engine, setEngine] = useState<TemplateEngine>('handlebars');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || templates) return;
    setLoading(true);
    fetchTemplates()
      .then(setTemplates)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, templates]);

  return (
    <div className="card template-viewer-card">
      <button className="toggle-templates" onClick={() => setOpen((o) => !o)}>
        <span className="toggle-icon">{open ? '−' : '+'}</span>
        Templates used in benchmarks
      </button>

      {open && (
        <div className="template-viewer">
          {/* Engine tabs */}
          <div className="engine-tabs">
            {ENGINES.map((e) => (
              <button
                key={e}
                className={`tab-btn ${engine === e ? 'active' : ''}`}
                onClick={() => setEngine(e)}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Template editor — read-only */}
          {loading ? (
            <p className="muted" style={{ padding: '0.75rem 0' }}>Loading…</p>
          ) : templates ? (
            <div className="editor-wrap">
              <Editor
                height="220px"
                language={LANG_MAP[engine]}
                theme="vs-dark"
                value={templates[engine] ?? '// template not found'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 8, bottom: 8 },
                }}
              />
            </div>
          ) : null}

          <p className="template-note">
            All engines receive identical data — only syntax differs. Data: <code>title</code>, <code>description</code>, <code>items[]</code>, <code>users[]</code>, and optional <code>departments[]</code> (heavy / extreme scenarios).
          </p>
        </div>
      )}
    </div>
  );
}
