import type { TemplateEngine } from './types';

export const ENGINES: TemplateEngine[] = ['handlebars', 'mustache', 'pug', 'ejs'];

export const DEFAULT_TEMPLATES: Record<TemplateEngine, string> = {
  handlebars: `<h1>{{title}}</h1>\n<ul>\n{{#each items}}\n  <li>{{this}}</li>\n{{/each}}\n</ul>`,
  mustache: `<h1>{{title}}</h1>\n<ul>\n{{#items}}\n  <li>{{.}}</li>\n{{/items}}\n</ul>`,
  pug: `h1= title\nul\n  each item in items\n    li= item`,
  ejs: `<h1><%= title %></h1>\n<ul>\n<% items.forEach(item => { %>\n  <li><%= item %></li>\n<% }); %>\n</ul>`,
};

// Движки, которые рендерятся на сервере (Node.js only)
export const SERVER_ENGINES: TemplateEngine[] = ['pug', 'ejs'];
