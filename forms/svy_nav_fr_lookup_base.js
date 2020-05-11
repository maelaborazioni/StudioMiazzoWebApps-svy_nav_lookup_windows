/**
 * @properties={typeid:35,uuid:"2FBD3283-AD5C-476E-9FF7-6F0B09608298",variableType:-4}
 */
var returnValue = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3FAF09D2-7B02-4E59-AFE4-BFFA84B3DC1F"}
 */
var vAfterInsertMethodName = null;

/**
 * @type {String}
 * @properties={typeid:35,uuid:"FFB226EC-0FA6-42A9-A7D3-29A8B582B2D6"}
 */
var vAfterMultiSelectMethodName = null;

/**
 * @properties={typeid:35,uuid:"4FDE360C-093F-4CC9-9138-1A720AB1C4C6",variableType:-4}
 */
var vElements = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6A048E0C-F639-49FB-A866-3F96519189E5"}
 */
var vFieldKey = null;

/**
 * @type {Array<String>}
 * 
 * @properties={typeid:35,uuid:"F4AC5F00-A64F-44E5-9D86-6CE4DAE577AA",variableType:-4}
 */
var vFields = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"5EED1240-5DCB-43A6-A468-B4488FEC0052",variableType:-4}
 */
var vMultiSelect = false;

/**
 * @type {Object}
 * 
 * @properties={typeid:35,uuid:"F4759F33-625B-43A6-ADD9-E0D94756CB78",variableType:-4}
 */
var vPrimaryKey = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"DD53AF64-0630-40D3-B092-C6FCF53A4A8A"}
 */
var vProgram = null;

/**
 * @properties={typeid:35,uuid:"B214A5D2-6194-4429-B5AC-D8CF0D317AC5",variableType:-4}
 */
var vRecursivecall = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E9CDE691-1BB9-4BB1-964F-322CC36F6E4F"}
 */
var vReturnField = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"35C2553C-A8BA-4B01-BCE7-55163378C7AF"}
 */
var vReturnForm = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"E16DAB4E-C184-4CF4-BEF4-35C954C49990",variableType:-4}
 */
var vReturnFullRecords = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"14C6E4DF-4E96-4454-A0C7-C2500FA3098E"}
 */
var vSelectedElement = null;

/**
 * @type {Array<JSRecord>}
 *
 * @properties={typeid:35,uuid:"B3F330B2-52BD-4718-8636-05AE853C5820",variableType:-4}
 */
var vSelectedElements = new Array();

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"8FC61CB6-A439-4485-859A-92D1B5D26904"}
 */
var vUniqueFilter = null;

/**
 * @properties={typeid:35,uuid:"222B22D5-36CB-451A-AA71-6ABA7D5D116D",variableType:-4}
 */
var vAllowHide = false;

/**
 * @param {JSEvent} event
 * @param {String} _form
 * 
 * @properties={typeid:24,uuid:"6F0B3697-A69A-44C7-9A66-03E08F24AEF0"}
 * @AllowToRunInFind
 */
