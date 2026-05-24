import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { fetchScenarios } from '../api/benchmark';
import type { Scenario } from '../types';
import { SCENARIOS } from '../constants';

interface Props {
  onCustomDataChange: (data: object | null) => void;
}

const SCENARIO_LABELS: Record<Scenario, string> = {
  simple: 'Simple',
  medium: 'Medium',
  heavy: 'Heavy',
  extreme: 'Extreme',
};

export default function ScenarioDataViewer({ onCustomDataChange }: Props) {
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

  // When switching to custom mode — seed editor with current scenario's data
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

  // When tab changes in custom mode — seed editor with new tab's data
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
      setParseError('Invalid JSON — fix the data to apply');
    }
  }

  function handleToggleCustom() {
    setCustomMode((prev) => !prev);
  }

  const viewValue = scenarioData
    ? JSON.stringify(scenarioData[activeTab], null, 2)
    : '';

  return (
    <div className="card template-viewer-card">
      <button className="toggle-templates" onClick={() => setOpen((v) => !v)}>
        <span className="toggle-icon">{open ? '▾' : '▸'}</span>
        Scenario Data
        {customMode && <span className="badge-note" style={{ marginLeft: '0.5rem' }}>custom data active</span>}
      </button>

      {open && (
        <div className="template-viewer">
          {loading && <p className="muted">Loading scenario data…</p>}

          {!loading && scenarioData && (
            <>
              {/* Tabs */}
              <div className="engine-tabs">
                {SCENARIOS.map((s) => (
                  <button
                    key={s}
                    className={`tab-btn ${activeTab === s ? 'active' : ''}`}
                    onClick={() => setActiveTab(s)}
                  >
                    {SCENARIO_LABELS[s]}
                  </button>
                ))}
              </div>

              {/* Custom mode toggle */}
              <div className="scenario-custom-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={customMode}
                    onChange={handleToggleCustom}
                  />
                  Use custom data for benchmark run
                </label>
                {customMode && (
                  <p className="template-note">
                    Edit the JSON below. The modified data will be used instead of the built-in scenario
                    data when you run the benchmark. Switch tabs to seed a different scenario's data as starting point.
                  </p>
                )}
              </div>

              {parseError && (
                <p className="parse-error">{parseError}</p>
              )}

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
