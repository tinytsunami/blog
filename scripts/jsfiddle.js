'use strict';

function jsfiddle(args) {

  const id      = args[0] || '';
  const tabs    = args[1] || 'result';
  const theme   = args[2] || 'light';
  const width   = args[3] || '100%';
  const height  = args[4] || '300px';

  const src = `https://jsfiddle.net/${id}/embedded/${tabs}/${theme}`;

  return `
    <div class="iframe-container" style="width:${width};">
    <iframe
        src="${src}"
        width="100%"
        height="${height}"
        allowfullscreen="allowfullscreen"
        loading="lazy"
        frameborder="0">
    </iframe>
    </div>
    `;
}

hexo.extend.tag.register('jsfiddle', jsfiddle);