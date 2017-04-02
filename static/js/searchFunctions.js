function searchOnLoad(){};

//str1 = 'getSearch?search_for=artist search_what = beach'
function submitSearchEventFunction(){
    console.log("asfasdf");
  //  $.mobile.showPageLoadingMsg();
    var cadena = $('#search_text').val();
    cadena = cadena.replace('ñ', 'n')
    cadena = cadena.replace('á', 'a')
    cadena = cadena.replace('ó', 'o')
    cadena = cadena.replace('é', 'e')
    cadena = cadena.replace('ú', 'u')
    cadena = cadena.replace('í', 'i')
    str1 = "/api/search?search_for=" + cadena; // +"&search_what=artist";



    $.getJSON(str1, function(data) {
        resultados=data;
        //console.log(data)
        $('#result').empty()
        searchResults = JSON.parse(data);
        console.log(searchResults)
        resultado = searchResults.searchResult[0]; //console.log(resultado)
       // resultado2 = searchResults.searchResult[1]; //console.log(resultado)
        if ('tracks' in resultado == false && 'album' in resultado == false && 'artists' in resultado == false && 'tracks' in resultado2 == false) {
            $('#result').append("no results found for this song / or artist. Please try again with a different name")
        } else {
            // Artistas
            artists = searchResults.searchResult[0].artists
            //artists2 = searchResults.searchResult[1].artists
            if (artists == undefined) artists = artists2
            var resultArtistTemplate = $.templates("#resultArtistTemplate"); 
            if (artists != undefined) {
                $('#result').append("<h2> ARTISTAS </h2>")
                $.each(artists, function(inde, artist) {
                     $('#result').append(resultArtistTemplate.render(artist));
                    if (inde > 10) {
                        return false; //Es como un break
                    }
                });
                // Canciones
            }
            //aaa=[]
            tracks = searchResults.searchResult[0].tracks
            if (typeof tracks == 'undefined') {
                tracks = searchResults.searchResult[1].tracks

            }
            if (typeof tracks == 'undefined') {
                tracks = []
            }

            var resultSongTemplate = $.templates("#resultSongTemplate"); 

            $('#result').append("<h2> CANCIONES </h2>")
            $.each(tracks, function(inde, song) {
              /**  var str = '<li data-icon="myapp-plus">' +
                    '<a href="#" class="song" name="' +
                    inde + '">' +
                    '<h3>' + song.name + '</h3>' + '<p>' + song.artists[0].name + '</p>' + '<p>' + song.album.name + '</p>' + '</a> </li>';
                //aaa.push(song.uri)
                $('#result').append(str) **/
                song.localid=inde;
                $('#result').append(resultSongTemplate.render(song));
            });
            /*tracks.push(searchResults.searchResult[1].tracks)
            if(typeof tracks == 'undefined') tracks=[]
                $.each(tracks,function(inde,song){
                    var str = '<li data-icon="myapp-plus">' +
                            '<a href="#" class="song" name="' +
                            inde + '">' +
                            '<h3>' +song.name+ '</h3>' + '<p>'+ song.artists[0].name+ '</p>' +'<p>'+ song.album.name+'</p>' + '</a> </li>';
                            //aaa.push(song.uri)
                    $('#result').append(str)
                });*/
            //console.log(aaa)

        }
       // $.mobile.hidePageLoadingMsg();
        //$('#result').listview('refresh');
        //$('#result').trigger('updatelayout');
    })
}

function addSongEventFunction(){
       console.log("click add .song")  
                //lastX=event.target.offsetLeft
                //lastY=event.target.offsetTop
                lastX=event.clientX
                lastY =event.clientY
                lastTarget=$(this)
        //Si localment no tengo creditos, no tiene sentido seguir
        if (myStatus.songsLeft<1) {
            v_showError("Has sobrepasado tu tu numero de creditos Espera "  + myStatus.nextSong + " minutos" ,lastX,lastY)
        }else{
            playSong( $(this).attr('name') );
            //playSong( $(this).attr('name') );
            $(this).parent().parent().parent().addClass('custom-list-clicked')
            $(this).parent().parent().children("span").removeClass("ui-icon-myapp-plus")
            $(this).parent().parent().children("span").addClass("ui-icon-myapp-tick")       
        }
}