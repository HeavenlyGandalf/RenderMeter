import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ENGINE_COLORS } from '../../shared/constants/engines';
import s from './DocsPage.module.css';

function ExternalLinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

interface EngineDoc {
  id: 'handlebars' | 'mustache' | 'pug' | 'ejs';
  docsUrl: string;
  perfClass: 'perf-fast' | 'perf-medium';
  syntaxLines: React.ReactNode[];
}

const ENGINE_DOCS: EngineDoc[] = [
  {
    id: 'handlebars',
    docsUrl: 'https://handlebarsjs.com/guide/',
    perfClass: 'perf-fast',
    syntaxLines: [
      <>
        <span className={s.comment}>{'{{!-- variables --}}'}</span>
      </>,
      <>
        <span className={s.tag}>{'<h1>'}</span>
        <span className={s.expr}>{'{{title}}'}</span>
        <span className={s.tag}>{'</h1>'}</span>
      </>,
      <></>,
      <>
        <span className={s.comment}>{'{{!-- block helpers --}}'}</span>
      </>,
      <>
        <span className={s.expr}>{'{{#each items}}'}</span>
      </>,
      <>
        {'  '}
        <span className={s.tag}>{'<li>'}</span>
        <span className={s.expr}>{'{{this}}'}</span>
        <span className={s.tag}>{'</li>'}</span>
      </>,
      <>
        <span className={s.expr}>{'{{/each}}'}</span>
      </>,
      <></>,
      <>
        <span className={s.expr}>{'{{#if isActive}}'}</span>
        <span className={s.str}>{' ok '}</span>
        <span className={s.expr}>{'{{/if}}'}</span>
      </>,
    ],
  },
  {
    id: 'mustache',
    docsUrl: 'https://mustache.github.io/mustache.5.html',
    perfClass: 'perf-fast',
    syntaxLines: [
      <>
        <span className={s.comment}>{'{{! variables }}'}</span>
      </>,
      <>
        <span className={s.tag}>{'<h1>'}</span>
        <span className={s.expr}>{'{{title}}'}</span>
        <span className={s.tag}>{'</h1>'}</span>
      </>,
      <></>,
      <>
        <span className={s.comment}>{'{{! sections (truthy / loop) }}'}</span>
      </>,
      <>
        <span className={s.expr}>{'{{#items}}'}</span>
      </>,
      <>
        {'  '}
        <span className={s.tag}>{'<li>'}</span>
        <span className={s.expr}>{'{{.}}'}</span>
        <span className={s.tag}>{'</li>'}</span>
      </>,
      <>
        <span className={s.expr}>{'{{/items}}'}</span>
      </>,
      <></>,
      <>
        <span className={s.comment}>{'{{! inverted section }}'}</span>
      </>,
      <>
        <span className={s.expr}>{'{{^items}}'}</span>
        <span className={s.str}>{' empty '}</span>
        <span className={s.expr}>{'{{/items}}'}</span>
      </>,
    ],
  },
  {
    id: 'pug',
    docsUrl: 'https://pugjs.org/api/getting-started.html',
    perfClass: 'perf-medium',
    syntaxLines: [
      <>
        <span className={s.comment}>{'//- indented, no closing tags'}</span>
      </>,
      <>
        <span className={s.tag}>{'h1'}</span> <span className={s.expr}>{'= title'}</span>
      </>,
      <>
        <span className={s.tag}>{'p'}</span>
        {' Text with '}
        <span className={s.expr}>{'#{variable}'}</span>
      </>,
      <></>,
      <>
        <span className={s.kw}>{'each'}</span>
        {' item '}
        <span className={s.kw}>{'in'}</span>
        {' items'}
      </>,
      <>
        {'  '}
        <span className={s.tag}>{'li'}</span> <span className={s.expr}>{'= item'}</span>
      </>,
      <></>,
      <>
        <span className={s.kw}>{'if'}</span>
        {' isActive'}
      </>,
      <>
        {'  '}
        <span className={s.tag}>{'span'}</span>
        {' active'}
      </>,
      <>
        <span className={s.kw}>{'else'}</span>
      </>,
      <>
        {'  '}
        <span className={s.tag}>{'span'}</span>
        {' inactive'}
      </>,
    ],
  },
  {
    id: 'ejs',
    docsUrl: 'https://ejs.co/#docs',
    perfClass: 'perf-fast',
    syntaxLines: [
      <>
        <span className={s.comment}>{'<%# output (escaped) %>'}</span>
      </>,
      <>
        <span className={s.tag}>{'<h1>'}</span>
        <span className={s.expr}>{'<%= title %>'}</span>
        <span className={s.tag}>{'</h1>'}</span>
      </>,
      <></>,
      <>
        <span className={s.comment}>{'<%# code block %>'}</span>
      </>,
      <>
        <span className={s.expr}>{'<% items.forEach(item => { %>'}</span>
      </>,
      <>
        {'  '}
        <span className={s.tag}>{'<li>'}</span>
        <span className={s.expr}>{'<%= item %>'}</span>
        <span className={s.tag}>{'</li>'}</span>
      </>,
      <>
        <span className={s.expr}>{'<% }); %>'}</span>
      </>,
      <></>,
      <>
        <span className={s.comment}>{'<%# unescaped output %>'}</span>
      </>,
      <>
        <span className={s.expr}>{'<%- htmlContent %>'}</span>
      </>,
    ],
  },
];

export default function DocsPage() {
  const { t } = useTranslation();

  return (
    <main className="page">
      <div className="page-header">
        <div className="page-title">{t('docs.title')}</div>
        <div className="page-subtitle">{t('docs.subtitle')}</div>
      </div>

      <div className={s.intro}>
        <InfoIcon />
        <span>
          {t('docs.intro')}{' '}
          <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            {t('nav.benchmark')}
          </Link>{' '}
          {t('docs.introOr')}{' '}
          <Link to="/playground" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            {t('nav.playground')}
          </Link>
          .
        </span>
      </div>

      <div className={s.grid}>
        {ENGINE_DOCS.map((eng) => (
          <div key={eng.id} className={s.engineCard}>
            <div className={s.cardHeader}>
              <div className={s.nameRow}>
                <div className={s.dot} style={{ background: ENGINE_COLORS[eng.id] }} />
                <span className={s.engineName}>{eng.id}</span>
              </div>
              <a
                href={eng.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={s.docsLink}
              >
                {t('docs.officialDocs')} <ExternalLinkIcon />
              </a>
            </div>

            <p className={s.description}>{t(`docs.engines.${eng.id}.description`)}</p>

            <div>
              <div className={s.featuresLabel}>{t('docs.features')}</div>
              <ul className={s.featuresList}>
                {(t(`docs.engines.${eng.id}.features`, { returnObjects: true }) as string[]).map(
                  (f, i) => (
                    <li key={i}>{f}</li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <div className={s.syntaxLabel}>{t('docs.syntax')}</div>
              <div className={s.codeBlock}>
                {eng.syntaxLines.map((line, i) => (
                  <div key={i}>{line || ' '}</div>
                ))}
              </div>
            </div>

            <div className={s.perfRow}>
              <span className={`${s.performanceBadge} ${s[eng.perfClass]}`}>
                {t(`docs.engines.${eng.id}.perfLabel`)}
              </span>
              <span className={s.perfNote}>{t(`docs.engines.${eng.id}.perfNote`)}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
