import type { TemplateEngine, Scenario } from './types';

export const ENGINES: TemplateEngine[] = ['handlebars', 'mustache', 'pug', 'ejs'];

export const SCENARIOS: Scenario[] = ['simple', 'medium', 'heavy', 'extreme'];

export const SCENARIO_LABELS: Record<Scenario, string> = {
  simple: 'Simple — 5 items',
  medium: 'Medium — 100 items + users',
  heavy: 'Heavy — 500 items + depts',
  extreme: 'Extreme — 1000 items + deep nesting',
};

export const RUNS_OPTIONS = [50, 100, 200] as const;

export const ENGINE_COLORS: Record<TemplateEngine, string> = {
  handlebars: '#f59e0b',
  mustache: '#10b981',
  pug: '#6366f1',
  ejs: '#ef4444',
};

// Playground — шаблоны по умолчанию для редактора
export const DEFAULT_TEMPLATES: Record<TemplateEngine, string> = {
  handlebars: `<h1>{{title}}</h1>\n<ul>\n{{#each items}}\n  <li>{{this}}</li>\n{{/each}}\n</ul>`,
  mustache: `<h1>{{title}}</h1>\n<ul>\n{{#items}}\n  <li>{{.}}</li>\n{{/items}}\n</ul>`,
  pug: `h1= title\nul\n  each item in items\n    li= item`,
  ejs: `<h1><%= title %></h1>\n<ul>\n<% items.forEach(item => { %>\n  <li><%= item %></li>\n<% }); %>\n</ul>`,
};

// Движки, которые рендерятся на сервере (Node.js only)
export const SERVER_ENGINES: TemplateEngine[] = ['pug', 'ejs'];
