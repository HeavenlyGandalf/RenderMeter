import { SCENARIOS, SCENARIO_LABELS } from '../constants';
import type { Scenario } from '../types';

interface Props {
  selected: Scenario[];
  onChange: (scenarios: Scenario[]) => void;
  disabled?: boolean;
}

export default function ScenarioSelector({ selected, onChange, disabled }: Props) {
  const toggle = (scenario: Scenario) => {
    onChange(
      selected.includes(scenario)
        ? selected.filter((s) => s !== scenario)
        : [...selected, scenario]
    );
  };

  return (
    <div className="field">
      <label>Scenarios</label>
      <div className="scenario-list">
        {SCENARIOS.map((scenario) => (
          <label key={scenario} className="checkbox-label">
            <input
              type="checkbox"
              checked={selected.includes(scenario)}
              onChange={() => toggle(scenario)}
              disabled={disabled}
            />
            <span className="scenario-badge">{scenario}</span>
            <span className="scenario-desc">{SCENARIO_LABELS[scenario].split(' — ')[1]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
