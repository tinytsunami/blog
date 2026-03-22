//==========================================================
// Import
//==========================================================
import 'dotenv/config';

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
// Connect to Notion
//==========================================================
const notion = new Client({
  auth: NOTION_KEY,
});

const n2m = new NotionToMarkdown({
    notionClient: notion,
});

if (DEBUG) 
    fs.mkdirSync('.tmp', { recursive: true });

//==========================================================
// Collect Articles
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

// const articles = JSON.parse(fs.readFileSync('./.tmp/parsed.json', 'utf-8'));

//==========================================================
// Parsing Attributes
//==========================================================
const slugs = {};

function slugify(str) {
    if (!!!str || str === '') return null;

    return str
           .toLowerCase()
           .replace(/[^\w\s-]/g, '') // 移除 emoji / 非字元
           .trim()
           .replace(/\s+/g, '-')     // 空白變 -
           .replace(/-+/g, '-');     // 多個 - 合併
}

function getIcon(icon) {
  if (!!!icon) return null;

  switch (icon.type) {
    case 'emoji':       return icon.emoji;
    case 'external':    return icon.external?.url || null;
    case 'file':        return icon.file?.url || null;
    default:            return null;
  }
}

function getProperty(prop) {
    if (!!!prop) return null;

    switch (prop.type) {
        case 'title':
        case 'rich_text':        return prop[prop.type].map(t => t.plain_text).join('');
        case 'number':           return prop.number;
        case 'people':           return prop.people[0].name;
        case 'select':           return prop.select?.name || null;
        case 'multi_select':     return prop.multi_select.map(s => s.name);
        case 'date':             return prop.start || null;
        case 'checkbox':         return prop.checkbox;
        case 'emoji':            return prop.emoji;
        default:                 return null;
    }
}

function formatDate(iso) {
    if (!!!iso) return null;

    const d = new Date(iso);
    const pad = (n) => n.toString().padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} `
         + `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

//==========================================================
// Parsing Blocks
//==========================================================
const noteBlocks = [
    {'type': '🟣', 'name': 'primary'},
    {'type': 'ℹ️', 'name': 'info'   },
    {'type': '✅', 'name': 'success'},
    {'type': '⚠️', 'name': 'warning'},
    {'type': '❌', 'name': 'danger' },
    {'type': '',   'name': 'default'},
];

function renderBlock(block) {
  switch (block.type) {
    
    case 'equation':    
        return `<raw>\n$$\n${block.parent}\n$$\n</raw>\n`;

    case 'callout': {

        let out  = [];
        let text = block.parent;

        noteBlocks.forEach(noteBlock => {
            if (text.startsWith(`> ${noteBlock.type}`)) {
                text = text.replace(`> ${noteBlock.type}`, '');
                out.push(`{% note ${noteBlock.name} %}`);
            }
        });

        text.split('\n> ').forEach(line => out.push(line));
        out.push('{% endnote %}');
        
        return `${out.join('\n')}\n`;
    }

    default:
      return block.parent;
  }
}

async function getContentMarkdown(id) {
    const blocks = await n2m.pageToMarkdown(id);
    const md = blocks.map(block => renderBlock(block)).join('\n');
    return md;
}

//==========================================================
// Clear Articles
//==========================================================
for (const file of fs.readdirSync('source/_posts'))
    fs.rmSync(path.join('source/_posts', file), { recursive: true, force: true });

//==========================================================
// Posted Articles
//==========================================================
const template = fs.readFileSync('./scaffolds/sync.md', 'utf-8');

await Promise.all(
    articles.forEach(async (article) => {

        // Genreate permalink (use customed or generation-by-title)
        let permalink = slugify(getProperty(article.properties.permalink)) ?? 
                        slugify(getProperty(article.properties.title));

        // Uniquify permalink
        if (!!!Object.hasOwn(slugs, permalink))
            slugs[permalink] = 1;
        else 
        {
            permalink = `${permalink}-${slugs[permalink]}`
            slugs[permalink]++;
        }

        permalink = `${permalink}/`;

        // Format Attributes
        const icon      = getIcon(article.icon);
        const title     = `${icon == null ? '' : icon} ${getProperty(article.properties.title)}`.trim();
        const category  = getProperty(article.properties.category);
        const author    = getProperty(article.properties.author);
        const created   = formatDate(getProperty(article.properties.created) ?? article.created_time);
        const updated   = formatDate(getProperty(article.properties.updated) ?? article.last_edited_time);
        const mathjax   = getProperty(article.properties.mathjax);
        const content   = await getContentMarkdown(article.id);

        // Combine to Post
        const post = template.replace('{{ title }}',     title)
                             .replace('{{ permalink }}',  permalink)
                             .replace('{{ author }}',     author)
                             .replace('{{ category }}',   category)
                             .replace('{{ created }}',    created)
                             .replace('{{ updated }}',    updated)
                             .replace('{{ mathjax }}',    mathjax)
                             .replace('{{ content }}',    content)

        fs.writeFileSync(`source/_posts/${p.permalink}.md`, post, 'utf8');

        console.log(`Sync: source/_posts/${p.permalink}.md`);
    })
);
