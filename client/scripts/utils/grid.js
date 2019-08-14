/**
 * @author 	: Saravana Kumar K
 * Grid module
 */
var swGrid = function( parent, pObj, meta ) {
	/* it represent, current object is being used by swPanel or Context object ( needed in pagination ) */
	this.Parent = parent;
	/* Parent object ( usually one of the context specific object ) */
	this.ParentContextObj = pObj;
	/*Holds input object*/
	this.MetaData = meta;
	/*Holds filtered rows*/
	this.Rows = meta.data;	
	/*pagination starting index*/
	this.StartIndex = 0;
	/*pagination ending index*/
	this.EndIndex = 50;
	/*pagination current active local page number*/
	this.CurrentPage = 0;
	/*pagination current active server page number*/
	this.CurrentServerPage = 1;
	/*pagination number entries per page*/	
	this.NumberOfColumn = 0;
	/* Pagination buttons class prefix */
	this.PaginationBtnClass = "";
	/* Pagination prev button object */
	this.PaginationPrevBtn = "";
	/* Pagination next button object */
	this.PaginationNextBtn = "";	
	/* Index of currently rendered page */	
	this.RecordPerPage = 10;	
	/* Total number of pages ( master total, without api result limitation ) */
	this.TotalServerPage = 0;
	/* Total number of record ( master total, without api result limitation ) */
	this.TotalServerRecord = 0;
	/* Total number locally available page ( this.RecordPerPage / this.TotalLocalRecord ) */
	this.TotalLocalPage = 0;
	/* Total number of record ( master total, without api result limitation ) */
	this.TotalLocalRecord = 0;
	
	
	this.ParentContainer = null;
	this.ParentTable = null;
	
	/**
	 * Constructor for TABLE_GRID (this is where everything start)
	 */
	this.InitGrid = function(pcontainer) {
		this.ParentContainer = pcontainer;		
		this.ParentContainer.html("");
		this.RenderSkeleton();
		this.RegisterEvents();
		this.InitPagination();		
	};
	
	/* Register events for pagination and row's click */
	this.RegisterEvents = function() {
		
		var btnNext = "a."+ this.PaginationBtnClass +"-next";
		var btnPrev = "a."+ this.PaginationBtnClass +"-prev";
		
		/* unregister previously registered events */
		$(document).off( "click", btnPrev );
		$(document).off( "click", btnNext );		
		
		/* register click event for pagination buttons */
		$(document).on("click", btnPrev, this, function(e){
			if( !$(this).hasClass("disabled") ) {
				if( e.data.ParentContextObj.swPanel.AjaxFlaQ ) {
					e.data.PrevPage();
				}else {
					var notifyText = $("#loading-notification").html();				
					if( notifyText.indexOf("Please wait,") == -1 ) {
						$("#loading-notification").html( "Please wait, I am trying to fetch more records...");
					}
				}
			}
			e.preventDefault();
		});
		
		$(document).on("click", btnNext, this, function(e){
			if( !$(this).hasClass("disabled") ) {
				if( e.data.ParentContextObj.swPanel.AjaxFlaQ ) {
					e.data.NextPage();				
				}else {
					var notifyText = $("#loading-notification").html();				
					if( notifyText.indexOf("Please wait,") == -1 ) {
						$("#loading-notification").html( "Please wait, I am trying to fetch more records...");
					}
				}
			}
			e.preventDefault();
		});
		
		/* store pagination buttons reference */
		this.PaginationPrevBtn = $(btnPrev);
		this.PaginationNextBtn = $(btnNext);
		
	};
	
	this.RenderSkeleton = function() {
		this.ParentTable = $('<table class="'+ this.MetaData.table_class +'"></table>');
		this.ParentContainer.append( this.ParentTable );		
	};
	
	this.InitPagination = function() {
		this.CurrentPage = 0;
		this.RecordPerPage = this.MetaData.record_per_page;
		/* server records */
		this.TotalServerRecord = this.MetaData.count;
		this.TotalServerPage = this.TotalServerRecord / this.RecordPerPage;
		
		/* local records */
		this.TotalLocalRecord = this.Rows.length;
		this.TotalLocalPage = this.TotalLocalRecord / this.RecordPerPage;
		
		if( this.MetaData.pagination ) {
			this.StartIndex = 0;
			if( ( this.StartIndex + this.RecordPerPage ) < this.TotalServerRecord ) {
				this.EndIndex = this.StartIndex + this.RecordPerPage;		
				
				this.PaginationPrevBtn.removeClass("disabled").addClass("disabled");
				this.PaginationNextBtn.removeClass("disabled");
			}else {
				this.EndIndex = this.TotalServerRecord;
				/* because total local record count is less then RecordPerPage */
				this.PaginationPrevBtn.removeClass("disabled").addClass("disabled");
				this.PaginationNextBtn.removeClass("disabled").addClass("disabled");
			}
		}else {
			this.StartIndex = 0;
			this.EndIndex = this.TotalLocalRecord;						
		}		
		
		this.SetContent();
	};
	
	this.NextPage = function() {
		this.CurrentPage++;
		
		/* server record & local record are same */
		if( this.TotalLocalRecord == this.TotalServerRecord ) {
			
			this.StartIndex = this.CurrentPage * this.RecordPerPage;
			
			if( ( this.StartIndex + this.RecordPerPage ) < this.TotalLocalRecord ) {
				this.EndIndex = this.StartIndex + this.RecordPerPage;
				this.PaginationPrevBtn.removeClass("disabled");
			}else {
				this.EndIndex = this.TotalLocalRecord;
				this.PaginationNextBtn.removeClass("disabled").addClass("disabled");
			}
			
			this.PaginationPrevBtn.removeClass("disabled");
			this.SetContent();
			
		}else {
			/* local record has enough rows */
			if( ( ( this.CurrentPage + 1 ) * this.RecordPerPage ) < ( this.TotalLocalRecord ) ) {
				
				this.StartIndex = this.CurrentPage * this.RecordPerPage;
				
				if( ( this.StartIndex + this.RecordPerPage ) < this.TotalServerRecord ) {
					this.EndIndex = this.StartIndex + this.RecordPerPage;
					this.PaginationPrevBtn.removeClass("disabled");
				}else {
					this.EndIndex = this.TotalLocalRecord;
					this.PaginationNextBtn.removeClass("disabled").addClass("disabled");
				}
				
				this.PaginationPrevBtn.removeClass("disabled");
				this.SetContent();
				
			} else {
				if( ( this.CurrentPage * this.RecordPerPage ) < ( this.TotalServerRecord ) ) {					
					
					/* local record drained but server has more record to offer. go and fetch them */
					if( this.ParentContextObj.swPanel.Context != "inventory" ) {
						this.ParentContextObj.swPanel.LastQueryObj.PAGE = ++(this.CurrentServerPage);							
						this.ParentContextObj.swPanel.Request = this.ParentContextObj.swPanel.LastQueryObj;
						
						if( this.Parent == "swPanel" ) {
							this.ParentContextObj.swPanel.Dock( "archive-pages", this.ParentContextObj.swPanel, this.ParentContainer.attr("id").substr(1) );
						}else {
							this.ParentContextObj.swPanel.Dock( "sub-archive-pages", this.ParentContextObj.swPanel, this.ParentContainer.attr("id").substr(1) );
						}
					}else {
						/* if it is inventory then we need special logic to handle variant rows */
						this.ParentContextObj.DoGetPages();
					}
					
				}
				
			}
		}	
	};
	
	this.PrevPage = function() {
		this.CurrentPage--;
		
		this.StartIndex = this.CurrentPage * this.RecordPerPage;
		this.EndIndex = this.StartIndex + this.RecordPerPage;
		
		if( this.CurrentPage == 0 ) {
			this.PaginationPrevBtn.removeClass("disabled").addClass("disabled");
		}
		this.PaginationNextBtn.removeClass("disabled");
		this.SetContent();
	};
	
	this.UpdatePages = function() {
		/* append additional pages from server */
		
		if( this.ParentContextObj.swPanel.Context == "products" ) {
			if( this.ParentContextObj.swPanel.Response.STATUS ) {
				this.Rows = this.Rows.concat( this.ParentContextObj.PrepareProductRows( "archive" ) );
			}			
		} else if( this.ParentContextObj.swPanel.Context == "inventory" ) {
			if( this.ParentContextObj.swPanel.Response.STATUS ) {
				this.Rows = this.Rows.concat( this.ParentContextObj.PrepareInventoryRows() );
			}			
		}else {
			if( this.ParentContextObj.swPanel.Response.STATUS ) {
				this.Rows = this.Rows.concat( this.ParentContextObj.swPanel.Response.DATA[ this.MetaData.object ] );
			}
		}
		
		/* update local records counts */
		this.TotalLocalRecord = this.Rows.length;
		this.TotalLocalPage = this.TotalLocalRecord / this.RecordPerPage;
		
		/* this.CurrentPage is already incremented so decrement it then call this.NextPage(), where it will get back to its origal position */
		this.CurrentPage--;
		this.NextPage();
	};
	
	this.SetColumn = function() {		
		this.NumberOfColumn = this.MetaData.columns.length;
		var swGridThead = jQuery('<thead></thead>');
		var swGridTrow = jQuery('<tr></tr>');
		var columns = this.MetaData.columns;
		

		if( this.MetaData.sno ) {
			swGridTrow.append('<th class="su-table-sno-column"><span>S.No</span></th>');
		}
		
		for(var i = 0; i < columns.length; i++) {			
			if( i != parseInt(columns.length - 1) ) {
				if( columns[i].type == "THUMB" ) {
					swGridTrow.append(jQuery('<th class="su-table-thumb-column"><span>'+columns[i].label+'</span></th>'));
				}else {
					swGridTrow.append(jQuery('<th><span">'+columns[i].label+'</span></th>'));
				}					
			}else {	
				if( this.MetaData.remove || this.MetaData.edit ) {
					swGridTrow.append(jQuery('<th style="width: 15%;"><span">'+columns[i].label+'</span></th>'));
					swGridTrow.append(jQuery('<th class="right-aligned"></th>'));
				}else {
					swGridTrow.append(jQuery('<th class="right-aligned"><span">'+columns[i].label+'</span></th>'));
				}
			}
		}
				
		swGridThead.append(swGridTrow);
		this.ParentTable.append(swGridThead);		
	};
	
	/**
	 * Render swGrid's data rows
	 * handles sno columns
	 * handles remove button for each row
	 * handles link columns
	 * handles date format
	 * handles nested object value (like customer.first_name) (only two level nesting)
	 * handle multi binding for single columns (like name = 'customer.first_name'+'customer.last_name')
	 */
	this.SetContent = function() {
		this.ParentTable.html("");
		
		if( this.MetaData.header ) {
			this.SetColumn();
		}
		
		var swGridTbody = jQuery('<tbody></tbody>'),
		columns = this.MetaData.columns,
		swGridTrow = null,
		row_value = null,
		keys = null,
		leftKeys = null,
		rightKeys = null,
		linkFlaQ = null,
		data_record_key = null,
		data_record = null,
		data_context = null;
		
		for(var i = this.StartIndex; i < this.EndIndex; i++) {
			swGridTrow = jQuery('<tr></tr>');			
			
			for(var j = 0; j < columns.length; j++) {
				/* reset link flaq */
				linkFlaQ = false;
				
				/* check for Sno TD */
				if( j == 0 && this.MetaData.sno ) {
					swGridTrow.append('<td class="su-table-sno-column"><span>' + (i + 1) + '</span></td>');
				}
				
				/* determine the current column is a link */
				for(var n = 0; n < this.MetaData.link.length; n++) {
					if( this.MetaData.link[n].key == columns[j].key ) {
						linkFlaQ = true;
						/* get the record key for data.record */
						data_record_key = this.MetaData.link[n].record_id;
						/* get the context for data.context */
						data_context = this.MetaData.link[n].context;
						break;
					}
				}
				
				if( data_record_key == null || data_record_key == undefined ) {
					data_record_key = "id";
				}
							
				/* check for two fields has to be concatenated ( first_name + last_name ) */
				if( columns[j].key.indexOf(",") != -1 ) {
							
					keys = columns[j].key.split(",");
					/* check for dot ( customer.first_name ) */
					if( keys[0].indexOf(".") != -1 && keys[1].indexOf(".") != -1 ) {
								
						leftKeys = keys[0].split(".");
						rightKeys = keys[1].split(".");
								
						row_value = this.Rows[ i ][leftKeys[0]] ? this.Rows[ i ][leftKeys[0]][leftKeys[1]] : "";								
						row_value += " ";
						row_value += this.Rows[ i ][rightKeys[0]] ? this.Rows[ i ][rightKeys[0]][rightKeys[1]] : "";
								
						data_record = this.Rows[ i ][rightKeys[0]][ data_record_key ];
								
					}else {
								
						row_value = this.Rows[ i ][ keys[0] ];
						row_value += " ";
						row_value += this.Rows[ i ][ keys[1] ];
							
						data_record = this.Rows[ i ][ data_record_key ];
								
					}							
				}else {
					/* if there is no comma then fallback check for dot alone */
					if( columns[j].key.indexOf(".") != -1) {								
						keys = columns[j].key.split(".");							
						row_value = this.Rows[ i ][ keys[0] ] ? this.Rows[ i ][ keys[0] ][ keys[1] ] : "";							
								
						data_record = this.Rows[ i ][ data_record_key ] ;								
					}else {							
						row_value = this.Rows[ i ][ columns[j].key ] ? this.Rows[ i ][ columns[j].key ] : "";
						data_record = this.Rows[ i ][ data_record_key ] ;						
					}							
				}
				
				/* check for date format */
				if( columns[j].type == "DATE" ) {
					row_value = new Date( row_value ).format("mmmm dd yyyy h:MMtt");
				} else if( columns[j].type == "EMAIL" ) {
					row_value = '<a href="mailto:'+ row_value +'" class="su-email-link">'+ row_value +'</a>';
				} else if( columns[j].type == "FULFILL" ) {
					/* special type used only shipping and payment status (i think only in orders context) */
					if( this.Rows[ i ][ columns[j].key ] == null ) {
						row_value = "Pending";
					}
				} else if( columns[j].type == "SMALL" || columns[j].type == "THUMB" || columns[j].type == "ICON" ) {
					/* if it is thumbnail then wrap it up with img tag */					
					if( row_value != undefined && row_value != null && row_value != "" ) {						
						var original_url = row_value,					
						lIndex = original_url.lastIndexOf("/");
						base_url = original_url.substr(0, lIndex + 1),			
						fname = original_url.substr( lIndex + 1 ),
						img_type = "_" + columns[j].type.toLowerCase(),
						final_name = "";
						
						/* check for any dot in filename itself */
						if( fname.split(".").length > 2 ) {
							final_name = fname.split(".")[0] +"."+ fname.split(".")[1] + img_type +"."+ fname.split(".")[2];
						}else {
							final_name = fname.split(".")[0] + img_type +"."+ fname.split(".")[1];
						}						
									
						resulted_url = base_url + final_name;
						
						row_value = '<img src="'+ resulted_url +'"/>';
					}else {
						row_value = '<i class="fi-prohibited"></i>';
					}
				}			
							
				/* if it is a link then wrap it up with anchor tag */
				if(linkFlaQ && row_value != "") {
					row_value = '<a href="#" class="single-link" data.record="'+ data_record +'" data.context="'+ data_context +'">'+ row_value +'</a>';
				}				
				
				/* last checkup for any null value */
				row_value = row_value == null ? "" : row_value; 
						
				if( j == parseInt(columns.length - 1) ) {				
					
					if( this.MetaData.remove && this.MetaData.edit ) {
						
						swGridTrow.append('<td><span>' + row_value + '</span></td>');
						
						var editBtn = $('<a href="#" data.record="'+ data_record +'" class="button tiny secondary row-edit-btn"><i class="fi-pencil"></i></a>')
						var deleteBtn = $('<a href="#" data.record="'+ data_record +'" class="button tiny secondary row-remove-btn"><i class="fi-trash"></i></a>');
						var td = $('<td class="right-aligned"></td>');
						
						td.append( editBtn );
						td.append( deleteBtn );
						
						swGridTrow.append( td );
						
					} else if( this.MetaData.remove ) {
						
						swGridTrow.append('<td><span>' + row_value + '</span></td>');
						swGridTrow.append('<td class="right-aligned"><a href="#" data.record="'+ data_record +'" class="button tiny secondary row-remove-btn"><i class="fi-trash"></i></a></td>');
						
					} else if( this.MetaData.edit ) {
						
						swGridTrow.append('<td><span>' + row_value + '</span></td>');
						swGridTrow.append('<td class="right-aligned"><a href="#" data.record="'+ data_record +'" class="button tiny secondary row-edit-btn"><i class="fi-pencil"></i></a></td>');
						
					}else {
						swGridTrow.append('<td class="right-aligned"><span>' + row_value + '</span></td>');
					}
					
				}else {
					if( columns[j].type == "SMALL" || columns[j].type == "THUMB" || columns[j].type == "ICON" ) {
						swGridTrow.append('<td class="su-table-'+columns[j].type.toLowerCase()+'-column"><span>' + row_value + '</span></td>');
					}else {
						swGridTrow.append('<td><span>' + row_value + '</span></td>');
					}
				}							
			}
			swGridTbody.append(swGridTrow);			
		}	
		this.ParentTable.append(swGridTbody);		
	};
};