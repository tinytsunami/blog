//==========================================================
// Import
//==========================================================
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import pLimit from 'p-limit';
import crypto from 'crypto';

import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

console.log("✅ Sync: import libs done");

//==========================================================
// Constants
//==========================================================
const DEBUG = (process.env.DEBUG === 'true');
const PARALLEL = 3;
const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DATASOURCE_ID = process.env.NOTION_DATASOURCE_ID;

console.log("✅ Sync: environment variables loaded");

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

console.log("✅ Sync: notion/n2m modules loaded");

//==========================================================
// Collect Sources
//==========================================================
let sources = [];
let cursor = undefined;

while (true)
{
    let res = await notion.dataSources.query({
        data_source_id: NOTION_DATASOURCE_ID,
        start_cursor: cursor,
        page_size: 100
    });

    console.log(`✅ Sync: sources pagination (${cursor ?? 0})`);

    res.results.forEach(source => {
        console.log(`✅ Sync: sources got ${source.url}`);
        sources.push(source);
    })

    if (!res.has_more) break;
    cursor = res.next_cursor;
}

if (DEBUG)
    fs.writeFileSync('.tmp/sources.json', JSON.stringify(sources, null, 2));

console.log("✅ Sync: sources downloaded");

//==========================================================
// Attributes Parser
//==========================================================
const slugs = {};

function slugify(str) {
    if (!str || str === '') return null;

    return str
           .toLowerCase()
           .replace(/[^\w\s-]/g, '') // 移除 emoji / 非字元
           .trim()
           .replace(/\s+/g, '-')     // 空白變 -
           .replace(/-+/g, '-');     // 多個 - 合併
}

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
        case 'date':             return prop.start || null;
        case 'checkbox':         return prop.checkbox;
        case 'emoji':            return prop.emoji;
        default:                 return null;
    }
}

function formatDate(iso) {
    if (!iso) return null;

    const d = new Date(iso);
    const pad = (n) => n.toString().padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} `
         + `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

async function downloadImage(url, filename) {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filename, Buffer.from(buffer));
}

function hash(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function truncate(str, len) {
  if (str.length <= len) return str;

  const half = Math.floor((len - 3) / 2);
  return str.slice(0, half) + '...' + str.slice(-half);
}

//==========================================================
// Blocks Parser
//==========================================================
const noteBlocks = [
    {'type': '🟣', 'name': 'primary'},
    {'type': 'ℹ️', 'name': 'info'   },
    {'type': '✅', 'name': 'success'},
    {'type': '⚠️', 'name': 'warning'},
    {'type': '❌', 'name': 'danger' },
    {'type': '',   'name': 'default'},
];

async function renderBlock(block) {

    // console.log(block);

    switch (block.type) {
        
        case 'equation': 
            return `{% raw %}\n${block.parent}\n{% endraw %}\n\n`;

        case 'quota': 
            return `${block.parent}\n\n`;

        case 'callout': {

            let out  = [];
            let text = block.parent;

            noteBlocks.forEach(noteBlock => {
                if (text.startsWith(`> ${noteBlock.type}`)) {
                    text = text.replace(`> ${noteBlock.type}`, '').trimStart();
                    out.push(`{% note ${noteBlock.name} %}`);
                }
            });

            text.split('\n> ').forEach(line => out.push(line));
            out.push('{% endnote %}');
            
            return `${out.join('\n')}\n\n`;
        }

        case 'bulleted_list_item':
        case 'numbered_list_item':
            return `${block.parent}\n`;

        case 'image':
            const matches = [...(block.parent).matchAll(/!\[(.*?)\]\((.*?)\)/g)];

            for (const m of matches) {
                const caption = m[1];
                const url     = m[2];

                const filename = hash(url)
                console.log(`✅ Sync: download resource ${caption} (${truncate(url, 28)})`);
                
                if (!fs.existsSync(`source/images/${filename}.png`))
                    await downloadImage(url, `source/images/${filename}.png`);

                return `![${caption}](images/${filename}.png)\n\n`;
            }

            return `(an image missing...)\n\n`;
        
        default:
            return `${block.parent}\n\n`;
    }
}

async function getContentMarkdown(id) {
    const blocks = await n2m.pageToMarkdown(id);
    const parts  = await Promise.all(blocks.map(block => renderBlock(block)));
    return parts.join('');
}

//==========================================================
// File Parser
//==========================================================
function findFile(dir, filename) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            findFileDir(fullPath, filename, result);
        } else if (file === filename) {
            return dir;
        }
    }

    return null;
}

