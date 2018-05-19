$(document).ready(function() {

  var defaults = {
      type: 'default', //default, vertical, accordion;
      width: 'auto',
      fit: true,
      closed: false,
      tabidentify: '',
      activetab_bg: 'white',
      inactive_bg: '#F5F5F5',
      active_border_color: '#c1c1c1',
      active_content_border_color: '#c1c1c1',
  }
  var options = $.extend(defaults, options);
  var $respTabs = $(this);
  $respTabs.find('ul.resp-tabs-list' + options.tabidentify + ' li').addClass('resp-tab-item').addClass(options.tabidentify);
  $respTabs.css({
      'display': 'block'
  });

//Active correct tab
$($respTabs.find("[aria-controls=" + "hor_1_tab_item-" + $("input[type=hidden]").val() + "]")).addClass('resp-tab-active').css({
    'background-color': options.activetab_bg,
    'border-color': options.active_border_color
});

//keep closed if option = 'closed' or option is 'accordion' and the element is in accordion mode
if (options.closed !== true && !(options.closed === 'accordion' && !$respTabsList.is(':visible')) && !(options.closed === 'tabs' && $respTabsList.is(':visible'))) {
    $($respTabs.find('.resp-accordion' + options.tabidentify)).addClass('resp-tab-active').css({
        'background-color': options.activetab_bg + ' !important',
        'border-color': options.active_border_color,
        'background': 'none'
    });

    $($respTabs.find('.resp-tab-content[aria-labelledby = ' + "hor_1_tab_item-" + $("input[type=hidden]").val() + ']' + options.tabidentify)).addClass('resp-tab-content-active').addClass(options.tabidentify).attr('style', 'display:block');
}

  $respTabs.find("[role=tab]").each(function () {

      var $currentTab = $(this);
      $currentTab.click(function () {

          var $currentTab = $(this);
          var $tabAria = $currentTab.attr('aria-controls');
          var $urlChange = $tabAria.split("-")[1];

          if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
              $respTabs.find('.resp-tab-content-active' + options.tabidentify).slideUp('', function () {
                  $(this).addClass('resp-accordion-closed');
              });
              $currentTab.removeClass('resp-tab-active').css({
                  'background-color': options.inactive_bg,
                  'border-color': 'none'
              });
              return false;
          }
          if (!$currentTab.hasClass('resp-tab-active') && $currentTab.hasClass('resp-accordion')) {
              $respTabs.find('.resp-tab-active' + options.tabidentify).removeClass('resp-tab-active').css({
                  'background-color': options.inactive_bg,
                  'border-color': 'none'
              });
              $respTabs.find('.resp-tab-content-active' + options.tabidentify).slideUp().removeClass('resp-tab-content-active resp-accordion-closed');
              $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active').css({
                  'background-color': options.activetab_bg,
                  'border-color': options.active_border_color
              });

              $respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']' + options.tabidentify).slideDown().addClass('resp-tab-content-active');
          } else {

              $respTabs.find('.resp-tab-active' + options.tabidentify).removeClass('resp-tab-active').css({
                  'background-color': options.inactive_bg,
                  'border-color': 'none'
              });

              $respTabs.find('.resp-tab-content-active' + options.tabidentify).removeAttr('style').removeClass('resp-tab-content-active').removeClass('resp-accordion-closed');

              $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active').css({
                  'background-color': options.activetab_bg,
                  'border-color': options.active_border_color
              });

              $respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']' + options.tabidentify).addClass('resp-tab-content-active').attr('style', 'display:block');
          }
          history.pushState(null, '', '/danh-muc/' + $urlChange);
      });
  });
    //Window resize function
    $(window).resize(function () {
        $respTabs.find('.resp-accordion-closed').removeAttr('style');
    });

});
