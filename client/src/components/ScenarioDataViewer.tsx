import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import { fetchScenarios } from '../api/benchmark';
import type { Scenario } from '../types';
import { SCENARIOS } from '../constants';

interface Props {
  onCustomDataChange: (data: object | null) => void;
}

export default function ScenarioDataViewer({ onCustomDataChange }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Scenario>('simple');
  const [scenarioData, setScenarioData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [parseError, setParseError] = useState('');

  useEffect(() => {
    if (open && !scenarioData) {
      setLoading(true);
      fetchScenarios()
        .then((data) => setScenarioData(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [open, scenarioData]);

  useEffect(() => {
    if (customMode && scenarioData) {
      const json = JSON.stringify(scenarioData[activeTab], null, 2);
      setEditValue(json);
      setParseError('');
      try {
        onCustomDataChange(scenarioData[activeTab] as object);
      } catch {
        // ignore
      }
    }
    if (!customMode) {
      onCustomDataChange(null);
      setParseError('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customMode]);

  useEffect(() => {
    if (customMode && scenarioData) {
      const json = JSON.stringify(scenarioData[activeTab], null, 2);
      setEditValue(json);
      setParseError('');
      try {
        onCustomDataChange(scenarioData[activeTab] as object);
      } catch {
        // ignore
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  function handleEditorChange(value: string | undefined) {
    const raw = value ?? '';
    setEditValue(raw);
    try {
      const parsed = JSON.parse(raw);
      setParseError('');
      onCustomDataChange(parsed);
    } catch {
      setParseError(t('scenarioData.parseError'));
    }
  }

  const viewValue = scenarioData
    ? JSON.stringify(scenarioData[activeTab], null, 2)
    : '';

  return (
    <div className="card template-viewer-card">
      <button className="toggle-templates" onClick={() => setOpen((v) => !v)}>
        <span className="toggle-icon">{open ? '▾' : '▸'}</span>
        {t('scenarioData.toggleLabel')}
        {customMode && (
          <span className="badge-note" style={{ marginLeft: '0.5rem' }}>
            {t('scenarioData.customBadge')}
          </span>
        )}
      </button>

      {open && (
        <div className="template-viewer">
          {loading && <p className="muted">{t('scenarioData.loading')}</p>}

          {!loading && scenarioData && (
            <>
              <div className="engine-tabs">
                {SCENARIOS.map((s) => (
                  <button
                    key={s}
                    className={`tab-btn ${activeTab === s ? 'active' : ''}`}
                    onClick={() => setActiveTab(s)}
                  >
                    {t(`scenarios.${s}_tab`, { defaultValue: s.charAt(0).toUpperCase() + s.slice(1) })}
                  </button>
                ))}
              </div>

              <div className="scenario-custom-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={customMode}
                    onChange={() => setCustomMode((prev) => !prev)}
                  />
                  {t('scenarioData.customToggle')}
                </label>
                {customMode && (
                  <p className="template-note">{t('scenarioData.customNote')}</p>
                )}
              </div>

              {parseError && <p className="parse-error">{parseError}</p>}

              <div className="editor-wrap">
                <Editor
                  height="360px"
                  language="json"
                  theme="vs-dark"
                  value={customMode ? editValue : viewValue}
                  options={{
                    readOnly: !customMode,
                    minimap: { enabled: false },
                    fontSize: 12,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'off',
                    folding: true,
                  }}
                  onChange={customMode ? handleEditorChange : undefined}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
