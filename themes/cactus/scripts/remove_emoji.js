/**
 * Remove Emoji 
 * @description return title without emoji
 * @example
 *     <%- mathjax() %>
 */
hexo.extend.helper.register("remove_emoji", function (title) {
    if (!title) return '';
    return title.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
});