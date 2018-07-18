/**
 * MAVariazione - permetti l'utilizzo di una form di lookup custom specificata a runtime
 * 
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"1DDC8F1A-8D09-43F9-BE4D-8FAA02638D57"}
 */
var ma_nav_customLookupName = null;

/**
 * MAVariazione - permetti l'utilizzo di uno stile personalizzato per la lookup
 * 
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"6A3C61D3-9E3D-4A5F-89DB-B076D8E57FE7"}
 */
var ma_nav_lookupStyle = null;

/**
 * 
 * @author Sanneke Aleman
 * @type {{ pk: Number, fields: Array, data: Array, mode: String, returnField: String, returnForm: String }}
 * @properties={typeid:35,uuid:"4195E908-335A-455F-A222-DD3D45AB673D",variableType:-4}
 */
var svy_nav_fr_solutionModelObject = null;

/**
 * @param {String|JSEvent} _event
 * @param {String} _returnField
 * @param {String} _program
 * @param {String} [_afterInsertMethodName]
 * @param {String} [_methodToAddFoundsetFilters]
 * @param {Object} [_params]  Mode can be (case insensitive):
 *							"newCommit" - will commit the transaction in the lookup window
 *							"newNoCommit" - will not commit the transaction in the lookup window
 *							"show" - shows the requested record (which has the edit button if needed) - pass the pk to use the correct record
 *							"editCommit" - will commit the transaction in the lookup window - pass the pk to use the correct record
 *							"editNoCommit" - will not commit the transaction in the lookup window - pass the pk to use the correct record
 * @param {Array} [_svy_nav_fr_recursivecall] if you want the lookup window to call a lookup window
 * @param {String} [_fieldkey] if you want to return the value of a different other then the PK
 * @param {Boolean} [_allowInBrowse] if you want the method to run in browse
 * \\MaVariazione
 * @param {Number} [_lkpWidth] if you want to specify the width of the lookup window
 * @param {Number} [_lkpHeight] if you want to specify the height of the lookup window
 * @param {Boolean} [_multiSelect] if you want to allow multiple selection
 * @param {String} [_afterMultiSelectMethodName] the method to execute after multiple selection. It will be passed the array of selected records
 * @param {String} [_dateFormat] the format to use when displaying date type fields
 * @param {Boolean} [verbose] true if you want to display a number of error messages, false otherwise
 * @param {String} [noRecordMessage] the message to show when no records are found
 * @param {Boolean} [returnFullRecords]
 * @param {String} [sortMethod]
 * @param {Boolean} [blocking]
 * @param {Array} [selectedElements]
 * @param {Array} [disabledElements]
 * @param {String} [customLookupName]
 * @param {String} [styleName]
 * @param {Array} [unselectableElements]
 *
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"09683411-0331-4A08-BF5E-656611194522"}
 * @SuppressWarnings(unused)
 * @SuppressWarnings(wrongparameters)
 */
