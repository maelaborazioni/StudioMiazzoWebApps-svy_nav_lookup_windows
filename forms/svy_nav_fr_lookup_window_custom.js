/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"28642AC0-89CF-4383-8902-A4A5BA4784D8",variableType:4}
 */
var isAllChecked = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9E549A47-7C83-4522-BFC4-4F7427DA2CDB"}
 */
var vSearch = null;

/**
 * @properties={typeid:35,uuid:"05CFBF50-255A-4EC2-91DF-E27D621180C7",variableType:-4}
 */
var vSelectedLetter = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"5B646ABC-5460-4D7A-91B8-8F8A52ED9DC3"}
 */
var vSearchOld = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F3879ACA-EC0E-42C8-A514-523CCC50A4E8",variableType:4}
 */
var vSelectionType = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2733DEED-B64D-4D6C-A700-EF4598D87EB0",variableType:4}
 */
var vResearchType = 1; 

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"352D7159-494E-4C4C-B938-8151A46195B8",variableType:8}
 */
var vResearchTypeOld = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Boolean} [refreshBtns]
 * 
 * @properties={typeid:24,uuid:"10EF86D1-75CF-49EA-B268-24F5D4D0731C"}
 * @AllowToRunInFind
 */
function search(event,refreshBtns) 
{
	vSearch = vSearch || '';
	
	// MAVariazione - if the search field's text did not change, take the currently selected record,
	// but only if the action was triggered by the enter key.
	if(event 
	   && event.getElementName() 
	   && elements[event.getElementName()]
	   && (elements[event.getElementName()].getElementType() === "TEXT_FIELD" 
		   && vSearchOld === vSearch
		   && vResearchTypeOld == vResearchType))
	{
		if(vMultiSelect)
			selectRecords(event);
		else
			selectRecord(event);
	}
	else
	{
		vResearchTypeOld = vResearchType;
		
		/** @type {Number} */
		var _index = elements.tab_searchFields.tabIndex
		var _form = elements.tab_searchFields.getTabFormNameAt(_index)
		
		var formFoundset = forms[_form].foundset;
		
		// Save any edited data if in multiselect
		if(vMultiSelect && !databaseManager.getAutoSave())
			databaseManager.saveData(formFoundset);
		
		if(forms[_form].controller.find())
		{
			// Handle multiple values separated by a comma
			var split = vSearch.replace(' ', '').split(',');
			if (split && split.length > 1)
			{
				split.forEach(function(_, index) {
					if(index > 0)
						forms[_form].controller.newRecord();
					switch(vResearchType)
					{
						case 1:
						    forms[_form][vFields[0]] = '#' + _ + '%';
							break;
						case 2:
						    forms[_form][vFields[0]] = '%' + _ + '%';
							break;
					}
										
				});
			}
			else
				switch(vResearchType)
				{
					case 1:
					    forms[_form][vFields[0]] = '#' + vSearch + '%';
						break;
					case 2:
					    forms[_form][vFields[0]] = '%' + vSearch + '%';
						break;
				}
				
			for (var i = 1; i < vFields.length; i++)
			{
				if(!vUniqueFilter || (vUniqueFilter != null && vUniqueFilter > 0 && vUniqueFilter == i+1))
				{
					if (split && split.length > 1)
					{
						split.forEach(function(_, index) {
							if(index > 0)
								forms[_form].controller.newRecord();
							switch(vResearchType)
							{
								case 1:
									forms[_form][vFields[i]] = '#' + _ + '%';	
									break;
								case 2:
								    forms[_form][vFields[i]] = '%' + _ + '%';
									break;
							}
														 
						});
					}
					else
					{
						forms[_form].controller.newRecord();
						switch(vResearchType)
						{
							case 1:
								forms[_form][vFields[i]] = '#' + vSearch + '%';
								break;
							case 2:
								forms[_form][vFields[i]] = '%' + vSearch + '%';
								break;
						}
						
					}
				}
			}
			
			forms[_form].controller.search()
			vSearchOld = vSearch
			
			// ordinamento in ordine alfabetico se tra i campi del foundset è presente un campo con nome : nominativo
//			if(forms[_form].foundset['lavoratori_to_persone.nominativo'])
			if(forms[_form].foundset.alldataproviders.indexOf('nominativo') != -1)
				forms[_form].foundset.sort('lavoratori_to_persone.nominativo asc');
				
		}
		
		if(refreshBtns != null)
		{
			elements.btn_search.enabled = !refreshBtns;
		    elements.btn_unsearch.enabled = refreshBtns;
		}
	}
}

