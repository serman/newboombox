 //When clicking a vote.	
 //
 //
 window.onload = function() {
		//playlistIntEventHandlers();
 };

 playlistIntEventHandlers=function(){
    $('#templates-container-playlist').on('click','.votamas', function() { //live
    	console.log("VOAMAS")
   
    song_id= $(this).attr('name') //song_id es el bbid de la canción
    vote( song_id,1 );
    });
    
    $('#templates-container-playlist').on('click','.votamenos', function() { //live          
        song_id= $(this).attr('name')
		vote( song_id,-1 );     
    } );
}



playlistOnLoad = function() {
	updatePlaylist();
}


updatePlaylist = function() {
	console.log("updatePlaylist")
	updateStatus();
	str1 = "/api/trackList";
	// $.mobile.showPageLoadingMsg();
	$.getJSON(str1, function(data) {
		playlist = JSON.parse(data);
		$('#playlist_list').empty()
		playlistTracks = playlist.tracks
		var playlistItemTemplateFirst = $.templates("#playlistItemTemplateFirst"); 
		var playlistItemTemplateVoted = $.templates("#playlistItemTemplateVoted");
		var playlistItemTemplateNotVoted = $.templates("#playlistItemTemplateNotVoted"); 
		if (playlistTracks.length > 0 && playlistTracks[0] != null) {
			$.each(playlistTracks, function(position, song) {
				if (position == 0) {
					 $('#playlist_list').append(playlistItemTemplateFirst.render(song));
				} else {
					//TODO aquí mirar si el elemento ya ha sido votado.
					if (jQuery.inArray(song.bbid, myStatus.songsVoted) != -1) {
						$('#playlist_list').append(playlistItemTemplateVoted.render(song));
					} else {
						$('#playlist_list').append(playlistItemTemplateNotVoted.render(song));
					}
				}
			});
			//$('#playlist_list').listview('refresh');
			//$('#playlist_list').trigger('updatelayout');
		} else {
			$('#playlist_list').append('<p style="color:#222; text-shadow:none; padding:2em;"> No hay ninguna canción en reproducción actualmente</p>')
		}
		// $.mobile.hidePageLoadingMsg();

	})
}