function svy_nav_showLookupWindow(
	_event, 
	_returnField, 
	_program, 
	_afterInsertMethodName, 
	_methodToAddFoundsetFilters, 
	_params, 
	_svy_nav_fr_recursivecall, 
	_fieldkey, 
	_allowInBrowse, 
	_lkpWidth, 
	_lkpHeight, 
	_multiSelect, 
	_afterMultiSelectMethodName, 
	_dateFormat, 
	verbose, 
	noRecordMessage, 
	returnFullRecords, 
	sortMethod, 
	blocking, 
	selectedElements, 
	disabledElements, 
	customLookupName, 
	styleName,
	unselectableElements
){	
	//MAVariazione
	/** @type {String} */
	var _element = ''
	/** @type {String} */
	var _returnForm = ''
		
	verbose = verbose !== false;
	
	if (_event instanceof JSEvent) {
		
		/** @type {JSEvent} */
		var _jsevent = _event 
		
		_returnForm = _jsevent.getFormName()
		_element = _jsevent.getElementName()
	}		
	else if (_event instanceof String)
		_returnForm = _event

	// Store the parameter into a global object
	if (_params) {
		globals.svy_nav_fr_solutionModelObject = _params;
		globals.svy_nav_fr_solutionModelObject.mode = globals.svy_nav_fr_solutionModelObject.mode.toLowerCase();
		//extra variables to make sure we return the created record
		globals.svy_nav_fr_solutionModelObject.returnField = _returnField
		globals.svy_nav_fr_solutionModelObject.returnForm = _returnForm
	}
	else
	{
		globals.svy_nav_fr_solutionModelObject = null
	}
	
	// MAVariazione - add sort method
	//get the foundset for the lookup windows
	/** @type {JSFoundset} */	
	var _fs = globals.svy_nav_lkp_getFoundset(_program,_returnForm,_methodToAddFoundsetFilters, sortMethod, _event)
	if(!_fs)
		return null;
	
	if (globals.svy_nav_fr_solutionModelObject && globals.nav.mode == 'browse' && (globals.svy_nav_fr_solutionModelObject.mode == "show" || globals.svy_nav_fr_solutionModelObject.mode == "lookup")) {
		// Allowing "show" and "lookup" mode to run in browse
		globals.svy_nav_lkp_showRecord(_fs,_program)
		return null;

	}
	// MAVariazione - also check for readonly
	else if (_returnForm && forms[_returnForm].controller.readOnly && globals.nav.mode == 'browse' &&(!globals.nav.program[globals.nav_program_name] ||  !globals.nav.program[globals.nav_program_name].noreadonly)  && !_allowInBrowse) {
		return null;// not allowed in browse mode
	}
	
	if(globals.svy_nav_fr_solutionModelObject && (globals.svy_nav_fr_solutionModelObject.mode == 'newcommit' || globals.svy_nav_fr_solutionModelObject.mode == 'newnocommit'))
	{
		globals.svy_nav_lkp_showRecord(_fs, _program, true)//also new record
		return null;
	}
	else if (globals.svy_nav_fr_solutionModelObject)
	{
		globals.svy_nav_lkp_showRecord(_fs, _program)
		return null;
	}

	if (!globals.nav.program[_program]) {
		//program is not in object, maybe user has no rights, or program does not exist
		return null;
	}
	
	// MAVariazione - don't even show the window if the foundset's empty (show an error message)
	if(_fs.getSize() == 0)
	{
		if(verbose)
			globals.svy_mod_dialogs_global_showInfoDialog('i18n:svy.fr.lbl.excuse_me',globals.nav.program[_program].description + ': ' + (noRecordMessage || i18n.getI18NMessage('hr.ex.emptyfoundset')), 'i18n:svy.fr.lbl.ok')
		
		return null;
	}

	//create new instance of the popup window
	var _UUID = application.getUUID()
	var _lookupWindow = 'svy_nav_fr_lookup_window';
	
	customLookupName = customLookupName || ma_nav_customLookupName;
	
	// MAVariazione - usa la lookup fornita come parametro
	if(customLookupName)
		_lookupWindow = customLookupName;
	else
	if(forms['svy_nav_fr_lookup_window_custom']) 
		_lookupWindow =  'svy_nav_fr_lookup_window_custom'
	
	var _formname = _lookupWindow+ _UUID;
	
	application.createNewFormInstance(_lookupWindow,_formname)
	
	// MAVariazione - set the focus to the search field
	forms[_formname].controller.focusField('fld_search',true)
	
	//create a form with the right fields on it
	// MAVariazione - duplicate the foundset so to not modify what's defined in the lkp program
	/** @type {JSFoundSet<db:/svy_framework/nav_program_fields>} */
	var _fs_fields = databaseManager.getFoundSet(globals.nav_db_framework,'nav_program_fields').duplicateFoundSet()
	_fs_fields.addFoundSetFilterParam('program_name','=',_program)
	_fs_fields.addFoundSetFilterParam('flag_lookup_field','=',1)
	_fs_fields.sort("sequence asc, nav_program_id asc", true);
	_fs_fields.loadRecords()
	
	forms[_formname]['vFields'] = new Array()
	forms[_formname]['vElements'] = new Array()
	
	//lookup the fields
	var _formProgram = _program + '_' + _UUID
	//MAVariazione - Style application
	var _style = ma_nav_lookupStyle || solutionModel.getForm(_lookupWindow).styleName;
	if(styleName)
		_style = styleName;
	
	//MAVariazione - Keep record of the primary key
	var _fs_pk = databaseManager.getTable(_fs.getDataSource()).getRowIdentifierColumnNames()
	forms[_formname]['vPrimaryKey'] = _fs_pk
	
	//MAVariazione - Format date fields (in order to do so, we need to keep track of the foundset's table
	var _fs_table = databaseManager.getTable(_fs)
	
	//MAVariazione - return full records if asked to
	forms[_formname]['vReturnFullRecords'] = returnFullRecords;
	
	// MAVariazione - Add a fake column to use for multiple selection
	//				  Also take into all related fields, so that search will work
	if(_multiSelect)
	{
		/**
		 * Add the calculation to the original datasource
		 */					
		var selected_calc = solutionModel.getDataSourceNode(_fs.getDataSource()).getCalculation('checked_lkp');
		if(!selected_calc)
			solutionModel.getDataSourceNode(_fs.getDataSource()).newCalculation("function checked_lkp(){ return 0; }", JSColumn.INTEGER);
		
		_fs.loadAllRecords();
		
		//sort the records
		if(databaseManager.saveData(_fs))
		{
			/** @type {Array<String>} */
			var _sort_value_split = [];
			
			if(globals.nav.program[_program].sort_value)
			{
			   _sort_value_split = globals.nav.program[_program].sort_value.split(',');
			}
			   
			for(var _sv in _sort_value_split)
			{
				var _ith_sort = _sort_value_split[_sv].split('.')
				_sort_value_split[_sv] = _ith_sort[_ith_sort.length - 1]
			}
		}

		_fs.sort(globals.nav.program[_program].sort_value, false);
	}
	
	// MAVariazione - disable the requested elements
	solutionModel.getDataSourceNode(_fs.getDataSource()).removeCalculation('disabled_calc');
	databaseManager.recalculate(_fs);

	var fs_index = 1;
	
	if (disabledElements && disabledElements.length > 0)
	{
		var disabled_calc = solutionModel.getDataSourceNode(_fs.getDataSource()).newCalculation("function disabled_calc(){ return 0; }", JSColumn.INTEGER);
		if(_fs && _fs.find())
		{
			_fs[_fs_pk[0]] = disabledElements;
			if(_fs.search() > 0)
			{
				for(var _r = 1; _r <= _fs.getSize(); _r++)
				{
					// needed for successful storing of the calculation (see https://support.servoy.com/browse/SVY-7095)
					var temp = _fs.getRecord(_r)['disabled_calc'];
					_fs.getRecord(_r)['disabled_calc'] = 1;
				}
			}
		}
		
		_fs.loadAllRecords();
		_fs.setSelectedIndex(1);
		
		while(_fs.getRecord(fs_index) && _fs.getRecord(fs_index)['disabled_calc'] == 1)
			fs_index++;
		
		if(fs_index > 1)
			_fs.setSelectedIndex(fs_index);
	}
	
	// MAVariazione - set unselectable requested elements
	solutionModel.getDataSourceNode(_fs.getDataSource()).removeCalculation('unselectable_calc');

	if (unselectableElements && unselectableElements.length > 0)
	{
		var unselectable_calc = solutionModel.getDataSourceNode(_fs.getDataSource()).newCalculation("function unselectable_calc(){ return 0; }", JSColumn.INTEGER);
		if(_fs && _fs.find())
		{
			_fs[_fs_pk[0]] = unselectableElements;
			if(_fs.search() > 0)
			{
				for(var r = 1; r <= _fs.getSize(); r++)
				{
					// needed for successful storing of the calculation (see https://support.servoy.com/browse/SVY-7095)
					var tempUn = _fs.getRecord(r)['unselectable_calc'];
					_fs.getRecord(r)['unselectable_calc'] = 1;
				}
			}
		}
		
		_fs.loadAllRecords();
		_fs.setSelectedIndex(1);
		
		while(_fs.getRecord(fs_index) && _fs.getRecord(fs_index)['unselectable_calc'] == 1)
			fs_index++;
		
		if(fs_index > 1)
			_fs.setSelectedIndex(fs_index);
	}
	
	// MAVariazione - Restore previously selected elements, if any
	/** @type {Array} */
	var _prevSelectedIDs 
	if(selectedElements)
		_prevSelectedIDs = selectedElements;
	else 
		_prevSelectedIDs = []
	if(_prevSelectedIDs.length > 0)
	{
		if(_fs.find())
		{
			_fs[_fs_pk[0]] = _prevSelectedIDs
			if(_fs.search() > 0)
			{
				// Update the list of selected elements
				forms[_formname]['vSelectedElements'] = []
				for(var i = 1; i <= _fs.getSize(); i++)
				{
					var record = _fs.getRecord(i);
					// needed for successful storing of the calculation (see https://support.servoy.com/browse/SVY-7095)
					var temp_rec = record['checked_lkp'];
					record['checked_lkp'] = 1;
						
					forms[_formname]['vSelectedElements'].push(record)
				}
			}
			
			// Reload the original foundset together with the updated records
			_fs.loadAllRecords();
		}
	}
	
	//MAVariazione - Use the same data source as the modified foundset, so that multiselect can work too
	var _jsForm = _jsForm = solutionModel.newForm(_formProgram,_fs.getDataSource(), _style, false, 400, 400)
//	_jsForm = solutionModel.newForm(_formProgram,'db:/'+globals.nav.program[_program].server_name+'/'+globals.nav.program[_program].table_name,_style,false,400,400)

	_jsForm.namedFoundSet = 'separate'
	
	_jsForm.view = JSForm.LOCKED_TABLE_VIEW
	_jsForm.scrollbars = SM_SCROLLBAR.VERTICAL_SCROLLBAR_AS_NEEDED | SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_NEVER;
	
	var _w_field = 200
	var _h_field = 20
	var _x_field = 0 
	var _y_field = 0
	var _total_field_w = 0
	
	if(_fs_fields.getSize() == 0)
	{	
		//there are no lookup fields specified
		return null;
	}
	
	// MAVariazione - always call selectRecords instead of selectRecord
	var _dateVar = _jsForm.newVariable("timestamp",JSColumn.DATETIME);
	var _selectMethod = _jsForm.newMethod("\
	function select(event) {\
		if (timestamp && (application.getTimeStamp().valueOf() - timestamp.valueOf()) < 400 ) {\
			forms['"+ _formname +"'].selectRecords(event);\
		} else {\
			timestamp = application.getTimeStamp();\
		}\
	}");
	
	if((disabledElements && disabledElements.length > 0)
		|| (unselectableElements && unselectableElements.length))
		_jsForm.onRender = solutionModel.getGlobalMethod("globals",'onRenderDisabled');
	
	// MAVariazione - Add a checkbox for multiple selection
	if(_multiSelect)
	{
		var _checked_width = 20;
		var _checked_field = _jsForm.newField('checked_lkp',JSField.CHECKS,_x_field,_y_field,_checked_width,_h_field);
			_checked_field.name = 'fld_checked';
			_checked_field.styleClass = 'table_check';
			_checked_field.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.WEST;
			_checked_field.editable = true;
			_checked_field.horizontalAlignment = SM_ALIGNMENT.CENTER;
			_checked_field.toolTipText = '%%i18n:ma.lbl.selectDeselect%%';
		
		_total_field_w += _checked_width;
		
		var _checked_label = _jsForm.newLabel('', _x_field, _y_field, _checked_width, _h_field);
			_checked_label.name = 'lbl_checked';
			_checked_label.labelFor = 'fld_checked';
			_checked_label.styleClass = 'table_header_lookup';
			_checked_label.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.WEST;
			_checked_label.enabled = true;
			_checked_label.horizontalAlignment = SM_ALIGNMENT.CENTER;
			_checked_label.imageMedia = solutionModel.getMedia('select_all_40.png');
			_checked_label.mediaOptions = SM_MEDIAOPTION.KEEPASPECT;
			_checked_label.showClick = false;
			_checked_label.toolTipText = '%%i18n:ma.lbl.selectDeselectAll%%';
			_checked_label.onAction = _jsForm.newMethod("\
			    function checksRecords(event) {\
			       forms['"+ _formname +"'].checkRecords(event);\
			    }");
	}
	
	for (var j = 1; j <=_fs_fields.getSize(); j++) {
		/** @type {JSRecord<db:/svy_framework/nav_program_fields>} */
		var _rec_pf = _fs_fields.getRecord(j)
		
		var _field_width = _w_field
		if(_rec_pf.field_width != null)
		{
			_field_width = _rec_pf.field_width
		}
		var _name = _rec_pf.elementname
		
		// MAVariazione
		var _data_provider = _rec_pf.dataprovider
		var _field = _jsForm.newField(_data_provider,//_rec_pf.dataprovider,
					JSField[_rec_pf.display_type],
					_x_field,
					_y_field,
					_field_width,
					_h_field)
			_field.name = _name				
			_field.anchors = SM_ANCHOR.ALL
			_field.editable = false
			_field.onAction = _selectMethod;
			
			_field.styleClass = 'table_lookup';
				
		if (_rec_pf.valuelistname) {
			_field.valuelist = solutionModel.getValueList(_rec_pf.valuelistname)
		}
		
		var _label = _jsForm.newLabel(_rec_pf.label, _x_field, _y_field, _w_field, _h_field)
		_label.name = 'lbl_' + _rec_pf.elementname
		_label.labelFor = _name
		_label.horizontalAlignment = _field.horizontalAlignment;
		_label.styleClass = 'table_header_lookup';
        _label.toolTipText = '%%i18n:ma.lbl.orderFilter%%';   
		// TODO setta l'indice del dataprovider su cui applicare il filtro
		_label.onRightClick = _jsForm.newMethod("\
		    function setUniqueFilter_" + j.toString() + "(event) {\
		       forms['"+ _formname +"'].setFilter(event,"+ j.toString() + ");\
		    }");
//		_label.onRightClick = _jsForm.newMethod("\
//		    function unsetUniqueFilter_" + j.toString() + "(event) {\
//		       forms['"+ _formname +"'].unsetFilter(event);\
//		    }");
		
		// MAVariazione - Format date fields 
		var _fs_field_type = (_fs_table.getColumn(_rec_pf.dataprovider) && _fs_table.getColumn(_rec_pf.dataprovider).getType()) || (solutionModel.getDataSourceNode(_fs.getDataSource()).getCalculation(_rec_pf.dataprovider) && solutionModel.getDataSourceNode(_fs.getDataSource()).getCalculation(_rec_pf.dataprovider).variableType);
		if (_fs_field_type)
		{
			//MAVariazione - Format date fields without hours
			if(_fs_field_type == JSColumn.DATETIME)
				_field.format = _dateFormat ? _dateFormat : 'dd/MM/yyyy'
			//MAVariazione - Format number fields without thousands separator
			if(_fs_field_type == JSColumn.NUMBER || _fs_field_type == JSColumn.INTEGER)
			   _field.format = "#"
		}
			
		forms[_formname].vFields.push(_rec_pf.dataprovider)
		forms[_formname].vElements.push(_name)
		_total_field_w += _field_width
	}	
	
	// MAVariazione - copy the filters over and load the foundset
	globals.svy_utl_copyFoundSetFilters(_fs, forms[_formProgram].foundset);
	forms[_formProgram].controller.loadRecords(_fs)
	
	//add the table form to the main form
	forms[_formname].elements['tab_searchFields'].addTab(forms[_formProgram])
		
	
	//set the properties
	forms[_formname]['vProgram'] = _program
	forms[_formname]['vReturnField'] = _returnField
	forms[_formname]['vReturnForm'] = _returnForm
	forms[_formname]['vAfterInsertMethodName'] = _afterInsertMethodName
	forms[_formname]['vRecursivecall'] = _svy_nav_fr_recursivecall  
	forms[_formname]['vFieldKey'] = _fieldkey
	
	//MAVariazione
	forms[_formname]['vMultiSelect'] = _multiSelect
	forms[_formname]['vAfterMultiSelectMethodName'] = _afterMultiSelectMethodName
	
	//set the buttons
	if(globals.nav.program[_program].btn_lookup_new)
	{
		forms[_formname].elements['btn_new_record'].enabled = (globals.nav.program[_program].add_mode == 1) && security.canInsert(_jsForm.dataSource)
	}
	else
	{
		forms[_formname].elements['btn_new_record'].enabled = false
	}
	
	if(globals.nav.program[_program].btn_lookup_show)
	{
		forms[_formname].elements['btn_show_record'].enabled = true
	}
	else
	{
		forms[_formname].elements['btn_show_record'].enabled = false
	}
	
	
	if(_element)
	{
		forms[_formname]['vSelectedElement'] = _element
	}
	
	/** MA Variazione*/
	var _width = 660
	var _height = 550
	
	// daniele: check whether we fit the screen
	if(_lkpWidth && application.getScreenWidth() > _lkpWidth){
		_width = _lkpWidth
	}else{
		//make width bigger if there are more fields
		var _basis_width = 40
		if((_basis_width + _total_field_w) > _width)
		{
			_width = _basis_width + _total_field_w
			if(application.getScreenWidth() < _width)
			{
				_width = application.getScreenWidth()
			}
		}
	}
	if(_lkpHeight)
		_height = _lkpHeight
	
	//show the popup	
	// daniele: use blocking dialog
	if(application.getApplicationType() === APPLICATION_TYPES.WEB_CLIENT && blocking !== false)
		return globals.svy_mod_dialogs_showBlockingDialog(_formname, true, _width, _height, globals.nav.program[_program].description)
	else
		globals.svy_mod_showFormInDialog(forms[_formname], -1, -1, _width, 550, globals.nav.program[_program].description,true,false,globals.nav.program[_program].description)
		
	return null;
}

