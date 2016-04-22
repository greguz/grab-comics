module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "          <tr>\n            <td>\n              "
    + container.escapeExpression((helpers.flag || (depth0 && depth0.flag) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"flag","hash":{},"data":data}))
    + "\n            </td>\n          </tr>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "          <tr data-plugin=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\">\n            <td>\n              "
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\n            </td>\n            <td>\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.languages : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "            </td>\n            <td>\n              "
    + alias2(alias1((depth0 != null ? depth0.url : depth0), depth0))
    + "\n            </td>\n            <td>\n              <input type=\"checkbox\" "
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.enabled : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " />\n            </td>\n          </tr>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "                "
    + container.escapeExpression((helpers.flag || (depth0 && depth0.flag) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"flag","hash":{},"data":data}))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "                -\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "checked";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"row\">\n\n  <div class=\"col-lg-4 col-md-5 col-sm-6\">\n\n  </div>\n\n  <div class=\"col-lg-8 col-md-7 col-sm-6\">\n\n    <table class=\"table table-striped table-condensed\">\n\n      <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.languages : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      </tbody>\n\n    </table>\n\n    <table class=\"table table-striped table-condensed\">\n\n      <thead>\n        <tr>\n          <th>"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"plugin",{"name":"i18n","hash":{},"data":data}))
    + "</th>\n          <th>"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"languages",{"name":"i18n","hash":{},"data":data}))
    + "</th>\n          <th>"
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"webSite",{"name":"i18n","hash":{},"data":data}))
    + "</th>\n          <th style=\"width: 56px;\"></th>\n        </tr>\n      </thead>\n\n      <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.plugins : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      </tbody>\n\n    </table>\n\n  </div>\n\n</div>";
},"useData":true});

};