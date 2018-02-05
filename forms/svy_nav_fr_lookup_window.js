/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"8C68FFBC-CED4-4DFE-8CD4-2257B35E9F2B",variableType:12}
 */
var vSearch = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2BBBFA0F-B1F5-4D56-B3BA-58D8FB04836A"}
 * @AllowToRunInFind
 */
function search(event) {
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex
	var _form = elements.tab_searchFields.getTabFormNameAt(_index)
	if(forms[_form].controller.find())
	{
		for (var i = 0; i < vFields.length; i++) {
			forms[_form].controller.newRecord()
			forms[_form][vFields[i]] = '#'+ vSearch + '%'
			forms[_form].controller.newRecord()
			forms[_form][vFields[i]] = '#% '+ vSearch + '%'
		}
		forms[_form].controller.search()
	}
	forms[_form].elements[vElements[0]].requestFocus()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"0B3E6F09-F1EC-4703-9ABF-21437C8BF338"}
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
 * @properties={typeid:24,uuid:"3ABB63FD-FCBC-4FA9-9B47-3D7032CC1957"}
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
 * @properties={typeid:24,uuid:"51460444-4FBD-494B-A4C3-16200162138A"}
 */
function onShow(firstShow, event) {
	elements.fld_search.requestFocus()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C7F4DFAD-8EAD-4936-907C-68B25F1B69B5"}
 */
function cancel(event) {
	globals.svy_mod_closeForm(event)
}

/** *
 * @param {JSEvent} event the event that triggered the action
 * @param {String} [_form]
 *
 * @properties={typeid:24,uuid:"EE5D0978-501D-4BDB-98A7-B753CC31733F"}
 */
function selectRecord(event, _form) {
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex
	_form = elements.tab_searchFields.getTabFormNameAt(_index)
	_super.selectRecord(event, _form)
}