/**
 * @param {String} _program
 * @param {String} _returnForm
 * @param {String} _methodToAddFoundsetFilters
 * @param {String} [_sortMethod] - MAVariazione
 * @param {JSEvent} [event]
 * 
 * @properties={typeid:24,uuid:"78AA52C9-48A2-43B5-A6C6-F8C95527A824"}
 * @AllowToRunInFind
 */
function svy_nav_lkp_getFoundset(_program,_returnForm,_methodToAddFoundsetFilters, _sortMethod, event) {

	var _fs = databaseManager.getFoundSet(globals.nav.program[_program].server_name,globals.nav.program[_program].table_name)
	
	// daniele: allow to use a form's specific method with the syntax <form>.<filter_method>
	//if there is a foundsetfilter add it
	if (_methodToAddFoundsetFilters)
	{
		_methodToAddFoundsetFilters = _methodToAddFoundsetFilters.split('.')
		if(_methodToAddFoundsetFilters.length == 1)
		{
			_methodToAddFoundsetFilters = _methodToAddFoundsetFilters[0]
			if(globals[_methodToAddFoundsetFilters] || forms[_returnForm] && forms[_returnForm][_methodToAddFoundsetFilters]) {
				if (globals[_methodToAddFoundsetFilters]) {
					_fs = globals[_methodToAddFoundsetFilters](_fs, event)
				} else {
					_fs = forms[_returnForm][_methodToAddFoundsetFilters](_fs, event)
				}
			}
		}
		else if(_methodToAddFoundsetFilters.length == 2 && forms[_methodToAddFoundsetFilters[0]][_methodToAddFoundsetFilters[1]])
		{
			_fs = forms[_methodToAddFoundsetFilters[0]][_methodToAddFoundsetFilters[1]](_fs)
		}
	}
	
	// MAVariazione - Check whether something is returned
	if(!_fs)
		return null;
	
	//load the records
	_fs.loadAllRecords()
	
	// MAVariazione - allow the user to specify a sort method
	//sort the records
	if(!_sortMethod)
		_fs.sort(globals.nav.program[_program].sort_value, false)
	else if(forms[_returnForm] && forms[_returnForm][_sortMethod])
		_fs.sort(forms[_returnForm][_sortMethod], false)
	else if(globals[_returnForm][_sortMethod])
		_fs.sort(globals[_sortMethod], false)
	
	return _fs
}

