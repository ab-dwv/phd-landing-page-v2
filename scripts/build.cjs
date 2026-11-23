const fs = require('node:fs');
const path = require('node:path');
const { programmes } = require('../catalogue.js');
const root = path.resolve(__dirname, '..');
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const cards = programmes.map((programme) => `          <article class="domain-card" data-programme-id="${escape(programme.id)}" data-group="${escape(programme.group)}" data-search="${escape(`${programme.name} ${programme.summary} ${programme.keywords} ${programme.areas.join(' ')}`.toLowerCase())}">
            <header class="domain-card-header"><h3>${escape(programme.name)}</h3><svg aria-hidden="true"><use href="#${escape(programme.icon)}"/></svg></header>
            <p>${escape(programme.summary)}</p>
            <details class="programme-detail"><summary>Explore discipline <svg aria-hidden="true"><use href="#plus"/></svg></summary><ul>${programme.areas.map((area) => `<li>${escape(area)}</li>`).join('')}</ul><div class="programme-actions"><a class="inline-link" href="${escape(programme.url)}" target="_blank" rel="noopener" data-track="programme_official" data-programme="${escape(programme.id)}">Official programme details <svg aria-hidden="true"><use href="#external"/></svg></a><button class="button button-small" type="button" data-choose-programme="${escape(programme.id)}">Enquire about this field <svg aria-hidden="true"><use href="#arrow"/></svg></button></div></details>
          </article>`).join('\n');
const file = path.join(root, 'index.html');
const source = fs.readFileSync(file, 'utf8');
if (!source.includes('<!-- PROGRAMMES:START -->') || !source.includes('<!-- PROGRAMMES:END -->')) throw new Error('Programme markers are missing.');
fs.writeFileSync(file, source.replace(/<!-- PROGRAMMES:START -->[\s\S]*?<!-- PROGRAMMES:END -->/, `<!-- PROGRAMMES:START -->\n${cards}\n          <!-- PROGRAMMES:END -->`));
console.log(`Built ${programmes.length} verified discipline cards into index.html.`);
