//<![CDATA[ 
    
        
        // If you want to prevent dragging, uncomment this section
	
	
	/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
	see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
	for more details -jm */
	/*
	function handleOpenURL(url)
	{
		// TODO: do something with the url passed in.
	}
	*/
	searchResults=null;
	myStatus={
		votesLeft:5,
		nextSong:0,
		songsLeft:4,
		user: "",
		songsVoted : []
	}

    function vote(song_id,vote){
        $.getJSON('api/vote?song_id='+song_id+"&votes="+vote , function(data) {
	    data=JSON.parse(data);
                //console.log(data)
		if (data.error == undefined) {
		    myStatus.songsVoted.push(data.ok)
                   updatePlaylist();
                }
                else{
                    v_showError("Error votando",lastX,lastY)                                       
                }            
        });
    }

	function onBodyLoad(){
	
	    
    
	    
	votes_left=5;
    if($.cookie('usuario')!=undefined){
        //$('.hej').empty().append("Hej "+  $.cookie('usuario')  )

    }
$(document).delegate('.bandpage', 'pageshow', function () {
    //Your code for each page load here
    //console.log("tiriri cargando bandpage")
    updateStatus()
    find_for_local_artist( $(this).attr("id") );
    
});

	
	
    
	function find_for_local_artist(artist_name) {		
	    str1 = "/api/search?search_for="+ artist_name; // +"&search_what=artist";
	    $.getJSON(str1, function(data) {
		    	//console.log(JSON.parse(data))
		    	$('#result2').empty()
		    	searchResults=JSON.parse(data);
                resultado=searchResults.searchResult[0]
                if('tracks' in resultado == false && 'album' in resultado == false && 'artists' in resultado == false ){
                    $('#result2').append("no results found for this song / or artist. Please try again with a different name")
                }
                else{
		    // canciones
		    tracks=searchResults.searchResult[0].tracks
		    $('#result2').append("<h2> CANCIONES </h2>")
                    $.each(tracks,function(inde,song){
                        var str = '<li data-icon="myapp-plus">' +
                                '<a href="#" class="song" name="' +
                                inde + '">' +
                                '<h3>' +song.name+ '</h3>' + '<p>'+ song.artists[0].name+ '</p>' +'<p>'+ song.album.name+'</p>' + '</a> </li>';
                        $('#result2').append(str)
                    });
                }		 
		$('#result2').listview('refresh');
		$('#result2').trigger('updatelayout');
		
	    });
	}    
    
    
	    $('#templates-container-search').on('click','.artist', function() { //TODO
			//$.mobile.showPageLoadingMsg();
			str1 = "/api/findExact?uri="+ $(this).attr('name');
			$.getJSON(str1, function(data) {
			    //console.log(JSON.parse(data))
			    $('#result').empty()
			    searchResults=JSON.parse(data);
			    tracks=searchResults.searchResult
			    
			    $('#result').append("<h2>"+ tracks[0].artists[0].name +"</h2>")
			    $.each(tracks,function(inde,song){
				var str = '<li data-icon="myapp-plus">' +
					    '<a href="#" class="song" name="' +
					    inde + '">' +
					    '<h3>' +song.name+ '</h3>' +'<p>'+ song.album.name+'</p>' + '</a> </li>';
				$('#result').append(str)
	                    });
			$("#search-wrapper").hide()
			$("#back-wrapper").show()
			//$.mobile.hidePageLoadingMsg();
			$('#result').listview('refresh');
			$('#result').trigger('updatelayout');
			})
	    })				

			
    
	
	
	
	
	$('.removeSong').on('click','.removeSong', function(){
			remove($(this).attr('name'))
	});
	
	
	$('#get_playlist').click( function() {
			updatePlaylist()
	});

	
	$('#showpop').on('click','#showpop', function() { editPopupMenu( $(this).attr('name') ) } );
	
	$('#enviar').click(function(){
	    dataDict={ 'amsg': $('#comentario').val(), 'origin':$('#remitente').val() }
	    $.ajax({
	    type: 'POST',
	      url: "/api/sendM",
	      data: dataDict,
              dataType: 'json',
	      success: function(data){
                $('#feedback').fadeOut().empty().append("<h3 style='color:#FF6B6B'> Mensaje enviado. Gracias <h3>").fadeIn()
	      }
	    })
	    
	})

//Send user name and react when receiving.	
	$('.username-popup-button').click(function(){
	    var newname=$(this).siblings().find('.user_text').val()
	  $.getJSON('/api/setUserName?userName='+ newname , function(data) {
		  $('#user_text').addClass('okForm')
		  $('#username-popup-button').addClass('greenText')
		  data=JSON.parse(data);
		  $('.hej').empty().append("Hola "+  data.user  )
		  myStatus.user=data.user
		  //updateVotes()		  
	  })
	  //$.cookie('usuario', $('#user_text').val(), { expires: 30 } );
	  //$('#user_text').addClass('okForm')
	  //$('#submit_user').addClass('greenText')
	  
	});
	
	mTimer = setInterval(periodicTask, 15000);
        
	popupTimer=setInterval(function(){return false},0 );
	
	updatePl_var=false
	//$.mobile.fixedToolbars.setTouchToggleEnabled(true);		
	
        }//bodyload
	
	
	function remove(m_id){
	  str1='remove?myid=' + m_id
	  $.getJSON(str1, function(data) {
		  updatePlaylist()
	  })
		
	}
	
	function displaysearch(result){
	  //console.log("result" + result)
	}
	
	function playSong(songId) {
	  //console.log( tracks[songId].uri)
	  //str1 = "/api/addSong"
	  //str2= "mid=" + esc(searchResults[songId].file) + "&title=" + esc(searchResults[songId].title)+"&artist="+esc(searchResults[songId].artist)+"&album="+esc(searchResults[songId].album)+"&user="+myStatus.user;
      //	$.getJSON(str1,str2, function(data){console.log(data)})    	 var tracks=searchResults.searchResult[1].tracks
      songId=parseInt(songId);
      console.log(songId);
	  if(myStatus.user != undefined){
	  	console.log(tracks[songId]);
	      dataDict={ 'jsonTrack': tracks[songId].uri, 'name':myStatus.user }
	      //console.log("definido send")
	      }
	  else
	      dataDict={'jsonTrack': tracks[songId].uri}
	  $.ajax({
	    type: 'POST',
	      url: "/api/addSong",
	      data: dataDict,
              dataType: 'json',
	      success: function(data){
                data=JSON.parse(data);                
		if (data.error == undefined) {
                    v_UpdateCredit(data.credit)
                }
                else{
		    //console.log("no credito")
		    if (data.error=="TooManySongs") {
			v_showError("Tienes que esperar antes de pode aniadir mas canciones",lastX,lastY)
		    }
                    else if (data.error=="AlreadyThere") {
			v_showError("La canción ya está en la lista",lastX,lastY)
		    }
		    else if (data.error=="blacklist") {
			v_showError("Está canción ha sido votada en negativo muchas veces. No se puede añadir más",lastX,lastY)
		    }
		    else if (data.error=="NoSong" || data.error =="NotFound") {
			v_showError("No hay canción con este nombre",lastX,lastY)
		    }   
                }
		
	      }
	  });
	}
	
	function v_UpdateCredit(ncredit) {
	  $('.creditos').empty().append(ncredit)
	  
	}
        
        function v_showError(msg,mx,my) {
            
            clearInterval(popupTimer)
            $("#error-content").empty().append(msg)
            if ($('.popupError').data('created')==undefined) {
                $('.popupError').popup({ positionTo: "origin" })
                $('.popupError').data('created',"yes")
            }            
            $('.popupError').popup('open',{'x':mx,'y':my})            
            popupTimer=setInterval(function(){$('.popupError').popup('close')}, 3000);
        }
	
	
	function testMove(songId){
    	$.ajax({
          type: 'GET',
            url: "/api/tracklist/move",
            data: {'cp_id': songId, 'new_position':'0'},
            success: function(data){},        
            dataType: 'json'
        });	   
	}
	

	
	updateHomepage=function(){
	    
	    $.mobile.showPageLoadingMsg();
	    $.getJSON("/api/trackList", function(data) {
		
		playlist=JSON.parse(data);
		$('#playlist_list').empty()
		playlistTracks=playlist.tracks
		updateHomepage_step2()
		$.mobile.hidePageLoadingMsg();
	    })
	    
	}
	updateHomepage_step2=function(){
	    $('#cancion1').empty()
	    $('#cancion2').empty()
            if(playlistTracks.length>0 && playlistTracks[0] != null){
                $.each(playlistTracks,function(position,song){
		    if (position>1 ) {
			return false;
		    }
                    var newItem= ''
                    if(position==0){
			newItem='<img src="/static/tmp/'+song.cover_url+'" />  '+	      
				'<div class="songItem"> <span class="titulo">'+
				    song.track[0].name +'</span> <span class="artista">'+
				     song.track[0].artists[0].name + '</span>  <span class="by"> Añadida por' +
				     song.user+'</span> 	</div>     '
    			$('#cancion1').append(newItem)	     
		    }else{			
			//TODO aquí mirar si el elemento ya ha sido votado.
			newItem='<div id="cancion2-inner"> <div id="dos">  2	</div>	<div class="songItem">'+
				    '<span class="titulo">' +song.track[0].name + '</span>'+
		    		  '<span class="artista">' +song.track[0].artists[0].name  + '</span>	</div>      </div>  </div>'
			$('#cancion2').append(newItem)
		    }
		    return true
                });
            }
	    else{
		$('#cancion1').append('<p style="color:#eee; text-shadow:none; padding:2em;"> No hay ninguna canción en reproducción actualmente</p>')
	    }
	    
	    
	}
	
	
	
	function editPopupMenu(id){
		
		$('#popup_content').empty().append("<p> <strong>" + playlistTracks[id].track[0].name+ "</strong><br/> " + playlistTracks[id].track[0].artists[0].name + "</p>")
		$('#plusOne').attr('name',playlistTracks[id].bbid)
		$('#minusOne').attr('name',playlistTracks[id].bbid)
		$('#nvotes').empty()
		//$.getJSON("countVotes?mid="+playlistTracks[id].spotify_id, function(data) {
		//	$('#nvotes').append("This song has " + data + " votes")
		//})
	}
	lastGetStatus=0
	updateStatus=function (id){
		var cdate=new Date()
		if (cdate.getTime()-lastGetStatus>10000) { //Para no llamar a esta funcion todo el timpo compruebo que hayan pasado mas de 10000 msecs		    
		    $.getJSON("/api/getStatus", function(data) {		
			    //console.log(data)
			    data=JSON.parse(data);
			    myStatus.user = data.user
			    myStatus.songsLeft = data.songsLeft
			    myStatus.nextSong = data.timeNextSong
			    myStatus.songsVoted = data.songsVoted
			    $('.hej').empty().append("Hola "+ myStatus.user + " Creditos: " + myStatus.songsLeft + " t: " + myStatus.nextSong)
		    })
		    lastGetStatus=cdate
		}
		
		
	}
     
     periodicTask=function(){
    	if(updatePl_var==true){
    		//console.log('updatingpl')
    		updatePlaylist()
    	}else{
		updateStatus()
		//console.log('periodistask')
	}
    }
    