/**
 * To show a record, or also create a record
 * @param {JSFoundset} _foundset
 * @param {String} _program
 * @param {Boolean} [_newRecord] if you want a new record
 * 
 *
 * @properties={typeid:24,uuid:"D0131E65-CD9E-4FE9-98F3-1CBCF8DEE1E2"}
 */
function svy_nav_lkp_showRecord(_foundset, _program, _newRecord) {
	
	var _orgformname = 'svy_nav_fr_buttonbar_lookup_window'
		
	//developer wants to use own form
	if(forms['svy_nav_fr_buttonbar_lookup_window_custom'])
	{
		_orgformname = 'svy_nav_fr_buttonbar_lookup_window_custom'
	}
	
	var _formname = _orgformname + application.getUUID()
	
	globals.svy_utl_cloneForm(_formname,solutionModel.getForm(_orgformname))
	
	var _orgEditForm = globals.nav.program[_program].form[0][2]
	
	var _editForm = _orgEditForm + application.getUUID()
	
	var _jsForm = solutionModel.cloneForm(_editForm,solutionModel.getForm(_orgEditForm))
	
	if (globals.svy_nav_fr_solutionModelObject) {
		/** @type {{onDeleteAllRecordsCmd:String, onDeleteRecordCmd:String, 
		 * 			onDrag:String, onDragOver:String, onDrop:String, 
		 * 			onDuplicateRecordCmd:String, onElementFocusGained:String, onElementFocusLost:String,
		 * 			onHide:String,onLoad:String,onNewRecordCmd:String,onNextRecordCmd:String,onPreviousRecordCmd:String,onRecordEditStart:String, 
		 * 			onOmitRecordCmd:String,onRecordEditStop:String,onRecordSelection:String,onResize:String,onSearchCmd:String,
		 * 			onShow:String,onShowAllRecordsCmd:String,onShowOmittedRecordsCmd:String,onSortCmd:String,onUnLoad:String }} */
		var _params = globals.svy_nav_fr_solutionModelObject;
		if (_params.onDeleteAllRecordsCmd) _jsForm.onDeleteAllRecordsCmd = _jsForm.newMethod(_params.onDeleteAllRecordsCmd);
		if (_params.onDeleteRecordCmd) _jsForm.onDeleteRecordCmd = _jsForm.newMethod(_params.onDeleteRecordCmd);
		if (_params.onDrag) _jsForm.onDrag = _jsForm.newMethod(_params.onDrag);
		if (_params.onDragOver) _jsForm.onDragOver = _jsForm.newMethod(_params.onDragOver);
		if (_params.onDrop) _jsForm.onDrop = _jsForm.newMethod(_params.onDrop);
		if (_params.onDuplicateRecordCmd) _jsForm.onDuplicateRecordCmd = _jsForm.newMethod(_params.onDuplicateRecordCmd);
		if (_params.onElementFocusGained) _jsForm.onElementFocusGained = _jsForm.newMethod(_params.onElementFocusGained);
		if (_params.onElementFocusLost) _jsForm.onElementFocusLost = _jsForm.newMethod(_params.onElementFocusLost);
		if (_params.onHide) _jsForm.onHide = _jsForm.newMethod(_params.onHide);
		if (_params.onLoad) _jsForm.onLoad = _jsForm.newMethod(_params.onLoad);
		if (_params.onNewRecordCmd) _jsForm.onNewRecordCmd = _jsForm.newMethod(_params.onNewRecordCmd);
		if (_params.onNextRecordCmd) _jsForm.onNextRecordCmd = _jsForm.newMethod(_params.onNextRecordCmd);
		if (_params.onOmitRecordCmd) _jsForm.onOmitRecordCmd = _jsForm.newMethod(_params.onOmitRecordCmd);
		if (_params.onPreviousRecordCmd) _jsForm.onPreviousRecordCmd = _jsForm.newMethod(_params.onPreviousRecordCmd);
		if (_params.onRecordEditStart) _jsForm.onRecordEditStart = _jsForm.newMethod(_params.onRecordEditStart);
		if (_params.onRecordEditStop) _jsForm.onRecordEditStop = _jsForm.newMethod(_params.onRecordEditStop);
		if (_params.onRecordSelection) _jsForm.onRecordSelection = _jsForm.newMethod(_params.onRecordSelection);
		if (_params.onResize) _jsForm.onResize = _jsForm.newMethod(_params.onResize);
		if (_params.onSearchCmd) _jsForm.onSearchCmd = _jsForm.newMethod(_params.onSearchCmd);
		if (_params.onShow) _jsForm.onShow = _jsForm.newMethod(_params.onShow);
		if (_params.onShowAllRecordsCmd) _jsForm.onShowAllRecordsCmd = _jsForm.newMethod(_params.onShowAllRecordsCmd);
		if (_params.onShowOmittedRecordsCmd) _jsForm.onShowOmittedRecordsCmd = _jsForm.newMethod(_params.onShowOmittedRecordsCmd);
		if (_params.onSortCmd) _jsForm.onSortCmd = _jsForm.newMethod(_params.onSortCmd);
		if (_params.onUnLoad) _jsForm.onUnLoad = _jsForm.newMethod(_params.onUnLoad);
	}

	forms[_formname].elements['form_view_01'].addTab(forms[_editForm])
	forms[_editForm].controller.loadRecords(_foundset)
	
	forms[_formname]['vMode'] = 'browse'
	forms[_formname]['vProgram'] = _program
	//  extra variables to make sure we can return the created record
	if (globals.svy_nav_fr_solutionModelObject && globals.svy_nav_fr_solutionModelObject.returnField && globals.svy_nav_fr_solutionModelObject.returnForm) {
		forms[_formname]['vReturnField'] = globals.svy_nav_fr_solutionModelObject.returnField
		forms[_formname]['vReturnForm'] = globals.svy_nav_fr_solutionModelObject.returnForm
	}	

	forms[_formname].updateUI()
	
	if (globals.svy_nav_fr_solutionModelObject && globals.svy_nav_fr_solutionModelObject.pk) {
		// Select the correct record	
			
		forms[_editForm].foundset.selectRecord(globals.svy_nav_fr_solutionModelObject.pk);
	}
	
	forms[_formname].elements['btn_edit'].enabled = (globals.nav.program[_program].update_mode == 1) && security.canUpdate(forms[_editForm].controller.getDataSource())
	
	forms[_editForm].controller.readOnly = true
	
	if(_newRecord)
	{
		forms[_formname].dc_edit()
		forms[_formname]['vNew'] = 1
		forms[_editForm].controller.newRecord()
		if (globals.svy_nav_fr_solutionModelObject && globals.svy_nav_fr_solutionModelObject.fields && globals.svy_nav_fr_solutionModelObject.data && globals.svy_nav_fr_solutionModelObject.fields.length == globals.svy_nav_fr_solutionModelObject.data.length) {
			for (var i = 0; i < globals.svy_nav_fr_solutionModelObject.fields.length; i++) {
				forms[_editForm][globals.svy_nav_fr_solutionModelObject.fields[i]] = globals.svy_nav_fr_solutionModelObject.data[i];
			}

		}
	}
	
	globals.svy_mod_showFormInDialog(forms[_formname], -1, -1, globals.svy_utl_getFormWidth(_orgEditForm)+40, globals.svy_utl_getFormHeight(_orgEditForm) + 80, globals.nav.program[_program].description,true,false,'show_'+globals.nav.program[_program].description)
	
	return _formname
}

