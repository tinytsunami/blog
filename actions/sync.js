//==========================================================
// Import
//==========================================================
import fs from 'fs';
import path from 'path';

import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

//==========================================================
// Constants
//==========================================================
const DEBUG = (process.env.DEBUG === 'true');
const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DATASOURCE_ID = process.env.NOTION_DATASOURCE_ID;

//==========================================================
// Connect to notion
//==========================================================
const notion = new Client({
  auth: NOTION_KEY,
});

const n2m = new NotionToMarkdown({
    notionClient: notion,
});

if (DEBUG)
    fs.mkdir(path.join(__dirname, '.tmp'))

//==========================================================
// Collect articles
//==========================================================
let articles = [];
let cursor = undefined;

while (true)
{
    let res = await notion.dataSources.query({
        data_source_id: NOTION_DATASOURCE_ID,
        filter: {
            property: "published",
            checkbox: { 
                equals: true 
            },
        },
        archived: false,
        in_trash: false,
        sorts: [
            {
            property: "created",
            direction: "descending"
            }
        ],
        start_cursor: cursor,
        page_size: 100
    });


    articles.push(...res.results);

    if (!res.has_more) break;
    cursor = res.next_cursor;
}

if (DEBUG)
    fs.writeFileSync('.tmp/source.json', JSON.stringify(articles, null, 2));

//==========================================================
// Parsing articles
//==========================================================
function getIcon(icon) {
  if (!icon) return null;

  switch (icon.type) {
    case 'emoji':       return icon.emoji;
    case 'external':    return icon.external?.url || null;
    case 'file':        return icon.file?.url || null;
    default:            return null;
  }
}

function getProperty(prop) {
    if (!prop) return null;

    switch (prop.type) {
        case 'title':
        case 'rich_text':        return prop[prop.type].map(t => t.plain_text).join('');
        case 'number':           return prop.number;
        case 'people':           return prop.people[0].name;
        case 'select':           return prop.select?.name || null;
        case 'multi_select':     return prop.multi_select.map(s => s.name);
        case 'created_time':     return prop.created_time || null;
        case 'last_edited_time': return prop.last_edited_time || null;
        case 'checkbox':         return prop.checkbox;
        case 'emoji':            return prop.emoji;
        default:                 return null;
    }
}

async function getContent(id) {
    const mdBlocks = await n2m.pageToMarkdown(id);
    const md = n2m.toMarkdownString(mdBlocks);
    return md.parent;
}

function formatDate(iso) {
  const d = new Date(iso);
  const pad = (n) => n.toString().padStart(2, '0');

  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const slugs = {};

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除 emoji / 非字元
    .replace(/\s+/g, '-')     // 空白變 -
    .replace(/-+/g, '-');     // 多個 - 合併
}

const parsed = await Promise.all(
    articles.map(async (article) => {

        // Genreate permalink (use customed or generation-by-title) with uniqueness
        let permalink = slugify(getProperty(article.properties.permalink));
        
        if (!!!permalink || permalink === "")
        {
            permalink = slugify(getProperty(article.properties.title));
            if (!!!Object.hasOwn(slugs, permalink))
                slugs[permalink] = 1;
            else 
            {
                permalink = `${permalink}-${slugs[permalink]}`
                slugs[permalink]++;
            }
        }

        // Get parsed objects
        return {
            'icon':      getIcon(article.icon),
            'title':     getProperty(article.properties.title),
            'permalink': permalink,
            'category':  getProperty(article.properties.category),
            'author':    getProperty(article.properties.author),
            'created':   formatDate(getProperty(article.properties.created)),
            'updated':   formatDate(getProperty(article.properties.updated)),
            'mathjax':   getProperty(article.properties.mathjax),
            'content':   await getContent(article.id),
        }
    })
);

if (DEBUG)
    fs.writeFileSync('.tmp/parsed.json', JSON.stringify(parsed, null, 2));

//==========================================================
// Clear articles
//==========================================================
for (const file of fs.readdirSync('source/_posts')) {
  fs.rmSync(path.join(dir, file), { recursive: true, force: true });
}

//==========================================================
// Posted articles
//==========================================================
const template = fs.readFileSync('./scaffolds/sync.md', 'utf-8');

parsed.forEach((p) => {

    const post = template.replace('{{ title }}',      (`${p.icon == null ? '' : p.icon} ${p.title}`.trim()))
                         .replace('{{ permalink }}',  p.permalink)
                         .replace('{{ category }}',   p.category)
                         .replace('{{ created }}',    p.created)
                         .replace('{{ updated }}',    p.updated)
                         .replace('{{ mathjax }}',    p.mathjax)
                         .replace('{{ content }}',    p.content)

    fs.writeFileSync(`source/_posts/${p.permalink}.md`, post, 'utf8');

    console.log(`Sync: source/_posts/${p.permalink}.md`);
});