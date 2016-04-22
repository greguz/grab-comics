module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "      <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.thumbnail : stack1), depth0))
    + "\" alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" />\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "      "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1), depth0))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"plugin-gallery\" id=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.$plugin : stack1), depth0))
    + "\">\n\n  <h3 class=\"title text-uppercase\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.thumbnail : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "  </h3>\n\n  <div class=\"justified-gallery\"></div>\n\n</div>";
},"useData":true});

};