// ##### Eventos de la interface #####    
    
/**** cambio de página ***/    
    $( '#playlist' ).on( 'pageshow','#playlist',function(event){ //live
  		updatePlaylist();
  		updatePl_var=true;  	
  		
	});

    $( '#playlist' ).on( 'pagehide','#playlist',function(event){//live
	//console.log("hide")
    	updatePl_var=false;
		//clearInterval(mTimer)
		
    });
    
    $( '#home' ).on( 'pageshow','#home',function(event){//live	
		updateHomepage()
    });
    
    
    
   
    
    $("#backbutton").on('click',"#backbutton", function(){ //live
	var artists=resultado.artists
	$('#result').empty()
	$('#result').append("<h2> ARTISTAS </h2>")
	$.each(artists,function(inde,artist){
	    var str = '<li data-icon="myapp-triangle">' +
		    '<a href="#" class="artist" name="'+artist.uri+'">' +
		    '<h3>' +artist.name+ '</h3>' +  '</a> </li>';
	    $('#result').append(str)
	    if (inde>10) {
		return false; //Es como un break
	    }
	});
	// Canciones
	tracks=resultado.tracks
	$('#result').append("<h2> CANCIONES </h2>")
	$.each(tracks,function(inde,song){
	    var str = '<li data-icon="myapp-plus">' +
		    '<a href="#" class="song" name="' +
		    inde + '">' +
		    '<h3>' +song.name+ '</h3>' + '<p>'+ song.artists[0].name+ '</p>' +'<p>'+ song.album.name+'</p>' + '</a> </li>';
	    $('#result').append(str)
	});
	$.mobile.hidePageLoadingMsg();
	$("#search-wrapper").show()
	$("#back-wrapper").hide()
	$('#result').listview('refresh');
	$('#result').trigger('updatelayout');
	
    });
    $('.search-popup-button').on('click','.search-popup-button',function(){ //live
	$.mobile.changePage($("#search"), "none");
	$('#search_text').val($('.search_popup_text').val())
	$('#submit_search').trigger('click')
	
    });
     /** Si descomento esto peta spotify
      * $('#username-popup-button').live('click',function(){
	$.mobile.changePage($("#search"), "none");
	$('#search_text').val($('#search_popup_text').val())
	$('#submit_search').trigger('click')
	
    });**/