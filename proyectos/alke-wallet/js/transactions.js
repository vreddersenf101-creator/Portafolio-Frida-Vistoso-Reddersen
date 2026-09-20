
$(document).ready(function () {
  var listaTransacciones = Wallet.read().movimientos;
  function getTipoTransaccion(tipo) {
    var tipos = {
      envio: 'Envío',
      compra: 'Compra',
      deposito: 'Depósito',
      transferencia: 'Transferencia recibida'
    };
    return tipos[tipo] || tipo;
  }
  function mostrarUltimosMovimientos(filtro) {
    var movimientos = filtro === 'todos'
      ? listaTransacciones
      : listaTransacciones.filter(function (t) { return t.tipo === filtro; });

    $('#transactionsList').empty();

    if (movimientos.length === 0) {
      $('#transactionsList').html('<p class="hint">No hay movimientos de este tipo.</p>');
      return;
    }

    movimientos.forEach(function (t) {
      var esPositivo = t.monto >= 0;
      var claseMonto = esPositivo ? 'positive' : 'negative';
      var signo = esPositivo ? '+' : '-';
      var montoAbs = Math.abs(t.monto).toFixed(2);

      var fila = $(
        '<div class="transaction-item">' +
          '<div>' +
            '<div class="transaction-type">' + $('<span>').text(getTipoTransaccion(t.tipo)).html() + '</div>' +
            '<div class="transaction-desc">' + $('<span>').text(t.descripcion).html() + '</div>' +
            '<div class="transaction-date">' + $('<span>').text(t.fecha).html() + '</div>' +
          '</div>' +
          '<div class="transaction-amount ' + claseMonto + '">' + signo + '$' + montoAbs + '</div>' +
        '</div>'
      );

      $('#transactionsList').append(fila);
    });
  }
  mostrarUltimosMovimientos('todos');
  $('#filterSelect').change(function () {
    mostrarUltimosMovimientos($(this).val());
  });

});
