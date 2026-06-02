import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import s from './TemplateViewer.module.css';
import { ENGINES } from '../../../../shared/constants';
import type { TemplateEngine } from '../../../../shared/types';
import { useTemplates } from '../../api';

const LANG_MAP: Record<TemplateEngine, string> = {
  handlebars: 'html',
  mustache: 'html',
  pug: 'plaintext',
  ejs: 'html',
};

export default function TemplateViewer() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [engine, setEngine] = useState<TemplateEngine>('handlebars');

  const { data: templates, isLoading } = useTemplates(open);

  return (
    <div className="card">
      <button className={s.toggle} onClick={() => setOpen((o) => !o)}>
        <span className={s.toggleIcon}>{open ? '−' : '+'}</span>
        {t('templates.toggleLabel')}
      </button>

      {open && (
        <div className={s.body}>
          <div className="engine-tabs" role="tablist">
            {ENGINES.map((e) => (
              <button
                key={e}
                type="button"
                role="tab"
                aria-selected={engine === e}
                className={`tab-btn ${engine === e ? 'active' : ''}`}
                onClick={() => setEngine(e)}
              >
                {e}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="muted" style={{ padding: '0.75rem 0' }}>
              {t('templates.loading')}
            </p>
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

          <p className={s.note} dangerouslySetInnerHTML={{ __html: t('templates.note') }} />
        </div>
      )}
    </div>
  );
}