/**
 * To show a record, or also create a record
 * @param {JSFoundset} _foundset
 * @param {String} _program
 * @param {Boolean} [_newRecord] if you want a new record
 * @param {Number} [_lkpWidth] if you want to specify the width of the lookup window
 * @param {Number} [_lkpHeight] if you want to specify the height of the lookup window
 * 
 * @properties={typeid:24,uuid:"29004725-ED66-47B5-8DC6-4F5624E54CE8"}
 */
function svy_nav_lkp_showRecord_new(_foundset, _program, _newRecord, _lkpWidth, _lkpHeight) {
	
	var _orgformname = 'svy_nav_fr_buttonbar_lookup_window'
		
	//developer wants to use own form
	if(forms['svy_nav_fr_buttonbar_lookup_window_custom'])
	{
		_orgformname = 'svy_nav_fr_buttonbar_lookup_window_custom'
	}
	
	var _formname = _orgformname + application.getUUID()
	
	globals.svy_utl_cloneForm(_formname,solutionModel.getForm(_orgformname))
	
	var _orgEditForm = globals.nav.program[_program].form[0][2]
	
	var _editForm = _orgEditForm + application.getUUID()
	
	var _jsForm = solutionModel.cloneForm(_editForm,solutionModel.getForm(_orgEditForm))		
	
	if (globals.svy_nav_fr_solutionModelObject) {
		/** @type {{onDeleteAllRecordsCmd:String, onDeleteRecordCmd:String, 
		 * 			onDrag:String, onDragOver:String, onDrop:String, 
		 * 			onDuplicateRecordCmd:String, onElementFocusGained:String, onElementFocusLost:String,
		 * 			onHide:String,onLoad:String,onNewRecordCmd:String,onNextRecordCmd:String,onPreviousRecordCmd:String,onRecordEditStart:String, 
		 * 			onOmitRecordCmd:String,onRecordEditStop:String,onRecordSelection:String,onResize:String,onSearchCmd:String,
		 * 			onShow:String,onShowAllRecordsCmd:String,onShowOmittedRecordsCmd:String,onSortCmd:String,onUnLoad:String }} */
		var _params = globals.svy_nav_fr_solutionModelObject;
		if (_params.onDeleteAllRecordsCmd) _jsForm.onDeleteAllRecordsCmd = _jsForm.newMethod(_params.onDeleteAllRecordsCmd);
		if (_params.onDeleteRecordCmd) _jsForm.onDeleteRecordCmd = _jsForm.newMethod(_params.onDeleteRecordCmd);
		if (_params.onDrag) _jsForm.onDrag = _jsForm.newMethod(_params.onDrag);
		if (_params.onDragOver) _jsForm.onDragOver = _jsForm.newMethod(_params.onDragOver);
		if (_params.onDrop) _jsForm.onDrop = _jsForm.newMethod(_params.onDrop);
		if (_params.onDuplicateRecordCmd) _jsForm.onDuplicateRecordCmd = _jsForm.newMethod(_params.onDuplicateRecordCmd);
		if (_params.onElementFocusGained) _jsForm.onElementFocusGained = _jsForm.newMethod(_params.onElementFocusGained);
		if (_params.onElementFocusLost) _jsForm.onElementFocusLost = _jsForm.newMethod(_params.onElementFocusLost);
		if (_params.onHide) _jsForm.onHide = _jsForm.newMethod(_params.onHide);
		if (_params.onLoad) _jsForm.onLoad = _jsForm.newMethod(_params.onLoad);
		if (_params.onNewRecordCmd) _jsForm.onNewRecordCmd = _jsForm.newMethod(_params.onNewRecordCmd);
		if (_params.onNextRecordCmd) _jsForm.onNextRecordCmd = _jsForm.newMethod(_params.onNextRecordCmd);
		if (_params.onOmitRecordCmd) _jsForm.onOmitRecordCmd = _jsForm.newMethod(_params.onOmitRecordCmd);
		if (_params.onPreviousRecordCmd) _jsForm.onPreviousRecordCmd = _jsForm.newMethod(_params.onPreviousRecordCmd);
		if (_params.onRecordEditStart) _jsForm.onRecordEditStart = _jsForm.newMethod(_params.onRecordEditStart);
		if (_params.onRecordEditStop) _jsForm.onRecordEditStop = _jsForm.newMethod(_params.onRecordEditStop);
		if (_params.onRecordSelection) _jsForm.onRecordSelection = _jsForm.newMethod(_params.onRecordSelection);
		if (_params.onResize) _jsForm.onResize = _jsForm.newMethod(_params.onResize);
		if (_params.onSearchCmd) _jsForm.onSearchCmd = _jsForm.newMethod(_params.onSearchCmd);
		if (_params.onShow) _jsForm.onShow = _jsForm.newMethod(_params.onShow);
		if (_params.onShowAllRecordsCmd) _jsForm.onShowAllRecordsCmd = _jsForm.newMethod(_params.onShowAllRecordsCmd);
		if (_params.onShowOmittedRecordsCmd) _jsForm.onShowOmittedRecordsCmd = _jsForm.newMethod(_params.onShowOmittedRecordsCmd);
		if (_params.onSortCmd) _jsForm.onSortCmd = _jsForm.newMethod(_params.onSortCmd);
		if (_params.onUnLoad) _jsForm.onUnLoad = _jsForm.newMethod(_params.onUnLoad);
	}

	forms[_formname].elements['form_view_01'].addTab(forms[_editForm])
	forms[_editForm].controller.loadRecords(_foundset)
	
	forms[_formname]['vMode'] = 'browse'
	forms[_formname]['vProgram'] = _program
	
	//MAVariazione
	if (_lkpWidth) 
		forms[_editForm]['width'] = _lkpWidth					
	if (_lkpHeight) 
		forms[_editForm]['height'] = _lkpHeight		
	
	
	//  extra variables to make sure we can return the created record
	if (globals.svy_nav_fr_solutionModelObject && globals.svy_nav_fr_solutionModelObject.returnField && globals.svy_nav_fr_solutionModelObject.returnForm) {
		forms[_formname]['vReturnField'] = globals.svy_nav_fr_solutionModelObject.returnField
		forms[_formname]['vReturnForm'] = globals.svy_nav_fr_solutionModelObject.returnForm
	}	

	forms[_formname].updateUI()
	
	if (globals.svy_nav_fr_solutionModelObject && globals.svy_nav_fr_solutionModelObject.pk) {
		// Select the correct record	
			
		forms[_editForm].foundset.selectRecord(globals.svy_nav_fr_solutionModelObject.pk);
	}
	
	forms[_formname].elements['btn_edit'].enabled = (globals.nav.program[_program].update_mode == 1) && security.canUpdate(forms[_editForm].controller.getDataSource())
	
	forms[_editForm].controller.readOnly = true
	
	if(_newRecord)
	{
		forms[_formname].dc_edit()
		forms[_formname]['vNew'] = 1
		forms[_editForm].controller.newRecord()
		if (globals.svy_nav_fr_solutionModelObject && globals.svy_nav_fr_solutionModelObject.fields && globals.svy_nav_fr_solutionModelObject.data && globals.svy_nav_fr_solutionModelObject.fields.length == globals.svy_nav_fr_solutionModelObject.data.length) {
			for (var i = 0; i < globals.svy_nav_fr_solutionModelObject.fields.length; i++) {
				forms[_editForm][globals.svy_nav_fr_solutionModelObject.fields[i]] = globals.svy_nav_fr_solutionModelObject.data[i];
			}

		}
	}
	
	//globals.svy_mod_showFormInDialog(forms[_formname], -1, -1, globals.svy_utl_getFormWidth(_orgEditForm)+40, globals.svy_utl_getFormHeight(_orgEditForm) + 80, globals.nav.program[_program].description,true,false,'show_'+globals.nav.program[_program].description)
	globals.svy_mod_showFormInDialog(forms[_formname], -1, -1, _lkpWidth + 40, _lkpHeight + 80, globals.nav.program[_program].description,true,false,'show_'+globals.nav.program[_program].description)
	
	if (_lkpWidth) {				 		
		forms[_formname].elements['lblInt'].setSize(_lkpWidth, forms[_formname].elements['lblInt'].getHeight())		
		forms[_formname].elements['lblDivider2'].setLocation(_lkpWidth - 100, forms[_formname].elements['lblDivider2'].getLocationY())
		forms[_formname].elements['btn_save'].setLocation(_lkpWidth - 89, forms[_formname].elements['btn_save'].getLocationY())
		forms[_formname].elements['btn_cancel'].setLocation(_lkpWidth - 62, forms[_formname].elements['btn_cancel'].getLocationY())
		forms[_formname].elements['lblDivider3'].setLocation(_lkpWidth - 33, forms[_formname].elements['lblDivider3'].getLocationY())
		forms[_formname].elements['btn_close'].setLocation(_lkpWidth - 26, forms[_formname].elements['btn_close'].getLocationY())		
	}
	
	return _formname
}

