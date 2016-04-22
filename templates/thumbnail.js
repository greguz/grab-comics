module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<a href=\"#comic/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.$plugin : stack1), depth0))
    + "/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.$comic : stack1), depth0))
    + "\" class=\"comic-thumbnail\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.$comic : stack1), depth0))
    + "\" data-language=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.language : stack1), depth0))
    + "\" data-plugin=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.$plugin : stack1), depth0))
    + "\">\n\n  <img alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.title : stack1), depth0))
    + "\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.thumbnail : stack1), depth0))
    + "\" />\n\n  "
    + alias2((helpers.flag || (depth0 && depth0.flag) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.language : stack1),{"name":"flag","hash":{},"data":data}))
    + "\n\n</a>";
},"useData":true});

};