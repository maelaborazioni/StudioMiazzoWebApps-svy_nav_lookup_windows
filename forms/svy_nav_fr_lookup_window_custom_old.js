/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D6BC1F27-B456-4B47-8BAC-89970D113A74"}
 */
var vSearch = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"46218C10-C160-4928-8A0D-2E550FB24328"}
 */
var vSearchOld = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"CD1566EB-F65C-4F74-B006-A26E7E0A9991"}
 * @AllowToRunInFind
 */
function search(event) {
	// MAVariazione - if the search field's text did not change, take the currently selected record,
	// but only if the action was triggered by the enter key.
	if(event.getElementName() && (elements[event.getElementName()].getElementType() === "TEXT_FIELD" && vSearchOld === vSearch))
	{
		selectRecord(event)
	}
	else
	{
		/** @type {Number} */
		var _index = elements.tab_searchFields.tabIndex
		var _form = elements.tab_searchFields.getTabFormNameAt(_index)
		if(forms[_form].controller.find())
		{
			for (var i = 0; i < vFields.length; i++)
			{
				if(vMultiSelect)
				{
					var _split_field = vFields[i].split('.')
					_split_field = _split_field[_split_field.length - 1]
					
					forms[_form].controller.newRecord()
					forms[_form][_split_field] = '#'+ vSearch + '%'
					forms[_form].controller.newRecord()
					forms[_form][_split_field] = '#% '+ vSearch + '%'
				}
				else
				{
					forms[_form].controller.newRecord()
					forms[_form][vFields[i]] = '#'+ vSearch + '%'
					forms[_form].controller.newRecord()
					forms[_form][vFields[i]] = '#% '+ vSearch + '%'
				}
			}
			forms[_form].controller.search()
			vSearchOld = vSearch
		}
//		forms[_form].elements[vElements[0]].requestFocus()
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D82A466A-B929-4C8A-88CC-8ADD53EE4E34"}
 */
function newRecord(event) {
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex
	var _form = elements.tab_searchFields.getTabFormNameAt(_index)
	globals.svy_nav_lkp_showRecord(forms[_form].foundset,vProgram, true)//also new record
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"510BF51C-3BDF-4262-AB1E-D1D7B62AABF1"}
 */
function showRecord(event) {
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex
	var _form = elements.tab_searchFields.getTabFormNameAt(_index)
	return globals.svy_nav_lkp_showRecord(forms[_form].foundset,vProgram)
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"80682CD4-6FB3-44C2-82E1-3B64806FFE9A"}
 */
function onShow(firstShow, event) {
	elements.fld_search.requestFocus()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"A1FCCE64-43F3-45B9-BBBE-43CEF9FAE993"}
 */
function cancel(event) {
	// daniele
	_cancelClicked(event)
//	globals.svy_mod_closeForm(event)
}

/** *
 * @param {JSEvent} event the event that triggered the action
 * @param {String} [_form]
 *
 * @properties={typeid:24,uuid:"E021833A-0E1D-4E2F-B092-E42FE8F44FEF"}
 */
function selectRecord(event, _form) {
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex
	_form = elements.tab_searchFields.getTabFormNameAt(_index)
	_super.selectRecord(event, _form)
}

/**
 * @properties={typeid:24,uuid:"905C1491-CA23-4B28-8EF6-B9A342C0C227"}
 */
function checkRecord(event, checked)
{
//	application.output('checked = ' + checked)
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex
	var _form = elements.tab_searchFields.getTabFormNameAt(_index)
	_super.checkRecords(event, checked, _form)
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"895A8A71-E790-4DFE-8E91-A3386B4BE0C6"}
 */
function selectRecords(event)
{
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex
	var _form = elements.tab_searchFields.getTabFormNameAt(_index)
	_super.selectRecords(event, _form)
}
