$(document).ready(function(e) {
  $('a.Status--product').on('click', function(e) {
    e.preventDefault();
    let id = $(this).closest('div.biseller-column').attr('data-hideID');
    let childN = $(this).children('input.hidden-poro').attr('data-val');
    var data = {
      Stuta: childN
    }
    $(this).closest('li').remove();
    $(this).children('input').val('Hiện');
    $(this).closest('li').after().appendTo('ul#new--productD');
    $.ajax({
        type: "PUT",
        url: "/ngung-ban/"+id,
        data: data,
        success: function (newData) {
            location.reload();
         },
        error: function (err) {
          throw err;
        }
    });
  });
  $('a.Status--productD').on('click', function(e) {
    e.preventDefault();
    let id = $(this).closest('div.biseller-column').attr('data-hideID');
    let childND = $(this).children('input.hidden-poro').attr('data-val');
    var data = {
      Stuta: childND
    }
    $(this).closest('li').remove();
    $(this).children('input').val('Ẩn');
    $(this).closest('li').after().appendTo('ul#new--product');
    $.ajax({
      type: "PUT",
      url: "/ngung-ban/"+id,
      data: data,
      success: function (data) {
        location.reload();
       },
      error: function (err) {
        throw err;
      }
    });
  });
});
