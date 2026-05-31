import s from './ThTooltip.module.css';

interface Props {
  label: string;
  tip: string;
}

export default function ThTooltip({ label, tip }: Props) {
  return (
    <th className={s.th}>
      <span className={s.inner}>
        {label}
        <i className={s.icon}>?</i>
        <span className={s.bubble}>{tip}</span>
      </span>
    </th>
  );
}
