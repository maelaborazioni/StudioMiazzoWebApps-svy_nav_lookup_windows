/**
 * @properties={typeid:35,uuid:"A404F86E-289D-4220-BEE0-AA0D91E18E82",variableType:-4}
 */
var vEditedRecords = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3F8DA3FC-3A33-4940-9D98-C31119064630"}
 */
var vMode = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F44EA4A1-79DE-466D-A1F7-462E53228907",variableType:4}
 */
var vNew = 0;

/**
 * @properties={typeid:24,uuid:"E8AA95C1-20CF-4AA1-8F2E-3B84F9B784F4"}
 */
function dc_edit() {
	/** @type {Number} */
	var _index = elements.form_view_01.tabIndex
	var _form = elements.form_view_01.getTabFormNameAt(_index)
	
	var _program = vProgram
	
	var success

		// acquire a lock or not, based on the program properties
	if (globals.nav.program[_program].record_locking) {

		if (forms[_form].controller.view != 0) //list or table view, so lock more records
		{
			success = databaseManager.acquireLock(forms[_form].foundset, -1)
			if (!success) {
				globals.DIALOGS.showWarningDialog(i18n.getI18NMessage('svy.fr.lbl.warning'), i18n.getI18NMessage('svy.fr.dlg.record_lock'));
				return;
			}

		} else {
			success = databaseManager.acquireLock(forms[_form].foundset, 0)
			if (!success) {
				globals.DIALOGS.showWarningDialog(i18n.getI18NMessage('svy.fr.lbl.warning'), i18n.getI18NMessage('svy.fr.dlg.record_lock'));
				return;
			}

		}
	}
	
	forms[_form].controller.focusFirstField()
	forms[_form].controller.readOnly = false
	globals['svy_nav_setFieldsColor'](_form, 'edit')
	globals['svy_nav_setRequiredFields'](globals.nav.program[_program],_form, 'edit')
	vMode = 'edit'
	if (forms[_form].gotoEdit) {
		forms[_form].gotoEdit()
	}
	
	
	updateUI();
	vEditedRecords = databaseManager.getEditedRecords()
//	application.output('edited records: '+ vEditedRecords.length)

}

/**
 * @param {JSEvent} _event
 * @properties={typeid:24,uuid:"129C3D27-0287-43BF-AFA9-21025EAAFD27"}
 * @AllowToRunInFind
 * @SuppressWarnings(unused)
 */
function dc_save(_event) {

	
	/** @type {Number} */
	var _index = elements.form_view_01.tabIndex
	var _form = elements.form_view_01.getTabFormNameAt(_index)
	

    // Want to avoid saving the transaction if we are editing a record
    if (globals.svy_nav_fr_solutionModelObject &&
    		(globals.svy_nav_fr_solutionModelObject.mode == "editnocommit" ||
                            globals.svy_nav_fr_solutionModelObject.mode == "newnocommit"))
    {
       globals.svy_mod_closeForm(_event)
	   return
    }
	var _methodReturn = forms[_form].dc_save_validate(forms[_form].foundset, vProgram)
	if (_methodReturn == -1) {
		return;
	}

	databaseManager.startTransaction()
	
	//run onPreSave-method of table when available
	_methodReturn = forms[_form].dc_save_pre(forms[_form].foundset)
	if (_methodReturn == -1) {
		return;
	}
	
	var _records = getEditedRecords()
	var _record, _thePressedButton
	for (var i = 0; i < _records.length; i++) {
		// save with output if the save went wrong
		if (!databaseManager.saveData(_records[i])) {
		
			var _failedArray = databaseManager.getFailedRecords()
			for (i = 0; i < _failedArray.length; i++) {
				_record = _failedArray[i];
			}
			/** @type {String} */
			var _ex = _record.exception
			_thePressedButton = globals.DIALOGS.showWarningDialog('Error in save', _ex, 'OK');
			databaseManager.rollbackTransaction()
			return;
		} 
	}
	//run onPostSave-method of table when available
	_methodReturn = forms[_form].dc_save_post(forms[_form].foundset)
	if (_methodReturn == -1) {
		databaseManager.rollbackTransaction()
		return;
	}
		
	// commit with output if the commit went wrong
	if (!databaseManager.commitTransaction()) {
		_failedArray = databaseManager.getFailedRecords()
		for (i = 0; i < _failedArray.length; i++) {
			_record = _failedArray[i];
		}
		_ex = _record.exception
		_thePressedButton = globals.DIALOGS.showWarningDialog('Error in Commit', _ex, 'OK');
		databaseManager.rollbackTransaction()
		return;
	}
	
	globals.svy_mod_closeForm(_event)
	
}

