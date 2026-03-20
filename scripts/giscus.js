const fs = require('fs');
const path = require('path');

function renderGiscus(str, data) {

  const giscus = `
    <div id="giscus_thread"></div>
    <script src="https://giscus.app/client.js"
            data-repo="tinytsunami/blog"
            data-repo-id="MDEwOlJlcG9zaXRvcnkxMjI3MTEwNTY="
            data-category="Blog Comments"
            data-category-id="DIC_kwDOB1BsEM4C42Ww"
            data-mapping="pathname"
            data-strict="0"
            data-reactions-enabled="1"
            data-emit-metadata="0"
            data-input-position="top"
            data-theme="preferred_color_scheme"
            data-lang="zh-TW"
            crossorigin="anonymous"
            async>
    </script>
    `;

  if (data.layout === 'post') 
  {
    const strWithGiscus = str.replace('</article>', giscus + '</article>');

    const outputPath = path.join(process.cwd(), 'debug.html');
    fs.writeFileSync(outputPath, strWithGiscus);
  
    return strWithGiscus;
  }

  return str;
}

hexo.extend.filter.register('after_render:html', renderGiscus);