sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/MessageToast",
    "../formatter/formatter",
    "sap/ui/commons/layout/MatrixLayout",
    "sap/ui/core/library",
    'sap/m/Label',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/base/util/uid"
  ],
  function (Controller, JSONModel, Dialog, Button, MessageToast, formatter, MatrixLayout, CoreLibrary, Label, Filter, FilterOperator, uid) {
    "use strict";
    var ValueState = CoreLibrary.ValueState;

    return Controller.extend("TableDetails.controller.Page1", {

      // set the formatter
      formatter: formatter,
      onInit: function () {

       var oController=this;
        this.aKeys = [
          "member_id", "name", "memberType", "address", "member_issue", "member_expiry"
        ];
        this.oSelectId = this.getSelect("slId");
        this.oSelectName = this.getSelect("slName");
        this.oSelectType = this.getSelect("slType");
        this.oSelectAddr = this.getSelect("slAddress");
        this.oSelectIssue = this.getSelect("slIssue");
        this.oSelectExpiry = this.getSelect("slExpiry");


        var model=sap.ui.getCore().getModel("emp");
        console.log(model);
        var newModel=oController.getView().getModel("emp");
			    console.log(newModel);

      },

      // onToggleOpenState: function(oEvent) {
      //  alert("Hello");
      // },
    




      //Deleting Table row

      deleteDetails: function (e) {
        var oController = this;
        var select=oController.getView().getModel("i18n").getResourceBundle().getText("select");
        var oModel = oController.getView().getModel("emp");
        var data = oModel.getData();
        var oTable = oController.byId("empData");

        var sItems = oTable.getSelectedItems();

        if (sItems.length == 0) {
          alert(select);
          return;
        } else {

          for (var i = sItems.length - 1; i >= 0; i--) {
            var path = sItems[i].getBindingContext("emp").getPath();
            var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
            data.Library.splice(idx, 1);
          }
          oModel.setData(data);
        }
        oTable.removeSelections();

      },




      //Adding Details
      addDetails: function (oEvent) {

        var oController = this;

        var add=oController.getView().getModel("i18n").getResourceBundle().getText("add");
        var empModel = oController.getView().getModel("emp");
        var object = {
          member_id: uid(),
          name: "",
          memberType: ""

        };



        empModel.setProperty("/newRecord", object);
        if (!oController.oDefaultDialog) {

          oController.oDefaultDialog = new Dialog({
            title: add,
            content: [
              new sap.ui.xmlfragment("TableDetails.fragment.Members", this)
            ],
            beginButton: new Button({
              type: sap.m.ButtonType.Emphasized,
              text: "Ok",
              press: function (oEvent) {
                var empModel = oController.getView().getModel("emp");
               
                var aData = empModel.getProperty("/Library");
               

                var data = empModel.getProperty("/newRecord");


                aData.push(data);
                empModel.setProperty("/Library", aData);
                var sPath = "Library/" + (aData.length - 1);
                sPath = sPath.replace("/", "X");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("page2", {
                  productPath: sPath
                 
                  
                });

                oController.oDefaultDialog.close();
              }.bind(this)
            }),
            endButton: new Button({
              text: "Cancel",
              press: function () {

                oController.oDefaultDialog.close();
              }.bind(this)
            })

          })
          // to get access to the controller's model
          oController.getView().addDependent(oController.oDefaultDialog);
        }
        oController.oDefaultDialog.bindElement("emp>/newRecord")
        oController.oDefaultDialog.open();

      },






      onSelectChange: function () {
        var aCurrentFilterValues = [];

        aCurrentFilterValues.push(this.oSelectId.getValue());
        aCurrentFilterValues.push(this.oSelectName.getValue());
        aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectType));
        aCurrentFilterValues.push(this.oSelectAddr.getValue());
        aCurrentFilterValues.push(this.oSelectIssue.getValue());
        aCurrentFilterValues.push(this.oSelectExpiry.getValue());
        // aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectRating));
        // aCurrentFilterValues.push(this.oSelectDob.getValue());

        this.filterTable(aCurrentFilterValues);

        //console.log(this.oSelectDob.getValue());
      },




      filterTable: function (aCurrentFilterValues) {
        this.getTableItems().filter(this.getFilters(aCurrentFilterValues));
        this.updateFilterCriterias(this.getFilterCriteria(aCurrentFilterValues));
      },



      updateFilterCriterias: function (aFilterCriterias) {
        //this.removeSnappedLabel(); /* because in case of label with an empty text, */
        //this.addSnappedLabel(); /* a space for the snapped content will be allocated and can lead to title misalignment */
        var oModel = this.getView().getModel("emp");
        oModel.setProperty("/Filter/text", this.getFormattedSummaryText(aFilterCriterias));
      },


      getFilters: function (aCurrentFilterValues) {
        this.aFilters = [];

        this.aFilters = this.aKeys.map(function (sCriteria, i) {
          return new Filter(sCriteria, FilterOperator.Contains, aCurrentFilterValues[i]);
        });

        return this.aFilters;
      },




      getFilterCriteria: function (aCurrentFilterValues) {
        return this.aKeys.filter(function (el, i) {
          if (aCurrentFilterValues[i] !== "") {
            return el;
          }
        });
      },




      getFormattedSummaryText: function (aFilterCriterias) {
        if (aFilterCriterias.length > 0) {
          return "Filtered By (" + aFilterCriterias.length + "): " + aFilterCriterias.join(", ");
        } else {
          return "Filtered by None";
        }
      },




      getTable: function () {
        return this.getView().byId("empData");
      },
      getTableItems: function () {
        return this.getTable().getBinding("items");
      },
      getSelect: function (sId) {
        return this.getView().byId(sId);
      },
      getSelectedItemText: function (oSelect) {
        return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";
      },

      onPress: function (oEvent) {
        var oItem = oEvent.getSource();
        console.log(oItem);
        var sPath = oItem.getBindingContext("emp").getPath().substr(1);

        sPath = sPath.replace("/", "X");
        console.log(sPath);
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("page2", {
          productPath: sPath
        });
      },




      //Sorting and Grouping
      onTableSettings: function (oEvent) {
        var oController=this;
        // Open the Table Setting dialog 
        oController._oDialog = sap.ui.xmlfragment("TableDetails.fragment.Personalization", this);
        oController._oDialog.open();
      },
      onConfirm: function (oEvent) {
        var oView = this.getView();
        var oTable = oView.byId("empData");
        var mParams = oEvent.getParameters();
        var oBinding = oTable.getBinding("items");
        // apply grouping 
        var aSorters = [];
        if (mParams.groupItem) {
          var sPath = mParams.groupItem.getKey();
          var bDescending = mParams.groupDescending;
          var vGroup = function (oContext) {
            var type = oContext.getProperty("memberType");
            return {
              key: type,
              text:type
            };
          };
          var aGroup = function (oContext) {
            var add = oContext.getProperty("address");
            return {
              key: add,
              text:add
            };
          };
          aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
          aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, aGroup));
        }
        // apply sorter 
        var sPath = mParams.sortItem.getKey();
        var bDescending = mParams.sortDescending;
        aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
        oBinding.sort(aSorters);
       
      }









    });
  }
);
