
$(document).ready(function () {

  $('#loginForm').submit(function (event) {
    event.preventDefault();
    var email = $('#email').val().trim();
    var password = $('#password').val().trim();

    if (email === 'admin@trinky.cl' && password === '12345') {
      if (localStorage.getItem('saldo') === null) {
        localStorage.setItem('saldo', 0);
      }

      window.location.href = 'menu.html';

    } else {
      mostrarAlerta('danger', 'Correo o contraseña inválidos. Inténtalo de nuevo.');
    }
  });
  function mostrarAlerta(tipo, mensaje) {
    var alertaHTML =
      '<div class="alert alert-' + tipo + ' alert-dismissible fade show" role="alert">' +
        mensaje +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
      '</div>';

    $('#alert-container').html(alertaHTML);
    $('#alert-container .close').on('click', function () { $('#alert-container').empty(); });
  }

});
