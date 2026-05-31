import { useTranslation } from 'react-i18next';
import { SCENARIOS } from '../../../../shared/constants';
import type { Scenario } from '../../../../shared/types';

interface Props {
  selected: Scenario[];
  onChange: (scenarios: Scenario[]) => void;
  disabled?: boolean;
}

export default function ScenarioSelector({ selected, onChange, disabled }: Props) {
  const { t } = useTranslation();

  const toggle = (scenario: Scenario) =>
    onChange(
      selected.includes(scenario)
        ? selected.filter((s) => s !== scenario)
        : [...selected, scenario],
    );

  return (
    <div className="field">
      <label>{t('scenarios.label')}</label>
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
            <span className="scenario-desc">{t(`scenarios.${scenario}`)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
