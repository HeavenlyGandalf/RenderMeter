import { useTranslation } from 'react-i18next';
import { ENGINES } from '../../../../shared/constants';
import type { TemplateEngine } from '../../../../shared/types';

interface Props {
  value: TemplateEngine;
  onChange: (engine: TemplateEngine) => void;
}

export default function EngineSelector({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="field">
      <label htmlFor="engine-select">{t('engines.selectLabel')}</label>
      <select id="engine-select" value={value} onChange={(e) => onChange(e.target.value as TemplateEngine)}>
        {ENGINES.map((engine) => <option key={engine} value={engine}>{engine}</option>)}
      </select>
    </div>
  );
}