/**
 * @param {JSEvent} event
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"136DEEE7-A6CB-443F-96E7-7AC25571BA83"}
 */
function searchByLetter(event)
{	
	updateLetters(event.getElementName());
	
	var _elemName = event.getElementName();
	/** @type {JSLabel} */
	var _elem = elements[_elemName];
	var _letter = _elem.text;
	
	vSearch = _letter;
	search(event, true);
}

/**
 * @properties={typeid:24,uuid:"85782AA6-81CB-445E-8F52-C202201BB103"}
 */
function getSelectedColor()
{
	return '#ec1c24';
}

/**
 * @properties={typeid:24,uuid:"4BB003E4-1648-4C85-9423-31777A8C9B5E"}
 */
function getUnselectedColor()
{
	return '#434343';
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected 
 *
 * @properties={typeid:24,uuid:"5DA57020-6BDD-4891-AE70-719BDA82E99E"}
 */
function searchByNumber(event) 
{
	updateLetters(event.getElementName());
	vSearch = '0, 1, 2, 3, 4, 5, 6, 7, 8, 9';
	
	search(event, true);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param element
 *
 * @properties={typeid:24,uuid:"011F2F42-0915-454C-BF70-C0E41849AF5D"}
 */
function updateLetters(element)
{
	resetSelectedLetter();
	
	elements[element].bgcolor = getSelectedColor();
	plugins.WebClientUtils.setExtraCssClass(elements[element], 'lkp-letter-selected');
	
	vSelectedLetter = element;
}

/**
 * @properties={typeid:24,uuid:"661D7AE0-FEA3-429E-A9C4-C478BF6811A3"}
 */
function resetSelectedLetter()
{
	if (elements[vSelectedLetter])
	{
		elements[vSelectedLetter].bgcolor = getUnselectedColor();
		plugins.WebClientUtils.removeExtraCssClass(elements[vSelectedLetter]);
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"A9235E86-F47F-4996-AF4C-D3E9F3126BF1"}
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
 * @properties={typeid:24,uuid:"63BBBB40-8E1D-4600-B9A9-0E6C7FCACDCE"}
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
 * @properties={typeid:24,uuid:"03484987-51CE-45F5-87E1-460F4BDC27FA"}
 */
function onShow(firstShow, event) {
	
	//MAVariazione : multiselect added
	if(vMultiSelect)
	{	
		elements.lbl_filtra_selezione.visible = true;
		elements.cmb_tipo_selezione.visible = true;
	}
	else
	{
		elements.lbl_filtra_selezione.visible = false;
		elements.cmb_tipo_selezione.visible = false;
	}
	
	isAllChecked = false;
	
	elements.fld_search.requestFocus();

}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2D86E15B-36A5-48BF-A6D8-808288E310C3"}
 */
function cancel(event) 
{
	// MAVariazione
	_cancelClicked(event)
}

/** *
 * @param {JSEvent} event the event that triggered the action
 * @param {String} [_form]
 *
 * @properties={typeid:24,uuid:"A3F07124-87EE-4DA7-A6A5-6BD51BD4D400"}
 */
function selectRecord(event, _form) {
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex
	_form = elements.tab_searchFields.getTabFormNameAt(_index)
	return _super.selectRecord(event, _form)
}

/**
 * // TODO generated, please specify type and doc for the params
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"608AFAB6-3EFE-4DF7-A2F6-84CAFCBCC8C1"}
 */
function checkRecords(event){
	
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex;
	var _form = elements.tab_searchFields.getTabFormNameAt(_index);
    if(isAllChecked)
		isAllChecked = 0;
	else
		isAllChecked = 1;
		
	_super.checkRecords(event, isAllChecked, _form)
	
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"814F6176-6AE1-4DEC-B639-4DC873DA6685"}
 */
function selectRecords(event)
{
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex;
	var _form = elements.tab_searchFields.getTabFormNameAt(_index);
	return _super.selectRecords(event, _form);
}

/**
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E19CDA4E-01F4-4673-B829-543EE76C5EAE"}
 */
function unsearch(event) {
	
	// annulliamo il valore del filtro
	vSearch = '';
	// resettiamo la selezione del campo su cui filtrare
	vUniqueFilter = null;
	// puliamo la descrizione del valore su cui filtrare
	elements.lbl_valore.text = '';
	
	elements.btn_search.enabled = true;
	elements.btn_unsearch.enabled = false;
	
	resetSelectedLetter();
	search(event,false);	
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5FD7460F-07CE-40AA-8C65-6D0407CA3913"}
 * @AllowToRunInFind
 */
function onDataChangeTipoSelezione(oldValue, newValue, event) 
{
	/** @type {Number} */
	var _index = elements.tab_searchFields.tabIndex;
	var _form = elements.tab_searchFields.getTabFormNameAt(_index);

	var fs  = forms[_form].foundset;
	
	fs.loadAllRecords();
	unsearch(event);
	
	if(newValue > 0)
	{
		var valuesToShow = [];
		for(var r = 1; r <= fs.getSize(); r++)
		{
			var record = fs.getRecord(r);
			if((newValue == 1 && record['checked_lkp'] == 1) || (newValue == 2 && record['checked_lkp'] == 0))
				valuesToShow.push(record[vPrimaryKey[0]]);
		}
		
		if(fs.find())
		{
			fs[vPrimaryKey[0]] = valuesToShow;
			fs.search();
		}
	}
	
	vSearchOld = vSearch;
	
	elements.btn_search.enabled = true;
	elements.btn_unsearch.enabled = false;

	var letters = solutionModel.getForm(controller.getName()).getLabels();
	for (var letter = 0; letter < letters.length; letter++)
	{
		if (letters[letter].name && utils.stringLeft(letters[letter].name,4).equals('lbl_')) 
				//globals.startsWith("lbl_", letters[letter].name))
			elements[letters[letter].name].bgcolor="#434343";
	}
	
	vUniqueFilter = null;
	elements.lbl_valore.text = '';
		
	return true;
}

///**
// * Handle changed data.
// *
// * @param oldValue old value
// * @param newValue new value
// * @param {JSEvent} event the event that triggered the action
// *
// * @returns {Boolean}
// *
// * @private
// *
// * @properties={typeid:24,uuid:"5FD7460F-07CE-40AA-8C65-6D0407CA3913"}
// * @AllowToRunInFind
// */
//function onDataChangeTipoSelezione(oldValue, newValue, event) {
//	
//	/** @type {Number} */
//	var _index = elements.tab_searchFields.tabIndex;
//	var _form = elements.tab_searchFields.getTabFormNameAt(_index);
//
//	forms[_form].foundset.loadAllRecords();
//	databaseManager.recalculate(forms[_form].foundset);
//	unsearch(event);
//	
//	if(forms[_form].controller.find())
//	{
//		if(newValue == 1)
//		   forms[_form]['checked'] = 1; 
//		else if(newValue == 2)
//		   forms[_form]['checked'] = 0;	
//		
//		forms[_form].controller.search();
//		
//		vSearchOld = vSearch;
//		
//		elements.btn_search.enabled = true;
//		elements.btn_unsearch.enabled = false;
//		var letters = solutionModel.getForm(controller.getName()).getLabels();
//		for (var letter in letters)
//		{
//			if (letters[letter].name && globals.startsWith("lbl_", letters[letter].name))
//				elements[letters[letter].name].bgcolor="#434343";
//		}
//		vUniqueFilter = null;
//		elements.lbl_valore.text = '';
//	}
//		
//	return true;
//}

/**
 * @param {JSEvent} event
 * @param {Number} i
 *
 * @properties={typeid:24,uuid:"757F1387-07CB-43E2-93D7-3754CB18A839"}
 */
function setFilter(event,i)
{
	if(vUniqueFilter == null)
	{
		vUniqueFilter = i;
		elements.lbl_valore.text = ': solo ' + utils.stringMiddle(event.getElementName(),9,event.getElementName().length);
	}
	else
	{
		vUniqueFilter = null;
		elements.lbl_valore.text = '';
	}
	
	resetSelectedLetter();
	
	if(vSearch)
	   search(event,false);
	else
	   search(event,true);
}

/**
 * @param {JSEvent} event
 * @param {Object} i
 *
 * @properties={typeid:24,uuid:"959C712B-188F-4DF4-9D83-EA6D3D3BE032"}
 */
function unsetFilter(event,i)
{
	vUniqueFilter = null;
	elements.lbl_valore.text = '';
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"8373B00D-620A-4C02-9362-D8543249CBCE"}
 */
function onAction$fld_search(event) 
{
	resetSelectedLetter();
	search(event, true);
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"04E5A024-87A0-4340-9BCC-6212141A359D"}
 */
function onDataChangeResearchType(oldValue, newValue, event) 
{
	elements.btn_search.enabled = true;
	elements.btn_unsearch.enabled = false;
	
	vResearchTypeOld = oldValue;
	return true;
}

/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7122047C-DFD0-401E-8B32-F9B89C09C612"}
 */
function onDataChangeSearchStr(oldValue, newValue, event) 
{
	elements.btn_search.enabled = true;
	elements.btn_unsearch.enabled = false;
	
	return true
}
