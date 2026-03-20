/**
 * permalink.js | No Native Tag
 */

'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');


function parseConfig(raw) {

  const start = raw.indexOf('---');
  const end = raw.indexOf('\n---', start);

  if (start === -1 || end === -1) 
    return null;
  
  raw = raw.slice(start, end).trim();

  const result = {};
  const lines = raw.split('\n');

  for (let line of lines) {

    const match = line.match(/^(\w+):\s*(.*)/);
    if (!match) continue;

    let [, key, value] = match;

    key = key.trim();
    value = value.trim();

    result[key] = value.replace(/^["']|["']$/g, '');
  }

  return result;
}

function permalink(args) {

  const url = args[0].trim();

  if (!url) 
    throw new Error(`permalink tag doesn't set (${this.source})`);

  const files = glob.sync('source/_posts/**/*.md');
  const posts = {};

  files.forEach(file => {
    let raw = fs.readFileSync(file, 'utf-8');
    let configs = parseConfig(raw);
    
    if (configs.permalink) {
      configs.permalink = configs.permalink.slice(0, -1);
      posts[configs.permalink] = configs;
    }
  });

  const post = posts[url];

  if (!post)
    throw new Error(`permalink tag: ${url} not found (${this.source})`);

  return `<a href="${hexo.config.root}${post.permalink}">${post.title}</a>`;
}

hexo.extend.tag.register('permalink', permalink, {ends: false});
