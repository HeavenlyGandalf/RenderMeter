import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import { ENGINES } from '../constants';
import type { TemplateEngine } from '../types';
import { fetchTemplates } from '../api/benchmark';

const LANG_MAP: Record<TemplateEngine, string> = {
  handlebars: 'html',
  mustache: 'html',
  pug: 'python',
  ejs: 'html',
};

export default function TemplateViewer() {
  const { t } = useTranslation();
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
        {t('templates.toggleLabel')}
      </button>

      {open && (
        <div className="template-viewer">
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

          {loading ? (
            <p className="muted" style={{ padding: '0.75rem 0' }}>{t('templates.loading')}</p>
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

          <p
            className="template-note"
            dangerouslySetInnerHTML={{ __html: t('templates.note') }}
          />
        </div>
      )}
    </div>
  );
}
