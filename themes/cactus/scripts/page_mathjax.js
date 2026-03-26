/**
 * Page Mathjax
 * @description return mathjax.enable for page
 * @example
 *     <%- mathjax() %>
 */
hexo.extend.helper.register("page_mathjax", function () {
  return this.page.mathjax;
});
