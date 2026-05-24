import { ENGINES } from '../constants';
import type { TemplateEngine } from '../types';

interface Props {
  value: TemplateEngine;
  onChange: (engine: TemplateEngine) => void;
}

export default function EngineSelector({ value, onChange }: Props) {
  return (
    <div className="field">
      <label htmlFor="engine-select">Template Engine</label>
      <select
        id="engine-select"
        value={value}
        onChange={(e) => onChange(e.target.value as TemplateEngine)}
      >
        {ENGINES.map((engine) => (
          <option key={engine} value={engine}>
            {engine}
          </option>
        ))}
      </select>
    </div>
  );
}
