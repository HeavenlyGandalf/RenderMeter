import Editor from '@monaco-editor/react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function TemplateEditor({ value, onChange }: Props) {
  return (
    <div className="field">
      <label>Template</label>
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
