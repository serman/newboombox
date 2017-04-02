window.onload = function() {
  //parseAll();
  //
  //

  //globalStatus.IEversion=detectIE();
   //var val1=Cookies.get('count'); 

 prefix=""
 countTemplates=0;


    $( "#templates-container-home").load( prefix+"/static/jsrenderertemplates/homeTemplates.html", checktemplatesLoaded );  
    $( "#templates-container-search").load( prefix+"static/jsrenderertemplates/searchTemplates.html", checktemplatesLoaded );   
    $( "#templates-container-playlist").load( prefix+"/static/jsrenderertemplates/playlistTemplates.html", checktemplatesLoaded );  
    $( "#templates-container-home").show();
    $( "#templates-container-search").hide();
    $( "#templates-container-playlist").hide();
  var window_width=$( window ).width();
  if(window_width<=768) globalStatus.screenSize="small"
    function checktemplatesLoaded(){
    countTemplates++;
    if(countTemplates>3){      
    }
  }

  $('a').on("click", function(e){
      e.preventDefault();
  })

  $('#footer').on("click",".tab-btn", function(e){
      console.log("click" +$(this).data("name") )
      e.preventDefault();
      tabRouter($(this).data('name'));
  })

  //******************** search ****/
  $('#templates-container-search').on('click', '#submit_search', submitSearchEventFunction);
  $("#templates-container-search").on('click','a.song', addSongEventFunction);
  playlistIntEventHandlers();
}

function tabRouter(tabname){
  console.log(tabname)
  $('.tab-content').hide();
  $('#'+tabname).show();
  var functionInitName= idClassTable[tabname]
  if(functionInitName!==undefined) {
    console.log(functionInitName)
    //window[functionInitName+'']();
    //
    idClassTable[tabname]();
  }
    //executeFunctionByName(functionInitName, window, arguments);
  //console.log( functionInitName);
}

idClassTable={
  'templates-container-search':searchOnLoad,
  'templates-container-playlist':playlistOnLoad,

}


function executeFunctionByName(functionName, context /*, args */) {
  var args = [].slice.call(arguments).splice(2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}