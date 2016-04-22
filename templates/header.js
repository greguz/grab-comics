module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div style=\"background-color: #2D2D2D; height: 50px; border-bottom: 1px #242424 solid;\" >\n  <!-- TODO add header image -->\n</div>\n\n<div class=\"container-fluid\" style=\"margin-top: 15px;\">\n  <div class=\"row\">\n\n    <div class=\"col-lg-5 col-md-6 col-sm-7\" style=\"margin-bottom: 15px;\">\n      <div class=\"input-group input-group-sm\">\n        <span class=\"input-group-addon\">\n          <strong class=\"text-uppercase\">\n            "
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"search",{"name":"i18n","hash":{},"data":data}))
    + "\n          </strong>\n        </span>\n        <input type=\"text\" class=\"form-control\" placeholder=\". . .\" id=\"searchBox\" />\n      </div>\n    </div>\n\n    <div class=\"col-lg-7 col-md-6 col-sm-5\" style=\"margin-bottom: 15px;\">\n      <div class=\"btn-toolbar pull-right\" role=\"toolbar\" id=\"mainToolbar\">\n\n        <div class=\"btn-group\" role=\"group\">\n          <a href=\"#\" class=\"btn btn-sm btn-default\" data-toggle=\"tooltip\" data-placement=\"bottom\" data-container=\"body\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"home",{"name":"i18n","hash":{},"data":data}))
    + "\">\n            <i class=\"fa fa-lg fa-home\"></i>\n          </a>\n        </div>\n\n        <div class=\"btn-group\" role=\"group\">\n          <a href=\"#favorites\" class=\"btn btn-sm btn-default\" data-toggle=\"tooltip\" data-placement=\"bottom\" data-container=\"body\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"favorites",{"name":"i18n","hash":{},"data":data}))
    + "\">\n            <i class=\"fa fa-lg fa-star\"></i>\n          </a>\n        </div>\n\n        <div class=\"btn-group\" role=\"group\">\n          <a href=\"#queue\" class=\"btn btn-sm btn-default\" data-toggle=\"tooltip\" data-placement=\"bottom\" data-container=\"body\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"queue",{"name":"i18n","hash":{},"data":data}))
    + "\">\n            <i class=\"fa fa-lg fa-bars\"></i>\n          </a>\n        </div>\n\n        <div class=\"btn-group\" role=\"group\">\n          <a href=\"#plugins\" class=\"btn btn-sm btn-default\" data-toggle=\"tooltip\" data-placement=\"bottom\" data-container=\"body\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"plugins",{"name":"i18n","hash":{},"data":data}))
    + "\">\n            <i class=\"fa fa-lg fa-cubes\"></i>\n          </a>\n        </div>\n\n        <div class=\"btn-group\" role=\"group\">\n          <a href=\"#options\" class=\"btn btn-sm btn-default\" data-toggle=\"tooltip\" data-placement=\"bottom\" data-container=\"body\" title=\""
    + alias3((helpers.i18n || (depth0 && depth0.i18n) || alias2).call(alias1,"options",{"name":"i18n","hash":{},"data":data}))
    + "\">\n            <i class=\"fa fa-lg fa-cog\"></i>\n          </a>\n        </div>\n\n      </div>\n    </div>\n\n  </div>\n</div>";
},"useData":true});

};