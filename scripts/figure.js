'use strict';

function figure(args) {

    const src     = args[0];
    const caption = args[1] || '';

    return `
        <figure class="figure">
            <img src="${src}" alt="${caption}">
            ${caption ? `<figcaption>${caption}</figcaption>` : ''}
        </figure>`;
}

hexo.extend.tag.register('figure', figure);