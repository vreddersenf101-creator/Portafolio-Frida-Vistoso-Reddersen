
$(document).ready(function () {
  var contactos = Wallet.contacts([
    { nombre: 'Camila Rojas', alias: 'camila.rojas', cbu: '1234567890123456789012' },
    { nombre: 'Matías Soto', alias: 'matias.soto', cbu: '2345678901234567890123' },
    { nombre: 'Valentina Pérez', alias: 'valentina.perez', cbu: '3456789012345678901234' },
    { nombre: 'Diego Fernández', alias: 'diego.fernandez', cbu: '4567890123456789012345' }
  ]);

  var contactoSeleccionado = null;
  function renderizarContactos(lista) {
    contactoSeleccionado = null;
    $('#sendSection').hide();
    $('#contactsList').empty();

    if (lista.length === 0) {
      $('#contactsList').html('<p class="hint">No se encontraron contactos.</p>');
      return;
    }

    lista.forEach(function (contacto) {
      var item = $('<button type="button" class="contact-item">');
      item.data('contacto', contacto);
      var contenido = $('<div>').appendTo(item);
      $('<div>').text(contacto.nombre).appendTo(contenido);
      $('<div class="contact-alias">').text('@' + contacto.alias).appendTo(contenido);
      $('#contactsList').append(item);
    });
  }

  renderizarContactos(contactos);
  $('#showAddContactBtn').click(function () {
    $('#addContactForm').slideToggle();
  });

  $('#cancelAddContactBtn').click(function () {
    $('#addContactForm').slideUp();
    $('#addContactForm')[0].reset();
    $('#contactFormAlert').empty();
  });
  $('#addContactForm').submit(function (event) {
    event.preventDefault();

    var nombre = $('#contactNombre').val().trim();
    var alias = $('#contactAlias').val().trim();
    var cbu = $('#contactCBU').val().trim();
    if (nombre === '' || alias === '' || cbu === '') {
      $('#contactFormAlert').html('<div class="alert alert-danger">Todos los campos son obligatorios.</div>');
      return;
    }
    var cbuValido = /^[0-9]{22}$/.test(cbu);
    if (!cbuValido) {
      $('#contactFormAlert').html('<div class="alert alert-danger">El CBU debe tener 22 dígitos numéricos.</div>');
      return;
    }

    if (contactos.some(c => c.cbu === cbu || c.alias.toLowerCase() === alias.toLowerCase())) {
      $('#contactFormAlert').text('El CBU o alias ya está registrado.'); return;
    }
    const nuevos = contactos.concat({ nombre, alias, cbu });
    try { localStorage.setItem('contactos', JSON.stringify(nuevos)); }
    catch (error) { $('#contactFormAlert').text('No se pudo guardar el contacto.'); return; }
    contactos = nuevos;
    renderizarContactos(contactos);

    $('#addContactForm')[0].reset();
    $('#addContactForm').slideUp();
    $('#contactFormAlert').empty();
  });
  $('#searchForm').submit(function (event) {
    event.preventDefault();

    var termino = $('#searchInput').val().trim().toLowerCase();

    if (termino === '') {
      renderizarContactos(contactos);
      return;
    }

    var filtrados = contactos.filter(function (contacto) {
      return contacto.nombre.toLowerCase().indexOf(termino) !== -1 ||
             contacto.alias.toLowerCase().indexOf(termino) !== -1;
    });

    renderizarContactos(filtrados);
  });
  $('#contactsList').on('click', '.contact-item', function () {
    $('.contact-item').removeClass('selected');
    $(this).addClass('selected');

    contactoSeleccionado = $(this).data('contacto');

    $('#sendSection').slideDown();
    $('#confirmationMsg').text('');
  });
  $('#sendMoneyBtn').click(function () {
    var monto = parseFloat($('#sendAmount').val());
    var saldo;
    try { saldo = Wallet.read().saldo; }
    catch (error) { $('#confirmationMsg').text(error.message); return; }

    if (!contactoSeleccionado) {
      return;
    }

    if (!Number.isSafeInteger(monto) || monto <= 0) {
      $('#confirmationMsg').removeClass('text-success').addClass('text-danger')
        .text('Ingresa un monto válido para enviar.');
      return;
    }

    if (monto > saldo) {
      $('#confirmationMsg').removeClass('text-success').addClass('text-danger')
        .text('No tienes saldo suficiente para este envío.');
      return;
    }
    try { Wallet.move(-monto, 'envio', 'Envío a ' + contactoSeleccionado.nombre); }
    catch (error) { $('#confirmationMsg').text(error.message); return; }

    $('#confirmationMsg').removeClass('text-danger').addClass('text-success')
      .text('¡Enviaste $' + monto.toFixed(2) + ' a ' + contactoSeleccionado.nombre + ' con éxito!');

    $('#sendAmount').val('');
  });

});
