import Editor from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function TemplateEditor({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="field">
      <label>{t('playground.templateLabel')}</label>
      <div className="editor-wrap">
        <Editor
          height="200px"
          defaultLanguage="html"
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange(val ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'off',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 8, bottom: 8 },
          }}
        />
      </div>
    </div>
  );
}
