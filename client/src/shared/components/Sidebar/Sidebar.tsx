import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../LangSwitcher/LangSwitcher';
import s from './Sidebar.module.css';

function BenchmarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function PlaygroundIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default function Sidebar() {
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { to: '/', end: true,  icon: <BenchmarkIcon />,  label: t('nav.benchmark'),  sub: t('nav.benchmarkSub') },
    { to: '/playground', end: false, icon: <PlaygroundIcon />, label: t('nav.playground'), sub: t('nav.playgroundSub') },
  ];

  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <div className={s.logo}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="4" fill="var(--accent)" opacity="0.15" />
            <polyline points="5 15 9 9 13 13 17 7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="17" cy="7" r="2" fill="var(--accent)" />
          </svg>
        </div>
        <div>
          <div className={s.brandName}>RenderMeter</div>
          <div className={s.brandSub}>{t('sidebar.subtitle')}</div>
        </div>
      </div>

      <div className={s.sectionLabel}>{t('sidebar.nav')}</div>

      <nav className={s.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}
          >
            <span className={s.linkIcon}>{item.icon}</span>
            <span className={s.linkText}>
              <span className={s.linkLabel}>{item.label}</span>
              <span className={s.linkSub}>{item.sub}</span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className={s.footer}>
        <LangSwitcher />
        <div className={s.footerTag}>{t('sidebar.footer')}</div>
      </div>
    </aside>
  );
}
