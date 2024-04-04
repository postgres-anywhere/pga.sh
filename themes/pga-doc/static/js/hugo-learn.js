// Get Parameters from some url
var getUrlParameter = function getUrlParameter(sPageURL) {
    var url = sPageURL.split('?');
    var obj = {};
    if (url.length == 2) {
      var sURLVariables = url[1].split('&'),
          sParameterName,
          i;
      for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');
          obj[sParameterName[0]] = sParameterName[1];
      }
      return obj;
    } else {
      return undefined;
    }
};

// Execute actions on images generated from Markdown pages
var images = $("div#body-inner img").not(".inline");
// Wrap image inside a featherlight (to get a full size view in a popup)
images.wrap(function(){
  var image =$(this);
  if (!image.parent("a").length) {
    return "<a href='" + image[0].src + "' data-featherlight='image'></a>";
  }
});

// Change styles, depending on parameters set to the image
images.each(function(index){
  var image = $(this)
  var o = getUrlParameter(image[0].src);
  if (typeof o !== "undefined") {
    var h = o["height"];
    var w = o["width"];
    var c = o["classes"];
    image.css("width", function() {
      if (typeof w !== "undefined") {
        return w;
      } else {
        return "auto";
      }
    });
    image.css("height", function() {
      if (typeof h !== "undefined") {
        return h;
      } else {
        return "auto";
      }
    });
    if (typeof c !== "undefined") {
      var classes = c.split(',');
      for (i = 0; i < classes.length; i++) {
        image.addClass(classes[i]);
      }
    }
  }
});

jQuery(document).ready(function() {

  // Stick the top to the top of the screen when  scrolling
  $("#top-bar").sticky({topSpacing:0, zIndex: 1000});

  // Add link button for every
  var text, clip = new ClipboardJS('.anchor');
  $("h1~h2,h1~h3,h1~h4,h1~h5,h1~h6").append(function(index, html){
    var element = $(this);
    var url = encodeURI(document.location.origin + document.location.pathname);
    var link = url + "#"+element[0].id;
    return " <a class='anchor' href='"+link+"' data-clipboard-text='"+link+"'>" +
      "<i class='fas fa-link fa-lg'></i>" +
      "</a>"
    ;
  });

  $(".anchor").on('mouseleave', function(e) {
    $(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
  }).on('click', function(e) {e.preventDefault();});

  clip.on('success', function(e) {
      e.clearSelection();
      $(e.trigger).attr('aria-label', 'Link copied to clipboard!').addClass('tooltipped');
  });
  $('code.language-mermaid').each(function(index, element) {
    var content = $(element).html().replace(/&amp;/g, '&');
    $(element).parent().replaceWith('<div class="mermaid" align="center">' + content + '</div>');
  });

  //Scroll to active sidebar section on load
  if($('ul.topics > li.parent').length)
    $('.highlightable').scrollTop($('.highlightable').scrollTop() + $('ul.topics > li.parent').position().top);

  //PGA version selector
  $('#pgaVersion').on('change', function(){
    var url = $(this).val(); // get selected value
    if (url) { // require a URL
      
      // Check if content had no translation
      if(url.includes('not-found')) {
        $('body').append(`
          <div id="lightbox" class="show">
            <div class="overlay close"></div>
            <div class="message">
              <strong>Content not found!</strong>
              <p>The requested content does not exist on the selected version of the docs.</p>
              <p>Would you like to <a href="` + url + `" title="Go to selected version homepage">visit the Homepage</a>?</p>
              <a href="javascript:void(0)" class="button white close">Close</a>
            </div>
          </div>
        `)

        $('#pgaVersion').val($('#pgaVersion option:not(:checked)').val())
      }
      else
        window.location = url; // redirect
    }
    return false;
  })

  $(document).on("click", "#lightbox .close", function(){
    $("#lightbox").detach();
  });
  // TOC index
  let activeLi = $('ul.topics li.active');
  let tocIndex = '';
  
  activeLi.parents('li').each(function(index, el){
    tocIndex = ($(el).index()+1) + '.' + tocIndex
  })
  tocIndex += (activeLi.index()+1) + '.'

  if($('ul.children[data-numbers="true"]').length) {
    
    $('ul.children li').each(function(index, el){
      let childIndex = ($(el).index()+1) + '.'
      $(el).parents('li').each(function(index, child){
        childIndex = ($(child).index()+1) + '.' + childIndex
      })

      $(el).children('a').text( tocIndex + childIndex + ' ' + $(el).children('a').text())
    })
  }
  
  
  if(window.location.href.includes(activeLi.children('a').prop('href')))
    $('#body-inner h1:first-of-type').text(tocIndex + ' ' + $('#body-inner h1').text()).addClass('show')
  else
    $('#body-inner h1').addClass('show')

});