sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../formatter/formatter",
	"sap/m/Dialog",
	"sap/m/Button",
	'sap/m/ColumnListItem',
	"sap/ui/core/routing/History",
	'sap/m/Label',
	'sap/m/Token',
	'sap/ui/core/Fragment',
	'sap/m/MessageToast',
	"sap/m/MessageBox"
], function (Controller, JSONModel, formatter, Dialog, Button, ColumnListItem, History, Label, Token, Fragment, MessageToast, MessageBox) {
	"use strict";
	var x = true;
	var copyModel;
	
	return Controller.extend("TableDetails.controller.Page2", {
		// set the formatter
		formatter: formatter,

		onInit: function () {
			var oController = this;


			var oRouter = sap.ui.core.UIComponent.getRouterFor(oController);
			oRouter.getRoute("page2").attachPatternMatched(oController._onObjectMatched, this);
			oRouter.getRoute("page2").attachPatternMatched(oController._onNewRecord, this);
			oController.getView().byId("empData").setEditable(false);

			var object = {

				address: "",
				mobile: "",

				member_issue: "",
				member_expiry: "",
				book_issue: ""

			};
			var oModel = new JSONModel();
			oModel.setData(object);
			sap.ui.getCore().setModel(oModel, "form");
			this._oMultiInput = this.getView().byId("multiInput"); 
			




		},
	
		_onObjectMatched: function (oEvent) {
			var oController = this;
			oController.productPath = oEvent.getParameter("arguments")
				.productPath.replace("X", "/");
			this.getView().bindElement({
				path: "/" + oEvent.getParameter("arguments")
					.productPath.replace("X", "/"),
				model: "emp"
			});
			oController.byId("ObjectPageLayout").setSelectedSection(oController.byId("formSection"));
			


		},
		_onNewRecord: function (oEvent) {
			var oController = this;
			var empModel = oController.getView().getModel("emp");
			var data = empModel.getProperty("/" + oController.productPath);
			console.log(data);
			if ((!data.address) && (!data.mobile) && (!data.member_issue) && (!data.member_expiry)) {
				// oController.getView().byId("edit").setVisible(false);
				// oController.getView().byId("display").setVisible(true);
				// var oObjectPageLayout = oController.byId("ObjectPageLayout");
				// oObjectPageLayout.setShowFooter(!oObjectPageLayout.getShowFooter());
				// var oModel = oController.getView().getModel("emp");
				// oModel.setProperty("/Edit/text1", true);
				// oModel.setProperty("/Edit/text2", false);
				oController.editing();
			}
			else {
				// oController.getView().byId("edit").setVisible(true);
				// oController.getView().byId("display").setVisible(false);
				// var oObjectPageLayout = oController.byId("ObjectPageLayout");
				// oObjectPageLayout.setShowFooter(oObjectPageLayout.getShowFooter());
				// var oModel = oController.getView().getModel("emp");
				// oModel.setProperty("/Edit/text1", false);
				//oModel.setProperty("/Edit/text2", true);

				oController.displaying();
			}

			var model=this.getView().getModel("emp").getData();
			copyModel = $.extend(true,{},model); 

		},

		onNavPress: function () {

			if (x === false) {
				MessageBox.confirm("Do you want to save changes", {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {
						if (sAction === MessageBox.Action.OK) {
							history.go(-1);
							x = true;
						} else (sAction === MessageBox.Action.CANCEL)
						{
							x = false;
						}
					}
				});
			}
			else {
				x = true;
				history.go(-1);
			}

		},
		onSelectUpdate: function () {
			x = false;
		},

		


		//Deleting Table row

		deleteDetails: function (e) {
			var oController = this;
			var oModel = oController.getView().getModel("emp");
			var select = oController.getView().getModel("i18n").getResourceBundle().getText("select");
			var data = oModel.getData();
			var oTable = oController.getView().byId("empData");
			var sItems = oTable.getSelectedIndices();
			//var sPath = sItems.slice(0, sItems.lastIndexOf("/"));
			if (sItems.length == 0) {
				alert(select);
				return;
			} else {

				for (var i = sItems.length - 1; i >= 0; i--) {
					var path = oTable.getContextByIndex(sItems[i]).getPath();
					var sPath = path.slice(0, path.lastIndexOf("/"));
					var del = oModel.getProperty(sPath);
					//var idx=path.split('/')[4];
					del.splice(sItems[i], 1);
				}
				oModel.setData(data);
			}
			oTable.clearSelection();

		},

		//Adding Details
		addDetails: function (oEvent) {
			var oController = this;
			var add = oController.getView().getModel("i18n").getResourceBundle().getText("add");
			var empModel = oController.getView().getModel("emp");
			var object = {
				book_issue: "",
			};
			empModel.setProperty("/newRecord", object);
			if (!oController.oDefaultDialog) {

				oController.oDefaultDialog = new Dialog({
					title: add,
					content: [
						new sap.ui.xmlfragment("TableDetails.fragment.Books", this)
					],
					beginButton: new Button({
						type: sap.m.ButtonType.Emphasized,
						text: "Ok",
						press: function (oEvent) {
							oController.addOnPressOk();
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
		addOnPressOk: function (oEvent) {
			var oController = this;
			var empModel = oController.getView().getModel("emp");
			var secondData = empModel.getProperty("/newRecord");
			empModel.setProperty("/bookRecord/book_issue", secondData.book_issue);
			var aData = empModel.getProperty("/" + oController.productPath + "/books");

			var data = empModel.getProperty("/bookRecord");

			if (!aData) {
				aData = [];
				aData.push(data);
			}
			else {
				aData.push(data);
			}
			empModel.setProperty("/" + oController.productPath + "/books", aData);
		},

		send: function (oEvent) {

			x = true;
			var oController = this;
			
			//oController.displayDetails();
			
			var oModel = oController.getView().getModel("emp");
			oModel.setProperty("/Edit/text1", false);
			oModel.setProperty("/Edit/text2", true);
			//var empModel = oController.getView().getModel("emp");
			var oModel = sap.ui.getCore().getModel("form");
			var oProperty = oModel.getProperty("/");
			var empModel = oController.getView().getModel("emp");
			empModel.setProperty("/newRecord", oProperty);
			var aData = empModel.getProperty("/" + oController.productPath);
			var data = empModel.getProperty("/newRecord");
			if (!aData) {
				aData = [];
				aData.push(data);
			}
			// else {
			// 	aData.push(data);
			// }
			empModel.setProperty("/" + oController.productPath, aData);
			var oObjectPageLayout = oController.byId("ObjectPageLayout");
			oObjectPageLayout.setShowFooter(!oObjectPageLayout.getShowFooter());
			oController.getView().byId("edit").setVisible(true);
			oController.getView().byId("display").setVisible(false);
		},

		cancel: function () {
				x = true;
			var oController = this;
			
			var empModel = oController.getView().getModel("emp");
			this.getView().getModel("emp").setData(copyModel);
			//copyModel.refresh();
			oController.getView().byId("edit").setVisible(true);
			oController.getView().byId("display").setVisible(false);
			var oObjectPageLayout = oController.byId("ObjectPageLayout");
			oObjectPageLayout.setShowFooter(!oObjectPageLayout.getShowFooter());
			var oModel = oController.getView().getModel("emp");
			oModel.setProperty("/Edit/text1", false);
			oModel.setProperty("/Edit/text2", true);
			//oController.displaying();
			var data = empModel.getProperty("/" + oController.productPath);
			if ((!data.address) && (!data.mobile) && (!data.member_issue) && (!data.member_expiry)) {
				oController.getView().byId("edit").setVisible(false);
				oController.getView().byId("display").setVisible(true);
				var oObjectPageLayout = oController.byId("ObjectPageLayout");
				oObjectPageLayout.setShowFooter(!oObjectPageLayout.getShowFooter());
				var oModel = oController.getView().getModel("emp");
				oModel.setProperty("/Edit/text1", true);
				oModel.setProperty("/Edit/text2", false);
				
				
				//oController.editing();
			}


		},
		//Deleting Record
		deleteRecord: function (oEvent) {

			var oController = this;
			var object = {}
			var empModel = oController.getView().getModel("emp");
			var data = empModel.getData();
			var path = oController.productPath;
			var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
			data.Library.splice(idx, 1);
			//empModel.setProperty("/" + oController.productPath, null);
			empModel.setData(data);
			history.go(-1);


		},
		onRowsUpdated: function (oEvent) {
			var oController = this;
			var oTable = oController.getView().byId("empData");
			const aRows = oTable.getRows();
			aRows[0].addStyleClass("thatImportantColor");
			if (aRows.length > 0) {
				aRows.forEach((oRow,index) => {
					const cellId = oRow.getAggregation("cells")[index].sId;
					const cellText = sap.ui.getCore().byId(cellId).getItems()[0].getText();
					//oRow.getAggregation("cells")[index].addStyleClass("thatImportantColor");
					if (cellText === "BKID03")
						oRow.addStyleClass("thatImportantColor");
					else 
						oRow.addStyleClass("thisImportantColor");
				})
			}
		},
		//Status Update 

		onStatusUpdate: function (oEvent) {
			var oController = this;
			var oSelectedIndex = oEvent.getParameter("selectedIndex");
			var oRadioButtonSrc = oEvent.getSource().getAggregation("buttons");
			var oSelectedRadioText = oRadioButtonSrc[oSelectedIndex].getText();

			var oSelectedItem = oEvent.getSource().getParent();
			var oBindingContext = oSelectedItem.getBindingContext("emp");
			var sPath = oBindingContext.getPath();

			var empModel = oController.getView().getModel("emp");

			//var aData = empModel.getProperty("/Employee");
			empModel.setProperty(sPath + "/status", oSelectedRadioText);


		},
		handleChange: function (oEvent) {
			var oController = this;
			x = false;
			var bookReturn = oController.getView().byId("bookReturn").getValue();
			var oSelectedItem = oEvent.getSource().getParent();
			var oBindingContext = oSelectedItem.getBindingContext("emp");
			var sPath = oBindingContext.getPath();
			var empModel = oController.getView().getModel("emp");
			var borrow = empModel.getProperty(sPath + "/status");

			empModel.setProperty(sPath + "/status", "Returned");



		},


		editDetails: function (e) {
			var oController = this;
			// oController.getView().byId("edit").setVisible(false);
			// oController.getView().byId("display").setVisible(true);
			// var oObjectPageLayout = oController.byId("ObjectPageLayout");
			// oObjectPageLayout.setShowFooter(!oObjectPageLayout.getShowFooter());
			// var oModel = oController.getView().getModel("emp");
			// oModel.setProperty("/Edit/text1", true);
			// oModel.setProperty("/Edit/text2", false);
			oController.editing();
			var model=this.getView().getModel("emp").getData();
			copyModel = $.extend(true,{},model); 
		},

		displayDetails: function (e) {
			var oController = this;
			// oController.getView().byId("edit").setVisible(true);
			// oController.getView().byId("display").setVisible(false);
			// var oObjectPageLayout = oController.byId("ObjectPageLayout");
			// oObjectPageLayout.setShowFooter(oObjectPageLayout.getShowFooter());
			// var oModel = oController.getView().getModel("emp");
			// oModel.setProperty("/Edit/text1", false);
			// oModel.setProperty("/Edit/text2", true);
			var model=this.getView().getModel("emp").getData();
			copyModel = $.extend(true,{},model); 
			oController.displaying();
		},
		editing: function (e) {
			var oController = this;
			oController.getView().byId("edit").setVisible(false);
			oController.getView().byId("display").setVisible(true);
			var oObjectPageLayout = oController.byId("ObjectPageLayout");
			oObjectPageLayout.setShowFooter(!oObjectPageLayout.getShowFooter());
			var oModel = oController.getView().getModel("emp");
			oModel.setProperty("/Edit/text1", true);
			oModel.setProperty("/Edit/text2", false);
		},

		displaying: function (e) {
			var oController = this;
			oController.getView().byId("edit").setVisible(true);
			oController.getView().byId("display").setVisible(false);
			var oObjectPageLayout = oController.byId("ObjectPageLayout");
			oObjectPageLayout.setShowFooter(oObjectPageLayout.getShowFooter());
			var oModel = oController.getView().getModel("emp");
			oModel.setProperty("/Edit/text1", false);
			oModel.setProperty("/Edit/text2", true);
		},
		//Sorting and Grouping
		onTableSettings: function (oEvent) {
			var oController = this;
			// Open the Table Setting dialog 
			oController._oDialog = sap.ui.xmlfragment("TableDetails.fragment.Bookspersonalization", this);
			oController._oDialog.open();
		},
		onConfirm: function (oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("empData");
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("rows");
			// apply grouping 
			var aSorters = [];
			if (mParams.groupItem) {
				var sPath = mParams.groupItem.getKey();
				var bDescending = mParams.groupDescending;
				var vGroup = function (oContext) {
					var status = oContext.getProperty("status");
					return {
						key: status,
						text: status
					};
				};

				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));

			}
			// apply sorter 
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(aSorters);

		},


		onValueHelpRequested: function () {
			var oController = this;
			var colModel = this.getView().getModel("emp");
			var empModel = this.getView().getModel("emp");
			var aCols = colModel.getData().cols;

			this.loadFragment({
				name: "TableDetails.fragment.ValueHelpDialog"
			}).then(function (oValueHelpDialog) {
				this._oValueHelpDialog = oValueHelpDialog;

				this._oValueHelpDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(empModel);
					oTable.setModel(colModel, "columns");

					if (oTable.bindRows) {
						oTable.bindAggregation("rows", "/booksData");
					}

					if (oTable.bindItems) {
						oTable.bindAggregation("items", "/booksData", function () {
							return new ColumnListItem({
								cells: aCols.map(function (column) {
									return new Label({ text: "{" + column.template + "}" });
								})
							});
						});
					}
					this._oValueHelpDialog.update();
				}.bind(this));

				// this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
				var oToken = new Token();
				this._oInput = sap.ui.getCore().byId("multiInput");
				this._oInput.setSelectedKey("BKID60");
				oToken.setKey(this._oInput.getSelectedKey());
				oToken.setText(this._oInput.getValue());
				this._oValueHelpDialog.setTokens([oToken]);
				this._oValueHelpDialog.open();
			}.bind(this));


		},

		onValueHelpOkPress: function (oEvent) {
			var oController = this;
			//var aTokens = oEvent.getParameter("tokens");
			this.aTokens = oEvent.getParameter("tokens");
			//this.t_oInput.setTokens(this.aTokens);
			var oTable = this._oValueHelpDialog.getTable();
			var oContext = oTable.getContextByIndex(oTable.getSelectedIndex()).getObject();
			var empModel = oController.getView().getModel("emp");
			var object = {
				bkid: oContext.bkid,
				book: oContext.book,
				book_author: oContext.book_author,

				due_date: oContext.due_date,
				status: "Borrowed",

			};
			empModel.setProperty("/bookRecord", object);

			this.getView().byId('bookname').setText(oContext.book);
			this.getView().byId('bookauth').setText(oContext.book_author);

			if (this.aTokens.length > 0) {
				this._oInput.setSelectedKey(this.aTokens[0].getKey());

			}
			this._oValueHelpDialog.close();
		},

		onValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},

		onValueHelpAfterClose: function () {
			this._oValueHelpDialog.destroy();
		},





	});
});