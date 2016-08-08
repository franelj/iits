/**
 * Created by julie on 7/27/16.
 */


$(document).ready(function() {
   // $(document).on("click", "form.login button#submit", function(event) {
   //     event.preventDefault();
   //
   //     var login = $('#username').val();
   //     var password = $('#password').val();
   //     var error = $('form.login #error');
   //     var success = $('form.login #success');
   //
   //     if (error.hasClass('show')) {
   //         error.removeClass('show').addClass('hidden');
   //     }
   //     if (success.hasClass('show')) {
   //         success.removeClass('show').addClass('hidden');
   //     }
   //
   //     $.post('/users/authenticate', {
   //         username: login,
   //         password: password
   //     }).fail(function(err) {
   //         if (err.responseJSON) {
   //             error.find('p').text(err.responseJSON.error.message);
   //             error.removeClass('hidden').addClass('show');
   //         }
   //     }).done(function(data) {
   //         console.log("DATA", data);
   //         success.find('p').text("Login successful, you will be redirected in a few minutes!");
   //         success.removeClass('hidden').addClass('show');
   //     });
   // });
});