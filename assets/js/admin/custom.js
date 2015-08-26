/**
 * Author: itplusvn
 * Created Date: 7/19/2015
 * Email: itplusvn@gmail.com
 * Skype: stupid_253
 */
$(function () {
  $("#datatable").DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": false,
    "info": true,
    "autoWidth": false
  });
  $('#birthday .input-group.date').datepicker({
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    calendarWeeks: true,
    autoclose: true
  });

// Setup form validation User register
  $.validate({
    form : '.register-user:not(.top-messages)',
    modules : 'security'
  });

});
