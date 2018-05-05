$( function () {

  $("svg").click(function(e){
      var x = e.pageX - this.offsetLeft;
      var y = e.pageY - this.offsetTop;
  
      $('footer').html("x: "+ x +', '+ "y: "+ y);
  });

  setSVG();

  $("#compila").on( 'click', function () {
    data = $('#code').html();
    filename = "nf.lin";
    type = 'text/html';
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
  });

  $("#open").on('click', function () {
    $("#file-input").click();
  });

  $("#new").on('click', function () {
    $("#code").html("<div></div>");
    setSVG();
  });
  
  $("#viewSVG").on('click', function () {
    if ($("#viewSVG").text() == 'Ampliar') {
      $("#space").addClass('spaceBlur');
      $("#PIheader").addClass('view');
      $("#viewSVG").text('<');
    } else {
      $("#space").removeClass('spaceBlur');
      $("#PIheader").removeClass('view');
      $("#viewSVG").text('Ampliar');
    }
  });

  $("#ex").on('click', function () {
    $("#lines").html("");
    var date = "";
    for ( var i = 1; i <= $('#code > div').length; i++) {
      $("#lines").html(
        $("#lines").html() + "<div>" + i + "</div>"
      );
      date += $('#code > div:nth-child(' + i + ')').text() + " ";
    }
    var svg = sbn.compile(date);
    $('#code').text(svg);
  });

  function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;
      displayContents(contents);
    };
    reader.readAsText(file);
  }

  function displayContents(contents) {
    $("#code").html(contents);
    setSVG();
  }

  document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);

  $('#code').on('keyup', function () {
    if (
      $("#code").html() == ""
    ) {
      $("#code").html("<div></div>");
    }
    setSVG();
  });

  $('.selector').on('click', function () {
    if ($(this).attr('id') == 'selectorEdit') {
      $('#txtDer').removeClass('viewActive');
      $('#txtIzq').addClass('viewActive');
    } else {
      $('#txtIzq').removeClass('viewActive');
      $('#txtDer').addClass('viewActive');
    }
    $('#PImenu button').removeClass('active');
    $(this).addClass('active');
  });

});

function setSVG () {
  $("#lines").html("");
  $('#PIheader svg').html("");
  var date = "";
  for ( var i = 1; i <= $('#code > div').length; i++) {
    $("#lines").html(
      $("#lines").html() + "<div>" + i + "</div>"
    );
    date = $('#code > div:nth-child(' + i + ')').text();
    var svg = sbn.compile(date, i);
    //$('#txtDer').html(svg);
    $('#PIheader svg').html(
      $('#PIheader svg').html() + svg
    );
  }
}