module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<div class=\"row\">\n\n  <div class=\"col-lg-5 col-md-6 col-sm-7\" id=\"comicSummary\">\n\n    <div class=\"row\">\n\n      <div class=\"col-xs-6\">\n\n        <div style=\"position: relative;\">\n\n          <img id=\"thumbnail\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.thumbnail : stack1), depth0))
    + "\" alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.title : stack1), depth0))
    + "\" width=\"100%\" height=\"auto\" />\n\n          "
    + alias2((helpers.flag || (depth0 && depth0.flag) || alias4).call(alias3,((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.language : stack1),{"name":"flag","hash":{"style":"position: absolute; top: 2px; right: 2px; font-size: 25px;"},"data":data}))
    + "\n\n        </div>\n\n      </div>\n\n      <div class=\"col-xs-6\">\n\n        <dl>\n\n          <dt>"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"title",{"name":"i18n","hash":{},"data":data}))
    + ":</dt>\n          <dd>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.title : stack1), depth0))
    + "</dd>\n\n          <dt>"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"author",{"name":"i18n","hash":{},"data":data}))
    + ":</dt>\n          <dd>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.author : stack1), depth0))
    + "</dd>\n\n          <dt>"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"artist",{"name":"i18n","hash":{},"data":data}))
    + ":</dt>\n          <dd>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.artist : stack1), depth0))
    + "</dd>\n\n          <dt>"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"release",{"name":"i18n","hash":{},"data":data}))
    + ":</dt>\n          <dd>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.release : stack1), depth0))
    + "</dd>\n\n          <dt>"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"description",{"name":"i18n","hash":{},"data":data}))
    + ":</dt>\n          <dd>"
    + alias2((helpers.truncate || (depth0 && depth0.truncate) || alias4).call(alias3,((stack1 = (depth0 != null ? depth0.comic : depth0)) != null ? stack1.description : stack1),250,{"name":"truncate","hash":{},"data":data}))
    + "</dd>\n\n        </dl>\n\n      </div>\n\n    </div>\n\n  </div>\n\n  <div class=\"col-lg-7 col-md-6 col-sm-5 pull-right\">\n\n    <table class=\"table table-condensed table-striped\">\n\n      <thead>\n        <tr>\n          <th>\n            "
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"title",{"name":"i18n","hash":{},"data":data}))
    + "\n          </th>\n          <th colspan=\"2\" class=\"text-right\">\n            "
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias4).call(alias3,"actions",{"name":"i18n","hash":{},"data":data}))
    + "\n          </th>\n        </tr>\n      </thead>\n\n      <tbody></tbody>\n\n    </table>\n\n  </div>\n\n</div>";
},"useData":true});

};