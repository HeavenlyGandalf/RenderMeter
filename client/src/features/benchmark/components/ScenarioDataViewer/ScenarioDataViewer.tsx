import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import s from './ScenarioDataViewer.module.css';
import { SCENARIOS } from '../../../../shared/constants';
import type { Scenario } from '../../../../shared/types';
import { useScenarios } from '../../api';

interface Props {
  onCustomDataChange: (data: object | null) => void;
}

export default function ScenarioDataViewer({ onCustomDataChange }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Scenario>('simple');
  const [customMode, setCustomMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [parseError, setParseError] = useState('');

  const { data: scenarioData, isLoading } = useScenarios(open);

  // Seed editor when switching to custom mode or changing tab
  useEffect(() => {
    if (!scenarioData) return;
    if (customMode) {
      const json = JSON.stringify(scenarioData[activeTab], null, 2);
      setEditValue(json);
      setParseError('');
      onCustomDataChange(scenarioData[activeTab] as object);
    }
  }, [customMode, activeTab, scenarioData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!customMode) {
      onCustomDataChange(null);
      setParseError('');
    }
  }, [customMode]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleEditorChange(value: string | undefined) {
    const raw = value ?? '';
    setEditValue(raw);
    try {
      onCustomDataChange(JSON.parse(raw));
      setParseError('');
    } catch {
      setParseError(t('scenarioData.parseError'));
    }
  }

  const viewValue = scenarioData ? JSON.stringify(scenarioData[activeTab], null, 2) : '';

  return (
    <div className="card">
      <button className={s.toggle} onClick={() => setOpen((v) => !v)}>
        <span className={s.toggleIcon}>{open ? '▾' : '▸'}</span>
        {t('scenarioData.toggleLabel')}
        {customMode && <span className="badge-note" style={{ marginLeft: '0.5rem' }}>{t('scenarioData.customBadge')}</span>}
      </button>

      {open && (
        <div className={s.body}>
          {isLoading && <p className="muted">{t('scenarioData.loading')}</p>}

          {!isLoading && scenarioData && (
            <>
              <div className="engine-tabs">
                {SCENARIOS.map((sc) => (
                  <button key={sc} className={`tab-btn ${activeTab === sc ? 'active' : ''}`} onClick={() => setActiveTab(sc)}>
                    {sc.charAt(0).toUpperCase() + sc.slice(1)}
                  </button>
                ))}
              </div>

              <div className={s.customRow}>
                <label className="checkbox-label">
                  <input type="checkbox" checked={customMode} onChange={() => setCustomMode((p) => !p)} />
                  {t('scenarioData.customToggle')}
                </label>
                {customMode && <p className={s.note}>{t('scenarioData.customNote')}</p>}
              </div>

              {parseError && <p className={s.parseError}>{parseError}</p>}

              <div className="editor-wrap">
                <Editor
                  height="360px"
                  language="json"
                  theme="vs-dark"
                  value={customMode ? editValue : viewValue}
                  options={{ readOnly: !customMode, minimap: { enabled: false }, fontSize: 12, lineNumbers: 'on', scrollBeyondLastLine: false, wordWrap: 'off', folding: true }}
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
