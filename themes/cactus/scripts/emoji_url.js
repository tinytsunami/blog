/**
 * Emoji URL
 * @description return twemoji URL
 * @example
 *     <%- mathjax() %>
 */
hexo.extend.helper.register("emoji_url", function (emoji) {
    if (!emoji) return null;
    
    const code = Array.from(emoji).map(c => c.codePointAt(0).toString(16)).join('-');
    
    return `https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/72x72/${code}.png`;
});