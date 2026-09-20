
$(document).ready(function () {

  function redirigirA(nombrePantalla, archivo) {
    $('#redirectMsg').text('Redirigiendo a ' + nombrePantalla + '...');

    setTimeout(function () {
      window.location.href = archivo;
    }, 800);
  }

  $('#depositarBtn').click(function () {
    redirigirA('depositar', 'deposit.html');
  });

  $('#enviarDineroBtn').click(function () {
    redirigirA('enviar dinero', 'sendmoney.html');
  });

  $('#ultimosMovimientosBtn').click(function () {
    redirigirA('últimos movimientos', 'transactions.html');
  });

});
