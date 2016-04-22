module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"container\" style=\"margin-bottom: 15px;\">\n\n  <div class=\"row\">\n\n    <div class=\"col-sm-6 col-sm-push-3 col-xs-12 text-center\">\n\n      TODO\n\n    </div>\n\n    <div class=\"col-sm-3 col-sm-pull-6 col-xs-6\">\n      <div class=\"btn-group\" role=\"group\">\n        <button type=\"button\" class=\"btn btn-sm btn-default text-uppercase\">\n          "
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"first",{"name":"i18n","hash":{},"data":data}))
    + "\n        </button>\n        <button type=\"button\" class=\"btn btn-sm btn-default text-uppercase\">\n          "
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"previous",{"name":"i18n","hash":{},"data":data}))
    + "\n        </button>\n      </div>\n    </div>\n\n    <div class=\"col-sm-3 col-xs-6\">\n      <div class=\"btn-group pull-right\" role=\"group\">\n        <button type=\"button\" class=\"btn btn-sm btn-default text-uppercase\">\n          "
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"next",{"name":"i18n","hash":{},"data":data}))
    + "\n        </button>\n        <button type=\"button\" class=\"btn btn-sm btn-default text-uppercase\">\n          "
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"last",{"name":"i18n","hash":{},"data":data}))
    + "\n        </button>\n      </div>\n    </div>\n\n  </div>\n\n</div>";
},"useData":true});

};