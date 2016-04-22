module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<h1>Hello World!</h1>\nWe are using node "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.versions : depth0)) != null ? stack1.node : stack1), depth0))
    + ",\nChrome "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.versions : depth0)) != null ? stack1.chrome : stack1), depth0))
    + ",\nand Electron "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.versions : depth0)) != null ? stack1.electron : stack1), depth0))
    + ".";
},"useData":true});

};