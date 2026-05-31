import { useTranslation } from 'react-i18next';
import { ENGINES, ENGINE_COLORS } from '../../../../shared/constants';
import type { TemplateEngine } from '../../../../shared/types';

interface Props {
  selected: TemplateEngine[];
  onChange: (engines: TemplateEngine[]) => void;
  disabled?: boolean;
}

export default function EngineMultiSelect({ selected, onChange, disabled }: Props) {
  const { t } = useTranslation();

  const toggle = (engine: TemplateEngine) =>
    onChange(
      selected.includes(engine)
        ? selected.filter((e) => e !== engine)
        : [...selected, engine],
    );

  return (
    <div className="field">
      <label>{t('engines.label')}</label>
      <div className="checkboxes-list">
        {ENGINES.map((engine) => (
          <label
            key={engine}
            className={`checkbox-label engine-label ${selected.includes(engine) ? 'checked' : ''}`}
            style={{ '--engine-color': ENGINE_COLORS[engine] } as React.CSSProperties}
          >
            <input
              type="checkbox"
              checked={selected.includes(engine)}
              onChange={() => toggle(engine)}
              disabled={disabled}
            />
            {engine}
          </label>
        ))}
      </div>
    </div>
  );
}