/**
 * @param {JSFoundSet<db:/svy_framework/nav_program_fields>} _fs_fields
 * 
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"1DEC1FC8-7C67-4557-9E5F-7D143852E597"}
 */
function _getRelatedFields(_fs_fields)
{
	var _relatedFields = new Array()
	for (var i = 1; i <=_fs_fields.getSize(); i++) {
		/** @type {JSRecord<db:/svy_framework/nav_program_fields>} */
		var _rec_pf = _fs_fields.getRecord(i)
		// MAVariazione - if in multiselect mode, we don't have any related field anymore
		var _rec_pf_dataprovider_split = _rec_pf.dataprovider.split('.')
		if(_rec_pf_dataprovider_split.length > 1)
		{
			var _relation = _rec_pf_dataprovider_split.slice(0,_rec_pf_dataprovider_split.length - 1).join('.')
			var _dataprovider = _rec_pf_dataprovider_split[_rec_pf_dataprovider_split.length - 1]//[_relation,_rec_pf_dataprovider_split[_rec_pf_dataprovider_split.length - 1]].join('_')
			_relatedFields[_rec_pf.elementname] = 
				{
					relation: _relation,
					dataprovider: _dataprovider 
				}
			
//			_rec_pf.dataprovider = _dataprovider
		}
	}
	
	return _relatedFields
}
