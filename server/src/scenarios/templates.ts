// Один шаблон на движок — обрабатывает любой сценарий.
// Опциональное поле departments просто не рендерится, если его нет.

export const TEMPLATES: Record<string, string> = {
  handlebars: `\
<html><head><title>{{title}}</title></head>
<body>
<h1>{{title}}</h1>
<p>{{description}}</p>
<ul>
  {{#each items}}
  <li>{{this}}</li>
  {{/each}}
</ul>
<table>
  <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Status</th><th>Score</th></tr></thead>
  <tbody>
  {{#each users}}
    <tr class="{{#if this.active}}active{{else}}inactive{{/if}}">
      <td>{{this.id}}</td><td>{{this.name}}</td><td>{{this.email}}</td>
      <td>{{#if this.active}}Active{{else}}Inactive{{/if}}</td>
      <td>{{this.score}}</td>
    </tr>
  {{/each}}
  </tbody>
</table>
{{#each departments}}
<section>
  <h2>{{this.name}}</h2>
  <p>Manager: {{this.manager}}</p>
  <ul>
  {{#each this.employees}}
    <li>{{this.name}} — {{this.role}} (Level {{this.level}})</li>
  {{/each}}
  </ul>
</section>
{{/each}}
</body></html>`,

  mustache: `\
<html><head><title>{{title}}</title></head>
<body>
<h1>{{title}}</h1>
<p>{{description}}</p>
<ul>{{#items}}<li>{{.}}</li>{{/items}}</ul>
<table>
  <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Status</th><th>Score</th></tr></thead>
  <tbody>
  {{#users}}
    <tr>
      <td>{{id}}</td><td>{{name}}</td><td>{{email}}</td>
      <td>{{#active}}Active{{/active}}{{^active}}Inactive{{/active}}</td>
      <td>{{score}}</td>
    </tr>
  {{/users}}
  </tbody>
</table>
{{#departments}}
<section>
  <h2>{{name}}</h2>
  <p>Manager: {{manager}}</p>
  <ul>{{#employees}}<li>{{name}} — {{role}} (Level {{level}})</li>{{/employees}}</ul>
</section>
{{/departments}}
</body></html>`,

  pug: `\
html
  head
    title= title
  body
    h1= title
    p= description
    ul
      each item in items
        li= item
    table
      thead
        tr
          th ID
          th Name
          th Email
          th Status
          th Score
      tbody
        each user in users
          tr(class=user.active ? 'active' : 'inactive')
            td= user.id
            td= user.name
            td= user.email
            td= user.active ? 'Active' : 'Inactive'
            td= user.score
    if departments && departments.length
      each dept in departments
        section
          h2= dept.name
          p Manager: \#{dept.manager}
          ul
            each emp in dept.employees
              li \#{emp.name} — \#{emp.role} (Level \#{emp.level})`,

  ejs: `\
<html><head><title><%= title %></title></head>
<body>
<h1><%= title %></h1>
<p><%= description %></p>
<ul>
<% items.forEach(item => { %><li><%= item %></li>
<% }); %>
</ul>
<table>
  <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Status</th><th>Score</th></tr></thead>
  <tbody>
<% users.forEach(u => { %>
    <tr class="<%= u.active ? 'active' : 'inactive' %>">
      <td><%= u.id %></td><td><%= u.name %></td><td><%= u.email %></td>
      <td><%= u.active ? 'Active' : 'Inactive' %></td>
      <td><%= u.score %></td>
    </tr>
<% }); %>
  </tbody>
</table>
<% if (typeof departments !== 'undefined' && departments && departments.length) { %>
<% departments.forEach(dept => { %>
<section>
  <h2><%= dept.name %></h2>
  <p>Manager: <%= dept.manager %></p>
  <ul><% dept.employees.forEach(emp => { %><li><%= emp.name %> — <%= emp.role %> (Level <%= emp.level %>)</li><% }); %></ul>
</section>
<% }); %>
<% } %>
</body></html>`,
};
