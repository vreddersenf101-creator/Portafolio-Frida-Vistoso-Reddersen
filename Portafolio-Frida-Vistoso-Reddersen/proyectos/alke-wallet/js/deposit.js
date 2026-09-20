
$(document).ready(function () {
  function obtenerSaldo() {
    return Wallet.read().saldo;
  }

  function mostrarSaldo() {
    var saldo = obtenerSaldo();
    $('#saldoActual').text('$' + saldo.toFixed(2));
  }

  mostrarSaldo();
  $('#depositForm').submit(function (event) {
    event.preventDefault();

    var monto = parseFloat($('#amount').val());

    if (!Number.isSafeInteger(monto) || monto <= 0) {
      mostrarAlerta('danger', 'Ingresa un monto válido para depositar.');
      return;
    }
    try { Wallet.move(monto, 'deposito', 'Depósito a tu cuenta'); }
    catch (error) { mostrarAlerta('danger', error.message); return; }
    mostrarSaldo();
    $('#depositedMsg').text('Depositaste $' + monto.toFixed(2) + ' correctamente.');
    mostrarAlerta('success', '¡Depósito realizado con éxito! Te llevamos al menú...');

    $('#amount').val('');
    $('#depositForm button').prop('disabled', true);
    setTimeout(function () {
      window.location.href = 'menu.html';
    }, 2000);
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