function selectRecords(event, _form)
{
	vAllowHide = true;
	
	if(vMultiSelect)// && vSelectedElements.length > 0)
	{
		var selectedElements = getSelectedElements(_form, vReturnFullRecords);
		if(selectedElements && selectedElements.length > 0)
		{
			if(vReturnForm && vReturnField)
			{
				forms[vReturnForm][vReturnField] = selectedElements
			}
			else if(vReturnField)
			{
				globals[vReturnField] = selectedElements
			}
			
			// call the callback method
			if (vAfterMultiSelectMethodName && forms[vReturnForm][vAfterMultiSelectMethodName])     
	        {
	        	forms[vReturnForm][vAfterMultiSelectMethodName](selectedElements);
	        }
			
	        // Save the currently selected elements
	        var _ids = []
	        for(var i = 0; i < vSelectedElements.length; i++)
			{
				_ids[i] = vSelectedElements[i][vPrimaryKey[0]];
			}
			
//			if(forms.svy_nav_fr_openTabs.vSelectedTab != null
//				&& forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab])
//			globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_elements = _ids;
			
			// Continue the execution where it left
			var _elementType = forms[event.getFormName()].elements[event.getElementName()].getElementType();
			if(_elementType === "TEXT_FIELD")	
			{
				closeAndContinue(event,forms[_form].controller.getFormContext().getValue(1,2))	// use the parent on double click
			}
			else
			{
				closeAndContinue(event)
			}
		}
		
		// Reload the whole foundset if nothing was selected
		forms[_form].controller.loadAllRecords();
	}
	else	// !vMultiSelect
	{
		selectRecord(event,_form)
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {String} _form
 *
 * @properties={typeid:24,uuid:"4A473FCF-2DFC-48B8-B026-ED782340BE46"}
 */
function selectRecord(event, _form)
{
	if(forms[_form]['disabled_calc'] == 1)
		return;
	
	vAllowHide = true;
	
	if(vReturnFullRecords)
	{
		returnValue = forms[_form].foundset.getSelectedRecord();
	}
	else if (vFieldKey)
	{
		if(forms[_form][vFieldKey])
			returnValue = forms[_form][vFieldKey];
		else
			returnValue = forms[_form].foundset[vFieldKey]
	}
	else
	{
		//MAVariazione - Use the previously stored name as the primary key
		returnValue = forms[_form][vPrimaryKey[0]];
	}
	
	if(vReturnForm && vReturnField)
	{
		forms[vReturnForm][vReturnField] = returnValue;
	}
	else if(vReturnField)
	{
		globals[vReturnField] = returnValue;
	}
	
	//call the callback method
	if(vAfterInsertMethodName)
	{
		 if (vReturnForm && forms[vReturnForm][vAfterInsertMethodName])
         {
         	forms[vReturnForm][vAfterInsertMethodName](forms[_form].foundset.getSelectedRecord());
         }
         else if(globals[vAfterInsertMethodName]) // MAVariazione - check whether the method exists
		 {
		 	globals[vAfterInsertMethodName](forms[_form].foundset.getSelectedRecord());
		 }
	}
	
	if(vSelectedElement) //if there is a selected element, request the focus
	{		
		if(forms[vReturnForm].elements[vSelectedElement] && forms[vReturnForm].elements[vSelectedElement].getElementType() == 'LABEL' && forms[vReturnForm].elements[vSelectedElement].getLabelForElementName)
		{
			var _fieldElement = forms[vReturnForm].elements[vSelectedElement].getLabelForElementName()
			if(_fieldElement)
			{
				forms[vReturnForm].elements[_fieldElement].requestFocus()
			}
		}
		else if(forms[vReturnForm].elements[vSelectedElement] && forms[vReturnForm].elements[vSelectedElement].getElementType() == 'BUTTON')
		{
			forms[vReturnForm].elements[vSelectedElement].requestFocus()
		}
	}
	
	globals.svy_mod_closeForm(event)
	
	if (vRecursivecall) 
		globals.svy_nav_showLookupWindow(vReturnForm, vRecursivecall[0], vRecursivecall[1], vRecursivecall[2], 
										 vRecursivecall[3], null, null, '', true)
		
	// daniele: handle differences between button ok and double click on a record
	var _elementType = forms[event.getFormName()].elements[event.getElementName()].getElementType()
	if(_elementType == "TEXT_FIELD")	
	{
		closeAndContinue(event,forms[_form].controller.getFormContext().getValue(1,2))	// use the parent on double click
	}
	else
	{
		closeAndContinue(event)
	}
}

/**
 * @param {JSEvent} event
 * @param {Number} checked
 * @param {String} form
 *
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"20F69562-1387-4E2B-A54A-BBEB2E57543A"}
 */
function checkRecords(event, checked, form)
{
	var fs = forms[form].foundset.duplicateFoundSet();
	for(var r = 1; r <= fs.getSize(); r++)
	{
		var record = fs.getRecord(r);
		// needed for successful storing of the calculation (see https://support.servoy.com/browse/SVY-7095)
		var temp = null;
		if(temp == null)
		   temp = record['checked_lkp'];
		record['checked_lkp'] = record['unselectable_calc'] ? record['checked_lkp'] : (!record['disabled_calc'] && checked);
	}
}

/**
 * @param {String} form
 * @param {Boolean} [returnFullRecords] whether to return full JSRecords
 * @param {Boolean} [excludeIfNotChecked] whether to exclude the only selected one if not checked
 * 
 * @return {Array|JSRecord}
 *
 * @properties={typeid:24,uuid:"95A2D5AB-7690-4967-ADC5-F4A2CDF4F335"}
 * @AllowToRunInFind
 */
function getSelectedElements(form,returnFullRecords,excludeIfNotChecked)
{
	var fs = forms[form].foundset;
		fs.loadAllRecords();
	
	var fieldToReturn = vFieldKey || vPrimaryKey[0];
	var selectedRecord = !fs['disabled_calc'] && ((returnFullRecords && fs.getSelectedRecord()) || fs.getSelectedRecord()[fieldToReturn]);
	
	// MAVariazione - Salva eventuali modifiche pendenti, pena fallimento del find
	if(!databaseManager.getAutoSave())
		databaseManager.saveData(fs);
		
	returnValue = [];
		
	for(var r = 1; r <= fs.getSize(); r++)
	{
		var record = fs.getRecord(r);
		if (record['checked_lkp'] === 1 && !record['disabled_calc'])
		{
			if(returnFullRecords)
				returnValue.push(record);
			else
				returnValue.push(record[fieldToReturn]);
		}
	}
			
	if(returnValue.length > 0)
			return returnValue;
	else
	if(selectedRecord && !excludeIfNotChecked)
		return [selectedRecord];
	
	return null;
}

/**
 * Closes the dialog and restores the call stack from the continuation returning the value. Called when the user pressed an ok button on a dialog.
 * @protected
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 * @param {JSEvent} _event
 * @param {String} [_form]
 *
 * @properties={typeid:24,uuid:"253AB953-45E6-4839-AC46-97843DADC542"}
 * @AllowToRunInFind
 */
function closeAndContinue(_event, _form)
{		
	//controller.search() - to make it work in find mode
	if(!_form)
		_form = _event.getFormName();
	/** @type {Function} */
	var c = forms[_form].dialogContinuation;
	var r = forms[_form].returnValue;
	globals.svy_mod_closeForm(_event);

	if (c && application.getApplicationType() === APPLICATION_TYPES.WEB_CLIENT)
	{
		c(r);
	}
}

/**
 * Closes the dialog and restores the call stack from the continuation. Called when the user pressed a cancel button on a dialog.
 * @protected
 *
 * @author Bogdan Diaconescu
 * @since 02 March 2009
 * @param {JSEvent} _event
 * @properties={typeid:24,uuid:"82A82BEB-C8B4-43F7-A220-5EE8918D6D15"}
 */
function _cancelClicked(_event) 
{		
	var fn = _event.getFormName();

	/** @type {Function} */
	var cont = forms[fn].dialogContinuation;
	
	vAllowHide = true;
	
	globals.svy_mod_closeForm(_event);
	
	if (application.getApplicationType() == 5) cont(null);
	
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7E4C281D-B517-46AB-ADAC-571C8400AD88"}
 */
function onHide(event) 
{	
//	if(!vAllowHide)
//		globals.ma_utl_showInfoDialog('Confermare od annullare la selezione tramite i pulsanti in basso a destra');
	return vAllowHide;
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F95E9157-486D-4249-96C7-B4F9AD293F08"}
 */
function onShow(firstShow, event) 
{
	vAllowHide = false;
}
