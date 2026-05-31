import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import styles from './EditorTabs.module.css';

type Tab = 'template' | 'data';

interface Props {
  template: string;
  onTemplateChange: (value: string) => void;
  data: string;
  onDataChange: (value: string) => void;
  dataError?: string;
}

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 13,
  lineNumbers: 'off' as const,
  scrollBeyondLastLine: false,
  wordWrap: 'on' as const,
  padding: { top: 8, bottom: 8 },
};

export default function EditorTabs({ template, onTemplateChange, data, onDataChange, dataError }: Props) {
  const { t } = useTranslation();
  const [active, setActive] = useState<Tab>('template');

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${active === 'template' ? styles.active : ''}`}
          onClick={() => setActive('template')}
        >
          {t('playground.tabTemplate')}
        </button>
        <button
          type="button"
          className={`${styles.tab} ${active === 'data' ? styles.active : ''}`}
          onClick={() => setActive('data')}
        >
          {t('playground.tabData')}
          {dataError && <span className={styles.errorDot} />}
        </button>
      </div>

      <div className={styles.editorWrap}>
        <div style={{ display: active === 'template' ? 'block' : 'none' }}>
          <Editor
            height="200px"
            defaultLanguage="html"
            theme="vs-dark"
            value={template}
            onChange={(val) => onTemplateChange(val ?? '')}
            options={EDITOR_OPTIONS}
          />
        </div>
        <div style={{ display: active === 'data' ? 'block' : 'none' }}>
          <Editor
            height="200px"
            defaultLanguage="json"
            theme="vs-dark"
            value={data}
            onChange={(val) => onDataChange(val ?? '')}
            options={EDITOR_OPTIONS}
          />
        </div>
      </div>

      {dataError && (
        <div className={styles.dataError}>{dataError}</div>
      )}
    </div>
  );
}
