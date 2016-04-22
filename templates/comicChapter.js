module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "      "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.chapter : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "      "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.chapter : depth0)) != null ? stack1.number : stack1), depth0))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<tr>\n\n  <td>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.chapter : depth0)) != null ? stack1.title : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "  </td>\n  <td width=\"30\">\n    <a href=\"#chapter/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.$plugin : stack1), depth0))
    + "/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.$comic : stack1), depth0))
    + "/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.chapter : depth0)) != null ? stack1.$chapter : stack1), depth0))
    + "\">\n      <i class=\"fa fa-lg fa-book\"></i>\n    </a>\n  </td>\n  <td width=\"30\">\n    <a>\n      <i class=\"fa fa-lg fa-download\"></i>\n    </a>\n  </td>\n\n</tr>";
},"useData":true});

};