sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/resource/ResourceModel",
  "sap/base/util/uid"
],
  function (UIComponent, JSONModel, ResourceModel,uid) {
    "use strict";

    return UIComponent.extend("TableDetails.Component", {
      metadata: {
        "interfaces": ["sap.ui.core.IAsyncContentCreation"],

        manifest: "json"
      },

      init: function () {
        UIComponent.prototype.init.apply(this, arguments);
        this.getRouter().initialize();
        var oComponent = this;
        
        var oModel = new JSONModel();
        oModel.loadData("./model/model.json");
        //oModel.setData(oData);
        
        oComponent.setModel(oModel, "emp");
        oComponent.setModel(oModel, "new");
       
        var i18nModel = new ResourceModel({
          bundleName: "TableDetails.i18n.i18n"
        });
        oComponent.setModel(i18nModel, "i18n");
        //oComponent.byId("animalsTable").bindRows("/");

      }
    });
  }
);