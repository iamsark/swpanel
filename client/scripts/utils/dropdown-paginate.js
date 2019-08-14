/**
 * 
 * Things get little complex here ( as there is a API limit. server returned maximum 250 record per request )
 * 
 */

var swDropDown = function( pObj, meta ) {
	/* Parent object ( usually one of the context specific object ) */
	this.ParentContextObj = pObj;
	/* Meta object for the drop down */
	this.MetaData = meta;
	/* Object which holds the data rows */
	this.Source = null;	
	/* Object which holds array prepared by this.PrepareObject() */
	this.FilteredRows = null;
	/* Index of currently rendered page */
	this.CurrentPage = 0;		
	/* Number of record to be rendered in single page */
	this.RecordPerPage = 10;
	/* Total number of pages ( master total, without api result limitation ) */
	this.TotalServerPage = 0;
	/* Total number of record ( master total, without api result limitation ) */
	this.TotalServerRecord = 0;
	/* Total number locally available page ( this.RecordPerPage / this.TotalLocalRecord ) */
	this.TotalLocalPage = 0;
	/* Total number of record ( master total, without api result limitation ) */
	this.TotalLocalRecord = 0;
	/* actual drop down element */
	this.DropDown = null;
	/* visible state flag */
	this.Visible = false;
	/* Page's starting row index */
	this.StartIndex = 0;
	/* Page's ending index */
	this.EndIndex = 0;
	
	/* will get additional pages from server and will append in 'this.Source' */
	this.UpdateSource = function() {
		
	};
	
	/* Invalidate the source data, ( this.Source = null ) */
	this.InvalidateDropDown = function() {
		this.Source = null;
		this.MetaData = null;
		
		this.CurrentPage = 0;
		this.StartIndex = 0;
		this.EndIndex = 0;
		
		this.TotalLocalPage = 0;
		this.TotalLocalRecord = 0;
		
		this.TotalServerPage = 0;
		this.TotalServerRecord = 0;
	};
	
	this.GetMetaObject = function( drop, archive ) {
		return {
			dropdown : "",
			archive : "",
			object_label : "",
			target : ""
		};
	}
	
	/* Prepare and show skeleton of drop down */
	this.ShowDropDown = function() {
		if( this.Source == null ) {
			this.DropDown = this.MetaData.dropdown;
			this.DropDown.html("");
			this.DropDown.append($('<div class="su-dropdown-preloader"><span></span></div>'));
			
			var position = this.MetaData.target.position();
			var top = $(this).next().css("top");
			this.DropDown.css("left", position.left+"px");
			this.DropDown.css("top", (top - 10)+"px");
			this.DropDown.show();	
		
			this.ParentContextObj.swPanel.Request = this.ParentContextObj.swPanel.GetRequestObject( "GET", this.MetaData.archive, "LIST", "", "", 0, {} );
			this.ParentContextObj.swPanel.Dock( "smart-drop", this.ParentContextObj.swPanel, null );
		}else {
			this.DropDown.show();
			this.RenderDropDown();
		}
	};
	
	this.HideDropDown = function() {
		this.DropDown.hide();	
		this.Visible = false;
	};
	
	this.RenderDropDown = function() {
		this.Visible = true;		
		this.DropDown.html("");
		
		if( this.Source == null ) {
			this.PrepareObject();	
		}	
		
		this.CurrentPage = 0;				
		this.TotalLocalRecord = this.Source.length;
		this.TotalLocalPage = this.Source.length / this.RecordPerPage;
		
		this.StartIndex = 0;
		if( ( this.StartIndex + this.RecordPerPage ) < this.TotalLocalRecord ) {
			this.EndIndex = this.StartIndex + this.RecordPerPage;		
		}else {
			this.EndIndex = this.TotalLocalRecord;
		}
		
		var dropUL = $('<ul></ul>'),
		rowPerPage = 0;
		
		if( this.FilteredRows.length < this.RecordPerPage ) {
			rowPerPage = this.FilteredRows.length;
		}else {
			rowPerPage = this.RecordPerPage;
		}
		
		for( var i = 0; i < rowPerPage; i++ ) {
			dropUL.append( $('<li><a href="#" data.record="'+ this.FilteredRows[i].id +'" data.action="" class="drop-down-row '+ this.FilteredRows[i].selected +'"><i class="fi-check"></i>'+ this.FilteredRows[i].title +'</a></li>') );
		}
		
		this.DropDown.append( dropUL );
		this.DropDown.append(this.GetPaginationSkeleton());	
		
		this.RegisterEvents();
	};
	
	this.PrepareObject = function() {
		var rows = null,
		subArchive= this.ParentContextObj.SubArchive ? this.ParentContextObj.SubArchive : [],
		flaQ = false;		
		
		if( this.Source == null ) {
			this.Source = this.ParentContextObj.swPanel.Response.DATA[ this.MetaData.object_label ];
			rows = this.Source;
		}else {
			rows = this.Source;
		}		
		
		this.FilteredRows = new Array();
		
		for( var i = 0; i < rows.length; i++ ) {
			flaQ = false;
			
			for( var j = 0; j < subArchive.length; j++ ) {
				if( rows[i].id == subArchive[j].id ) {
					flaQ = true;
					break;
				}
			}
			
			if( flaQ ) {
				this.FilteredRows.push( { id : rows[i].id, title : rows[i].title, selected : "selected" } );
			}else {
				this.FilteredRows.push( { id : rows[i].id, title : rows[i].title, selected : "" } );
			}
		}	
	};
	
	/* used to render pages while paginating */
	this.RefreshDropDown = function() {
		var dropUL = this.DropDown.children().eq(0);
		dropUL.html("");		
		
		for( var i = this.StartIndex; i < this.EndIndex; i++ ) {
			dropUL.append( $('<li><a href="#" data.record="'+ this.FilteredRows[i].id +'" data.action="" class="drop-down-row '+ this.FilteredRows[i].selected +'"><i class="fi-check"></i><span class="row-content">'+ this.FilteredRows[i].title +'</span></a></li>') );
		}			
	};
	
	/* used to refresh the current page ( while selecting or deselecting rows ) */
	this.RefreshDropView = function() {
		this.PrepareObject();	
		
		var dropUL = this.DropDown.children().eq(0);
		dropUL.html("");		
		
		for( var i = this.StartIndex; i < this.EndIndex; i++ ) {
			dropUL.append( $('<li><a href="#" data.record="'+ this.FilteredRows[i].id +'" data.action="" class="drop-down-row '+ this.FilteredRows[i].selected +'"><i class="fi-check"></i><span class="row-content">'+ this.FilteredRows[i].title +'</span></a></li>') );
		}
	};
	
	/* Register events for pagination and row's click */
	this.RegisterEvents = function() {
		
		/* unbind previously attached event for pagination buttons */
		$(".su-smart-popup").off("click", "a.su-drop-prev");
		$(".su-smart-popup").off("click", "a.su-drop-next");
		
		$(".su-smart-popup").off("click", "a.drop-down-row");
		$(".su-smart-popup").off("mouseenter", "a.drop-down-row");
		$(".su-smart-popup").off("mouseleave", "a.drop-down-row");
		
		/* register click event for pagination buttons */
		$(".su-smart-popup").on("click", "a.su-drop-prev", this, function(e){
			if( !$(this).hasClass("disabled") ) {
				e.data.PrevPage();				
			}
			e.preventDefault();
		});
		
		$(".su-smart-popup").on("click", "a.su-drop-next", this, function(e){
			if( !$(this).hasClass("disabled") ) {
				e.data.NextPage();				
			}
			e.preventDefault();
		});
		
		/* register click event for rows */
		$(".su-smart-popup").on("click", "a.drop-down-row", this, function(e){
			if( $(this).hasClass("selected") ) {
				e.data.ParentContextObj.DropRowDeSelected( $(this).attr("data.record") );
			} else {
				e.data.ParentContextObj.DropRowSelected( $(this).attr("data.record") );
			}
			e.preventDefault();
		});	
		
		/* register mouseenter event for showing remove product icon. ( if it is already selected ) */
		$(".su-smart-popup").on("mouseenter", "a.drop-down-row", this, function(e){
			if( $(this).hasClass("selected") ) {
				$(this).find("i").removeClass().addClass("fi-x");
			}			
			e.preventDefault();
		});
		
		/* register mouseleave event for changing back to previous state. ( if it is already changed while mouseenter event ) */
		$(".su-smart-popup").on("mouseleave", "a.drop-down-row", this, function(e){
			if( $(this).hasClass("selected") ) {
				$(this).find("i").removeClass().addClass("fi-check");
			}			
			e.preventDefault();
		});
	};
	
	this.NextPage = function() {
		this.CurrentPage++;
		
		this.StartIndex = this.CurrentPage * this.RecordPerPage;
		if( ( this.StartIndex + this.RecordPerPage ) < this.TotalLocalRecord ) {
			this.EndIndex = this.StartIndex + this.RecordPerPage;
			$(".su-drop-next").removeClass().addClass("pagination-btn su-drop-next");
		}else {
			this.EndIndex = this.TotalLocalRecord;
			$(".su-drop-next").removeClass().addClass("pagination-btn su-drop-next disabled");
		}
		$(".su-drop-prev").removeClass().addClass("pagination-btn su-drop-prev");
		this.RefreshDropDown();
	};
	
	this.PrevPage = function() {
		this.CurrentPage--;
		this.StartIndex = this.CurrentPage * this.RecordPerPage;
		this.EndIndex = this.StartIndex + this.RecordPerPage;
		
		if( this.CurrentPage == 0 ) {
			$(".su-drop-prev").removeClass().addClass("pagination-btn su-drop-prev disabled");
		}
		$(".su-drop-next").removeClass().addClass("pagination-btn su-drop-next");
		this.RefreshDropDown();
	};
	
	this.GetPaginationSkeleton = function() {
		var pWrapper = $( '<div class="pagination-wrapper"></div>' ),
		pUL = $( '<ul class="pagination-ul"></ul>' );
		
		if( this.RecordPerPage >= this.TotalLocalRecord ) {
			pUL.append( $('<li><a class="pagination-btn su-drop-prev disabled" href="#"><span class="page-prev">Previous</span></a></li>') );
			pUL.append( $('<li><a class="pagination-btn su-drop-next disabled" href="#"><span class="page-next">Next</span></a></li>') );
		}else {
			pUL.append( $('<li><a class="pagination-btn su-drop-prev disabled" href="#"><span class="page-prev">Previous</span></a></li>') );
			pUL.append( $('<li><a class="pagination-btn su-drop-next" href="#"><span class="page-next">Next</span></a></li>') );
		}
		
		pWrapper.append( pUL );
		return pWrapper;
	};	
};