'use strict';

function note(args) {
    const type = args[0] || 'info';
    return `<div class="note ${type}">`;
}

function endnote(args) {
    return '</div>';
}

hexo.extend.tag.register('note', note);
hexo.extend.tag.register('endnote', endnote);