function extractUpdated(content) {
    const match = content.match(/^---[\s\S]*?updated:\s*(.+)$/m);
    return match ? match[1].trim() : null;
}

function parseTime(str) {
    return new Date(str.replace(' ', 'T'));
}

//==========================================================
// Parsing Articles
//==========================================================
const articles = sources.map((source) => {

    // Genreate permalink (use customed or generation-by-title)
    let permalink = slugify(getProperty(source.properties.permalink)) ?? 
                    slugify(getProperty(source.properties.title));

    // Uniquify permalink
    if (!Object.hasOwn(slugs, permalink))
        slugs[permalink] = 1;
    else 
    {
        permalink = `${permalink}-${slugs[permalink]}`
        slugs[permalink]++;
    }

    // Get attributes
    let pageId         = source.id;
    let title          = `${source.icon == null ? '' : getIcon(source.icon)} ${getProperty(source.properties.title)}`.trim();
    let category       = getProperty(source.properties.category);
    let author         = getProperty(source.properties.author);
    let createDatetime = formatDate(getProperty(source.properties.created) ?? source.created_time);
    let updateDatetime = formatDate(getProperty(source.properties.updated) ?? source.last_edited_time);
    let mathjax        = getProperty(source.properties.mathjax);
    let contentId      = source.id;
    let isUpdated      = parseTime(extractUpdated(oldFilepath)) <= parseTime(source.properties.last_edited_time);
    let oldFileDir     = findFile('source/', `${pageId}.md`);
    let newFileDir     = null;

    // Check status
    if (source.in_trash) 
        newFileDir = null;
    else if (source.is_archived) 
        newFileDir = '_archives/notion/';
    else if (getProperty(source.properties.published)) 
        newFileDir = '_posts/notion/';
    else
        newFileDir = '_drafts/notion/';

    console.log(`✅ Sync: attribute parsed (${permalink}, ${source.id})`);
    
    return {
        'pageId':         pageId,
        'title':          title,
        'permalink':      permalink,
        'category':       category,
        'author':         author,
        'createDatetime': createDatetime,
        'updateDatetime': updateDatetime,
        'mathjax':        mathjax,
        'contentId':      contentId,
        'oldFileDir':     oldFileDir,
        'newFileDir':     newFileDir,
        'isUpdated':      isUpdated
    };
});

if (DEBUG)
    fs.writeFileSync('.tmp/articles.json', JSON.stringify(articles, null, 2));

//==========================================================
// Generate Posts
//==========================================================
const template = fs.readFileSync('./scaffolds/sync.md', 'utf-8');
const limit = pLimit(PARALLEL);

await Promise.all(
    articles
    .filter(article => article.isUpdated)
    .map(article =>
        limit(async () => {
            const content = (await getContentMarkdown(article.contentId)).replaceAll('$', '$$$$');

            const post = template.replace('{{ title }}',          article.title)
                                 .replace('{{ permalink }}',      article.permalink)
                                 .replace('{{ author }}',         article.author)
                                 .replace('{{ category }}',       article.category)
                                 .replace('{{ createDatetime }}', article.createDatetime)
                                 .replace('{{ updateDatetime }}', article.updateDatetime)
                                 .replace('{{ mathjax }}',        article.mathjax)
                                 .replace('{{ content }}',        content);

            const oldFullpath = `${article.oldFileDir}/${article.pageId}.md`;
            const newFullpath = `${article.newFileDir}/${article.pageId}.md`;

            fs.rmSync(oldFullpath, { recursive: true, force: true });
            console.log(`✅ Sync: clear ${oldFullpath}`);

            fs.writeFileSync(newFullpath, post, 'utf8');
            console.log(`✅ Sync: generate ${newFullpath}`);
        })
    )
);