/**
 * @param {JSEvent} _event
 * @properties={typeid:24,uuid:"678E5D7E-60A5-4C4D-BE06-4BAEE3C448AD"}
 */
function dc_cancel(_event) {
	
	/** @type {Number} */
	var _index = elements.form_view_01.tabIndex
	var _form = elements.form_view_01.getTabFormNameAt(_index)
	
	var _record = forms[_form].foundset.getSelectedRecord()

	//roll back record changes
	// databaseManager.revertEditedRecords(_record) - for 6
	_record.revertChanges()
	if(vNew)// to rollback the new record
	{
		forms[_form].controller.deleteRecord()
	}
	// to prevent setting a value
	vReturnField = null;

	globals.svy_mod_closeForm(_event)
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"F5215DB1-D831-4A1A-9A43-131F0AB58778"}
 */
function close(event) {
	globals.svy_mod_closeForm(event)
}

/**
 * @properties={typeid:24,uuid:"A3280687-EF48-4183-8893-2D8A5C13B56D"}
 */
function updateUI() {
	elements.btn_cancel.enabled = vMode != 'browse'
	elements.btn_close.enabled = vMode == 'browse'
	elements.btn_edit.enabled = vMode == 'browse'
	elements.btn_save.enabled = vMode != 'browse'	
}

/**
 * Method to get a array with all the records that are edited in the popupform
 * @return JSArray editedRecords returns a array with all the records that are edited in the popupform
 * @properties={typeid:24,uuid:"C2322E0F-4E2D-4343-8E18-C21251C1F080"}
 */
function getEditedRecords() {
	/** @type {Number} */
	var _index = elements.form_view_01.tabIndex
	var _form = elements.form_view_01.getTabFormNameAt(_index)
	var _record = forms[_form].foundset.getSelectedRecord()
	var _records = new Array()
	
	//get the record of the form you are editing
	_records.push(_record)
	
	//compare the edited records that where there before you start editing with what records there are now
	var _currentEditedRecords = databaseManager.getEditedRecords()
	
	for (var i = 0; i < _currentEditedRecords.length; i++) {
		var _isInArray = false
		for (var j = 0; j < vEditedRecords.length; j++) {
			if(_currentEditedRecords[i] == vEditedRecords[j])
			{
				_isInArray = true
			}
		}
		if(!_isInArray)
		{
			//This is a record that is edited on the form
			if(_currentEditedRecords[i] != _record) //not the form record
			{
				_records.push(_currentEditedRecords[i])
			}
		}
	}
	return _records
}

/**
 * Handle hide window.
 * @param {JSEvent} event the event that triggered the action
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"024F2E77-5B5F-4B10-9875-08119B0A00FD"}
 */
function onHide(event) {
	
	if (globals.svy_nav_fr_solutionModelObject && (globals.svy_nav_fr_solutionModelObject.mode == 'newcommit' || globals.svy_nav_fr_solutionModelObject.mode == 'newnocommit')) {
		selectRecord(event);
	} else {
		globals.svy_mod_closeForm(event)
	}
	if (globals.svy_nav_fr_solutionModelObject) globals.svy_nav_fr_solutionModelObject.mode = "exit";
    return true
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2848C9EC-E250-4BAF-B0DD-844AC49618AA"}
 */
function onShow(firstShow, event)
{
	if (globals.svy_nav_fr_solutionModelObject && 
			((globals.svy_nav_fr_solutionModelObject.mode == "editnocommit" || 
					globals.svy_nav_fr_solutionModelObject.mode == "editcommit")||
			(globals.svy_nav_fr_solutionModelObject.mode == "newcommit" || 
			globals.svy_nav_fr_solutionModelObject.mode == "newnocommit"))) {
				application.sleep(200)
		dc_edit();
	}
}

/** *
 * @param {JSEvent} event the event that triggered the action
 * @param {String} [_form]
 *
 * @properties={typeid:24,uuid:"AD314D71-8A35-490E-9745-577F484BD3CB"}
 */
function selectRecord(event, _form) {
	/** @type {Number} */
	var _index = elements.form_view_01.tabIndex
	_form = elements.form_view_01.getTabFormNameAt(_index)
	_super.selectRecord(event, _form)
}
