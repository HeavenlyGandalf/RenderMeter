import type { TemplateEngine } from './types';

export const ENGINES: TemplateEngine[] = ['handlebars', 'mustache'];

export const DEFAULT_TEMPLATES: Record<TemplateEngine, string> = {
  handlebars: `<h1>{{title}}</h1>\n<ul>\n{{#each items}}\n  <li>{{this}}</li>\n{{/each}}\n</ul>`,
  mustache: `<h1>{{title}}</h1>\n<ul>\n{{#items}}\n  <li>{{.}}</li>\n{{/items}}\n</ul>`,
};
