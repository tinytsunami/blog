'use strict';

function note(args, content) {
    const type = args[0] || 'info';

    const rendered = hexo.render.renderSync({
        text: content,
        engine: 'markdown'
    });

    return `<div class="note ${type}">${rendered}</div>`;
}

hexo.extend.tag.register('note', note, { ends: true });